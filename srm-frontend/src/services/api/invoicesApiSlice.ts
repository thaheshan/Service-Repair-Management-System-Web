import { apiSlice } from './apiSlice';

export const invoicesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInvoices: builder.query({
      query: () => '/v1/invoices',
      providesTags: ['Invoices'],
    }),
    getInvoiceSummary: builder.query({
      query: () => '/v1/invoices/summary',
      providesTags: ['Invoices'],
    }),
    createInvoice: builder.mutation({
      query: (data) => ({
        url: '/v1/invoices',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Invoices', 'Dashboard'],
    }),
    updateInvoiceStatus: builder.mutation({
      query: ({ id, status, amount }) => ({
        url: `/v1/invoices/${id}/status`,
        method: 'PATCH',
        body: { status, amount },
      }),
      invalidatesTags: ['Invoices'],
    }),
    deleteInvoice: builder.mutation({
      query: (id) => ({
        url: `/v1/invoices/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Invoices', 'Dashboard'],
    }),
  }),
});

export const {
  useGetInvoicesQuery,
  useGetInvoiceSummaryQuery,
  useCreateInvoiceMutation,
  useUpdateInvoiceStatusMutation,
  useDeleteInvoiceMutation,
} = invoicesApiSlice;
