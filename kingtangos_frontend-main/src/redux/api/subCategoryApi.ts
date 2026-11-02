import { baseApi } from "@/redux/api/baseApi";
import { SubCategoryProductsResponse } from "@/types/productSubCategory.type";
import { SubCategoryResponse } from "@/types/subCategory.type";
import { CategoryConsultationResponse } from "@/types/subCategoryConsultation.type";
import { CategoryProductResponse } from "@/types/subCategoryProducts.type";
import { CategoryServiceResponse } from "@/types/subCategoryService.type";
import { CategorySubscriptionResponse } from "@/types/subCategorySubscription.type";

export const subCategoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSubCategoryById: builder.query<SubCategoryResponse, string>({  
            query: (id) => ({
                url: `/subcategory/category/${id}`,
                method: "GET",
            }),
            providesTags: ["SubCategory"],
        }),

        getProductBySubCategoryId: builder.query<SubCategoryProductsResponse, { subCategoryId: string }, string>({
            query: ({ subCategoryId }) => ({
                url: `/products/get-product/by-subcategory/${subCategoryId}`,
                method: "GET",
            }),
            providesTags: ["SubCategory"],
        }),

        getCategoryProduct: builder.query<CategoryProductResponse, { categoryId: string }, string>({
            query: ({ categoryId }) => ({
                url: `/products/category/${categoryId}`,
                method: "GET",
            }),
            providesTags: ["SubCategory"],
        }),

        getCategoryService: builder.query<CategoryServiceResponse, { categoryId: string, subCategoryId: string }, string>({
            query: ({ categoryId, subCategoryId }) => ({
                url: `/service/get-all/bay-category/${categoryId}?subCategoryId=${subCategoryId}`,
                method: "GET",
            }),
            providesTags: ["SubCategory"]
        }),

        getCategoryConsultation: builder.query<CategoryConsultationResponse, { categoryId: string, subCategoryId: string }, string>({
            query: ({ categoryId, subCategoryId }) => ({
                url: `/consultations/get-all/by-category/${categoryId}?subCategoryId=${subCategoryId}`,
                method: "GET",
            }),
            providesTags: ["SubCategory"]
        }),

        getCategorySubscription: builder.query<CategorySubscriptionResponse, { categoryId: string, subCategoryId: string }, string>({
            query: ({ categoryId, subCategoryId }) => ({
                url: `/plans/bay-categroy/${categoryId}?subCategoryId=${subCategoryId}`,
                method: "GET",
            }),
            providesTags: ["SubCategory"]
        }),
    }),
});

export const {
    useGetSubCategoryByIdQuery,
    useGetCategoryProductQuery,
    useGetCategoryServiceQuery,
    useGetCategoryConsultationQuery,
    useGetCategorySubscriptionQuery,
    useGetProductBySubCategoryIdQuery

} = subCategoryApi;