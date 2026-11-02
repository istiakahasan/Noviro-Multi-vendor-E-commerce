import { baseApi } from "@/redux/api/baseApi";
import { SubscriptionResponse } from "@/types/subscription.type";
import { CreateSubscriptionResponse } from "../subscriptionstype/subscriptiontype";

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSubscription: builder.query<SubscriptionResponse, void>({
      query: () => ({
        url: "/subscriptions",
        method: "GET",
      }),
      providesTags: ["Subscription"],
    }),

    getSubscriptionById: builder.query<SubscriptionResponse, string>({
      query: (id) => ({
        url: `/subscriptions/${id}`,
        method: "GET",
      }),
      providesTags: ["Subscription"],
    }),

    createSubscriptionPlan: builder.mutation<CreateSubscriptionResponse, { planId: string }>({
      query: (data) => ({
        url: "/subscriptions/create-subscription",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Subscription"],
    }),

  }),
});

export const { useGetAllSubscriptionQuery, useGetSubscriptionByIdQuery, useCreateSubscriptionPlanMutation } =
  subscriptionApi;
