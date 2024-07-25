import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import carRoutes from './routes/carRoutes';
import userRoutes from './routes/userRoutes';
import config from './config/service';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/cars', carRoutes);
app.use('/api/auth', userRoutes);

const mongoUri = config.MONGO_URI;
if (!mongoUri) {
  throw new Error('MONGO_URI is not defined');
}

mongoose.connect(mongoUri)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Create HTTP server and WebSocket server
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Emit function for real-time updates
export const emitCarUpdate = (updatedCars: any) => {
  io.emit('carUpdated', updatedCars);
};

const port = config.PORT || '3000'; 
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
