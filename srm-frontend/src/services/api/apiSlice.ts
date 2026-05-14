import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

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
    'Suppliers', 'PurchaseOrders',
  ],
  endpoints: (builder) => ({}),
});
