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

// === API Endpoints ===
export const specialistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Existing
    getWeeklyAvailability: builder.query<GetWeeklyAvailabilityResponse, void>({
      query: () => "/availabilitys",
      providesTags: ["Availability"],
    }),

    setWeeklyAvailability: builder.mutation<SetAvailabilityResponse,SetAvailabilityRequest >({
      query: (body) => ({
        url: "/availabilitys/set/weekly",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Availability"],
    }),

    updateSingleDayAvailability: builder.mutation< UpdateSingleDayResponse,UpdateSingleDayRequest>({
      query: (body) => ({
        url: "/availabilitys/day/1",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Availability"],
    }),

    // NEW: Get upcoming appointments
    getUpcomingAppointmentSpecialist: builder.query< GetUpcomingAppointmentsResponse,void >({
      query: () => "/availabilitys/bookings/upcoming",
      providesTags: ["UpcomingBookings"],
    }),
  }),
});

// === Export All Hooks ===
export const {
  useGetWeeklyAvailabilityQuery,
  useSetWeeklyAvailabilityMutation,
  useUpdateSingleDayAvailabilityMutation,
  useGetUpcomingAppointmentSpecialistQuery, 
} = specialistApi;
