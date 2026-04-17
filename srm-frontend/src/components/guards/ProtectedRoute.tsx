'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

/**
 * Route guarding component for client-side authentication and role-based access control.
 * In a Next.js App Router context, this is typically used around page content or in a layout.
 */
export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAuthStore();

  useEffect(() => {
    // Wait until hydration/initialization is complete
    if (isAuthenticated === false && !isLoading) {
      router.push('/login');
    } else if (isAuthenticated && user && !allowedRoles.includes(user.role)) {
      router.push('/unauthorized');
    }
  }, [isAuthenticated, user, isLoading, allowedRoles, router]);

  // Loading state (optional: replace with a Spinner)
  if (isLoading || isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F46E5]" />
      </div>
    );
  }

  // If not authenticated or wrong role, show nothing while we redirect
  if (isAuthenticated === false || (user && !allowedRoles.includes(user.role))) {
    return null;
  }

  return <>{children}</>;
};
