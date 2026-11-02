import { baseApi } from "./baseApi";

const specialOfferApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSpecialOffers: builder.query<
      any,
      { page?: number; limit?: number; searchTerm?: string }
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());
        if (params.searchTerm)
          queryParams.append("searchTerm", params.searchTerm);

        return {
          url: `/specialoffer?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["SpecialOffers"],
    }),
    getSingleSpecialOffer: builder.query<any, string>({
      query: (id) => `/specialoffer/${id}`,
      providesTags: ["SpecialOffers"],
    }),
    deleteSpecialOffer: builder.mutation<any, string>({
      query: (id) => ({
        url: `/specialoffer/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SpecialOffers"],
    }),
  }),
});

export const {
  useGetSpecialOffersQuery,
  useGetSingleSpecialOfferQuery,
  useDeleteSpecialOfferMutation,
} = specialOfferApi;
