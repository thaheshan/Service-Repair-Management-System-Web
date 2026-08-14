import { apiSlice } from './apiSlice';

export const customersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query({
      query: () => '/v1/customers',
      providesTags: ['Customers'],
    }),
    getCustomerById: builder.query({
      query: (id) => `/v1/customers/${id}`,
      providesTags: (result, error, id) => [{ type: 'Customers', id }],
    }),
    createCustomer: builder.mutation({
      query: (data) => ({ url: '/v1/customers', method: 'POST', body: data }),
      invalidatesTags: ['Customers'],
    }),
    updateCustomer: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/v1/customers/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Customers', id }, 'Customers'],
    }),
    deleteCustomer: builder.mutation({
      query: (id) => ({ url: `/v1/customers/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Customers'],
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useGetCustomerByIdQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customersApiSlice;
