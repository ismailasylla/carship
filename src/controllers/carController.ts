import { Request, Response } from 'express';
import Car from '../models/carModel';
import { ICar } from '../interfaces/car';

// Get all cars
export const getCars = async (req: Request, res: Response) => {
  try {
    const cars: ICar[] = await Car.find();
    res.json(cars);
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({ message: 'Error fetching cars' });
  }
};

// Add a new car
export const addCar = async (req: Request, res: Response) => {
  const { make, model, year, price, vin, currency, shippingStatus } = req.body;

  try {
    const newCar: ICar = new Car({ make, model, year, price, vin, currency, shippingStatus });
    const savedCar: ICar = await newCar.save();
    res.status(201).json(savedCar);
  } catch (error) {
    console.error('Error adding car:', error);
    res.status(500).json({ message: 'Error adding car' });
  }
};

// Update car details (price, model, etc.)
export const updateCar = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedCar: ICar | null = await Car.findByIdAndUpdate(id, { $set: updates }, { new: true });
    if (!updatedCar) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.json(updatedCar);
  } catch (error) {
    console.error('Error updating car:', error);
    res.status(500).json({ message: 'Error updating car' });
  }
};

// Update car shipping status
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

// Delete a car
export const deleteCar = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedCar: ICar | null = await Car.findByIdAndDelete(id);
    if (!deletedCar) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    console.error('Error deleting car:', error);
    res.status(500).json({ message: 'Error deleting car' });
  }
};

// Get a car by ID
export const getCarById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const car: ICar | null = await Car.findById(id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.json(car);
  } catch (error) {
    console.error('Error fetching car:', error);
    res.status(500).json({ message: 'Error fetching car' });
  }
};
