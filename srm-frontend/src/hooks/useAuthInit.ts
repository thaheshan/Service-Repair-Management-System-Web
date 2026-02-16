import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

/**
 * Custom Hook: useAuthInit
 * Initializes authentication on app startup
 * Should be called once in the App component
 *
 * Responsibilities:
 * - Check for stored token
 * - Validate token with backend
 * - Set auth state (true/false/null)
 * - Allow guards to make routing decisions
 */
export const useAuthInit = (): void => {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    // Only run initialization once, when isAuthenticated is null (initial state)
    if (isAuthenticated === null) {
      console.log('[useAuthInit] Starting auth initialization');
      initializeAuth();
    }
  }, []); // Empty dependency array - run only once on mount
};