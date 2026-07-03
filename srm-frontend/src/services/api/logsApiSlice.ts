import { apiSlice } from "./apiSlice";

export interface ActivityLog {
  id: string;
  tenantId: string;
  shopId: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: Record<string, any>;
  amount?: number;
  amountLabel?: string;
  createdAt: string;
}

export interface LogsResponse {
  success: boolean;
  data: ActivityLog[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  staff: { userId: string; userName: string; userRole: string }[];
}

export interface LogsSummaryResponse {
  success: boolean;
  data: {
    totalToday: number;
    totalAll: number;
    topUsers: { userName: string; userRole: string; _count: { id: number } }[];
  };
}

export interface LogsQueryParams {
  userId?: string;
  action?: string;
  entity?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
  search?: string;
}

export const logsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getActivityLogs: builder.query<LogsResponse, LogsQueryParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.userId) searchParams.set("userId", params.userId);
        if (params.action) searchParams.set("action", params.action);
        if (params.entity) searchParams.set("entity", params.entity);
        if (params.fromDate) searchParams.set("fromDate", params.fromDate);
        if (params.toDate) searchParams.set("toDate", params.toDate);
        if (params.page) searchParams.set("page", String(params.page));
        if (params.limit) searchParams.set("limit", String(params.limit));
        if (params.search) searchParams.set("search", params.search);
        return `/v1/logs?${searchParams.toString()}`;
      },
      providesTags: ["Logs" as any],
    }),
    getLogsSummary: builder.query<LogsSummaryResponse, void>({
      query: () => "/v1/logs/summary",
      providesTags: ["Logs" as any],
    }),
  }),
});

export const { useGetActivityLogsQuery, useGetLogsSummaryQuery } = logsApiSlice;
