import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  email: string | null;
  fullName?: string | null;
  role: 'ADMIN' | 'MANAGER' | 'TECHNICIAN' | 'CUSTOMER';
  tenantId: string;
  shopId: string | null;
  shopCode?: string | null;
  shopName?: string | null;
  shopEmail?: string | null;
  shopPhone?: string | null;
  shopAddress?: string | null;
  shopCity?: string | null;
  shopCountry?: string | null;
  shopPostalCode?: string | null;
  shopTaxNumber?: string | null;
  shopWebsite?: string | null;
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
  token: typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null,
  isAuthenticated: false,
  isLoading: false,
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
      console.log("Redux: Setting Credentials", action.payload);
      state.user = action.payload.user;
      state.token = action.payload.accessToken;
      state.isAuthenticated = true;
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', action.payload.accessToken);
      }
      console.log("Redux: New State User:", state.user);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
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
