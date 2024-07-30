import { Request, Response } from 'express';
import Car from '../../schemas/carModel';
import { ICar } from '../../interfaces/car';
import { emitCarUpdate } from '../../server';
import { ShippingStatus } from '../../interfaces/enums/shippingStatus.enum';

// Get cars with filters
export const getCars = async (req: Request, res: Response): Promise<void> => {
  const { page = 1, limit = 8, make, model, year, minPrice, maxPrice, shippingStatus } = req.query;

  let filter: any = {};

  if (make) filter.make = make;
  if (model) filter.model = model;
  if (year) filter.year = parseInt(year as string, 10);
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
    console.error('Error fetching cars:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Get filter options for cars
export const getFilterOptions = async (req: Request, res: Response): Promise<void> => {
  try {
    const makes = await Car.distinct('make').exec();
    const models = await Car.distinct('model').exec();
    const years = await Car.distinct('year').exec();

    res.status(200).json({ makes, models, years });
  } catch (error) {
    console.error('Error fetching filter options:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};


// Create a new car
export const createCar = async (req: Request, res: Response): Promise<void> => {
  const { make, model, year, price, vin, currency, shippingStatus }: ICar = req.body;

  if (!make || !model || !year || !price || !vin || !currency) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }

  if (year < 1900 || year > new Date().getFullYear()) {
    res.status(400).json({ message: 'Invalid year' });
    return;
  }
  if (price < 0) {
    res.status(400).json({ message: 'Invalid price' });
    return;
  }

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
    const savedCar = await car.save();
    const cars = await Car.find({});
    emitCarUpdate(cars);
    res.status(201).json(savedCar);
  } catch (error) {
    console.error('Error creating car:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Update a car
export const updateCar = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { make, model, year, price, vin, currency, shippingStatus }: ICar = req.body;

  try {
    const car = await Car.findById(id);

    if (!car) {
      res.status(404).json({ message: 'Car not found' });
      return;
    }

    await Car.updateOne(
      { _id: id },
      { $set: { make, model, year, price, vin, currency, shippingStatus } }
    ).exec();

    const updatedCar = await Car.findById(id);
    const cars = await Car.find({});
    emitCarUpdate(cars);

    res.status(200).json(updatedCar);
  } catch (error) {
    console.error('Error updating car:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Delete a car
export const deleteCar = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const car = await Car.findById(id);

    if (!car) {
      res.status(404).json({ message: 'Car not found' });
      return;
    }

    await Car.deleteOne({ _id: id }).exec();
    const cars = await Car.find({});
    emitCarUpdate(cars);
    res.status(200).json({ message: 'Car deleted' });
  } catch (error) {
    console.error('Error deleting car:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Fetch a single car by ID
export const getCarById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const car = await Car.findById(id);

    if (!car) {
      res.status(404).json({ message: 'Car not found' });
      return;
    }

    res.status(200).json(car);
  } catch (error) {
    console.error('Error fetching car:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};
