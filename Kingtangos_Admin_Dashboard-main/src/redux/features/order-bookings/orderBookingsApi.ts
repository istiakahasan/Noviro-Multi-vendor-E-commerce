// import baseApi from "@/redux/api/baseApi";

// // ========== BOOKINGS API TYPES ==========

// export interface BookingService {
//   id: string;
//   name: string;
//   price: number;
//   slotDuration: number;
// }

// export interface BookingSpecialist {
//   id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
// }

// export interface BookingUser {
//   id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
// }

// export interface Booking {
//   id: string;
//   serviceId: string;
//   specialistId: string;
//   userId: string;
//   bookingDate: string;
//   startTime: string;
//   endTime: string;
//   status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
//   createdAt: string;
//   updatedAt: string;
//   service: BookingService;
//   specialist: BookingSpecialist;
//   user: BookingUser;
// }

// export interface BookingsResponse {
//   success: boolean;
//   message: string;
//   data: Booking[];
// }

// export interface GetAllBookingsParams {
//   status?: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
//   userId?: string;
//   specialistId?: string;
//   serviceId?: string;
// }

// // ========== ORDERS API TYPES ==========

// export interface OrderUser {
//   id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   profilePic?: string;
// }

// export interface OrderStore {
//   id: string;
//   name: string;
//   logo: string;
//   location?: string;
//   phone?: string;
//   email?: string;
// }

// export interface OrderProduct {
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
//   sponsored: string | null;
//   createdAt: string;
//   updatedAt: string;
//   isTopDeal: boolean;
//   topDealFrom: string | null;
//   topDealUntil: string | null;
//   store: OrderStore;
// }

// export interface OrderItem {
//   id: string;
//   orderId: string;
//   productId: string;
//   quantity: number;
//   price: number;
//   totalPrice: number;
//   product: OrderProduct;
// }

// export interface ShippingAddress {
//   id: string;
//   userId: string;
//   fullName: string;
//   country: string;
//   phone: string;
//   city: string;
//   state: string | null;
//   postalCode: string;
//   address: string;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface Order {
//   id: string;
//   userId: string;
//   shippingId: string;
//   totalAmount: number;
//   shippingCost: number;
//   paymentMethod: string;
//   couponId: string | null;
//   orderStatus:
//     | "PENDING"
//     | "SHIPPED"
//     | "DELIVERED"
//     | "Cancellable"
//     | "CANCELLED";
//   paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
//   createdAt: string;
//   updatedAt: string;
//   user: OrderUser;
//   orderItems: OrderItem[];
//   shippingAddress: ShippingAddress;
// }

// export interface Pagination {
//   page: number;
//   limit: number;
//   total: number;
//   pages: number;
// }

// export interface OrdersResponse {
//   success: boolean;
//   message: string;
//   data: {
//     orders: Order[];
//     pagination: Pagination;
//   };
// }

// export interface GetAllOrdersParams {
//   page?: number;
//   limit?: number;
//   orderStatus?: "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
//   paymentStatus?: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
//   userId?: string;
// }

// // ========== SINGLE ORDER RESPONSE ==========
// export interface SingleOrderResponse {
//   success: boolean;
//   message: string;
//   data: Order;
// }

// // =========================
// // Order & Booking API
// // =========================

// export const orderBookingApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     // GET ALL BOOKINGS (unchanged)
//     getAllBookings: builder.query<
//       BookingsResponse,
//       GetAllBookingsParams | void
//     >({
//       query: (params) => {
//         const queryParams = new URLSearchParams();

//         if (params) {
//           if (params.status) queryParams.append("status", params.status);
//           if (params.userId) queryParams.append("userId", params.userId);
//           if (params.specialistId)
//             queryParams.append("specialistId", params.specialistId);
//           if (params.serviceId)
//             queryParams.append("serviceId", params.serviceId);
//         }

//         const queryString = queryParams.toString();
//         return queryString ? `/booking?${queryString}` : "/booking";
//       },
//       providesTags: ["Bookings"],
//     }),

//     // GET ALL ORDERS
//     getAllOrders: builder.query<OrdersResponse, GetAllOrdersParams | void>({
//       query: (params) => {
//         const queryParams = new URLSearchParams();

//         if (params) {
//           if (params.page) queryParams.append("page", params.page.toString());
//           if (params.limit)
//             queryParams.append("limit", params.limit.toString());
//           if (params.orderStatus)
//             queryParams.append("orderStatus", params.orderStatus);
//           if (params.paymentStatus)
//             queryParams.append("paymentStatus", params.paymentStatus);
//           if (params.userId) queryParams.append("userId", params.userId);
//         }

//         const queryString = queryParams.toString();
//         return queryString ? `/orders?${queryString}` : "/orders";
//       },
//       providesTags: ["Bookings"],
//     }),

//     // NEW: GET SINGLE ORDER
//     getSingleOrder: builder.query<SingleOrderResponse, string>({
//       query: (orderId) => `/orders/${orderId}`,
//       providesTags: (result, error, orderId) => [{ type: "Bookings", id: orderId }],
//     }),
//   }),
// });

// // =========================
// // Export Hooks
// // =========================
// export const {
//   useGetAllBookingsQuery,
//   useGetAllOrdersQuery,
//   useGetSingleOrderQuery, // NEW HOOK ADDED
// } = orderBookingApi;

import baseApi from "@/redux/api/baseApi";

// ========== BOOKINGS API TYPES ==========

export interface BookingStore {
  id: string;
  name: string;
  logo: string;
  location?: string;
  phone?: string;
  email?: string;
}

export interface BookingCategory {
  id: string;
  name: string;
  description?: string;
  type?: string;
}

export interface BookingSubCategory {
  id: string;
  name: string;
  description?: string;
  slug?: string;
  image?: string;
}

export interface BookingService {
  id: string;
  storeId: string;
  name: string;
  profilePic: string;
  price: number;
  description: string;
  duration: string;
  location: string;
  slotDuration: number;
  serviceMode: string;
  providerType: string;
  store?: BookingStore;
  category?: BookingCategory;
  subCategory?: BookingSubCategory;
}

export interface BookingConsultation {
  id: string;
  storeId: string;
  name: string;
  profilePic: string;
  price: number;
  description: string;
  duration: string;
  location: string;
  slotDuration: number;
  consultationMode: string;
  providerType: string;
  store?: BookingStore;
  category?: BookingCategory;
  subCategory?: BookingSubCategory;
}

export interface BookingSpecialist {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNum?: string;
  title?: string;
  bio?: string;
  experience?: string;
}

export interface BookingUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePic?: string;
}

export interface Booking {
  id: string;
  serviceId: string | null;
  consultationId: string | null;
  providerId: string;
  specialistId: string | null;
  userId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  meetingLink: string | null;
  notes: string | null;
  isProvidedByOwner: boolean;
  amount: number;
  paymentMethod: string;
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  commissionAmount: number | null;
  commissionPaid: boolean;
  stripePaymentId: string | null;
  vendorAmount: number | null;
  createdAt: string;
  updatedAt: string;
  rescheduledAt: string | null;
  rescheduleReason: string | null;
  user: BookingUser;
  specialist: BookingSpecialist | null;
  service: BookingService | null;
  consultation: BookingConsultation | null;
}

export interface BookingsResponse {
  success: boolean;
  message: string;
  data: Booking[];
}

export interface GetAllBookingsParams {
  status?: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  userId?: string;
  specialistId?: string;
  serviceId?: string;
}

// ========== SINGLE BOOKING RESPONSE ==========
export interface SingleBookingResponse {
  success: boolean;
  message: string;
  data: Booking;
}

// ========== ORDERS API TYPES ==========

export interface OrderUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePic?: string;
}

export interface OrderStore {
  id: string;
  name: string;
  logo: string;
  location?: string;
  phone?: string;
  email?: string;
}

export interface OrderProduct {
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
  sponsored: string | null;
  createdAt: string;
  updatedAt: string;
  isTopDeal: boolean;
  topDealFrom: string | null;
  topDealUntil: string | null;
  store: OrderStore;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  totalPrice: number;
  product: OrderProduct;
}

export interface ShippingAddress {
  id: string;
  userId: string;
  fullName: string;
  country: string;
  phone: string;
  city: string;
  state: string | null;
  postalCode: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  userId: string;
  shippingId: string;
  totalAmount: number;
  shippingCost: number;
  paymentMethod: string;
  couponId: string | null;
  orderStatus:
    | "PENDING"
    | "SHIPPED"
    | "DELIVERED"
    | "Cancellable"
    | "CANCELLED";
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  createdAt: string;
  updatedAt: string;
  user: OrderUser;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface OrdersResponse {
  success: boolean;
  message: string;
  data: {
    orders: Order[];
    pagination: Pagination;
  };
}

export interface GetAllOrdersParams {
  page?: number;
  limit?: number;
  orderStatus?: "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  paymentStatus?: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  userId?: string;
}

export interface SingleOrderResponse {
  success: boolean;
  message: string;
  data: Order;
}

// =========================
// Order & Booking API
// =========================

export const orderBookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL BOOKINGS
    getAllBookings: builder.query<
      BookingsResponse,
      GetAllBookingsParams | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();

        if (params) {
          if (params.status) queryParams.append("status", params.status);
          if (params.userId) queryParams.append("userId", params.userId);
          if (params.specialistId)
            queryParams.append("specialistId", params.specialistId);
          if (params.serviceId)
            queryParams.append("serviceId", params.serviceId);
        }

        const queryString = queryParams.toString();
        return queryString ? `/booking?${queryString}` : "/booking";
      },
      providesTags: ["Bookings"],
    }),

    // NEW: GET SINGLE BOOKING
    getSingleBooking: builder.query<SingleBookingResponse, string>({
      query: (bookingId) => `/booking/${bookingId}`,
      providesTags: (result, error, bookingId) => [
        { type: "Bookings", id: bookingId },
        "Bookings",
      ],
    }),

    // GET ALL ORDERS
    getAllOrders: builder.query<OrdersResponse, GetAllOrdersParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();

        if (params) {
          if (params.page) queryParams.append("page", params.page.toString());
          if (params.limit)
            queryParams.append("limit", params.limit.toString());
          if (params.orderStatus)
            queryParams.append("orderStatus", params.orderStatus);
          if (params.paymentStatus)
            queryParams.append("paymentStatus", params.paymentStatus);
          if (params.userId) queryParams.append("userId", params.userId);
        }

        const queryString = queryParams.toString();
        return queryString ? `/orders?${queryString}` : "/orders";
      },
      providesTags: ["Orders"],
    }),

    // GET SINGLE ORDER
    getSingleOrder: builder.query<SingleOrderResponse, string>({
      query: (orderId) => `/orders/${orderId}`,
      providesTags: (result, error, orderId) => [
        { type: "Orders", id: orderId },
        "Orders",
      ],
    }),
  }),
});

// =========================
// Export Hooks
// =========================
export const {
  useGetAllBookingsQuery,
  useGetSingleBookingQuery, // NEW
  useGetAllOrdersQuery,
  useGetSingleOrderQuery,
} = orderBookingApi;
