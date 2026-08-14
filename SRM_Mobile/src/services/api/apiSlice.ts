import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// For Android emulator, localhost is 10.0.2.2.
// Use process.env.EXPO_PUBLIC_API_URL if defined.
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:8000/api';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    'User', 'Shop', 'Repair', 'Repairs', 'Registration',
    'Customers', 'Staff', 'Devices', 'Inventory',
    'Invoices', 'Settings', 'Dashboard', 'Schedule',
    'Suppliers', 'PurchaseOrders', 'StaffRoles', 'Logs',
  ],
  endpoints: (builder) => ({}),
});
