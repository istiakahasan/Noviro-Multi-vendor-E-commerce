import baseApi from "../baseApi";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // getAllProduct: builder.query({
    //   query: (params) => ({
    //     url: "/products",
    //     method: "GET",
    //     params: { ...params },
    //   }),
    //   providesTags: ["Product"],
    // }),

    getAllStoreProduct: builder.query({
      query: (params) => ({
        url: "/products/get-by/store",
        method: "GET",
        params: { ...params },
      }),
      providesTags: ["Product"],
    }),

    getAllStoreCategory: builder.query({
      query: (id) => ({
        url: `/shops/store-category/${id}`,
        method: "GET",
      }),
      providesTags: ["Product"],
    }),

    getAllStoreSubCategory: builder.query({
      query: (id) => ({
        url: `/subcategory/category/${id}`,
        method: "GET",
      }),
      providesTags: ["Product"],
    }),

    getSingleProductById: builder.query({
      query: (id) => ({
        url: `/products/${id}`,
        method: "GET",
      }),
      providesTags: ["Product"],
    }),

    createProduct: builder.mutation({
      query: (data) => ({
        url: "/products/create-one",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),

    updateProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useGetAllStoreProductQuery,
  useGetAllStoreCategoryQuery,
  useGetAllStoreSubCategoryQuery,
  useGetSingleProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
