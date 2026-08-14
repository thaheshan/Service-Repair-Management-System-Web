import { apiSlice } from './apiSlice';

export const dashboardApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardAnalytics: builder.query({
      query: ({ days = 30 }: { days?: number } = {}) => `/v1/dashboard/analytics?days=${days}`,
      providesTags: ['Dashboard'],
    }),
    seedDashboard: builder.mutation({
      query: () => ({ url: '/v1/dashboard/seed', method: 'POST' }),
      invalidatesTags: ['Dashboard', 'Customers', 'Devices', 'Repairs', 'Schedule', 'Invoices', 'Staff', 'Inventory'],
    }),
    markRead: builder.mutation({
      query: (notificationId?: string) => ({
        url: '/v1/dashboard/notifications/mark-read',
        method: 'PATCH',
        body: { notificationId },
      }),
      invalidatesTags: ['Dashboard'],
    }),
    clearNotifications: builder.mutation({
      query: (notificationId?: string) => ({
        url: '/v1/dashboard/notifications/clear',
        method: 'PATCH',
        body: { notificationId },
      }),
      invalidatesTags: ['Dashboard'],
    }),
  }),
});

export const {
  useGetDashboardAnalyticsQuery,
  useSeedDashboardMutation,
  useMarkReadMutation,
  useClearNotificationsMutation,
} = dashboardApiSlice;
