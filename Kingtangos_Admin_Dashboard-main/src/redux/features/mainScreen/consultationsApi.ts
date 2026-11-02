import { baseApi } from "@/redux/api/baseApi";
import { ConsultationBookingDateResponse, ConsultationDetailsResponse, ConsultationResponse, ConsultationSlotResponse } from "@/types/consultationTypes";
import { ServiceDetailsResponse } from "@/types/global";

export const consultationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

  getConsultations: builder.query<ConsultationResponse, { page: number; limit: number }>({
      query: ({ page, limit }) => ({
        url: `/consultations?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Consultations"],
    }),
  getConsultationsByAdmin: builder.query<ConsultationResponse, { page: number; limit: number }>({
      query: ({ page, limit }) => ({
        url: `/consultations/admin/all?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Consultations"],
    }),

    getConsultationsbyCtegory: builder.query<ConsultationResponse, {
      categoryId?: string;
      minPrice?: number;
      maxPrice?: number;
      minRating?: number;
      maxRating?: number;
    }>({
      query: (filters) => ({
        url: "/consultations/bay-category",
        method: "GET",
        params: filters
      }),

      providesTags: ["Consultations"],
    }),

    getConsultationDetails: builder.query<ConsultationDetailsResponse, string>({
      query: (id) => ({
        url: `/consultations/${id}`,
        method: "GET",
      }),
      providesTags: ["Consultations"],
    }),

    getBookingDates: builder.query<ConsultationBookingDateResponse, { serviceId: string; specialistId: string }>({
      query: (params) => ({
        url: "/booking/monthly-availability",
        method: "GET",
        params: {
          serviceId: params.serviceId,
          specialistId: params.specialistId
        }
      }),
      providesTags: ["Consultations"],
    }),
       getServiceById: builder.query<ServiceDetailsResponse, { page?: number; limit?: number }>({
  query: ({ page = 1, limit = 10 } = {}) => ({
    url: '/service',
    method: 'GET',
    params: {
      page,
      limit,
    },
  }),
  providesTags: ['Service'],
}),
       getServiceForAdmin: builder.query<ServiceDetailsResponse, { page?: number; limit?: number }>({
  query: ({ page = 1, limit = 10 } = {}) => ({
    url: '/service/admin/get-services',
    method: 'GET',
    params: {
      page,
      limit,
    },
  }),
  providesTags: ['Service'],
}),
        getSingleServiceById: builder.query<ServiceDetailsResponse, string>({
      query: (id) => ({
        url: `/service/${id}`,
        method: "GET",
      }),
      providesTags: ["Service"],
    }),

    getBookingSlots: builder.query<ConsultationSlotResponse, { consultationId: string, specialistId: string, date: string }>({
      query: (params) => ({
        url: "/booking/available-consultation-slots",
        method: "GET",
        params: {
          consultationId: params.consultationId,
          specialistId: params.specialistId,
          date: params.date
        }
      }),
      providesTags: ["Consultations"],
    }),

  }),
});

export const {
  useGetConsultationsQuery,
  useGetConsultationsByAdminQuery,
  useGetConsultationsbyCtegoryQuery,
  useGetConsultationDetailsQuery,
  useGetBookingDatesQuery,
  useGetBookingSlotsQuery,
  useGetServiceForAdminQuery,
  useGetServiceByIdQuery,
  useGetSingleServiceByIdQuery,

} = consultationsApi;