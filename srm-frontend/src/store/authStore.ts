import { create } from 'zustand';
import axios from 'axios';

export interface User {
  user_id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  tenant_id: string;
}

interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean | null; // null = loading, true = auth, false = not auth
  isLoading: boolean;
  error: string | null;

  // Actions
  initializeAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
const AUTH_TOKEN_KEY = 'auth_token';

export const useAuthStore = create<AuthState>((set, get) => ({
  // ==================== INITIAL STATE ====================
  user: null,
  token: null,
  isAuthenticated: null, // null = loading
  isLoading: false,
  error: null,

  // ==================== INITIALIZE AUTH ====================
  /**
   * Called once on app startup
   * Checks for stored token and validates it
   */
  initializeAuth: async () => {
    try {
      console.log('[Auth] Initializing authentication...');

      // Check for stored token
      const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);

      if (!storedToken) {
        // No token found - user is not authenticated
        set({
          isAuthenticated: false,
          user: null,
          token: null
        });
        console.log('✓ Auth initialized - no token found');
        return;
      }

      console.log('[Auth] Found token, validating with backend...');

      // Validate token with backend
      const response = await axios.get(`${API_URL}/api/auth/validate`, {
        headers: { Authorization: `Bearer ${storedToken}` },
        timeout: 5000
      });

      // Token is valid
      set({
        isAuthenticated: true,
        token: storedToken,
        user: response.data.user
      });
      console.log('✓ Auth initialized - token valid');
    } catch (error) {
      console.error('[Auth] Token validation failed:', error);

      // Token is invalid or expired
      localStorage.removeItem(AUTH_TOKEN_KEY);
      set({
        isAuthenticated: false,
        user: null,
        token: null,
        error: null
      });
      console.log('✓ Auth initialized - token invalid');
    }
  },

  // ==================== LOGIN ====================
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password
      });

      const { token, user } = response.data;

      // Store token
      localStorage.setItem(AUTH_TOKEN_KEY, token);

      set({
        token,
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });

      console.log('✓ Login successful');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      set({
        isLoading: false,
        error: message
      });
      console.error('❌ Login error:', message);
      throw error;
    }
  },

  // ==================== LOGOUT ====================
  logout: () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
      isLoading: false
    });
    console.log('✓ Logged out');
  },

  // ==================== UTILITIES ====================
  clearError: () => set({ error: null }),

  setUser: (user: User | null) => {
    set({ user });
  },

  setToken: (token: string | null) => {
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
    set({ token });
  }
}));