/**
 * Authentication Type Definitions
 * Centralized types for the entire auth system
 */

/**
 * User object returned from API
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

/**
 * Supported user roles
 */
export type UserRole = 'admin' | 'technician';

/**
 * Login request payload
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Login response from API
 */
export interface LoginResponse {
  token: string;
  user: User;
  expiresIn?: number; // Optional: token expiration time
}

/**
 * Standard API error response
 */
export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
}

/**
 * Auth state in store
 */
export interface AuthState {
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

/**
 * Protected route props
 */
export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
}

/**
 * No auth route props
 */
export interface NoAuthRouteProps {
  children: React.ReactNode;
}