import baseApi from "../baseApi";

export const dashboardOverviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllDashboardOverview: builder.query({
      query: (params) => ({
        url: "/shops/seller-dashboard/overview",
        method: "GET",
        params: { ...params },
      }),
      providesTags: ["Dashboard"],
    }),

    getAllProductOrders: builder.query({
      query: (params) => ({
        url: "/shops/seller-dashboard/product-orders",
        method: "GET",
        params: { ...params },
      }),
      providesTags: ["Dashboard"],
    }),

    getAllServiceBooking: builder.query({
      query: (params) => ({
        url: "/shops/seller-dashboard/service-booking",
        method: "GET",
        params: { ...params },
      }),
      providesTags: ["Dashboard"],
    }),

    getAllSubscriptionsBooking: builder.query({
      query: (params) => ({
        url: "/shops/seller-dashboard/subscriptions-booking",
        method: "GET",
        params: { ...params },
      }),
      providesTags: ["Dashboard"],
    }),

    getAllConsultationBooking: builder.query({
      query: (params) => ({
        url: "/shops/seller-dashboard/consultation-booking",
        method: "GET",
        params: { ...params },
      }),
      providesTags: ["Dashboard"],
    }),

    getAllSellerDashboardActivity: builder.query({
      query: (params) => ({
        url: "/seller-dashboard/activity",
        method: "GET",
        params: { ...params },
      }),
      providesTags: ["Dashboard"],
    }),

    getSingleOrderById: builder.query({
      query: (id) => ({
        url: `/orders/${id}`,
        method: "GET",
      }),
      providesTags: ["Dashboard"],
    }),

    updateOrderStatus: builder.mutation({
      query: ({ id, data }) => ({
        url: `/orders/${id}/status`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useGetAllDashboardOverviewQuery,
  useGetAllProductOrdersQuery,
  useGetAllServiceBookingQuery,
  useGetAllSubscriptionsBookingQuery,
  useGetAllConsultationBookingQuery,
  useGetAllSellerDashboardActivityQuery,
  useGetSingleOrderByIdQuery,
  useUpdateOrderStatusMutation,
} = dashboardOverviewApi;
