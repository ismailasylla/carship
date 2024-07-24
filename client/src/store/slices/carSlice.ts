import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  fetchCars as fetchCarsAPI,
  addCarRequest as addCarAPI,
  updateCarRequest as updateCarAPI,
  deleteCarRequest as deleteCarAPI
} from '../../utils/apiCalls';
import { Car } from '../../types';
import { RootState } from '../../store';

export interface CarState {
  cars: Car[];
  models: string[];
  makes: string[];
  years: string[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  currentCar: Car | null;
  totalPages: number;
  currentPage: number;
  filters: {
    model: string;
    year: string;
    make: string;
  };
}

const initialState: CarState = {
  cars: [],
  models: [],
  makes: [],
  years: [],
  status: 'idle',
  error: null,
  currentCar: null,
  totalPages: 1,
  currentPage: 1,
  filters: {
    model: '',
    year: '',
    make: ''
  }
};

interface FetchCarsParams {
  page: number;
}

interface FetchCarsResponse {
  cars: Car[];
  totalPages: number;
}

// Fetch cars with pagination and filters
export const fetchCars = createAsyncThunk<FetchCarsResponse, FetchCarsParams, { rejectValue: string }>(
  'car/fetchCars',
  async ({ page }, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    try {
      const { cars = [], totalPages = 1 } = await fetchCarsAPI(
        page,
        state.car.filters.model,
        state.car.filters.year,
        state.car.filters.make
      );
      return { cars, totalPages };
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to fetch cars');
    }
  }
);

// Fetch filter options
export const fetchFilterOptions = createAsyncThunk<{
  models: string[];
  makes: string[];
  years: string[];
}, void, { rejectValue: string }>(
  'car/fetchFilterOptions',
  async (_, thunkAPI) => {
    try {
      const response = await fetch('/api/cars/filters');
      const data = await response.json();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to fetch filter options');
    }
  }
);

// Add a new car
export const addCar = createAsyncThunk<Car, Car, { rejectValue: string }>(
  'car/addCar',
  async (car, thunkAPI) => {
    const { isAuthenticated } = (thunkAPI.getState() as RootState).auth;
    if (!isAuthenticated) {
      return thunkAPI.rejectWithValue('User not authenticated');
    }
    try {
      const newCar = await addCarAPI(car);
      return newCar;
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to add car');
    }
  }
);

// Update a car
export const updateCar = createAsyncThunk<Car, Car, { rejectValue: string }>(
  'car/updateCar',
  async (car, thunkAPI) => {
    const { isAuthenticated } = (thunkAPI.getState() as RootState).auth;
    if (!isAuthenticated) {
      return thunkAPI.rejectWithValue('User not authenticated');
    }
    try {
      const updatedCar = await updateCarAPI(car);
      return updatedCar;
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to update car');
    }
  }
);

// Delete a car
export const deleteCar = createAsyncThunk<string, string, { rejectValue: string }>(
  'car/deleteCar',
  async (id, thunkAPI) => {
    const { isAuthenticated } = (thunkAPI.getState() as RootState).auth;
    if (!isAuthenticated) {
      return thunkAPI.rejectWithValue('User not authenticated');
    }
    try {
      await deleteCarAPI(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to delete car');
    }
  }
);

// Get a single car by ID
export const getCar = createAsyncThunk<Car, string, { rejectValue: string }>(
  'car/getCar',
  async (id, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    try {
      const { cars } = await fetchCarsAPI(
        1, // Default page number
        state.car.filters.model,
        state.car.filters.year,
        state.car.filters.make
      );
      const car = cars.find((car) => car._id === id);
      if (!car) throw new Error('Car not found');
      return car;
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to fetch car');
    }
  }
);

const carSlice = createSlice({
  name: 'car',
  initialState,
  reducers: {
    updateCars(state, action: PayloadAction<Car[]>) {
      state.cars = action.payload;
    },
    setPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    setFilters(state, action: PayloadAction<{ model?: string; year?: string; make?: string }>) {
      state.filters = { ...state.filters, ...action.payload };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCars.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCars.fulfilled, (state, action: PayloadAction<FetchCarsResponse>) => {
        state.status = 'succeeded';
        state.cars = action.payload.cars;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchCars.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch cars';
      })
      .addCase(addCar.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addCar.fulfilled, (state, action: PayloadAction<Car>) => {
        state.status = 'succeeded';
        state.cars.push(action.payload);
      })
      .addCase(addCar.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to add car';
      })
      .addCase(updateCar.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateCar.fulfilled, (state, action: PayloadAction<Car>) => {
        state.status = 'succeeded';
        state.cars = state.cars.map((car) =>
          car._id === action.payload._id ? action.payload : car
        );
      })
      .addCase(updateCar.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to update car';
      })
      .addCase(deleteCar.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteCar.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = 'succeeded';
        state.cars = state.cars.filter((car) => car._id !== action.payload);
      })
      .addCase(deleteCar.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to delete car';
      })
      .addCase(getCar.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getCar.fulfilled, (state, action: PayloadAction<Car>) => {
        state.status = 'succeeded';
        state.currentCar = action.payload;
      })
      .addCase(getCar.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch car';
      })
      .addCase(fetchFilterOptions.fulfilled, (state, action: PayloadAction<{ models: string[], makes: string[], years: string[] }>) => {
        state.models = action.payload.models;
        state.makes = action.payload.makes;
        state.years = action.payload.years;
      });
  },
});

export const { updateCars, setPage, setFilters } = carSlice.actions;

export default carSlice.reducer;
