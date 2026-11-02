import { baseApi } from "@/redux/api/baseApi";
import { StoreResponse } from "@/types/store.type";
import { StoreCategoryResponse } from "@/types/storeCategory.type";

export const storeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getAllStoreProduct: builder.query<StoreResponse, string>({
      query: () => ({
        url: "/shops",
        method: "GET",
      }),
      providesTags: ["Store"],
    }),

    getStoreByProduct: builder.query<StoreCategoryResponse, string>({
      query: (id) => ({
        url: `/products/store/${id}`,
        method: "GET",
      }),
      providesTags: ["Store"],
    }),

  }),
});

export const {
  useGetAllStoreProductQuery,
  useGetStoreByProductQuery,

} = storeApi;