import { apiSlice } from './apiSlice';

export const inventoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInventoryItems: builder.query({
      query: () => '/v1/inventory',
      providesTags: ['Inventory'],
    }),
    createInventoryItem: builder.mutation({
      query: (data) => ({
        url: '/v1/inventory',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Inventory', 'Dashboard'],
    }),
    updateInventoryItem: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/v1/inventory/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Inventory', id },
        'Inventory',
      ],
    }),
    deleteInventoryItem: builder.mutation({
      query: (id) => ({
        url: `/v1/inventory/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Inventory', 'Dashboard'],
    }),
    getLowStockItems: builder.query({
      query: () => '/v1/inventory/low-stock',
      providesTags: ['Inventory'],
    }),
    getInventoryUsage: builder.query({
      query: () => '/v1/inventory/usage',
      providesTags: ['Inventory'],
    }),
    getInventorySummary: builder.query({
      query: () => '/v1/inventory/summary',
      providesTags: ['Inventory'],
    }),
  }),
});

export const {
  useGetInventoryItemsQuery,
  useCreateInventoryItemMutation,
  useUpdateInventoryItemMutation,
  useDeleteInventoryItemMutation,
  useGetLowStockItemsQuery,
  useGetInventoryUsageQuery,
  useGetInventorySummaryQuery,
} = inventoryApiSlice;
