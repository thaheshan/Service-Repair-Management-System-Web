import { apiSlice } from './apiSlice';

export interface SearchResult {
  id: string;
  type: string;
  name: string;
  sub: string;
  link: string;
}

interface SearchResponse {
  success: boolean;
  message: string;
  data: SearchResult[];
}

export const searchApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    globalSearch: builder.query<SearchResponse, string>({
      query: (query) => `/v1/search?q=${encodeURIComponent(query)}`,
      // Keep unused data around for a short period to avoid re-fetching on rapid typing
      keepUnusedDataFor: 60,
    }),
  }),
});

export const { useGlobalSearchQuery, useLazyGlobalSearchQuery } = searchApiSlice;
