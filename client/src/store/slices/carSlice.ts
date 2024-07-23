import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchCars as fetchCarsAPI, addCarRequest as addCarAPI } from '../../components/utils/apiCalls';
import { Car } from '../../types';

export interface CarState {
  cars: Car[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CarState = {
  cars: [],
  status: 'idle',
  error: null,
};

export const fetchCars = createAsyncThunk<Car[], void, { rejectValue: string }>(
  'car/fetchCars',
  async (_, thunkAPI) => {
    try {
      const cars = await fetchCarsAPI();
      return cars;
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to fetch cars');
    }
  }
);

export const addCar = createAsyncThunk<Car, Car, { rejectValue: string }>(
  'car/addCar',
  async (car, thunkAPI) => {
    try {
      const newCar = await addCarAPI(car);
      return newCar;
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to add car');
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCars.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCars.fulfilled, (state, action: PayloadAction<Car[]>) => {
        state.status = 'succeeded';
        state.cars = action.payload;
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
      });
  },
});

export const { updateCars } = carSlice.actions;

export default carSlice.reducer;
