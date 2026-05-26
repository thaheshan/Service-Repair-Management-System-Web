import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  email: string | null;
  name?: string | null;
  fullName?: string | null;
  role: 'ADMIN' | 'MANAGER' | 'TECHNICIAN' | 'CUSTOMER' | 'admin' | 'manager' | 'technician' | 'customer';
  tenantId?: string;
  tenant_id?: string;
  shopId?: string | null;
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
  token: null, // Don't load from localStorage here - do it in authLoader instead (fixes SSR issues)
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // ==================== SET CREDENTIALS ====================
    setCredentials: (
      state,
      action: PayloadAction<{ 
        user: User; 
        accessToken?: string;
        token?: string;
      }>
    ) => {
      // Accept both 'accessToken' and 'token' field names
      const authToken = action.payload.accessToken || action.payload.token;
      
      if (!authToken) {
        console.warn('[Redux Auth] ⚠️ No token provided to setCredentials');
      }
      
      console.log('[Redux Auth] Setting Credentials', {
        userId: action.payload.user?.id,
        userRole: action.payload.user?.role,
        hasToken: !!authToken,
      });

      state.user = action.payload.user;
      state.token = authToken || null;
      state.isAuthenticated = !!authToken;
      state.isLoading = false;
      state.error = null;
      
      // Save to localStorage (only on client side)
      if (typeof window !== 'undefined' && authToken) {
        try {
          localStorage.setItem('auth_token', authToken);
          localStorage.setItem('auth_user', JSON.stringify(action.payload.user));
          console.log('✓ Credentials saved to localStorage');
        } catch (err) {
          console.error('❌ Failed to save to localStorage:', err);
        }
      }
      
      console.log('[Redux Auth] ✓ Credentials set successfully');
    },

    // ==================== LOGOUT ====================
    logout: (state) => {
      console.log('[Redux Auth] Logging out...');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          console.log('✓ Auth cleared from localStorage');
        } catch (err) {
          console.error('❌ Failed to clear localStorage:', err);
        }
      }
    },

    // ==================== SET LOADING ====================
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // ==================== SET ERROR ====================
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      if (action.payload) {
        console.error('[Redux Auth] Error:', action.payload);
      }
    },

    // ==================== RESTORE AUTH ====================
    // Called on app startup to restore auth from localStorage
    restoreAuth: (state) => {
      if (typeof window === 'undefined') return; // Skip on server side
      
      try {
        const savedToken = localStorage.getItem('auth_token');
        const savedUser = localStorage.getItem('auth_user');

        console.log('[Redux Auth] Attempting to restore from localStorage', {
          hasToken: !!savedToken,
          hasUser: !!savedUser,
        });

        if (savedToken && savedUser) {
          state.token = savedToken;
          state.user = JSON.parse(savedUser);
          state.isAuthenticated = true;
          state.error = null;
          console.log('✓ Auth restored from localStorage');
        } else if (savedToken && !savedUser) {
          // Token exists but user doesn't - clear both (inconsistent state)
          localStorage.removeItem('auth_token');
          console.warn('⚠️ Cleared invalid token - user data missing');
        } else {
          state.isAuthenticated = false;
          console.log('[Redux Auth] No saved auth found');
        }
      } catch (err) {
        console.error('[Redux Auth] ❌ Failed to restore auth:', err);
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
        // Clear corrupted data
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    },

    // ==================== CLEAR ERROR ====================
    clearError: (state) => {
      state.error = null;
    },

    // ==================== SET USER ====================
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      if (action.payload && typeof window !== 'undefined') {
        localStorage.setItem('auth_user', JSON.stringify(action.payload));
      }
    },

    // ==================== SET TOKEN ====================
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
      
      if (typeof window !== 'undefined') {
        if (action.payload) {
          localStorage.setItem('auth_token', action.payload);
          console.log('✓ Token saved to localStorage');
        } else {
          localStorage.removeItem('auth_token');
        }
      }
    },
  },
});

export const { 
  setCredentials, 
  logout, 
  setLoading, 
  setError, 
  restoreAuth, 
  clearError,
  setUser,
  setToken,
} = authSlice.actions;

export default authSlice.reducer;