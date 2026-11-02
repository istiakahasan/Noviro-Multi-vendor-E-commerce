import baseApi from "../baseApi";

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
  serviceId: string;
  consultationId: string | null;
  specialistId: string;
  userId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  status: string;
  meetingLink: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  user: BookingUser;
  service: BookingService;
}

export interface BookingDetail extends BookingListItem {
  specialist: Specialist;
  service: BookingService & {
    store: NonNullable<BookingService["store"]>;
    category: NonNullable<BookingService["category"]>;
    subCategory: NonNullable<BookingService["subCategory"]>;
  };
  consultation?: unknown | null;
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

export const bookingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // List bookings (paginated)
    getMyBookingsAsStoreOwner: builder.query<
      BookingsResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) => ({
        // url: "/booking/specialist/bookings",
        url: "/availabilitys/bookings",
        params: { page, limit },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "BookingsTimeSlot" as const, id })),
              { type: "BookingsTimeSlot", id: "LIST" },
            ]
          : [{ type: "BookingsTimeSlot", id: "LIST" }],
    }),

    // Get single booking by ID
    getBookingById: builder.query<SingleBookingResponse, string>({
      query: (id) => `/booking/${id}`,
      providesTags: (result, error, id) => [{ type: "BookingsTimeSlot", id }],
    }),

    // NEW: Cancel booking as specialist (PATCH, no body)
    cancelBookingAsStoreOwner: builder.mutation<CancelBookingResponse, string>({
      query: (bookingId) => ({
        // url: `/booking/cancel/specialist/${bookingId}`,
        url: `/availabilitys/bookings/${bookingId}/cancel`,
        method: "PATCH",
        // No body needed → intentionally empty
      }),
      invalidatesTags: (result, error, id) => [
        { type: "BookingsTimeSlot", id },
        { type: "BookingsTimeSlot", id: "LIST" },
      ],
    }),
  }),
});

// Export all hooks
export const {
  useGetMyBookingsAsStoreOwnerQuery,
  useGetBookingByIdQuery,
  useCancelBookingAsStoreOwnerMutation, // ← This is the new one
} = bookingsApi;