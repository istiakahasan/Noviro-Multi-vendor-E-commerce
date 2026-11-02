import { baseApi } from "@/redux/api/baseApi";
import { CategoriesResponse } from "@/types/category.type";
import { ProductCategoryResponse } from "@/types/productCategory.type";

export const categoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        categories: builder.query<CategoriesResponse, void>({
            query: () => ({
                url: "/categorys",
                method: "GET",
            }),
            providesTags: ["Categories"],
        }),

        getProductByCategoryId: builder.query<ProductCategoryResponse, string>({
            query: (id) => ({
                url: `/products/get-product/bay-category/${id}`,
                method: "GET",
            }),
            providesTags: ["Categories"],
        }),
    }),
});

export const {
    useCategoriesQuery,
    useGetProductByCategoryIdQuery,

} = categoryApi;