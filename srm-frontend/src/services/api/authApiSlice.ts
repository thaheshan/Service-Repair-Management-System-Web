import { apiSlice } from './apiSlice';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/v1/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    getMe: builder.query({
      query: () => '/v1/auth/me',
      providesTags: ['User'],
    }),
    listRegistrations: builder.query({
      query: (status) => ({
        url: '/v1/onboarding',
        params: { status },
      }),
      providesTags: ['Registration'],
    }),
    requestRegistration: builder.mutation({
      query: (data) => ({
        url: '/v1/onboarding/request',
        method: 'POST',
        body: data,
      }),
    }),
    getRegistrationStatus: builder.query({
      query: (id) => `/v1/onboarding/status/${id}`,
      providesTags: ['Registration'],
    }),
    approveRegistration: builder.mutation({
      query: (token) => ({
        url: `/v1/onboarding/approve/${token}`,
        method: 'POST',
      }),
      invalidatesTags: ['Registration'],
    }),
    finalizeRegistration: builder.mutation({
      query: (data) => ({
        url: '/v1/onboarding/finalize',
        method: 'POST',
        body: data,
      }),
    }),
    registerStaff: builder.mutation({
      query: (data) => ({
        url: '/v1/staff/register',
        method: 'POST',
        body: data,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: '/v1/auth/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: '/v1/auth/reset-password',
        method: 'POST',
        body: data,
      }),
    }),
    updateMe: builder.mutation({
      query: (data) => ({
        url: '/v1/auth/me',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetMeQuery,
  useListRegistrationsQuery,
  useRequestRegistrationMutation,
  useGetRegistrationStatusQuery,
  useApproveRegistrationMutation,
  useFinalizeRegistrationMutation,
  useRegisterStaffMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useUpdateMeMutation,
} = authApiSlice;
