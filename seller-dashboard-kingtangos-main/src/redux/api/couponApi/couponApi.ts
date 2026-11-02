import baseApi from "../baseApi";

export const couponApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCoupon: builder.query({
      query: (params) => ({
        url: "/coupon",
        method: "GET",
        params: { ...params },
      }),
      providesTags: ["Coupon"],
    }),

    getAllCouponByStoreId: builder.query({
      query:  ({ id, params }) => ({
        url: `/coupon/storeAllCoupon/${id}`,
        method: "GET",
        params: { ...params },
      }),
      providesTags: ["Coupon"],
    }),

    getSingleCouponById: builder.query({
      query: (id) => ({
        url: `/coupon/${id}`,
        method: "GET",
      }),
      providesTags: ["Coupon"],
    }),

    createCoupon: builder.mutation({
      query: (data) => ({
        url: "/coupon/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Coupon"],
    }),

    updateCoupon: builder.mutation({
      query: ({ id, data }) => ({
        url: `/coupon/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Coupon"],
    }),

    deleteCoupon: builder.mutation({
      query: (id) => ({
        url: `/coupon/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Coupon"],
    }),
  }),
});

export const {
  useGetAllCouponQuery,
  useGetAllCouponByStoreIdQuery,
  useGetSingleCouponByIdQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation
} = couponApi;
