import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes';
import carRoutes from './routes/carRoutes';
import dotenv from 'dotenv';

const app = express();

dotenv.config();

app.use(express.json());
app.use('/api/auth', userRoutes);
app.use('/api/cars', carRoutes);

// MongoDB connection
const mongoURI = process.env.MONGO_URI || '';
if (!mongoURI) {
  console.error('MONGO_URI is not defined in the environment variables');
  process.exit(1);
}

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
