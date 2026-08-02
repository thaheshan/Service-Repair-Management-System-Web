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
        url: '/v1/staff/register',
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
    getStaffRoles: builder.query({
      query: () => '/v1/staff/roles',
      providesTags: ['StaffRoles'],
    }),
    addStaffRole: builder.mutation({
      query: (data) => ({
        url: '/v1/staff/roles',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['StaffRoles'],
    }),
    updateStaffRole: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/v1/staff/roles/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['StaffRoles'],
    }),
    deleteStaffRole: builder.mutation({
      query: (id) => ({
        url: `/v1/staff/roles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['StaffRoles'],
    }),
  }),
});

export const {
  useGetStaffListQuery,
  useGetStaffContextQuery,
  useCreateStaffMutation,
  useUpdateStaffMutation,
  useDeleteStaffMutation,
  useGetStaffRolesQuery,
  useAddStaffRoleMutation,
  useUpdateStaffRoleMutation,
  useDeleteStaffRoleMutation,
} = staffApiSlice;
