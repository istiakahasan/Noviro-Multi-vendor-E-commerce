import { baseApi } from "@/redux/api/baseApi";
import { ProductsResponse } from "@/types/product.type";
import { ProductDetailsResponse } from "@/types/productDetails.type";
import { ProductReviewsResponse } from "@/types/productReview.type";
import { SearchResponse } from "@/types/search.type";
import { YouMayLikeProductResponse } from "@/types/youMayLikeProducts.type";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    products: builder.query<ProductsResponse, void>({
      query: () => ({
        url: "/products",
        method: "GET",
      }),
      providesTags: ["Products"],
    }),

    getCategoryByProduct: builder.query<
      ProductsResponse,
      {
        categoryId?: string;
        minPrice?: number;
        maxPrice?: number;
        minRating?: number;
        maxRating?: number;
        stockQuantity?: boolean;
        isTopDeal?: boolean;
      }
    >({
      query: (filters) => ({
        url: "/categorys/bay-products",
        method: "GET",
        params: filters,
      }),
      providesTags: ["Categories"],
    }),

    getProductDetails: builder.query<ProductDetailsResponse, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "GET",
      }),
      providesTags: ["Products"],
    }),

    getYouMayLikeProducts: builder.query<YouMayLikeProductResponse, string>({
      query: (id) => ({
        url: `/products/category/${id}`,
        method: "GET",
      }),
      providesTags: ["Products"],
    }),

    addProductReview: builder.mutation<
      ProductReviewsResponse,
      { productId: string; rating: number; comment: string }
    >({
      query: ({ productId, rating, comment }) => ({
        url: `/products-review/${productId}`,
        method: "POST",
        body: {
          rating,
          comment,
        },
      }),
      invalidatesTags: ["Products"],
    }),

    getProductReviews: builder.query<ProductReviewsResponse, string>({
      query: (id) => ({
        url: `/products-review/product/${id}`,
        method: "GET",
      }),
      providesTags: ["Products"],
    }),

    getSearchProducts: builder.query<
      SearchResponse,
      {
        q?: string;
        page?: number;
        limit?: number;
      }
    >({
      query: (filters) => ({
        url: "/products/search",
        method: "GET",
        params: filters,
      }),
      providesTags: ["Products"],
    }),

    addProductWishlist: builder.mutation({
      query: ({ productId }) => ({
        url: `/wishlist/toggle/${productId}`,
        method: "POST",
      }),
      invalidatesTags: ["Products"],
    }),

    CreateSendMessage: builder.mutation({
      query: (data) => ({
        url: "/messages/send-message",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["MessageChat"],
    }),
  }),
});

export const {
  useProductsQuery,
  useGetCategoryByProductQuery,
  useGetProductDetailsQuery,
  useGetProductReviewsQuery,
  useGetYouMayLikeProductsQuery,
  useAddProductReviewMutation,
  useGetSearchProductsQuery,
  useAddProductWishlistMutation,
} = productApi;
