import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  fetchCars as fetchCarsAPI,
  addCarRequest as addCarAPI,
  updateCarRequest as updateCarAPI,
  deleteCarRequest as deleteCarAPI,
  fetchFilterOptions as fetchFilterOptionsAPI
} from '../../utils/apiCalls';
import { Car } from '../../types';
import { RootState } from '../../store';

interface CarState {
  cars: Car[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  currentPage: number;
  totalPages: number;
  filters: {
    model: string;
    year: string;
    make: string;
  };
  filterOptions: {
    models: string[];
    years: string[];
    makes: string[];
  };
}

const initialState: CarState = {
  cars: [],
  status: 'idle',
  error: null,
  currentPage: 1,
  totalPages: 0,
  filters: {
    model: '',
    year: '',
    make: ''
  },
  filterOptions: {
    models: [],
    years: [],
    makes: []
  }
};

interface FetchCarsParams {
  page: number;
}

interface FetchCarsResponse {
  cars: Car[];
  totalPages: number;
}

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

export const fetchFilterOptions = createAsyncThunk<{
  models: string[];
  makes: string[];
  years: string[];
}, void, { rejectValue: string }>(
  'car/fetchFilterOptions',
  async (_, thunkAPI) => {
    try {
      const data = await fetchFilterOptionsAPI();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to fetch filter options');
    }
  }
);

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
      .addCase(fetchFilterOptions.fulfilled, (state, action: PayloadAction<{ models: string[], makes: string[], years: string[] }>) => {
        state.filterOptions = action.payload;
      });
  },
});

export const { updateCars, setPage, setFilters } = carSlice.actions;

export default carSlice.reducer;
