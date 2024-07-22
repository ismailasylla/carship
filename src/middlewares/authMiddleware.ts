import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';
import { IUser } from '../interfaces/user';

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as { id: string };

      const user = await User.findById(decoded.id).select('-password').exec();

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      req.user = user as IUser;
      next();
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(401).json({ message: 'Not authorized, token failed', error: error.message });
      } else {
        res.status(401).json({ message: 'Not authorized, token failed' });
      }
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};
