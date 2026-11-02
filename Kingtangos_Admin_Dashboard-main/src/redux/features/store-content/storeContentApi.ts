// src/redux/api/storeContentApi.ts  (or wherever this file is)

// =========================
// 📦 Store Types
// =========================
import baseApi from "@/redux/api/baseApi";

// ---------- CATEGORY ----------
export interface Category {
  id: string;
  name: string;
  description: string;
  type: "PRODUCT" | "SERVICE";
  comment: string;
  createdAt: string;
  updatedAt: string;
}

// ---------- STORE CATEGORY ----------
export interface StoreCategory {
  id: string;
  storeId: string;
  categoryId: string;
  createdAt: string;
  category: Category;
}

// ---------- STORE USER ----------
export interface StoreUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

// ---------- STORE COUNT ----------
export interface StoreCount {
  products: number;
  services: number;
  specialists: number;
  consultations: number;
}

// ---------- VARIANT SIZE ----------
export interface VariantSize {
  id: string;
  variantId: string;
  size: string;
  stockQuantity: number;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}

// ---------- PRODUCT VARIANT ----------
export interface ProductVariant {
  id: string;
  productId: string;
  color: string;
  colorCode: string;
  image: string;
  sizes: VariantSize[];
  createdAt: string;
  updatedAt: string;
}

// ---------- PRODUCT ----------
export interface Product {
  id: string;
  storeId: string;
  categoryId: string;
  name: string;
  image?: string;
  images: string[];
  status: "approved" | "pending" | "rejected";
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
  sponsored: string | null;
  createdAt: string;
  updatedAt: string;
  isTopDeal: boolean;
  topDealFrom: string | null;
  topDealUntil: string | null;
  hasVariants: boolean;
  variants: ProductVariant[];
}

// ---------- SERVICE (currently empty because API returns empty array) ----------
// export interface StoreService {
// // expand later if needed
// }

// ---------- SPECIALIST (currently empty because API returns empty array) ----------
// export interface StoreSpecialist {
// // expand later if needed
// }

// ---------- MAIN STORE ----------
export interface Store {
  id: string;
  userId: string;
  name: string;
  location: string;
  tags: string[];
  description: string;
  logo: string;
  banner: string;
  phone: string;
  email: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  shopStatus: "PENDING" | "APPROVED" | "REJECTED";
  status: "ONLINE" | "OFFLINE";
  createdAt: string;
  updatedAt: string;
  storeCategories: StoreCategory[];
  user: StoreUser;
  products: Product[];
  // services: StoreService[];
  services: unknown[];
  // specialists: StoreSpecialist[];
  specialists: unknown[];
  _count: StoreCount;
}

// ---------- PAGINATION ----------
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// ---------- GET ALL STORES ----------
export interface StoresData {
  stores: Store[];
  pagination: Pagination;
}
export interface StoresResponse {
  success: boolean;
  message: string;
  data: StoresData;
}

// ---------- GET SINGLE STORE ----------
export interface SingleStoreResponse {
  success: boolean;
  message: string;
  data: Store;
}

// ---------- Query Params ----------
export interface GetAllStoresParams {
  page?: number;
  limit?: number;
  search?: string;
  shopStatus?: "PENDING" | "APPROVED" | "REJECTED";
  status?: "ONLINE" | "OFFLINE";
}

// ========== NEW: PRODUCTS API TYPES ==========
// ---------- SUBCATEGORY ----------
export interface Subcategory {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  slug: string;
  image: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// ---------- STORE INFO (for product listing) ----------
export interface StoreInfo {
  id: string;
  name: string;
  logo: string;
  shopStatus: "PENDING" | "APPROVED" | "REJECTED";
  status: "ONLINE" | "OFFLINE";
}

// ---------- STORE INFO DETAILED (for single product) ----------
export interface StoreInfoDetailed extends StoreInfo {
  location: string;
  phone: string;
  email: string;
}

// ---------- PRODUCT WITH RELATIONS ----------
export interface ProductWithRelations extends Product {
  store: StoreInfo;
  category: Category;
  subcategory: Subcategory;
}

// ---------- SINGLE PRODUCT WITH DETAILED RELATIONS ----------
export interface SingleProductData extends Product {
  store: StoreInfoDetailed;
  category: Category;
  subcategory: Subcategory;
}

// ---------- PRODUCTS PAGINATION ----------
export interface ProductsPagination {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

// ---------- GET ALL PRODUCTS ----------
// export interface ProductsData {
//   products: ProductWithRelations[];
//   pagination: ProductsPagination;
// }
export interface ProductsResponse {
  success: boolean;
  message: string;
  data: ProductWithRelations[];
  pagination: ProductsPagination;
}

// ---------- GET SINGLE PRODUCT ----------
export interface SingleProductResponse {
  success: boolean;
  message: string;
  data: SingleProductData;
}

// ---------- PRODUCTS Query Params ----------
export interface GetAllProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  storeId?: string;
  categoryId?: string;
  subCategoryId?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  isTopDeal?: boolean;
}

// ========== NEW: COUPONS API TYPES ==========
// ---------- COUPON ----------
export interface Coupon {
  id: string;
  storeId: string;
  couponCode: string;
  discountType: "PERCENTAGE" | "FIXED";
  discount: number;
  minimumOrderAmount: number;
  maximumOrderAmount: number;
  maximumDiscountAmount: number | null;
  limitForSingleUser: number;
  startDate: string;
  expireDate: string;
  startTime: string;
  expireTime: string;
  tags: string[];
  barcode: string | null;
  createdAt: string;
  updatedAt: string;
}

// ---------- COUPONS PAGINATION ----------
export interface CouponsPagination {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

// ---------- GET ALL COUPONS ----------
export interface CouponsData {
  meta: CouponsPagination;
  data: Coupon[];
}
export interface CouponsResponse {
  success: boolean;
  message: string;
  data: CouponsData;
}

// ---------- COUPONS Query Params ----------
export interface GetAllCouponsParams {
  page?: number;
  limit?: number;
  storeId?: string;
}

// ========== NEW: ADVERTISEMENTS API TYPES ==========
// ---------- ADVERTISEMENT STORE INFO ----------
export interface AdvertisementStoreInfo {
  id: string;
  userId: string;
  name: string;
  location: string;
  tags: string[];
  description: string;
  logo: string;
  banner: string;
  phone: string;
  email: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  shopStatus: "PENDING" | "APPROVED" | "REJECTED";
  status: "ONLINE" | "OFFLINE";
  createdAt: string;
  updatedAt: string;
}

// ---------- ADVERTISEMENT ----------
export interface Advertisement {
  id: string;
  storeId: string;
  productId: string;
  adminId: string | null;
  status: "PAYMENT_PENDING" | "PAID" | "APPROVED" | "REJECTED";
  pricePerHour: number;
  totalDays: number;
  totalPrice: number;
  isActive: boolean;
  isPaid: boolean;
  paidAt: string | null;
  pausedAt: string | null;
  image: string | null;
  startDate: string | null;
  endDate: string | null;
  cancelledAt: string | null;
  impressions: number;
  clicks: number;
  stripePaymentIntentId: string | null;
  stripeClientSecret: string | null;
  createdAt: string;
  updatedAt: string;
  product: Product;
  store: AdvertisementStoreInfo;
}

// ---------- ADVERTISEMENTS PAGINATION ----------
export interface AdvertisementsPagination {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

// ---------- GET ALL ADVERTISEMENTS ----------
export interface AdvertisementsResponse {
  success: boolean;
  message: string;
  meta: AdvertisementsPagination;
  data: Advertisement[];
}

// ---------- ADVERTISEMENTS Query Params ----------
export interface GetAllAdvertisementsParams {
  page?: number;
  limit?: number;
  storeId?: string;
  status?: "PENDING" | "APPROVED" | "REJECTED";
}

// =========================
// 📦 Store Content API
// =========================
export const storeContentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 🔥 GET ALL STORES
    getAllStores: builder.query<StoresResponse, GetAllStoresParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params) {
          if (params.page) queryParams.append("page", params.page.toString());
          if (params.limit)
            queryParams.append("limit", params.limit.toString());
          if (params.search) queryParams.append("search", params.search);
          if (params.shopStatus)
            queryParams.append("shopStatus", params.shopStatus);
          if (params.status) queryParams.append("status", params.status);
        }
        const queryString = queryParams.toString();
        return queryString ? `/shops?${queryString}` : "/shops";
      },
      providesTags: ["Stores"],
    }),

    // 🔥 GET SINGLE STORE
    getSingleStore: builder.query<SingleStoreResponse, string>({
      query: (id) => `/shops/${id}`,
      providesTags: (result, error, id) => [{ type: "Stores", id }],
    }),

    // 🔥 APPROVE STORE
    approveStore: builder.mutation<SingleStoreResponse, string>({
      query: (id) => ({
        url: `/shops/${id}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Stores", id },
        "Stores",
      ],
    }),

    // 🔥 REJECT STORE
    rejectStore: builder.mutation<SingleStoreResponse, string>({
      query: (id) => ({
        url: `/shops/${id}/reject`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Stores", id },
        "Stores",
      ],
    }),

    // 🔥 DELETE STORE
    deleteStore: builder.mutation<SingleStoreResponse, string>({
      query: (id) => ({
        url: `/shops/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Stores", id },
        "Stores",
      ],
    }),

    // 🔥 NEW: UPDATE PRODUCT STATUS (PATCH /products/admin/:id/status)
    updateProductStatus: builder.mutation<
      SingleProductResponse, // response type
      { id: string; status: "approved" | "pending" | "rejected" } // params + body
    >({
      query: ({ id, status }) => ({
        url: `/products/admin/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        // invalidate admin products list
        "Products", // invalidate regular products list
      ],
    }),
    updateSubscriptionStatus: builder.mutation<
      SingleProductResponse, // response type
      { id: string; status: "approved" | "rejected" } // params + body
    >({
      query: ({ id, status }) => ({
        url: `/plans/admin/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        // invalidate admin products list
        "Products", // invalidate regular products list
      ],
    }),
    updateConsultaionStatus: builder.mutation<
      SingleProductResponse, // response type
      { id: string; status: "approved" | "rejected" } // params + body
    >({
      query: ({ id, status }) => ({
        url: `/consultations/admin/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        // invalidate admin products list
        "Products", // invalidate regular products list
      ],
    }),
    updateServiceStatus: builder.mutation<
      SingleProductResponse, // response type
      { id: string; status: "approved" | "rejected" } // params + body
    >({
      query: ({ id, status }) => ({
        url: `/service/admin/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        // invalidate admin products list
        "Products", // invalidate regular products list
      ],
    }),
    // 🔥 GET ALL PRODUCTS (existing)
    getAllProducts: builder.query<
      ProductsResponse,
      GetAllProductsParams | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params) {
          if (params.page) queryParams.append("page", params.page.toString());
          if (params.limit)
            queryParams.append("limit", params.limit.toString());
        }
        const queryString = queryParams.toString();
        return queryString ? `/products?${queryString}` : "/products";
      },
      providesTags: ["Products"],
    }),

    // 🔥 NEW: GET ALL PRODUCTS BY ADMIN (with pagination)
    getAllProductsByAdmin: builder.query<
      ProductsResponse,
      GetAllProductsParams | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params) {
          if (params.page) queryParams.append("page", params.page.toString());
          if (params.limit)
            queryParams.append("limit", params.limit.toString());
          if (params.search) queryParams.append("search", params.search);
          if (params.storeId) queryParams.append("storeId", params.storeId);
          if (params.categoryId)
            queryParams.append("categoryId", params.categoryId);
          if (params.subCategoryId)
            queryParams.append("subCategoryId", params.subCategoryId);
          if (params.type) queryParams.append("type", params.type);
          if (params.minPrice !== undefined)
            queryParams.append("minPrice", params.minPrice.toString());
          if (params.maxPrice !== undefined)
            queryParams.append("maxPrice", params.maxPrice.toString());
          if (params.isTopDeal !== undefined)
            queryParams.append("isTopDeal", params.isTopDeal.toString());
        }
        const queryString = queryParams.toString();
        return queryString
          ? `/products/admin?${queryString}`
          : "/products/admin";
      },
      providesTags: ["Products"], // separate tag so we can invalidate only admin products if needed
    }),

    // 🔥 GET SINGLE PRODUCT (NEW)
    getSingleProduct: builder.query<SingleProductResponse, string>({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),

    // 🔥 GET ALL COUPONS (NEW)
    getAllCoupons: builder.query<CouponsResponse, GetAllCouponsParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params) {
          if (params.page) queryParams.append("page", params.page.toString());
          if (params.limit)
            queryParams.append("limit", params.limit.toString());
          if (params.storeId) queryParams.append("storeId", params.storeId);
        }
        const queryString = queryParams.toString();
        return queryString ? `/coupon?${queryString}` : "/coupon";
      },
      providesTags: ["Coupons"],
    }),

    // 🔥 GET ALL ADVERTISEMENTS (NEW)
    getAllAdvertisements: builder.query<
      AdvertisementsResponse,
      GetAllAdvertisementsParams | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params) {
          if (params.page) queryParams.append("page", params.page.toString());
          if (params.limit)
            queryParams.append("limit", params.limit.toString());
          if (params.storeId) queryParams.append("storeId", params.storeId);
          if (params.status) queryParams.append("status", params.status);
        }
        const queryString = queryParams.toString();
        return queryString ? `/advertisement?${queryString}` : "/advertisement";
      },
      providesTags: ["Advertisements"],
    }),

    // NEW: APPROVE ADVERTISEMENT
    approveAdvertisement: builder.mutation<AdvertisementsResponse, string>({
      query: (id) => ({
        url: `/advertisement/${id}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: ["Advertisements"],
    }),

    // NEW: REJECT ADVERTISEMENT
    rejectAdvertisement: builder.mutation<AdvertisementsResponse, string>({
      query: (id) => ({
        url: `/advertisement/${id}/reject`,
        method: "PATCH",
      }),
      invalidatesTags: ["Advertisements"],
    }),

    // NEW: DELETE ADVERTISEMENT
    deleteAdvertisement: builder.mutation<AdvertisementsResponse, string>({
      query: (id) => ({
        url: `/advertisement/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Advertisements"],
    }),

    //  getProductDetails: builder.query<ProductDetailsResponse, string>({
    getProductDetails: builder.query<any, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "GET",
      }),
      providesTags: ["Products"],
    }),
  }),
});

// =========================
// 📦 Export Hooks
// =========================
export const {
  useGetAllStoresQuery,
  useGetSingleStoreQuery,
  useApproveStoreMutation,
  useRejectStoreMutation,
  useDeleteStoreMutation,
  useGetAllProductsQuery,
  useGetAllProductsByAdminQuery,
  useUpdateProductStatusMutation,
  useUpdateSubscriptionStatusMutation,
  useUpdateServiceStatusMutation,
  useUpdateConsultaionStatusMutation,
  useGetSingleProductQuery,
  useGetAllCouponsQuery,
  useGetAllAdvertisementsQuery,
  useApproveAdvertisementMutation,
  useRejectAdvertisementMutation,
  useDeleteAdvertisementMutation,
  useGetProductDetailsQuery,
} = storeContentApi;
