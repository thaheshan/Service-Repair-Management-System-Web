import { apiSlice } from './apiSlice';

export const scheduleApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAppointments: builder.query({
      query: () => '/v1/appointments',
      providesTags: ['Schedule'],
    }),
    createAppointment: builder.mutation({
      query: (data) => ({
        url: '/v1/appointments',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Schedule'],
    }),
    updateAppointment: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/v1/appointments/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Schedule'],
    }),
    deleteAppointment: builder.mutation({
      query: (id) => ({
        url: `/v1/appointments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Schedule'],
    }),
  }),
});

export const {
  useGetAppointmentsQuery,
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation,
} = scheduleApiSlice;
