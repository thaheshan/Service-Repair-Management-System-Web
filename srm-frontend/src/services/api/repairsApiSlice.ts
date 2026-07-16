import { apiSlice } from './apiSlice';

export const repairsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRepairs: builder.query({
      query: () => '/v1/repairs',
      providesTags: ['Repairs'],
    }),
    getRepairById: builder.query({
      query: (id) => `/v1/repairs/${id}`,
      providesTags: (result, error, id) => [{ type: 'Repairs', id }],
    }),
    createRepair: builder.mutation({
      query: (data) => ({
        url: '/v1/repairs',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Repairs', 'Dashboard'],
    }),
    updateRepairStatus: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/v1/repairs/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Repairs', id },
        'Repairs',
        'Dashboard',
      ],
    }),
    deleteRepair: builder.mutation({
      query: (id) => ({
        url: `/v1/repairs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Repairs', 'Dashboard'],
    }),
    addRepairNote: builder.mutation({
      query: ({ id, text }) => ({
        url: `/v1/repairs/${id}/notes`,
        method: 'POST',
        body: { text },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Repairs', id }],
    }),
    deleteRepairPhoto: builder.mutation({
      query: ({ repairId, photoId }) => ({
        url: `/v1/uploads/image/${photoId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { repairId }) => [{ type: 'Repairs', id: repairId }],
    }),
  }),
});

export const {
  useGetRepairsQuery,
  useGetRepairByIdQuery,
  useCreateRepairMutation,
  useUpdateRepairStatusMutation,
  useDeleteRepairMutation,
  useAddRepairNoteMutation,
  useDeleteRepairPhotoMutation,
} = repairsApiSlice;
