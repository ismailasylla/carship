import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5001/api';

export interface AuthState {
  isAuthenticated: boolean;
  user: any;
  loading: boolean;
  error: string | null;
  token: string | null;
}

const getTokenFromLocalStorage = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

const initialState: AuthState = {
  isAuthenticated: !!getTokenFromLocalStorage(),
  user: null,
  loading: false,
  error: null,
  token: getTokenFromLocalStorage(),
};

export const loginUser = createAsyncThunk<
  any, 
  { email: string; password: string }, 
  { rejectValue: string }
>(
  'auth/loginUser',
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await axios.post('/auth/login', { email, password });
      const { token, user } = response.data;

      localStorage.setItem('token', token);

      return { user, token };
    } catch (error) {
      console.error('Login error:', error);
      return thunkAPI.rejectWithValue('Login failed');
    }
  }
);

export const registerUser = createAsyncThunk<
  any, 
  { email: string; password: string }, 
  { rejectValue: string }
>(
  'auth/registerUser',
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await axios.post('/auth/register', { email, password });
      const { token, user } = response.data;

      localStorage.setItem('token', token);

      return { user, token };
    } catch (error) {
      console.error('Registration error:', error);
      return thunkAPI.rejectWithValue('Registration failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
      state.error = null;
      state.token = null;

      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.loading = false;
        state.error = null;
        state.token = action.payload.token;

        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Login failed';
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.loading = false;
        state.error = null;
        state.token = action.payload.token;

        localStorage.setItem('token', action.payload.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Registration failed';
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;