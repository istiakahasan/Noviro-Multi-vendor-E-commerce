import baseApi from "../baseApi";

export const specialOfferApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // getAllSpecialOfferById: builder.query({
    //   query: (params) => ({
    //     url: `/specialoffer/store/${params.id}`,
    //     method: "GET",
    //     params: { ...params },
    //   }),
    //   providesTags: ["SpecialOffer"],
    // }),

    getAllSpecialOfferById: builder.query({
      query: (params) => {
        const { id, ...restParams } = params; // 👈 strip id out
        return {
          url: `/specialoffer/store/${id}`,
          method: "GET",
          params: restParams, // only sends page=1&limit=10
        };
      },
      providesTags: ["SpecialOffer"],
    }),

    getSingleSpecialOfferById: builder.query({
      query: (id) => ({
        url: `/specialoffer/${id}`,
        method: "GET",
      }),
      providesTags: ["SpecialOffer"],
    }),

    createSpecialOffer: builder.mutation({
      query: (data) => ({
        url: "/specialoffer/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SpecialOffer"],
    }),

    updateSpecialOffer: builder.mutation({
      query: ({ id, data }) => ({
        url: `/specialoffer/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["SpecialOffer"],
    }),

    deleteSpecialOffer: builder.mutation({
      query: (id) => ({
        url: `/specialoffer/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SpecialOffer"],
    }),
  }),
});

export const {
  useGetAllSpecialOfferByIdQuery,
  useGetSingleSpecialOfferByIdQuery,
  useCreateSpecialOfferMutation,
  useUpdateSpecialOfferMutation,
  useDeleteSpecialOfferMutation,
} = specialOfferApi;
