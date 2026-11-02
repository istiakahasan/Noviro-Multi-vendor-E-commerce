import { baseApi } from "@/redux/api/baseApi";
export const userDashbordApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyOders: builder.query({
      query: ({ orderStatus, page, limit }) => ({
        url: "/orders/my-orders",
        method: "GET",
        params: { orderStatus, page, limit },
      }),
      providesTags: ["UserOrders"],
    }),
    getOrderDetails: builder.query({
      query: (orderId) => ({
        url: `/orders/${orderId}`,
        method: "GET",
      }),
      providesTags: ["UserOrders"],
    }),
    getAllBooking: builder.query({
      query: ({ page, limit, bookingType }) => ({
        url: "/booking/my/bookings",
        method: "GET",
        params: { page, limit, bookingType },
      }),
      providesTags: ["UserBookings"],
    }),
    getSingleBooking: builder.query({
      query: (bookingId) => ({
        url: `/booking/${bookingId}`,
        method: "GET",
      }),
      providesTags: ["UserBookings"],
    }),
    cancelBooking: builder.mutation({
      query: (bookingId) => ({
        url: `/booking/cancel/${bookingId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["UserBookings"],
    }),
    rescheduleBooking: builder.mutation({
      query: ({ data, bookingId }) => ({
        url: `/booking/my-bookings/${bookingId}/reschedule`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["UserBookings"],
    }),
    getSubscriptions: builder.query({
      query: ({ page, limit }) => ({
        url: "/subscriptions/my-subscription",
        method: "GET",
        params: { page, limit },
      }),
      providesTags: ["UserSubscriptions"],
    }),
    getSingleSubscription: builder.query({
      query: (subscriptionId) => ({
        url: `/subscriptions/${subscriptionId}`,
        method: "GET",
      }),
      providesTags: ["UserSubscriptions"],
    }),
    getCancelSubscriptions: builder.query({
      query: ({ page, limit }) => ({
        url: "/subscriptions/user/my-cancellations",
        method: "GET",
        params: { page, limit },
      }),
      providesTags: ["UserSubscriptions"],
    }),

    cancelSubscription: builder.mutation({
      query: (subscriptionId) => ({
        url: `/subscriptions/${subscriptionId}/cancel`,
        method: "POST",
      }),
      invalidatesTags: ["UserSubscriptions"],
    }),
    reActiveSubscription: builder.mutation({
      query: (subscriptionId) => ({
        url: `/subscriptions/${subscriptionId}/reactivate`,
        method: "POST",
      }),
      invalidatesTags: ["UserSubscriptions"],
    }),
    toggleAutoRenewSubscription: builder.mutation({
      query: ({ subscriptionId, autoRenew }) => ({
        url: `/subscriptions/${subscriptionId}/auto-renew`,
        method: "PATCH",
        body: { autoRenew },
      }),
      invalidatesTags: ["UserSubscriptions"],
    }),
    getMyCoupon: builder.query({
      query: () => ({
        url: "/coupon",
        method: "GET",
      }),
      providesTags: ["UserCoupons"],
    }),
    userProfileUpdate: builder.mutation({
      query: (data) => ({
        url: "/users/update-profile",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    authMe: builder.query({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    deleteUserAccount: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    myWishlist: builder.query({
      query: () => ({
        url: "/wishlist/my",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    userDashboardOverviews: builder.query({
      query: () => ({
        url: "/products/user/dashboard/overviews",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    productRefundsRequest: builder.mutation({
      query: (data) => ({
        url: "/refunds",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["UserOrders"],
    }),
    getSingleconsultations: builder.query({
      query: (consultationId) => ({
        url: `/consultations/${consultationId}`,
        method: "GET",
      }),
      providesTags: ["UserConsultations"],
    }),
    getProductsReviews: builder.query({
      query: () => ({
        url: "/products-review",
        method: "GET",
      }),
      providesTags: ["UserReviews"],
    }),
    getServicesReviews: builder.query({
      query: () => ({
        url: "/service-reviews",
        method: "GET",
      }),
      providesTags: ["UserReviews"],
    }),
    getSpecialistReviews: builder.query({
      query: () => ({
        url: "/specialist-reviews",
        method: "GET",
      }),
      providesTags: ["UserReviews"],
    }),
    getSubscriptionReviews: builder.query({
      query: () => ({
        url: "/subscription-reviews",
        method: "GET",
      }),
      providesTags: ["UserReviews"],
    }),
    getConsultationReviews: builder.query({
      query: () => ({
        url: "/consultation-reviews",
        method: "GET",
      }),
      providesTags: ["UserReviews"],
    }),
  }),
});

export const {
  useGetOrderDetailsQuery,
  useGetAllBookingQuery,
  useGetSingleBookingQuery,
  useGetSubscriptionsQuery,
  useGetMyCouponQuery,
  useUserProfileUpdateMutation,
  useCancelBookingMutation,
  useAuthMeQuery,
  useDeleteUserAccountMutation,
  useMyWishlistQuery,
  useUserDashboardOverviewsQuery,
  useGetSingleSubscriptionQuery,
  useCancelSubscriptionMutation,
  useToggleAutoRenewSubscriptionMutation,
  useGetCancelSubscriptionsQuery,
  useProductRefundsRequestMutation,
  useReActiveSubscriptionMutation,
  useGetSingleconsultationsQuery,
  useRescheduleBookingMutation,
  useGetMyOdersQuery,
  useGetProductsReviewsQuery,
  useGetServicesReviewsQuery,
  useGetSpecialistReviewsQuery,
  useGetSubscriptionReviewsQuery,
  useGetConsultationReviewsQuery,
  
} = userDashbordApi;
