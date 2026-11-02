// // In your bookingApi.ts or wherever you define the endpoint

// import baseApi from "../api/baseApi";

// // Correct full response type
// export interface BookingUser {
//   id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   profilePic?: string;
// }

// export interface BookingService {
//   id: string;
//   name: string;
//   price: number;
//   slotDuration: number;
//   description?: string;
//   location?: string;
//   profilePic?: string | null;
//   store?: {
//     id: string;
//     name: string;
//     logo?: string;
//     location?: string;
//     phone?: string;
//     email?: string;
//   };
//   category?: {
//     id: string;
//     name: string;
//   };
//   subCategory?: {
//     id: string;
//     name: string;
//   };
// }

// export interface Specialist {
//   id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   phoneNum?: string;
//   title?: string;
//   bio?: string;
//   experience?: string;
// }

// // For list response (paginated)
// export interface BookingListItem {
//   id: string;
//   serviceId: string;
//   consultationId: string | null;
//   specialistId: string;
//   userId: string;
//   bookingDate: string;
//   startTime: string;
//   endTime: string;
//   status: string;
//   meetingLink: string | null;
//   notes: string | null;
//   createdAt: string;
//   updatedAt: string;
//   user: BookingUser;
//   service: BookingService;
// }

// // Full single booking response
// export interface BookingDetail extends BookingListItem {
//   specialist: Specialist;
//   service: BookingService & {
//     store: NonNullable<BookingService["store"]>;
//     category: NonNullable<BookingService["category"]>;
//     subCategory: NonNullable<BookingService["subCategory"]>;
//   };
//   consultation?: unknown | null;
// }

// // API Response Types
// interface BookingsResponse {
//   success: boolean;
//   message: string;
//   meta: {
//     page: number;
//     limit: number;
//     total: number;
//     totalPage: number;
//   };
//   data: BookingListItem[];
// }

// interface SingleBookingResponse {
//   success: boolean;
//   message: string;
//   data: BookingDetail;
// }

// export const userApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     getMyBookingsAsSpecialist: builder.query<
//       BookingsResponse,
//       { page?: number; limit?: number }
//     >({
//       query: ({ page = 1, limit = 10 }) => ({
//         url: "/booking/specialist/bookings",
//         params: { page, limit },
//       }),
//       providesTags: ["Bookings"],
//     }),
//     // Get single booking by ID
//     getBookingById: builder.query<SingleBookingResponse, string>({
//       query: (id) => `/booking/${id}`,
//       providesTags: (result, error, id) => [{ type: "Bookings", id }],
//     }),
//   }),
// });

// export const { useGetMyBookingsAsSpecialistQuery, useGetBookingByIdQuery } = userApi;

// lib/bookings/bookingApi.ts

import baseApi from "../api/baseApi";

// === All your existing interfaces stay the same ===
export interface BookingUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePic?: string;
}

export interface BookingService {
  id: string;
  name: string;
  price: number;
  slotDuration: number;
  description?: string;
  location?: string;
  profilePic?: string | null;
  store?: {
    id: string;
    name: string;
    logo?: string;
    location?: string;
    phone?: string;
    email?: string;
  };
  category?: { id: string; name: string };
  subCategory?: { id: string; name: string };
}

export interface Consultation {
  id: string;
  storeId: string;
  categoryId: string;
  subCategoryId: string;
  name: string;
  profilePic?: string;
  price: number;
  description?: string;
  duration: string;
  location?: string;
  type: string;
  consultationMode?: string;
  providerType?: string;
  averageRating?: number;
  totalReviews?: number;
  totalSlot?: number;
  status?: string;
  currentStatus?: string;
  createdAt?: string;
  updatedAt?: string;
  store?: {
    id: string;
    name: string;
    logo?: string;
    location?: string;
    phone?: string;
    email?: string;
  };
}

export interface Specialist {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNum?: string;
  title?: string;
  bio?: string;
  experience?: string;
}

export interface BookingListItem {
  id: string;
  serviceId: string | null;
  consultationId: string | null;
  providerId: string;
  specialistId: string;
  userId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  status: string;
  meetingLink: string | null;
  notes: string | null;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  rescheduledAt?: string;
  rescheduleReason?: string;
  createdAt: string;
  updatedAt: string;
  user: BookingUser;
  service: BookingService | null;
  consultation: Consultation | null;
}

export interface BookingDetail extends BookingListItem {
  specialist: Specialist;
  consultation: Consultation | null;
  service:
    | (BookingService & {
        store: NonNullable<BookingService["store"]>;
        category: NonNullable<BookingService["category"]>;
        subCategory: NonNullable<BookingService["subCategory"]>;
        serviceMode?: string;
        providerType?: string;
        features?: any;
        duration?: string;
      })
    | null;
}

interface BookingsResponse {
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  data: BookingListItem[];
}

interface SingleBookingResponse {
  success: boolean;
  message: string;
  data: BookingDetail;
}

// Response for cancel mutation (you can adjust based on actual response)
interface CancelBookingResponse {
  success: boolean;
  message: string;
  data?: BookingDetail;
}

export const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // List bookings (paginated)
    getMyBookingsAsSpecialist: builder.query<
      BookingsResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) => ({
        url: "/booking/specialist/bookings",
        params: { page, limit },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Bookings" as const,
                id,
              })),
              { type: "Bookings", id: "LIST" },
            ]
          : [{ type: "Bookings", id: "LIST" }],
    }),

    // Get single booking by ID
    getBookingById: builder.query<SingleBookingResponse, string>({
      query: (id) => `/booking/${id}`,
      providesTags: (result, error, id) => [{ type: "Bookings", id }],
    }),

    // NEW: Cancel booking as specialist (PATCH, no body)
    cancelBookingAsSpecialist: builder.mutation<CancelBookingResponse, string>({
      query: (bookingId) => ({
        url: `/booking/cancel/specialist/${bookingId}`,
        method: "PATCH",
        // No body needed → intentionally empty
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Bookings", id },
        { type: "Bookings", id: "LIST" },
      ],
    }),
  }),
});

// Export all hooks
export const {
  useGetMyBookingsAsSpecialistQuery,
  useGetBookingByIdQuery,
  useCancelBookingAsSpecialistMutation, // ← This is the new one
} = bookingApi;
