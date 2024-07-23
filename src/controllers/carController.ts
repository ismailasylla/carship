import { Request, Response } from 'express';
import Car from '../models/carModel';
import { ICar } from '../interfaces/car';

// Get all cars
export const getCars = async (req: Request, res: Response) => {
  const { page = 1, limit = 10, make, model, year, minPrice, maxPrice, shippingStatus } = req.query;

  // Build the filter query object
  let filter: any = {};
  if (make) filter.make = make;
  if (model) filter.model = model;
  if (year) filter.year = parseInt(year as string);
  if (minPrice) filter.price = { ...filter.price, $gte: parseFloat(minPrice as string) };
  if (maxPrice) filter.price = { ...filter.price, $lte: parseFloat(maxPrice as string) };
  if (shippingStatus) filter.shippingStatus = shippingStatus;

  try {
    // Fetch cars with pagination and filtering
    const cars = await Car.find(filter)
      .skip((parseInt(page as string) - 1) * parseInt(limit as string))
      .limit(parseInt(limit as string))
      .exec();

    // Count total cars for pagination info
    const totalCars = await Car.countDocuments(filter);

    res.json({
      totalCars,
      page: parseInt(page as string),
      totalPages: Math.ceil(totalCars / parseInt(limit as string)),
      cars,
    });
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
  const { _id } = req.params;
  const updates = req.body;

  try {
    const updatedCar: ICar | null = await Car.findByIdAndUpdate(_id, { $set: updates }, { new: true });
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
  const { _id } = req.params;
  const { shippingStatus } = req.body;

  try {
    const updatedCar: ICar | null = await Car.findByIdAndUpdate(_id, { shippingStatus }, { new: true });
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
  const { _id } = req.params;

  try {
    const deletedCar: ICar | null = await Car.findByIdAndDelete(_id);
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
  const { _id } = req.params;

  try {
    const car: ICar | null = await Car.findById(_id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.json(car);
  } catch (error) {
    console.error('Error fetching car:', error);
    res.status(500).json({ message: 'Error fetching car' });
  }
};
