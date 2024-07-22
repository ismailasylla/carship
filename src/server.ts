import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes'; // Adjust the path as needed
import carRoutes from './routes/carRoutes'; // Import car routes
import dotenv from 'dotenv';

const app = express();

dotenv.config(); // Load environment variables

app.use(express.json()); // Middleware to parse JSON bodies
app.use('/api/auth', userRoutes); // Register user routes
app.use('/api/cars', carRoutes); // Register car routes

// MongoDB connection
const mongoURI = process.env.MONGO_URI;
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
