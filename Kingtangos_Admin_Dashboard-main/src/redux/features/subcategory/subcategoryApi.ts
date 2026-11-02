


// import baseApi from "@/redux/api/baseApi";

// // ========================
// // Existing Types — unchanged
// // ========================

// export interface Product {
//   id: string;
//   storeId: string;
//   categoryId: string;
//   name: string;
//   images: string[];
//   price: number;
//   description: string;
//   subCategoryId: string;
//   type: string;
//   stockQuantity: number;
//   discount: number;
//   finalPrice: number;
//   averageRating: number;
//   totalReviews: number;
//   tags: string[];
//   barcode: string;
//   sponsored: boolean;
//   createdAt: string;
//   updatedAt: string;
//   isTopDeal: boolean;
//   topDealFrom: string | null;
//   topDealUntil: string | null;
// }

// export interface Category {
//   id: string;
//   name: string;
//   description: string;
//   type: "PRODUCT" | "SERVICE";
//   comment: string;
//   createdAt: string;
//   updatedAt: string;
//   _count: {
//     storeCategories: number;
//     products: number;
//     services: number;
//     consultations: number;
//   };
//   products: Product[];
// }

// export interface CategoryMeta {
//   page: number;
//   limit: number;
//   total: number;
//   totalPage: number;
// }

// export interface CategoriesResponse {
//   success: boolean;
//   message: string;
//   meta: CategoryMeta;
//   data: Category[];
// }

// export interface Subcategory {
//   id: string;
//   name: string;
//   description: string;
//   categoryId: string;
//   slug: string;
//   image: string | null;
//   isActive: boolean;
//   sortOrder: number;
//   createdAt: string;
//   updatedAt: string;
//   category: {
//     id: string;
//     name: string;
//     type: string;
//   };
// }

// export interface SubcategoryPagination {
//   page: number;
//   limit: number;
//   total: number;
//   pages: number;
// }

// export interface SubcategoriesResponse {
//   success: boolean;
//   message: string;
//   data: {
//     subcategories: Subcategory[];
//     pagination: SubcategoryPagination;
//   };
// }

// export interface GetAllCategoriesParams {
//   page?: number;
//   limit?: number;
//   type?: "PRODUCT" | "SERVICE";
//   search?: string;
// }

// export interface GetAllSubcategoriesParams {
//   page?: number;
//   limit?: number;
// }

// // ========================
// // Subcategory Mutation Types
// // ========================

// export interface CreateSubcategoryResponse {
//   success: boolean;
//   message: string;
//   data: Subcategory;
// }

// export interface UpdateSubcategoryResponse {
//   success: boolean;
//   message: string;
//   data: Subcategory;
// }

// export interface DeleteSubcategoryResponse {
//   success: boolean;
//   message: string;
//   // data might be empty or { id: string } — adjust if needed
// }

// // For update — same shape as create, but includes optional slug
// export interface UpdateSubcategoryInput {
//   name?: string;
//   description?: string;
//   categoryId?: string;
//   slug?: string; // will be generated from name if empty
//   // file/image is optional (only if changing image)
// }

// // For single subcategory fetch
// export interface SingleSubcategoryResponse {
//   success: boolean;
//   message: string;
//   data: Subcategory;
// }

// // ========================
// // NEW: Response type for subcategories by category
// // ========================
// export interface SubcategoriesByCategoryResponse {
//   success: boolean;
//   message: string;
//   data: Subcategory[];
// }

// // ========================
// // API Slice
// // ========================
// export const categoryApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     // GET ALL CATEGORIES
//     getAllCategories: builder.query<
//       CategoriesResponse,
//       GetAllCategoriesParams | void
//     >({
//       query: (params) => {
//         if (!params) return "/categorys";

//         const queryParams = new URLSearchParams();
//         if (params.page) queryParams.append("page", params.page.toString());
//         if (params.limit) queryParams.append("limit", params.limit.toString());
//         if (params.type) queryParams.append("type", params.type);
//         if (params.search) queryParams.append("search", params.search);

//         return `/categorys?${queryParams.toString()}`;
//       },
//       providesTags: ["Categories"],
//     }),

//     // GET ALL SUBCATEGORIES (global/paginated)
//     getAllSubcategories: builder.query<
//       SubcategoriesResponse,
//       GetAllSubcategoriesParams | void
//     >({
//       query: (params) => {
//         if (!params) return "/subcategory";

//         const queryParams = new URLSearchParams();
//         if (params.page) queryParams.append("page", params.page.toString());
//         if (params.limit) queryParams.append("limit", params.limit.toString());

//         return `/subcategory?${queryParams.toString()}`;
//       },
//       providesTags: ["Subcategories"],
//     }),

//     // GET SINGLE SUBCATEGORY - /subcategory/:id
//     getSubcategoryById: builder.query<SingleSubcategoryResponse, string>({
//       query: (id) => `/subcategory/${id}`,
//       providesTags: ["Categories"],
//     }),

//     // ── NEW ENDPOINT ────────────────────────────────────────
//     getSubcategoriesByCategory: builder.query<
//       SubcategoriesByCategoryResponse,
//       string // categoryId
//     >({
//       query: (categoryId) => `/subcategory/category/${categoryId}`,
//       providesTags: (result, error, categoryId) => [
//         { type: "Subcategories", id: `LIST_BY_CATEGORY_${categoryId}` },
//         "Subcategories", // also helps invalidate global list when needed
//       ],
//     }),

//     // POST CREATE SUBCATEGORY
//     createSubcategory: builder.mutation<
//       CreateSubcategoryResponse,
//       { formData: FormData }
//     >({
//       query: ({ formData }) => ({
//         url: "/subcategory",
//         method: "POST",
//         body: formData,
//       }),
//       invalidatesTags: ["Subcategories"],
//     }),

//     // PATCH UPDATE SINGLE SUBCATEGORY
//     updateSubcategory: builder.mutation<
//       UpdateSubcategoryResponse,
//       { id: string; formData: FormData }
//     >({
//       query: ({ id, formData }) => ({
//         url: `/subcategory/${id}`,
//         method: "PATCH",
//         body: formData,
//       }),
//       invalidatesTags: ["Categories"],
//     }),

//     // DELETE SINGLE SUBCATEGORY
//     deleteSubcategory: builder.mutation<
//       DeleteSubcategoryResponse,
//       string // just the id
//     >({
//       query: (id) => ({
//         url: `/subcategory/${id}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: ["Categories"],
//     }),
//   }),
// });

// // ========================
// // Export Hooks
// // ========================
// export const {
//   useGetAllCategoriesQuery,
//   useLazyGetAllCategoriesQuery,
//   useGetAllSubcategoriesQuery,
//   useLazyGetAllSubcategoriesQuery,
//   useGetSubcategoryByIdQuery,
//   useCreateSubcategoryMutation,
//   useUpdateSubcategoryMutation,
//   useDeleteSubcategoryMutation,

//   // ── NEW hooks ──
//   useGetSubcategoriesByCategoryQuery,
//   useLazyGetSubcategoriesByCategoryQuery,
// } = categoryApi;



import baseApi from "@/redux/api/baseApi";

// ========================
// Existing Types — unchanged
// ========================

export interface Product {
  id: string;
  storeId: string;
  categoryId: string;
  name: string;
  images: string[];
  price: number;
  description: string;
  subCategoryId: string;
  type: string;
  stockQuantity: number;
  discount: number;
  finalPrice: number;
  averageRating: number;
  totalReviews: number;
  tags: string[];
  barcode: string;
  sponsored: boolean;
  createdAt: string;
  updatedAt: string;
  isTopDeal: boolean;
  topDealFrom: string | null;
  topDealUntil: string | null;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  type: "PRODUCT" | "SERVICE";
  comment: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    storeCategories: number;
    products: number;
    services: number;
    consultations: number;
  };
  products: Product[];
}

export interface CategoryMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface CategoriesResponse {
  success: boolean;
  message: string;
  meta: CategoryMeta;
  data: Category[];
}

export interface Subcategory {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  slug: string;
  image: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
    type: string;
  };
}

export interface SubcategoryPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface SubcategoriesResponse {
  success: boolean;
  message: string;
  data: {
    subcategories: Subcategory[];
    pagination: SubcategoryPagination;
  };
}

export interface GetAllCategoriesParams {
  page?: number;
  limit?: number;
  type?: "PRODUCT" | "SERVICE";
  search?: string;
}

export interface GetAllSubcategoriesParams {
  page?: number;
  limit?: number;
}

// ========================
// Subcategory Mutation Types
// ========================

export interface CreateSubcategoryResponse {
  success: boolean;
  message: string;
  data: Subcategory;
}

export interface UpdateSubcategoryResponse {
  success: boolean;
  message: string;
  data: Subcategory;
}

export interface DeleteSubcategoryResponse {
  success: boolean;
  message: string;
}

// For update — same shape as create, but includes optional slug
export interface UpdateSubcategoryInput {
  name?: string;
  description?: string;
  categoryId?: string;
  slug?: string;
}

// For single subcategory fetch
export interface SingleSubcategoryResponse {
  success: boolean;
  message: string;
  data: Subcategory;
}

// ========================
// NEW: Response type for subcategories by category
// ========================
export interface SubcategoriesByCategoryResponse {
  success: boolean;
  message: string;
  data: Subcategory[];
}

// ========================
// NEW: Category Creation / Update / Single Types
// ========================

export type CategoryType = "PRODUCT" | "SERVICE" | "SUBSCRIPTION" | "CONSULTATION";

export interface CreateCategoryInput {
  name: string;
  description: string;
  type: CategoryType;
}

export interface CreateCategoryResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    description: string;
    type: CategoryType;
    comment: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface SingleCategoryResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    description: string;
    type: CategoryType;
    comment: string;
    createdAt: string;
    updatedAt: string;
    storeCategories: Array<{
      id: string;
      storeId: string;
      categoryId: string;
      createdAt: string;
    }>;
    products: Product[];
    services: Array<any>;       // you can refine this type later if needed
    consultations: Array<any>;  // you can refine this type later if needed
    _count: {
      storeCategories: number;
      products: number;
      services: number;
      consultations: number;
    };
  };
}

export interface UpdateCategoryInput {
  name?: string;
  description?: string;
  type?: CategoryType;
}

export interface UpdateCategoryResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    description: string;
    type: CategoryType;
    comment: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface DeleteCategoryResponse {
  success: boolean;
  message: string;
}

// ========================
// API Slice
// ========================
export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL CATEGORIES
    getAllCategories: builder.query<
      CategoriesResponse,
      GetAllCategoriesParams | void
    >({
      query: (params) => {
        if (!params) return "/categorys";

        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());
        if (params.type) queryParams.append("type", params.type);
        if (params.search) queryParams.append("search", params.search);

        return `/categorys?${queryParams.toString()}`;
      },
      providesTags: ["Categories"],
    }),

    // GET ALL SUBCATEGORIES (global/paginated)
    getAllSubcategories: builder.query<
      SubcategoriesResponse,
      GetAllSubcategoriesParams | void
    >({
      query: (params) => {
        if (!params) return "/subcategory";

        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());

        return `/subcategory?${queryParams.toString()}`;
      },
      providesTags: ["Subcategories"],
    }),

    // GET SINGLE SUBCATEGORY - /subcategory/:id
    getSubcategoryById: builder.query<SingleSubcategoryResponse, string>({
      query: (id) => `/subcategory/${id}`,
      providesTags: ["Categories"],
    }),

    // GET SUBCATEGORIES BY CATEGORY
    getSubcategoriesByCategory: builder.query<
      SubcategoriesByCategoryResponse,
      string
    >({
      query: (categoryId) => `/subcategory/category/${categoryId}`,
      providesTags: (result, error, categoryId) => [
        { type: "Subcategories", id: `LIST_BY_CATEGORY_${categoryId}` },
        "Subcategories",
      ],
    }),

    // POST CREATE SUBCATEGORY
    createSubcategory: builder.mutation<
      CreateSubcategoryResponse,
      { formData: FormData }
    >({
      query: ({ formData }) => ({
        url: "/subcategory",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Subcategories"],
    }),

    // PATCH UPDATE SINGLE SUBCATEGORY
    updateSubcategory: builder.mutation<
      UpdateSubcategoryResponse,
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/subcategory/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["Categories"],
    }),

    // DELETE SINGLE SUBCATEGORY
    deleteSubcategory: builder.mutation<
      DeleteSubcategoryResponse,
      string
    >({
      query: (id) => ({
        url: `/subcategory/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categories"],
    }),

    // ────────────────────────────────────────────────
    //          NEW CATEGORY ENDPOINTS
    // ────────────────────────────────────────────────

    // POST Create single category
    createCategory: builder.mutation<
      CreateCategoryResponse,
      CreateCategoryInput
    >({
      query: (body) => ({
        url: "/categorys/create-one",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Categories"],
    }),

    // GET Single category with relations
    getCategoryById: builder.query<SingleCategoryResponse, string>({
      query: (id) => `/categorys/${id}`,
      providesTags: (result, error, id) => [
        { type: "Categories", id },
        "Categories",
      ],
    }),

    // PATCH Update single category
    updateCategory: builder.mutation<
      UpdateCategoryResponse,
      { id: string; body: UpdateCategoryInput }
    >({
      query: ({ id, body }) => ({
        url: `/categorys/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Categories", id },
        "Categories",
      ],
    }),

    // DELETE Single category
    deleteCategory: builder.mutation<DeleteCategoryResponse, string>({
      query: (id) => ({
        url: `/categorys/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categories"],
    }),
  }),
});

// ========================
// Export Hooks
// ========================
export const {
  useGetAllCategoriesQuery,
  useLazyGetAllCategoriesQuery,
  useGetAllSubcategoriesQuery,
  useLazyGetAllSubcategoriesQuery,
  useGetSubcategoryByIdQuery,
  useCreateSubcategoryMutation,
  useUpdateSubcategoryMutation,
  useDeleteSubcategoryMutation,
  useGetSubcategoriesByCategoryQuery,
  useLazyGetSubcategoriesByCategoryQuery,

  // ── NEW hooks ──
  useCreateCategoryMutation,
  useGetCategoryByIdQuery,
  useLazyGetCategoryByIdQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;