// lib/api/specialistApi.ts

import baseApi from "../baseApi";

// === Existing Types ===
export interface AvailabilitySlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface SetAvailabilityRequest {
  availability: AvailabilitySlot[];
}

export interface SetAvailabilityResponse {
  success: boolean;
  message: string;
  data: { count: number };
}

export interface AvailabilityFromDB {
  id: string;
  dayOfWeek: number;
  dayName: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface GetWeeklyAvailabilityResponse {
  success: boolean;
  message: string;
  data: AvailabilityFromDB[];
}

export interface UpdateSingleDayRequest {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface UpdateSingleDayResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    specialistId: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

// === NEW: Upcoming Appointments Types ===
export interface UpcomingBooking {
  id: string;
  serviceId: string;
  specialistId: string;
  userId: string;
  bookingDate: string; // ISO date
  startTime: string; // ISO datetime
  endTime: string; // ISO datetime
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  createdAt: string;
  updatedAt: string;
  service: {
    id: string;
    name: string;
    price: number;
    slotDuration: number;
  };
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface GetUpcomingAppointmentsResponse {
  success: boolean;
  message: string;
  data: UpcomingBooking[];
}

export interface RescheduleBookingRequest {
  newBookingDate: string;
  newStartTime: string;
  newEndTime: string;
  reason: string;
}

export interface RescheduleBookingResponse {
  success: boolean;
  message: string;
  data?: any;
}

// === API Endpoints ===
export const specialistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Existing
    getWeeklyAvailability: builder.query<GetWeeklyAvailabilityResponse, void>({
      query: () => "/specialist/get-weekly/availability",
      providesTags: ["Availability"],
    }),

    setWeeklyAvailability: builder.mutation<
      SetAvailabilityResponse,
      SetAvailabilityRequest
    >({
      query: (body) => ({
        url: "/specialist/availability",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Availability"],
    }),

    updateSingleDayAvailability: builder.mutation<
      UpdateSingleDayResponse,
      UpdateSingleDayRequest
    >({
      query: (body) => ({
        url: "/specialist/availability/update",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Availability"],
    }),

    // NEW: Get upcoming appointments
    getUpcomingAppointmentSpecialist: builder.query<
      GetUpcomingAppointmentsResponse,
      void
    >({
      query: () => "/booking/specialist/upcoming-bookings",
      providesTags: ["UpcomingBookings"],
    }),

    // NEW: Reschedule booking
    rescheduleBooking: builder.mutation<
      RescheduleBookingResponse,
      { bookingId: string; body: RescheduleBookingRequest }
    >({
      query: ({ bookingId, body }) => ({
        url: `/booking/specialist/bookings/${bookingId}/reschedule`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Bookings", "UpcomingBookings"],
    }),
  }),
});

// === Export All Hooks ===
export const {
  useGetWeeklyAvailabilityQuery,
  useSetWeeklyAvailabilityMutation,
  useUpdateSingleDayAvailabilityMutation,
  useGetUpcomingAppointmentSpecialistQuery,
  useRescheduleBookingMutation, // ← NEW HOOK READY!
} = specialistApi;
