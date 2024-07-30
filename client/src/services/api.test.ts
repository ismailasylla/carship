import MockAdapter from 'axios-mock-adapter';
import axiosInstance from '../config/axiosConfig';
import { fetchCars, addCarRequest, updateCarRequest, deleteCarRequest, fetchFilterOptions, fetchCarRequest } from '../services/apiCalls';

// Create a mock adapter instance
const mock = new MockAdapter(axiosInstance);

describe('API Functions', () => {
  beforeEach(() => {
    // Reset the mock adapter before each test
    mock.reset();
  });

  it('should fetch cars with caching', async () => {
    const mockData = { cars: [{ id: '1', make: 'Toyota', model: 'Camry', year: 2021 }], totalPages: 10 };
    mock.onGet('/cars').reply(200, mockData);

    const result = await fetchCars(1, 'Camry', '2021', 'Toyota');
    expect(result).toEqual(mockData);
  });

  it('should add a car', async () => {
    const carData = { make: 'Honda', model: 'Civic', year: 2022 };
    mock.onPost('/cars', carData).reply(200, carData);

    const result = await addCarRequest(carData);
    expect(result).toEqual(carData);
  });

  it('should update a car', async () => {
    const carData = { _id: '1', make: 'Honda', model: 'Accord', year: 2023 };
    mock.onPut(`/cars/${carData._id}`, carData).reply(200, carData);

    const result = await updateCarRequest(carData);
    expect(result).toEqual(carData);
  });

  it('should delete a car', async () => {
    const carId = '1';
    mock.onDelete(`/cars/${carId}`).reply(200);

    await expect(deleteCarRequest(carId)).resolves.toBeUndefined();
  });

  it('should fetch filter options', async () => {
    const filterOptions = { models: ['Camry', 'Accord'], makes: ['Toyota', 'Honda'], years: ['2021', '2022'] };
    mock.onGet('/cars/filters').reply(200, filterOptions);

    const result = await fetchFilterOptions();
    expect(result).toEqual(filterOptions);
  });

  it('should fetch a single car', async () => {
    const carId = '1';
    const carData = { id: carId, make: 'Toyota', model: 'Camry', year: 2021 };
    mock.onGet(`/cars/${carId}`).reply(200, carData);

    const result = await fetchCarRequest(carId);
    expect(result).toEqual(carData);
  });
});
