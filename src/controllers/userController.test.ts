import { Request, Response } from 'express';
import { verifyToken } from '../controllers/userController';
import User from '../models/userModel';
import jwt from 'jsonwebtoken';

jest.mock('../models/userModel');
jest.mock('jsonwebtoken');

describe('verifyToken', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should verify the token and return the user', async () => {
    const req = {
      headers: {
        authorization: 'Bearer fake-token',
      },
    } as unknown as Request;
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    (jwt.verify as jest.Mock).mockReturnValue({ id: 'fake-id' });
    (User.findById as jest.Mock).mockResolvedValue({
      _id: 'fake-id',
      email: 'test@example.com',
      password: 'hashedPassword',
    });

    await verifyToken(req, res);

    expect(jwt.verify).toHaveBeenCalledWith('fake-token', process.env.JWT_SECRET);
    expect(User.findById).toHaveBeenCalledWith('fake-id');
    expect(res.json).toHaveBeenCalledWith({
      _id: 'fake-id',
      email: 'test@example.com',
      password: 'hashedPassword',
    });
  });

  it('should return 401 if token validation fails', async () => {
    const req = {
      headers: {
        authorization: 'Bearer invalid-token',
      },
    } as unknown as Request;
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    await verifyToken(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Token validation failed',
      error: 'Invalid token',
    });
  });

  it('should return 401 if no token is provided', async () => {
    const req = {
      headers: {},
    } as unknown as Request;
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    await verifyToken(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'No token provided',
    });
  });
});
