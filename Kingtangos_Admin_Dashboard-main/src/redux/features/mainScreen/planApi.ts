import { baseApi } from "@/redux/api/baseApi";
import { PlanCategoryResponse, PlansResponse, SubscriptionDetailsResponse, SubscriptionReviewResponse } from "@/types/global";

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

    plansByAdmin: builder.query<PlansResponse, void>({
      query: () => ({
        url: "/plans/admin/get-plans",
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
  usePlansByAdminQuery,
  useGetCategoryByProductPlansQuery,
  useGetPlansDetailsQuery,
  useGetSubscriptionReviewsQuery,
  useGetPlansCategoryByIdQuery,
} = plansApi;
