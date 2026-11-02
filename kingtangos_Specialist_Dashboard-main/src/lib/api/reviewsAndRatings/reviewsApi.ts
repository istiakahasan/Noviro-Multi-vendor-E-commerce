// lib/api/reviewsAndRatings/reviewsApi.ts
import baseApi from "../baseApi";

export interface ReviewUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface ReviewReply {
  id: string;
  reviewId: string;
  parentId: string | null;
  userId: string | null;
  specialistId: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  userId: string;
  specialistId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user: ReviewUser;
  specialist: {
    id?: string;
    firstName?: string;
    lastName?: string;
    averageRating?: number;
  }; // you can type this better if needed
  reviewReply: ReviewReply[]; // Now an array!
}

export interface GetAllReviewsResponse {
  success: boolean;
  message: string;
  data: {
    reviews: Review[];
    ratings: Record<string, number>; // e.g. { "5": 2, "4": 0 }
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface GetAllReviewsParams {
  page?: number;
  limit?: number;
}

export interface CreateReplyRequest {
  reviewId: string;
  comment: string;
}

export interface CreateReplyResponse {
  success: boolean;
  message: string;
  data: ReviewReply;
}

export const reviewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllReviewsForSpecialist: builder.query<
      GetAllReviewsResponse,
      GetAllReviewsParams | undefined
    >({
      query: (params) => {
        const { page = 1, limit = 10 } = params ?? {};
        return {
          url: "/specialist-reviews",
          method: "GET",
          params: { page, limit },
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.reviews.map(({ id }) => ({
                type: "Review" as const,
                id,
              })),
              { type: "Review", id: "LIST" },
            ]
          : [{ type: "Review", id: "LIST" }],
    }),

    createReply: builder.mutation<CreateReplyResponse, CreateReplyRequest>({
      query: (body) => ({
        url: "/specialist-reviews/reply",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { reviewId }) => [
        { type: "Review", id: reviewId },
        { type: "Review", id: "LIST" },
      ],
    }),
  }),
});

export const { useGetAllReviewsForSpecialistQuery, useCreateReplyMutation } =
  reviewsApi;
