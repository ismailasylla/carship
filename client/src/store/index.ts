import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import carReducer from './slices/carSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    car: carReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
