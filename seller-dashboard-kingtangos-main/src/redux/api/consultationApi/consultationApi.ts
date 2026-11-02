import baseApi from "../baseApi";

export const consultationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // getAllConsultation: builder.query({
    //   query: (params) => ({
    //     url: "/consultations",
    //     method: "GET",
    //     params: { ...params },
    //   }),
    //   providesTags: ["Consultation"],
    // }),

    getAllConsultation: builder.query({
      query: (params) => ({
        url: "/consultations/get-by/store",
        method: "GET",
        params: { ...params },
      }),
      providesTags: ["Consultation"],
    }),

    getSingleConsultationById: builder.query({
      query: (id) => ({
        url: `/consultations/${id}`,
        method: "GET",
      }),
      providesTags: ["Consultation"],
    }),

    createConsultation: builder.mutation({
      query: (data) => ({
        url: "/consultations/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Consultation"],
    }),

    updateConsultation: builder.mutation({
      query: ({ id, data }) => ({
        url: `/consultations/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Consultation"],
    }),

    deleteConsultation: builder.mutation({
      query: (id) => ({
        url: `/consultations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Consultation"],
    }),
  }),
});

export const {
  useGetAllConsultationQuery,
  useGetSingleConsultationByIdQuery,
  useCreateConsultationMutation,
  useUpdateConsultationMutation,
  useDeleteConsultationMutation,
} = consultationApi;
