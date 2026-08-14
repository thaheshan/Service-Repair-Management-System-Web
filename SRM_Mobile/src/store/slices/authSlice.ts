import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  email: string | null;
  fullName?: string | null;
  role: 'ADMIN' | 'MANAGER' | 'TECHNICIAN' | 'CUSTOMER';
  tenantId: string;
  shopId: string | null;
  shopCode?: string | null;
  shopName?: string | null;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null, // Token loaded async in mobile
  isAuthenticated: false,
  isLoading: true, // Start loading until async storage check completes
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken: string }>
    ) => {
      state.user = {
        ...action.payload.user,
        role: action.payload.user.role?.toUpperCase() as User['role']
      };
      state.token = action.payload.accessToken;
      state.isAuthenticated = true;
      state.isLoading = false;
      // Async storage is handled outside the reducer
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setCredentials, logout, setLoading, setError } = authSlice.actions;

export default authSlice.reducer;
