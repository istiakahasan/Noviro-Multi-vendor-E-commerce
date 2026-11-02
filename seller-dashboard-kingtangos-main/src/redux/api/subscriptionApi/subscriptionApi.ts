import baseApi from "../baseApi";

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSubscription: builder.query({
      query: (params) => ({
        url: "/subscriptions",
        method: "GET",
        params: { ...params },
      }),
      providesTags: ["Subscription"],
    }),

    getAllCancelledSubscription: builder.query({
      query: (params) => ({
        url: "/subscriptions/seller/cancellations",
        method: "GET",
        params: { ...params },
      }),
      providesTags: ["Subscription"],
    }),

    getAllSubscriptionPlan: builder.query({
      query: (params) => ({
        url: "/plans/get-by/store",
        method: "GET",
        params: { ...params },
      }),
      providesTags: ["Subscription"],
    }),

    getAllPlan: builder.query({
      query: (params) => ({
        url: "/plans ",
        method: "GET",
        params: { ...params },
      }),
      providesTags: ["Subscription"],
    }),

    getSingleSubscriptionPlanById: builder.query({
      query: (id) => ({
        url: `plans/${id}`,
        method: "GET",
      }),
      providesTags: ["Subscription"],
    }),


    getSingleSubscriptionById: builder.query({
      query: (id) => ({
        url: `subscriptions/${id}`,
        method: "GET",
      }),
      providesTags: ["Subscription"],
    }),

    createSubscription: builder.mutation({
      query: (data) => ({
        url: "/subscriptions/create-subscription",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Subscription"],
    }),

    createSubscriptionPlan: builder.mutation({
      query: (data) => ({
        url: "/plans/create-plan",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Subscription"],
    }),

    updateSubscriptionPlan: builder.mutation({
      query: ({ id, data }) => ({
        url: `/plans/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Subscription"],
    }),

    updateSubscription: builder.mutation({
      query: ({ id, data }) => ({
        url: `/subscriptions/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Subscription"],
    }),

    updateSubscriptionCancellationStatus: builder.mutation({
      query: ({ id, data }) => ({
        url: `/subscriptions/seller/cancellations/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Subscription"],
    }),

    deleteSubscriptionPlan: builder.mutation({
      query: (id) => ({
        url: `/plans/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Subscription"],
    }),

    deleteSubscription: builder.mutation({
      query: (id) => ({
        url: `/subscriptions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Subscription"],
    }),
  }),
});

export const {
useGetAllSubscriptionQuery,
useGetAllCancelledSubscriptionQuery,
useGetAllSubscriptionPlanQuery,
useGetAllPlanQuery,
useGetSingleSubscriptionPlanByIdQuery,
useGetSingleSubscriptionByIdQuery,
useCreateSubscriptionMutation,
useCreateSubscriptionPlanMutation,
useUpdateSubscriptionPlanMutation,
useUpdateSubscriptionMutation,
useUpdateSubscriptionCancellationStatusMutation,
useDeleteSubscriptionPlanMutation,
useDeleteSubscriptionMutation
} = subscriptionApi;
