import { apiSlice } from './apiSlice';

export const devicesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDevices: builder.query({
      query: () => '/v1/devices',
      providesTags: ['Devices'],
    }),
    createDevice: builder.mutation({
      query: (data) => ({
        url: '/v1/devices',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Devices', 'Dashboard'],
    }),
    updateDevice: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/v1/devices/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Devices', id },
        'Devices',
      ],
    }),
    deleteDevice: builder.mutation({
      query: (id) => ({
        url: `/v1/devices/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Devices', 'Dashboard'],
    }),
  }),
});

export const {
  useGetDevicesQuery,
  useCreateDeviceMutation,
  useUpdateDeviceMutation,
  useDeleteDeviceMutation,
} = devicesApiSlice;
