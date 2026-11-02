import { baseApi } from "@/redux/api/baseApi";
import { PlansResponse } from "@/types/plan.type";
import { PlanCategoryResponse } from "@/types/planCategory.type";
import { SubscriptionDetailsResponse } from "@/types/subscriptionDetails.type";
import { SubscriptionReviewResponse } from "@/types/subscriptionReview.type";

export const plansApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({

    plans: builder.query<PlansResponse, void>({
      query: () => ({
        url: "/plans",
        method: "GET",
      }),
      providesTags: ["Plans"],
    }),

    getCategoryByProductPlans: builder.query<PlansResponse, {
      categoryId?: string;
      minPrice?: number;
      maxPrice?: number;
      minRating?: number;
      maxRating?: number;
    }>({
      query: (filters) => ({
        url: '/subscriptions/bay-category',
        method: "GET",
        params: filters,
      }),
      providesTags: ["Plans"],
    }),

    getPlansDetails: builder.query<SubscriptionDetailsResponse, string>({
      query: (id) => ({
        url: `/plans/${id}`,
        method: "GET",
      }),
      providesTags: ["Plans"],
    }),

    addSubscriptionReview: builder.mutation<
      SubscriptionReviewResponse,
      { subscriptionId: string; rating: number; comment: string }
    >({
      query: ({ subscriptionId, rating, comment }) => ({
        url: `/subscription-reviews/${subscriptionId}`,
        method: "POST",
        body: {
          rating,
          comment,
        },
      }),
      invalidatesTags: ["Subscription"],
    }),

    getSubscriptionReviews: builder.query<SubscriptionReviewResponse, string>({
      query: (id) => ({
        url: `/subscription-reviews/reviews/${id}`,
        method: "GET",
      }),
      providesTags: ["Plans"],
    }),

    getPlansCategoryById: builder.query<PlanCategoryResponse, string>({
      query: (id) => ({
        url: `/plans/bay-categroy/${id}`,
        method: "GET",
      }),
      providesTags: ["Plans"]
    }),

  }),
});

export const {
  usePlansQuery,
  useGetCategoryByProductPlansQuery,
  useGetPlansDetailsQuery,
  useGetSubscriptionReviewsQuery,
  useGetPlansCategoryByIdQuery,
  useAddSubscriptionReviewMutation,
} = plansApi;
