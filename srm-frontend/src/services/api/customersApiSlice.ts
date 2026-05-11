import { apiSlice } from './apiSlice';

export const customersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query({
      query: () => '/v1/customers',
      providesTags: ['Customers'],
    }),
    searchCustomers: builder.query({
      query: (q) => `/v1/customers/search?q=${q}`,
      providesTags: ['Customers'],
    }),

    getCustomerById: builder.query({
      query: (id) => `/v1/customers/${id}`,
      providesTags: (result, error, id) => [{ type: 'Customers', id }],
    }),
    createCustomer: builder.mutation({
      query: (data) => ({
        url: '/v1/customers',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Customers', 'Dashboard'],
    }),
    updateCustomer: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/v1/customers/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Customers', id },
        'Customers',
      ],
    }),
    deleteCustomer: builder.mutation({
      query: (id) => ({
        url: `/v1/customers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Customers'],
    }),
    addCustomerNote: builder.mutation({
      query: ({ customerId, text }) => ({
        url: `/v1/customers/${customerId}/notes`,
        method: 'POST',
        body: { text },
      }),
      invalidatesTags: (result, error, { customerId }) => [
        { type: 'Customers', id: customerId },
      ],
    }),
    mergeCustomers: builder.mutation({
      query: ({ sourceId, targetId }) => ({
        url: `/v1/customers/${sourceId}/merge`,
        method: 'POST',
        body: { targetId },
      }),
      invalidatesTags: ['Customers'],
    }),
    sendCustomerSMS: builder.mutation({
      query: ({ customerId, message }) => ({
        url: `/v1/customers/${customerId}/sms`,
        method: 'POST',
        body: { message },
      }),
    }),
  }),
});

export const { 
  useGetCustomersQuery, 
  useGetCustomerByIdQuery, 
  useCreateCustomerMutation, 
  useUpdateCustomerMutation, 
  useDeleteCustomerMutation, 
  useAddCustomerNoteMutation,
  useSearchCustomersQuery,
  useMergeCustomersMutation,
  useSendCustomerSMSMutation
} = customersApiSlice;
