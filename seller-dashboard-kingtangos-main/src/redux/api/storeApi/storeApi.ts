import baseApi from "../baseApi";

export const storeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategory: builder.query({
      query: (params) => ({
        url: "/categorys",
        method: "GET",
        params: { ...params },
      }),
      providesTags: ["Store"],
    }),

    // getMyStoreById: builder.query({
    //   query: (id) => ({
    //     url: `/shops/my/store/${id}`,
    //     method: "GET",
    //   }),
    //   providesTags: ["Store"],
    // }),

    getStoreById: builder.query({
      query: (id) => ({
        url: `/shops/${id}`,
        method: "GET",
      }),
      providesTags: ["Store"],
    }),

    getMyStore: builder.query({
      query: () => ({
        url: `/shops/my/store`,
        method: "GET",
      }),
      providesTags: ["Store"],
    }),

    createStore: builder.mutation({
      query: (data) => ({
        url: "/shops/create-store",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Store"],
    }),


    updateStore: builder.mutation({
      query: ({ id, data }) => ({
        url: `/shops/update-store/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Store"],
    }),
  }),
});

export const {
  useGetAllCategoryQuery,
  useGetMyStoreQuery,
  useGetStoreByIdQuery,
  useCreateStoreMutation,
  useUpdateStoreMutation,
} = storeApi;
