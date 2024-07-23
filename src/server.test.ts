import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import routes
import userRoutes from './routes/userRoutes';
import carRoutes from './routes/carRoutes';

// Create app instance
const app = express();

app.use(express.json());
app.use('/api/auth', userRoutes);
app.use('/api/cars', carRoutes);

// Ensure Mongoose connection before running tests
const mongoURI = process.env.MONGO_URI || '';
if (!mongoURI) {
  throw new Error('MONGO_URI is not defined in the environment variables');
}

beforeAll(async () => {
  await mongoose.connect(mongoURI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Server', () => {
  it('should be able to GET /api/cars', async () => {
    const response = await request(app).get('/api/cars');
    expect(response.status).toBe(200);
  });

  it('should be able to POST /api/auth/register', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'testuser@example.com',
        password: 'password123'
      });
    expect(response.status).toBe(201);
  });

  // More tests for other endpoints...
});
