import { Car } from '../types';
import api from './api';

const cache = new Map<string, any>();
const CACHE_DURATION = 300000; // 5 minutes

// Fetch cars with pagination
export const fetchCars = async (page: number): Promise<{ cars: Car[], totalPages: number }> => {
  const cacheKey = `cars_page_${page}`;

  // Check the cache
  if (cache.has(cacheKey) && Date.now() - cache.get(cacheKey).timestamp < CACHE_DURATION) {
    console.log('Returning cached data:', cache.get(cacheKey).data);
    return cache.get(cacheKey).data;
  }

  // Fetch data from the API
  const response = await api.get(`/api/cars?page=${page}`);
  console.log('Fetched data from API:', response.data);

  // Extract cars and totalPages from response
  const carsData = response.data.cars;
  const totalPages = response.data.totalPages;

  // Update the cache
  cache.set(cacheKey, { timestamp: Date.now(), data: { cars: carsData, totalPages } });

  return { cars: carsData, totalPages };
};

export const addCarRequest = async (car: Car) => {
  const response = await api.post('/api/cars', car);
  return response.data;
};

export const updateCarRequest = async (car: Car) => {
  const response = await api.put(`/api/cars/${car._id}`, car);
  return response.data;
};

export const deleteCarRequest = async (_id: string) => {
  await api.delete(`/api/cars/${_id}`);
};
