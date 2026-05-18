'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetMeQuery } from '@/services/api/authApiSlice';
import { setCredentials, logout } from '@/store/slices/authSlice';
import { RootState } from '@/store/store';

export function AuthLoader({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);

  const { data: meData, error, isSuccess, isError } = useGetMeQuery(undefined, {
    skip: !token || !!user,
  });

  useEffect(() => {
    if (isSuccess && meData?.data && token) {
      console.log("AuthLoader: Success fetching /me", meData.data);
      dispatch(setCredentials({ 
        user: meData.data, 
        accessToken: token 
      }));
    } else if (isSuccess && !meData?.data) {
      console.error("AuthLoader: Success but NO DATA in response", meData);
    }
  }, [isSuccess, meData, token, dispatch]);

  useEffect(() => {
    if (isError) {
      console.error(
        "Session Recovery: Failed to load user profile",
        error || "Unknown error"
      );
      dispatch(logout());
    }
  }, [isError, error, dispatch]);

  return <>{children}</>;
}
