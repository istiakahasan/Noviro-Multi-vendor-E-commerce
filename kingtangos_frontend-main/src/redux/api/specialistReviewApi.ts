import { SpecialistReviewsResponse } from "@/types/specialistReview.type";
import { baseApi } from "./baseApi";
import { ConsultationReviewResponse } from "@/types/consultationReview.type";

export const specialistReviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSpecialistReviews: builder.query<SpecialistReviewsResponse, { specialistId: string; type: string }>({
      query: ({ specialistId, type }) => ({
        url: `/specialist-reviews/specialist/reviews/${specialistId}`,
        method: "GET",
        params: { type },
      }),
      providesTags: ["specialistReviews"],
    }),

    addSpecialistReview: builder.mutation<
      ConsultationReviewResponse,
      { specialistId: string; rating: number; comment: string }
    >({
      query: ({ specialistId, rating, comment }) => ({
        url: `/specialist-reviews/${specialistId}`,
        method: "POST",
        body: {
          rating,
          comment,
        },
      }),
      invalidatesTags: ["specialistReviews"],
    }),
  }),
});

export const { useGetSpecialistReviewsQuery, useAddSpecialistReviewMutation } =
  specialistReviewApi;
