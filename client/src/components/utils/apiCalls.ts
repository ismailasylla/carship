import { Car } from '../../types';
import api from './api';

const cache = new Map<string, any>();
const CACHE_DURATION = 300000; // 5 minutes

export const fetchCars = async (): Promise<Car[]> => {
  const cacheKey = 'cars';

  // Check the cache
  if (cache.has(cacheKey) && Date.now() - cache.get(cacheKey).timestamp < CACHE_DURATION) {
    console.log('Returning cached data:', cache.get(cacheKey).data);
    return cache.get(cacheKey).data;
  }

  // Fetch data from the API
  const response = await api.get('/api/cars');
  console.log('Fetched data from API:', response.data);

  // Check if the response is an array or an object containing an array
  const carsData = Array.isArray(response.data) ? response.data : response.data.cars;

  // Update the cache
  cache.set(cacheKey, { timestamp: Date.now(), data: carsData });

  return carsData;
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
