import baseApi from "../baseApi";

export const withdrawApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEligibility: builder.query({
      query: (params) => ({
        url: "/withdrawals/eligibility",
        method: "GET",
        params: { ...params },
      }),
    providesTags: ["Withdraw"],
    }),

    getWithdrawalsHistory: builder.query({
      query: (params) => ({
        url: "/withdrawals/history",
        method: "GET",
        params: { ...params },
      }),
    providesTags: ["Withdraw"],
    }),

    createWithdrawal: builder.mutation({
      query: (data) => ({
        url: "/withdrawals/request",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Withdraw"],
    }),

    createStripeAccount: builder.mutation({
      query: (data) => ({
        url: "/stripe/connect-account",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Withdraw"],
    }),
  }),
});

export const {
    useGetEligibilityQuery,
    useGetWithdrawalsHistoryQuery,
    useCreateWithdrawalMutation,
    useCreateStripeAccountMutation,
} = withdrawApi;
