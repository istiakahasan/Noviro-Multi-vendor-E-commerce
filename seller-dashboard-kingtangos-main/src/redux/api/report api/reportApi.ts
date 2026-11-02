import baseApi from "../baseApi";

export const reportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllReport: builder.query({
      query: (params) => ({
        url: "/orders/revenue/overview",
        method: "GET",
        params: { ...params },
      }),
      providesTags: ["Report"],
    }),
  }),
});

export const {
useGetAllReportQuery,
} = reportApi;
