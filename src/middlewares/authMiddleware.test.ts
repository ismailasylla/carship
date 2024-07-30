import { protect } from './authMiddleware';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../schemas/userModel';
import mockingoose from 'mockingoose';
import { IUser } from '../interfaces/user';

jest.mock('jsonwebtoken');

describe('protect middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: {
        authorization: 'Bearer token',
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call next if token is valid and user is found', async () => {
    const user = {
      _id: 'userId',
      name: 'Test User',
      email: 'test@example.com',
      // Add other necessary properties of IUser if needed
    } as unknown as IUser;

    (jwt.verify as jest.Mock).mockReturnValue({ id: 'userId' });
    mockingoose(User).toReturn(user, 'findOne');

    await protect(req as Request, res as Response, next);

    expect(jwt.verify).toHaveBeenCalledWith('token', process.env.JWT_SECRET || '');
    expect(req.user).toEqual(user);
    expect(next).toHaveBeenCalled();
  });

  it('should return 404 if user is not found', async () => {
    (jwt.verify as jest.Mock).mockReturnValue({ id: 'userId' });
    mockingoose(User).toReturn(null, 'findOne');

    await protect(req as Request, res as Response, next);

    expect(jwt.verify).toHaveBeenCalledWith('token', process.env.JWT_SECRET || '');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if token is invalid', async () => {
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    await protect(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized, token failed', error: 'Invalid token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if no token is provided', async () => {
    req.headers = {};

    await protect(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized, no token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should handle errors thrown by User.findById', async () => {
    (jwt.verify as jest.Mock).mockReturnValue({ id: 'userId' });
    mockingoose(User).toReturn(new Error('DB error'), 'findOne');

    await protect(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized, token failed', error: 'DB error' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should handle unknown errors during token verification', async () => {
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw 'Unknown error';
    });

    await protect(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized, token failed' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if token is missing in authorization header', async () => {
    req.headers = { authorization: 'Bearer ' };

    await protect(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized, no token' });
    expect(next).not.toHaveBeenCalled();
  });
});
