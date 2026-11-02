// // =========================
// // 📦 User Types
// // =========================
// import baseApi from "@/redux/api/baseApi";

// export interface Product {
//   id: string;
//   storeId: string;
//   categoryId: string;
//   name: string;
//   image: string;
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

// export interface OrderItem {
//   id: string;
//   orderId: string;
//   productId: string;
//   quantity: number;
//   price: number;
//   totalPrice: number;
//   product: Product;
// }

// export interface Order {
//   id: string;
//   userId: string;
//   shippingId: string;
//   totalAmount: number;
//   shippingCost: number;
//   paymentMethod: string;
//   couponId: string | null;
//   orderStatus: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
//   paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
//   createdAt: string;
//   updatedAt: string;
//   orderItems: OrderItem[];
// }

// export interface Store {
//   id: string;
//   userId: string;
//   name: string;
//   location: string;
//   tags: string[];
//   description: string;
//   logo: string;
//   banner: string;
//   phone: string;
//   email: string;
//   facebookUrl: string;
//   instagramUrl: string;
//   youtubeUrl: string;
//   shopStatus: "PENDING" | "APPROVED" | "REJECTED";
//   status: "ONLINE" | "OFFLINE";
//   createdAt: string;
//   updatedAt: string;
//   services: unknown[];
// }

// export interface UserData {
//   id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   profilePic: string;
//   passwordChangedAt?: string | null;
//   isVerified: boolean;
//   isResetPassword?: boolean;
//   canResetPassword?: boolean;
//   isResentOtp?: boolean;
//   role: "SUPER_ADMIN" | "ADMIN" | "SELLER" | "USER" | "SPECIALIST";
//   isSubscribed: boolean;
//   planExpiration: string | null;
//   resetPasswordOTP?: string | null;
//   resetPasswordOTPExpiresAt?: string | null;
//   createdAt: string;
//   updatedAt: string;
//   status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
//   Profile: object | null;
//   orders?: Order[];
//   stores?: Store;
//   data?: {
//     lastName: string;
//     firstName: string;
//     createdAt: string;
//     email: string;
//     profilePic: string;
//     isSubscribed: boolean;
//     role: string;
//     isVerified: boolean;
//   };
// }

// export interface SingleUserResponse {
//   success: boolean;
//   message: string;
//   data: UserData;
// }

// export interface UsersResponse {
//   success: boolean;
//   message: string;
//   data: UserData[];
// }

// // =========================
// // 📦 User Management API
// // =========================
// export const userManagementApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     // 🔥 GET ALL USERS ( /users )
//     getAllUsers: builder.query<UsersResponse, void>({
//       query: () => "/users",
//       providesTags: ["Users"],
//     }),
//     // 🔥 GET USER BY ID ( /users/:id )
//     getSingleUser: builder.query<SingleUserResponse, string>({
//       query: (id) => `/users/${id}`,
//       providesTags: (result, error, id) => [{ type: "Users", id }],
//     }),
//     // 🔥 DELETE USER ( /users/:id )
//     deleteUser: builder.mutation<{ success: boolean; message: string }, string>(
//       {
//         query: (id) => ({
//           url: `/users/${id}`,
//           method: "DELETE",
//         }),
//         invalidatesTags: ["Users"],
//       },
//     ),
//   }),
// });

// // =========================
// // 📦 Export Hooks
// // =========================
// export const {
//   useGetAllUsersQuery,
//   useGetSingleUserQuery,
//   useDeleteUserMutation,
// } = userManagementApi;

// src/redux/api/userManagementApi.ts
// =========================
// 📦 User Types
// =========================
import baseApi from "@/redux/api/baseApi";

export interface Product {
  id: string;
  storeId: string;
  categoryId: string;
  name: string;
  image: string;
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

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  totalPrice: number;
  product: Product;
}

export interface Order {
  id: string;
  userId: string;
  shippingId: string;
  totalAmount: number;
  shippingCost: number;
  paymentMethod: string;
  couponId: string | null;
  orderStatus: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
}

export interface ServiceFeature {
  price?: number;
  duration?: string;
  available?: boolean;
  serviceName?: string;
  includes?: string[];
  providers?: string;
}

export interface Service {
  id: string;
  storeId: string;
  categoryId: string;
  serviceTypeId: string;
  name: string;
  profilePic: string | null;
  price: number;
  description: string;
  duration: string;
  location: string;
  slotDuration: number;
  subCategoryId: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  tags: string[];
  averageRating: number;
  totalReviews: number;
  totalSlot: number;
  features: ServiceFeature | ServiceFeature[];
  serviceMode: "ONLINE" | "OFFLINE";
  providerType: "SPECIALIST_ONLY" | "OWNER_ONLY" | "BOTH";
  createdAt: string;
  updatedAt: string;
  status: "approved" | "pending" | "rejected";
}

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
  stripeAccountId?: string;
  stripeAccountStatus?: string;
  services?: Service[];
}

export interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePic: string;
  passwordChangedAt?: string | null;
  isVerified: boolean;
  isResetPassword?: boolean;
  canResetPassword?: boolean;
  isResentOtp?: boolean;
  role: "SUPER_ADMIN" | "ADMIN" | "SELLER" | "USER" | "SPECIALIST";
  isSubscribed: boolean;
  planExpiration: string | null;
  resetPasswordOTP?: string | null;
  resetPasswordOTPExpiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  Profile: object | null;
  orders?: Order[];
  stores?: Store;
  data?: {
    lastName: string;
    firstName: string;
    createdAt: string;
    email: string;
    profilePic: string;
    isSubscribed: boolean;
    role: string;
    isVerified: boolean;
  };
}

export interface SingleUserResponse {
  success: boolean;
  message: string;
  data: UserData;
}

export interface UsersResponse {
  success: boolean;
  message: string;
  data: UserData[];
}

// =========================
// 📦 User Management API
// =========================
export const userManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 🔥 GET ALL USERS ( /users )
    getAllUsers: builder.query<UsersResponse, void>({
      query: () => "/users",
      providesTags: ["Users"],
    }),

    // 🔥 GET USER BY ID ( /users/:id )
    getSingleUser: builder.query<SingleUserResponse, string>({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: "Users", id }],
    }),

    // 🔥 DELETE USER ( /users/:id )
    deleteUser: builder.mutation<{ success: boolean; message: string }, string>(
      {
        query: (id) => ({
          url: `/users/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Users"],
      },
    ),

    // 🔥 NEW: UPDATE SELLER STATUS (PATCH /auth/admin/seller-status/:id)
    updateSellerStatus: builder.mutation<
      SingleUserResponse, // response type
      { id: string; status: "ACTIVE" | "INACTIVE" | "SUSPENDED" } // body + id
    >({
      query: ({ id, status }) => ({
        url: `/auth/admin/seller-status/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Users", id }, // invalidate single user cache
        "Users", // invalidate all users list
      ],
    }),
  }),
});

// =========================
// 📦 Export Hooks
// =========================
export const {
  useGetAllUsersQuery,
  useGetSingleUserQuery,
  useDeleteUserMutation,
  useUpdateSellerStatusMutation,
} = userManagementApi;
