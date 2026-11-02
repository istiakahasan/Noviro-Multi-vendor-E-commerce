import baseApi from "../baseApi";

export const refundApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRefund: builder.query({
      query: (params) => ({
        url: "/refunds/seller/request",
        method: "GET",
        params: { ...params },
      }),
    providesTags: ["Refund"],
    }),

    updateRefundStatus: builder.mutation({
      query: ({ id, data }) => ({
        url: `/refunds/seller-response/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Refund"],
    }),

  }),
});

export const {
    useGetRefundQuery,
    useUpdateRefundStatusMutation,
} = refundApi
