import api from './api';

// interceptor to include the token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

const cache = new Map<string, any>();
const CACHE_DURATION = 300000; // 5 minutes

export const fetchCars = async (
  page: number,
  model: string,
  year: string,
  make: string
): Promise<{ cars: any[], totalPages: number }> => {
  const cacheKey = `cars_page_${page}_${model}_${year}_${make}`;
  console.log('Fetching cars with cacheKey:', cacheKey);

  if (cache.has(cacheKey) && Date.now() - cache.get(cacheKey).timestamp < CACHE_DURATION) {
    console.log('Returning cached data:', cache.get(cacheKey).data);
    return cache.get(cacheKey).data;
  }

  try {
    const response = await api.get('/cars', { params: { page, model, year, make } });
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

export const addCarRequest = async (car: any) => {
  try {
    const response = await api.post('/cars', car);
    return response.data;
  } catch (error) {
    console.error('Error adding car:', error);
    throw error;
  }
};

export const updateCarRequest = async (car: any) => {
  try {
    const response = await api.put(`/cars/${car._id}`, car);
    return response.data;
  } catch (error) {
    console.error('Error updating car:', error);
    throw error;
  }
};

export const deleteCarRequest = async (_id: string) => {
  try {
    await api.delete(`/cars/${_id}`);
  } catch (error) {
    console.error('Error deleting car:', error);
    throw error;
  }
};

export const fetchFilterOptions = async (): Promise<{ models: string[], makes: string[], years: string[] }> => {
  try {
    const response = await api.get('/cars/filters');
    return response.data;
  } catch (error) {
    console.error('Error fetching filter options:', error);
    throw error;
  }
};

export const fetchCarRequest = async (id: string): Promise<any> => {
  try {
    const response = await api.get(`/cars/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching car:', error);
    throw error;
  }
};
