import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';
import mongoose from 'mongoose';
import { IUser } from '../interfaces/user';

export const registerUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const userExists = await User.findOne({ email }) as IUser | null;
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      email,
      password: hashedPassword,
    }) as IUser;

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ message: 'JWT_SECRET is not defined' });
    }
    const token = jwt.sign({ id: (user._id as mongoose.Types.ObjectId).toString() }, jwtSecret, { expiresIn: '1h' });

    res.status(201).json({ token });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }) as IUser | null;
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ message: 'JWT_SECRET is not defined' });
    }
    const token = jwt.sign({ id: (user._id as mongoose.Types.ObjectId).toString() }, jwtSecret, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

export const verifyToken = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret || !token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, jwtSecret) as { id: string };
    const user = await User.findById(decoded.id).select('-password').exec();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error("Error in verifyToken:", error);
    res.status(401).json({ message: 'Token validation failed', error: (error as Error).message });
  }
};
