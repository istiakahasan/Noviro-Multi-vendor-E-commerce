import { baseApi } from "@/redux/api/baseApi";

export const specialOfferApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getSpecialOfferById: builder.query({
      query: (id) => ({
        url: `/specialoffer/check/${id}`,
        method: "GET",
      }),
      providesTags: ["SpecialOffer"]
    }),

  }),
});

export const {
  useGetSpecialOfferByIdQuery,
} = specialOfferApi;
