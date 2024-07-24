import { Request, Response } from 'express';
import Car from '../models/carModel';
import { ICar } from '../interfaces/car';
import { ShippingStatus } from '../interfaces/enums/shippingStatus.enum';

// Get all cars with pagination and filters
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
    const cars = await Car.find(filter)
      .skip((+page - 1) * +limit)
      .limit(+limit);

    const totalCars = await Car.countDocuments(filter);
    const totalPages = Math.ceil(totalCars / +limit);

    res.status(200).json({ cars, totalPages });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get filter options for cars (make, model, year)
export const getFilterOptions = async (req: Request, res: Response) => {
  try {
    const makes = await Car.distinct('make');
    const models = await Car.distinct('model');
    const years = await Car.distinct('year');

    res.status(200).json({ makes, models, years });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Create a new car
export const createCar = async (req: Request, res: Response) => {
  const { make, model, year, price, vin, currency, shippingStatus }: ICar = req.body;

  const car = new Car({
    make,
    model,
    year,
    price,
    vin,
    currency,
    shippingStatus: shippingStatus || ShippingStatus.Pending,
  });

  try {
    await car.save();
    res.status(201).json(car);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update a car
export const updateCar = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { make, model, year, price, vin, currency, shippingStatus }: ICar = req.body;

  try {
    const car = await Car.findById(id);

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    await Car.updateOne(
      { _id: id },
      { $set: { make, model, year, price, vin, currency, shippingStatus } }
    );

    const updatedCar = await Car.findById(id);

    res.status(200).json(updatedCar);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete a car
export const deleteCar = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const car = await Car.findById(id);

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    await Car.deleteOne({ _id: id });
    res.status(200).json({ message: 'Car deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};