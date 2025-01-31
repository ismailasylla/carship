import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  fetchCars as fetchCarsAPI,
  addCarRequest as addCarAPI,
  updateCarRequest as updateCarAPI,
  deleteCarRequest as deleteCarAPI,
  fetchFilterOptions as fetchFilterOptionsAPI,
  fetchCarRequest as fetchCarAPI,
} from '../../services/apiCalls';
import { Car } from '../../types';
import store, { RootState } from '../../store';
import socket from '../../socket/websocket';

interface CarState {
  cars: Car[];
  currentCar: Car | null; 
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
  currentCar: null,
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
  model: string;
  year: string;
  make: string;
}

interface FetchCarsResponse {
  cars: Car[];
  totalPages: number;
}

export const fetchCars = createAsyncThunk<FetchCarsResponse, FetchCarsParams, { rejectValue: string }>(
  'car/fetchCars',
  async ({ page, model, year, make }, thunkAPI) => {
    try {
      const { cars = [], totalPages = 1 } = await fetchCarsAPI(page, model, year, make);
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

export const getCar = createAsyncThunk<Car, string, { rejectValue: string }>(
  'car/getCar',
  async (id, thunkAPI) => {
    try {
      const car = await fetchCarAPI(id);
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
      .addCase(fetchFilterOptions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFilterOptions.fulfilled, (state, action: PayloadAction<{ models: string[], makes: string[], years: string[] }>) => {
        state.status = 'succeeded';
        state.filterOptions = action.payload;
      })
      .addCase(fetchFilterOptions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch filter options';
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
        const index = state.cars.findIndex((car) => car._id === action.payload._id);
        if (index !== -1) {
          state.cars[index] = action.payload;
        }
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
      });
  },
});

socket.on('updateCars', (cars: Car[]) => {
  store.dispatch(updateCars(cars));
});

export const { updateCars, setPage, setFilters } = carSlice.actions;

export default carSlice.reducer;
