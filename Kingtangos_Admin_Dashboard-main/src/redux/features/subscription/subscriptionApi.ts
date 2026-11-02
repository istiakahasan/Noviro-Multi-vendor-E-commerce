// src/redux/features/subscriptions/subscriptionApi.ts
// or wherever you keep your API files

import baseApi from "@/redux/api/baseApi";

// ========================
// Subscription Types
// ========================

export interface SubscriptionUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePic: string;
  role: string;
  isSubscribed: boolean;
  planExpiration: string | null;
}

export interface SubscriptionPlan {
  id: string;
  userId: string;
  categoryId: string;
  subCategoryId: string;
  storeId: string;
  planName: string;
  amount: number;
  currency: string;
  interval: "day" | "week" | "month" | "year";
  intervalCount: number;
  freeTrialDays: number | null;
  productId: string;
  priceId: string;
  averageRating: number;
  totalReviews: number;
  active: boolean;
  description: string | null;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  startDate: string;
  endDate: string;
  amount: number;
  stripePaymentId: string;
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "CANCELLED" | "REFUNDED";
  description: string | null;
  benefitsIncluded: string | null;
  createdAt: string;
  updatedAt: string;
  user: SubscriptionUser;
  plan: SubscriptionPlan;
}

export interface CancellationRequest {
  id: string;
  orderId: string | null;
  bookingId: string | null;
  subscriptionId: string;
  userId: string;
  productId: string | null;
  quantity: number | null;
  customerReason: string;
  sellerReason: string;
  adminReason: string;
  sellerApproved: boolean;
  adminApproved: boolean;
  status: string;
  refundAmount: number;
  createdAt: string;
  updatedAt: string;
  user: SubscriptionUser;
  subscription: Subscription;
}

export interface CancellationRequestsResponse {
  success: boolean;
  message: string;
  meta: SubscriptionPagination;
  data: CancellationRequest[];
}

export interface SubscriptionPagination {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface SubscriptionsResponse {
  success: boolean;
  message: string;
  meta: SubscriptionPagination;
  data: Subscription[];
}

export interface GetAllSubscriptionsParams {
  page?: number;
  limit?: number;
  paymentStatus?: "PENDING" | "PAID" | "FAILED" | "CANCELLED" | "REFUNDED";
  userId?: string;
  planId?: string;
}

// ========================
// Subscription API
// ========================

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL SUBSCRIPTIONS
    getAllSubscriptions: builder.query<
      SubscriptionsResponse,
      GetAllSubscriptionsParams | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();

        if (params) {
          if (params.page) queryParams.append("page", params.page.toString());
          if (params.limit)
            queryParams.append("limit", params.limit.toString());
          if (params.paymentStatus)
            queryParams.append("paymentStatus", params.paymentStatus);
          if (params.userId) queryParams.append("userId", params.userId);
          if (params.planId) queryParams.append("planId", params.planId);
        }

        const queryString = queryParams.toString();
        return queryString ? `/subscriptions?${queryString}` : "/subscriptions";
      },
      providesTags: ["Subscriptions"],
    }),
    // GET SINGLE SUBSCRIPTION

    getSingleSubscription: builder.query<
      { success: boolean; message: string; data: Subscription },
      string
    >({
      query: (id) => `/subscriptions/${id}`,
      providesTags: (result, error, id) => [{ type: "Subscriptions", id }],
    }),

    // GET CANCELLATION REQUESTS
    getCancellationRequests: builder.query<
      CancellationRequestsResponse,
      { page?: number; limit?: number }
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params) {
          if (params.page) queryParams.append("page", params.page.toString());
          if (params.limit)
            queryParams.append("limit", params.limit.toString());
        }
        const queryString = queryParams.toString();
        return `/subscriptions/admin/cancellations?${queryString}`;
      },
      providesTags: ["Subscriptions"],
    }),
    // RESPOND TO CANCELLATION
    respondToCancellation: builder.mutation<
      { success: boolean; message: string; data: CancellationRequest },
      { id: string; body: { action: "approve" | "reject"; reason: string } }
    >({
      query: ({ id, body }) => ({
        url: `/subscriptions/admin/cancellations/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Subscriptions"],
    }),
  }),
});

// ========================
// Export Hooks
// ========================

export const {
  useGetAllSubscriptionsQuery,
  useGetSingleSubscriptionQuery,
  useGetCancellationRequestsQuery,
  useRespondToCancellationMutation,
} = subscriptionApi;
