import baseApi from "../baseApi";

export const advertisementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSellerAdvertisementById: builder.query({
      query: ({id,params}) => ({
        url: `/advertisement/store/${id}`,
        method: "GET",
        params: { ...params },
      }),
      providesTags: ["Advertisement"],
    }),

    getSellerAdvertisementAnalyticsById: builder.query({
      query: ({id,params}) => ({
        url: `/advertisement/analytics/${id}`,
        method: "GET",
        params: { ...params },
      }),
      providesTags: ["Advertisement"],
    }),

    createTrackAdvertisementImpression: builder.mutation({
      query: (data) => ({
        url: `/advertisement/${data.id}/impression`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Advertisement"],
    }),

    createAdvertisement: builder.mutation({
      query: (data) => ({
        url: "/advertisement",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Advertisement"],
    }),

    stopAdvertise: builder.mutation({
      query: ({ id, data }) => ({
        url: `/advertisement/${id}/pause`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Advertisement"],
    }),
    
    resumeAdvertise: builder.mutation({
      query: ({ id, data }) => ({
        url: `/advertisement/${id}/resume`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Advertisement"],
    }),
  }),
});

export const {
    useGetAllSellerAdvertisementByIdQuery,
    useGetSellerAdvertisementAnalyticsByIdQuery,
    useCreateTrackAdvertisementImpressionMutation,
    useCreateAdvertisementMutation,
    useStopAdvertiseMutation,
    useResumeAdvertiseMutation,

} = advertisementApi;
