import { apiSlice } from './apiSlice';

export const settingsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query({
      query: () => '/v1/settings',
      providesTags: ['Settings'],
    }),
    updateSettings: builder.mutation({
      query: (data) => ({
        url: '/v1/settings',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Settings'],
    }),
  }),
});

export const {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} = settingsApiSlice;
