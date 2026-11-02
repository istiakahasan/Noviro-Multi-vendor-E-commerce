


// // src/redux/api/userManagementApi.ts 
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
//     // 🔥 GET ALL STAFF ( /staffs )
//     getAllStaffs: builder.query<UsersResponse, void>({
//       query: () => "/staffs",
//       providesTags: ["Staff"],
//     }),

//     // 🔥 GET STAFF BY ID ( /staffs/:id )
//     getSingleStaff: builder.query<SingleUserResponse, string>({
//       query: (id) => `/users/${id}`,
//       providesTags: (result, error, id) => [{ type: "Staff", id }],
//     }),

//     // 🔥 DELETE STAFF ( /staffs/:id )
//     deleteStaff: builder.mutation<{ success: boolean; message: string }, string>({
//       query: (id) => ({
//         url: `/staffs/${id}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: ["Staff"],
//     }),

//     resendSetPassEmail: builder.mutation<{ success: boolean; message: string }, string>({
//       query: (email) => ({
//         url: `/staffs/resend-password-email`,
//         method: "POST",
//         body: { email },
//       }),
//       invalidatesTags: ["Staff"],
//     }),

// createStaff: builder.mutation<
//   { success: boolean; message: string },
//   {
//     firstName: string;
//     lastName: string;
//     email: string;
//     phone: string;
//     gender: string;
//   }
// >({
//   query: (body) => ({
//     url: `/staffs`,
//     method: "POST",
//     body, // ← সরাসরি object পাঠানো হচ্ছে (backend এ JSON হিসেবে পাবে)
//   }),
//   invalidatesTags: ["Staff"],
// }),


//   }),
// });

// // =========================
// // 📦 Export Hooks
// // =========================
// export const {
//   useGetAllStaffsQuery,
//   useGetSingleStaffQuery,
//   useDeleteStaffMutation,
//   useResendSetPassEmailMutation,
//   useCreateStaffMutation,
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
  services: unknown[];
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
  role: "SUPER_ADMIN" | "ADMIN" | "SELLER" | "USER" | "SPECIALIST" | "STAFF";
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
    // 🔥 GET ALL STAFF ( /staffs )
    getAllStaffs: builder.query<UsersResponse, void>({
      query: () => "/staffs",
      providesTags: ["Staff"],
    }),

    // 🔥 GET STAFF BY ID ( /staffs/:id )
    getSingleStaff: builder.query<SingleUserResponse, string>({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: "Staff", id }],
    }),

    // 🔥 DELETE STAFF ( /staffs/:id )
    deleteStaff: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/staffs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Staff"],
    }),

    // 🔥 RESEND PASSWORD EMAIL
    resendSetPassEmail: builder.mutation<{ success: boolean; message: string }, string>({
      query: (email) => ({
        url: `/staffs/resend-password-email`,
        method: "POST",
        body: { email },
      }),
      invalidatesTags: ["Staff"],
    }),

    // 🔥 CREATE STAFF
    createStaff: builder.mutation<
      { success: boolean; message: string },
      {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        gender: string;
      }
    >({
      query: (body) => ({
        url: `/staffs`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Staff"],
    }),

    // 🔥 NEW: UPDATE STAFF BY ID (PUT /staffs/:id)
    updateStaff: builder.mutation<
      { success: boolean; message: string; data: UserData },
      {
        id: string;
        body: {
          firstName?: string;
          lastName?: string;
          email?: string;
        }
      }
    >({
      query: ({ id, body }) => ({
        url: `/staffs/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Staff",
        { type: "Staff", id },
      ],
    }),
  }),
});

// =========================
// 📦 Export Hooks
// =========================
export const {
  useGetAllStaffsQuery,
  useGetSingleStaffQuery,
  useDeleteStaffMutation,
  useResendSetPassEmailMutation,
  useCreateStaffMutation,
  useUpdateStaffMutation, // ← New hook exported
} = userManagementApi;