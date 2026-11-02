import { baseApi } from "@/redux/api/baseApi";
import { SponsoredProductResponse } from "@/types/feature.type";
import { ProductsResponse } from "@/types/product.type";
// import { ProductResponse } from "@/types/product.type";
// import { TopDealsResponse } from "@/types/product.type";

export const topDealsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    topDeals: builder.query<ProductsResponse, {
      categoryId?: string;
      minPrice?: number;
      maxPrice?: number;

    }>({
      query: () => ({
        url: "/products/top/deals",
        method: "GET",
      }),
      providesTags: ["TopDeals"],
    }),

    getActiveAdvertisement: builder.query<SponsoredProductResponse, void>({
      query: () => ({
        url: "/advertisement/active",
        method: "GET",
      }),
      providesTags: ["Feature"],
    }),

  }),
});

export const {
  useTopDealsQuery,
  useGetActiveAdvertisementQuery

} = topDealsApi;