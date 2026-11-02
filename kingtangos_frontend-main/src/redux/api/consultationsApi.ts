import { baseApi } from "@/redux/api/baseApi";
import { ConsultationDetailsResponse } from "@/types/consultationDetails.type";
import { ConsultationReviewResponse } from "@/types/consultationReview.type";
import { ConsultationResponse } from "@/types/consultations.type";
import { ConsultationSlotResponse } from "@/types/consultationSlot.type";
import { ConsultationBookingDateResponse } from "@/types/monthlyDateBooking.type";

export const consultationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getConsultations: builder.query<ConsultationResponse, void>({
      query: () => ({
        url: "/consultations/",
        method: "GET",
      }),
      providesTags: ["Consultations"],
    }),

    getConsultationsbyCtegory: builder.query<
      ConsultationResponse,
      {
        categoryId?: string;
        minPrice?: number;
        maxPrice?: number;
        minRating?: number;
        maxRating?: number;
        location?: string;
      }
    >({
      query: (filters) => ({
        url: "/consultations/bay-category",
        method: "GET",
        params: filters,
      }),

      providesTags: ["Consultations"],
    }),

    // getConsultationReviews: builder.query<ConsultationReviewResponse, string>({
    //   query: (id) => ({
    //     url: `/consultation-reviews/consultation/${id}`,
    //     method: "GET",
    //   }),
      
    //   providesTags: ["Consultations"],
    // }),
    
    getConsultationReviews: builder.query<ConsultationReviewResponse, string>({
  query: (id) => {
    console.log("Consultation ID:", id);

    return {
      url: `/consultation-reviews/consultation/${id}`,
      method: "GET",
    };
  },
  providesTags: ["Consultations"],
}),

    addConsultationReview: builder.mutation<
      ConsultationReviewResponse,
      { consultationId: string; rating: number; comment: string }
    >({
      query: ({ consultationId, rating, comment }) => ({
        url: `/consultation-reviews/${consultationId}`,
        method: "POST",
        body: {
          rating,
          comment,
        },
      }),
      invalidatesTags: ["Consultations"],
    }),

    getConsultationDetails: builder.query<ConsultationDetailsResponse, string>({
      query: (id) => ({
        url: `/consultations/${id}`,
        method: "GET",
      }),
      providesTags: ["Consultations"],
    }),

    getBookingDates: builder.query<
      ConsultationBookingDateResponse,
      { itemId: string; providerId: string; year: number; month: number }
    >({
      query: (params) => ({
        url: "/booking/monthly-availability",
        method: "GET",
        params: {
          itemId: params.itemId,
          providerId: params.providerId,
          year: params.year,
          month: params.month,
        },
      }),
      providesTags: ["Consultations"],
    }),

    getBookingSlots: builder.query<
      ConsultationSlotResponse,
      { itemId: string; providerId: string; date: string }
    >({
      query: (params) => ({
        url: "/booking/available-consultation-slots",
        method: "GET",
        params: {
          consultationId: params.itemId,
          specialistId: params.providerId,
          date: params.date,
        },
      }),
      providesTags: ["Consultations"],
    }),
  }),
});

export const {
  useGetConsultationsQuery,
  useGetConsultationsbyCtegoryQuery,
  useGetConsultationDetailsQuery,
  useGetConsultationReviewsQuery,
  useAddConsultationReviewMutation,
  useGetBookingDatesQuery,
  useGetBookingSlotsQuery,
} = consultationsApi;
