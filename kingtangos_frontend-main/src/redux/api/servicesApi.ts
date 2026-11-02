import { GetAllCategoriesResponse } from "@/components/shared/BookServices";
import { baseApi } from "@/redux/api/baseApi";
// import { GetAllCategoriesResponse } from "@/types/CategoryItem.type";

import { ServiceResponse } from "@/types/service.type";
import { GetAllServicesResponse } from "@/types/serviceCategory.type";
import { ServiceDetailsResponse } from "@/types/serviceDetails.type";
import { ServiceReviewResponse } from "@/types/serviceReview.type";
import { ServiceSlotResponse } from "@/types/serviceSlotResponse.type";

export const serviceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    service: builder.query<ServiceResponse, void>({
      query: () => ({
        url: "/service",
        method: "GET",
      }),
      providesTags: ["Service"],
    }),
    getServiceByCategory: builder.query<
      ServiceResponse,
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
        url: "/service/bay-category",
        method: "GET",
        params: filters,
      }),
      providesTags: ["Service"],
    }),

    getAllCategory: builder.query<GetAllCategoriesResponse, string>({
      query: () => ({
        url: `/categorys`,
        method: "GET",
      }),
      providesTags: ["Service"],
    }),

    getSingleServiceById: builder.query<ServiceDetailsResponse, string>({
      query: (id) => ({
        url: `/service/${id}`,
        method: "GET",
      }),
      providesTags: ["Service"],
    }),

    getAllServiceByCategoryId: builder.query<GetAllServicesResponse, string>({
      query: (id) => ({
        url: `/service/get-all/bay-category/${id}`,
        method: "GET",
      }),
      providesTags: ["Service"],
    }),

    addServiceReview: builder.mutation<
      ServiceReviewResponse,
      { serviceId: string; rating: number; comment: string }
    >({
      query: ({ serviceId, rating, comment }) => ({
        url: `/service-reviews/${serviceId}`,
        method: "POST",
        body: {
          rating,
          comment,
        },
      }),
      invalidatesTags: ["Service"],
    }),

    getServiceReviews: builder.query<ServiceReviewResponse, string>({
      query: (id) => ({
        url: `/service-reviews/service/${id}`,
        method: "GET",
      }),
      providesTags: ["Service"],
    }),

    getServiceBookingSlots: builder.query<
      ServiceSlotResponse,
      { serviceId: string; specialistId: string; date: string }
    >({
      query: (params) => ({
        url: "/booking/get-available",
        method: "GET",
        params: {
          serviceId: params.serviceId,
          specialistId: params.specialistId,
          date: params.date,
        },
      }),
      providesTags: ["Service"],
    }),
  }),
});

export const {
  useServiceQuery,
  useGetServiceByCategoryQuery,
  useGetSingleServiceByIdQuery,
  useGetAllServiceByCategoryIdQuery,
  useGetAllCategoryQuery,
  useGetServiceReviewsQuery,
  useGetServiceBookingSlotsQuery,
  useAddServiceReviewMutation,
} = serviceApi;
