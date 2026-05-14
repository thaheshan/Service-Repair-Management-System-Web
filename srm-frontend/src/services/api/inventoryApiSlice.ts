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
    // Supplier Endpoints
    getSuppliers: builder.query({
      query: () => '/v1/inventory/suppliers/all',
      providesTags: ['Suppliers'],
    }),
    createSupplier: builder.mutation({
      query: (data) => ({
        url: '/v1/inventory/suppliers',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Suppliers'],
    }),
    updateSupplier: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/v1/inventory/suppliers/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Suppliers'],
    }),
    deleteSupplier: builder.mutation({
      query: (id) => ({
        url: `/v1/inventory/suppliers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Suppliers'],
    }),
    // Purchase Order Endpoints
    getPurchaseOrders: builder.query({
      query: () => '/v1/inventory/purchase-orders/all',
      providesTags: ['PurchaseOrders'],
    }),
    createPurchaseOrder: builder.mutation({
      query: (data) => ({
        url: '/v1/inventory/purchase-orders',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['PurchaseOrders', 'Inventory'],
    }),
    updatePurchaseOrderStatus: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/v1/inventory/purchase-orders/${id}/status`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['PurchaseOrders', 'Inventory'],
    }),
    updatePurchaseOrder: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/v1/inventory/purchase-orders/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['PurchaseOrders', 'Inventory'],
    }),
    deletePurchaseOrder: builder.mutation({
      query: (id) => ({
        url: `/v1/inventory/purchase-orders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['PurchaseOrders', 'Inventory'],
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
  useGetSuppliersQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
  useGetPurchaseOrdersQuery,
  useCreatePurchaseOrderMutation,
  useUpdatePurchaseOrderStatusMutation,
  useUpdatePurchaseOrderMutation,
  useDeletePurchaseOrderMutation,
} = inventoryApiSlice;
