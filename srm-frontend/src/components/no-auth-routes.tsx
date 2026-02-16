import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import  LoadingScreen  from './Splash_Screen/SplashScreen';

interface NoAuthRouteProps {
  children: React.ReactNode;
}

/**
 * NoAuthRoute Component
 * Routes that should only be accessible when NOT authenticated (login, register)
 * - If loading: shows loading screen
 * - If authenticated: redirects to appropriate dashboard
 * - Otherwise: allows access
 */
export const NoAuthRoute: React.FC<NoAuthRouteProps> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isAuthenticated === null);

  // ==================== LOADING STATE ====================
  if (isLoading) {
    console.log('[NoAuthRoute] Auth state loading...');
    return <LoadingScreen />;
  }

  // ==================== ALREADY AUTHENTICATED ====================
  if (isAuthenticated && user) {
    // Redirect authenticated users to appropriate dashboard
    const dashboard = user.role === 'admin' ? '/admin-dashboard' : '/user-dashboard';
    console.warn(
      `❌ NoAuthRoute: User already authenticated, redirecting to ${dashboard}`
    );
    return <Navigate to={dashboard} replace />;
  }

  // ==================== ALLOW ACCESS ====================
  console.log('✓ NoAuthRoute: Allowing access');
  return <>{children}</>;
};