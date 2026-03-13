import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import  SplashScreen  from './Splash_Screen/SplashScreen';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles
}) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isAuthenticated === null);

  // ==================== LOADING STATE ====================
  if (isLoading) {
    console.log('[ProtectedRoute] Auth state loading...');
    return <SplashScreen />;
  }

  // ==================== NOT AUTHENTICATED ====================
  if (!isAuthenticated) {
    console.warn('❌ ProtectedRoute: User not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // ==================== CHECK ROLE ====================
  if (requiredRoles && user) {
    const hasRequiredRole = requiredRoles.includes(user.role);

    if (!hasRequiredRole) {
      console.warn(
        `❌ ProtectedRoute: User role "${user.role}" not in required roles: ${requiredRoles.join(', ')}`
      );
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // ==================== ALLOW ACCESS ====================
  console.log('✓ ProtectedRoute: Allowing access');
  return <>{children}</>;
};