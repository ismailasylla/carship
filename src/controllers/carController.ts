// src/controllers/carController.ts
import { Request, Response } from 'express';
import Car from '../models/carModel';
import { ICar } from '../interfaces/car';

export const getCars = async (req: Request, res: Response) => {
  const { page = 1, limit = 10, make, model, year, shippingStatus } = req.query;
  const query: any = {};
  if (make) query.make = make;
  if (model) query.model = model;
  if (year) query.year = year;
  if (shippingStatus) query.shippingStatus = shippingStatus;

  try {
    const cars: ICar[] = await Car.find(query)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));
    res.json(cars);
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({ message: 'Error fetching cars' });
  }
};

export const addCar = async (req: Request, res: Response) => {
  const { make, model, year, vin, shippingStatus } = req.body;

  try {
    const newCar: ICar = new Car({ make, model, year, vin, shippingStatus });
    const savedCar: ICar = await newCar.save();
    res.status(201).json(savedCar);
  } catch (error) {
    console.error('Error adding car:', error);
    res.status(500).json({ message: 'Error adding car' });
  }
};

export const updateCarStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { shippingStatus } = req.body;

  try {
    const updatedCar: ICar | null = await Car.findByIdAndUpdate(id, { shippingStatus }, { new: true });
    if (!updatedCar) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.json(updatedCar);
  } catch (error) {
    console.error('Error updating car status:', error);
    res.status(500).json({ message: 'Error updating car status' });
  }
};

export const deleteCar = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedCar: ICar | null = await Car.findByIdAndDelete(id);
    if (!deletedCar) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.json({ message: 'Car deleted' });
  } catch (error) {
    console.error('Error deleting car:', error);
    res.status(500).json({ message: 'Error deleting car' });
  }
};
