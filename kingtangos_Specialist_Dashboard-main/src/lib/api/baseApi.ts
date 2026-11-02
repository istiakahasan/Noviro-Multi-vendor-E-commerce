import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  prepareHeaders: (headers) => {
    const token =
      window && typeof window !== "undefined"
        ? localStorage.getItem("token")
        : null;
    if (token) {
      headers.set("Authorization", `${token}`);
    }
    // console.log(token);
    return headers;
  },
});

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery,
  tagTypes: [
    "TodaysSchedule",
    "Users",
    "Bookings",
    "Availability",
    "UpcomingBookings",
    "Review",
    "SpecialistProfile",
    "MessageChat",
    "Notifications",
  ],
  endpoints: () => ({}),
});

export default baseApi;
