import { apiSlice } from './apiSlice';

export const staffApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStaffList: builder.query({
      query: () => '/v1/staff',
      providesTags: ['Staff'],
    }),
    getStaffContext: builder.query({
      query: () => '/v1/staff/me',
      providesTags: ['Staff'],
    }),
    createStaff: builder.mutation({
      query: (data) => ({
        url: '/v1/staff',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Staff', 'Dashboard'],
    }),
    updateStaff: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/v1/staff/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Staff', id },
        'Staff',
      ],
    }),
    deleteStaff: builder.mutation({
      query: (id) => ({
        url: `/v1/staff/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Staff', 'Dashboard'],
    }),
  }),
});

export const {
  useGetStaffListQuery,
  useGetStaffContextQuery,
  useCreateStaffMutation,
  useUpdateStaffMutation,
  useDeleteStaffMutation,
} = staffApiSlice;
