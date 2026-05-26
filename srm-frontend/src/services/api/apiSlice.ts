import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState }) => {
      // Try to get token from Redux first
      let token = (getState() as any).auth.token;
      console.log('[API] Redux token:', token ? 'Found' : 'Missing');

      // If no token in Redux, check localStorage directly
      // This handles the race condition where API calls fire before token restoration
      if (!token && typeof window !== 'undefined') {
        token = localStorage.getItem('auth_token');
        console.log('[API] Fallback to localStorage:', token ? 'Found' : 'Missing');
      }

      if (token) {
        headers.set('authorization', `Bearer ${token}`);
        console.log('[API] ✓ Authorization header added');
      } else {
        console.warn('[API] ⚠️ No token found in Redux or localStorage');
      }
      return headers;
    },
  }),
  tagTypes: [
    'User', 'Shop', 'Repair', 'Repairs', 'Registration',
    'Customers', 'Staff', 'Devices', 'Inventory',
    'Invoices', 'Settings', 'Dashboard', 'Schedule',
    'Suppliers', 'PurchaseOrders', 'StaffRoles',
  ],
  endpoints: (builder) => ({}),
});
