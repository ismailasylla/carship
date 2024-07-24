import axios from 'axios';
import { Car } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:5001',
});

const cache = new Map<string, any>();
const CACHE_DURATION = 300000; // 5 minutes

// Fetch cars with pagination and filters
export const fetchCars = async (
  page: number,
  model: string,
  year: string,
  make: string
): Promise<{ cars: Car[], totalPages: number }> => {
  const cacheKey = `cars_page_${page}_${model}_${year}_${make}`;
  console.log('Fetching cars with cacheKey:', cacheKey);

  if (cache.has(cacheKey) && Date.now() - cache.get(cacheKey).timestamp < CACHE_DURATION) {
    console.log('Returning cached data:', cache.get(cacheKey).data);
    return cache.get(cacheKey).data;
  }

  try {
    const response = await api.get('/api/cars', { params: { page, model, year, make } });
    console.log('Fetched data from API:', response.data);

    const carsData = response.data.cars;
    const totalPages = response.data.totalPages;

    cache.set(cacheKey, { timestamp: Date.now(), data: { cars: carsData, totalPages } });
    return { cars: carsData, totalPages };
  } catch (error) {
    console.error('Error fetching cars:', error);
    throw error;
  }
};

// Add a new car
export const addCarRequest = async (car: Car) => {
  try {
    const response = await api.post('/api/cars', car);
    return response.data;
  } catch (error) {
    console.error('Error adding car:', error);
    throw error;
  }
};

// Update car details
export const updateCarRequest = async (car: Car) => {
  try {
    const response = await api.put(`/api/cars/${car._id}`, car);
    return response.data;
  } catch (error) {
    console.error('Error updating car:', error);
    throw error;
  }
};

// Delete a car
export const deleteCarRequest = async (_id: string) => {
  try {
    await api.delete(`/api/cars/${_id}`);
  } catch (error) {
    console.error('Error deleting car:', error);
    throw error;
  }
};

// Fetch filter options (models, makes, years)
export const fetchFilterOptions = async () => {
  try {
    const response = await api.get('/api/cars/filters');
    return response.data;
  } catch (error) {
    console.error('Error fetching filter options:', error);
    throw error;
  }
};
