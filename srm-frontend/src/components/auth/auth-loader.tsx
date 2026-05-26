'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetMeQuery } from '@/services/api/authApiSlice';
import { setCredentials, logout, restoreAuth } from '@/store/slices/authSlice';
import { RootState } from '@/store/store';

interface AuthLoaderProps {
  children?: React.ReactNode;
}

export function AuthLoader({ children }: AuthLoaderProps) {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  // Step 1: Restore auth from localStorage on first mount (synchronously check)
  useEffect(() => {
    console.log('[AuthLoader] Mounting - checking localStorage');
    const savedToken = localStorage.getItem('auth_token');
    
    if (savedToken && !token) {
      console.log('[AuthLoader] Found saved token in localStorage, restoring to Redux...');
      dispatch(restoreAuth());
    }
  }, []); // Run only once on mount

  // Step 2: Fetch user profile from /me endpoint if we have token but no user
  const { data: meData, error, isSuccess, isError, isLoading } = useGetMeQuery(undefined, {
    skip: !token || !!user, // Skip if no token or already have user
  });

  // Step 3: Update Redux with fetched user data
  useEffect(() => {
    if (isSuccess && meData?.data && token) {
      console.log('[AuthLoader] ✓ Successfully fetched user profile from /me', meData.data);
      
      dispatch(setCredentials({
        user: meData.data,
        accessToken: token,
      }));
      
      // Save user to localStorage for quick restoration
      localStorage.setItem('auth_user', JSON.stringify(meData.data));
      console.log('✓ User saved to localStorage');
    } else if (isSuccess && !meData?.data) {
      console.warn('[AuthLoader] ⚠️ /me returned success but NO DATA', meData);
    }
  }, [isSuccess, meData, token, dispatch]);

  // Step 4: Handle errors - logout if token is invalid
  useEffect(() => {
    if (isError) {
      console.error('[AuthLoader] ❌ Failed to load user profile', error);
      
      // Token is invalid or expired
      dispatch(logout());
      localStorage.removeItem('auth_user');
      console.log('✓ Logged out due to invalid token');
    }
  }, [isError, error, dispatch]);

  // Debugging logs
  useEffect(() => {
    console.log('[AuthLoader] Current state:', {
      hasToken: !!token,
      hasUser: !!user,
      isAuthenticated,
      isLoading,
      userRole: user?.role,
    });
  }, [token, user, isAuthenticated, isLoading]);

  // If loading user profile, optionally show loading state
  if (isLoading && token && !user) {
    console.log('[AuthLoader] Loading user profile...');
  }

  return <>{children}</>;
}