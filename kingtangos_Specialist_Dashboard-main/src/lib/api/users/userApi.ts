// // src/redux/api/userApi.ts

// import baseApi from "../baseApi";

// // 📦 Single user type
// export interface UserData {
//   id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   profilePic: string;
//   role: string;
//   isVerified: boolean;
//   isSubscribed: boolean;
//   planExpiration: string | null;
//   Profile: object | string | null;
//   Subscription?: object | string | null;
//   createdAt?: string;
//   updatedAt?: string;
// }

// // 📦 Single user response (for /auth/me)
// interface UserResponse {
//   success: boolean;
//   message: string;
//   data: UserData;
// }

// // 📦 Multiple users response (for /users)
// // interface UsersResponse {
// //   success: boolean;
//   // message: string;
// //   data: UserData[];
// // }

// export const userApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     // ✅ Single logged-in user
//     getUser: builder.query<UserResponse, void>({
//       query: () => "/auth/me",
//       providesTags: ["Users"],
//     }),

//     // ✅ All users list

//   }),
// });

// // ✅ হুক এক্সপোর্ট করা
// export const { useGetUserQuery } = userApi;

// src/redux/api/userApi.ts
import baseApi from "../baseApi";

// Single user type
export interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePic: string;
  role: string;
  isVerified: boolean;
  isSubscribed: boolean;
  planExpiration: string | null;
  Profile: object | string | null;
  Subscription?: object | string | null;
  createdAt?: string;
  updatedAt?: string;
}

// Single user response (for /auth/me)
interface UserResponse {
  success: boolean;
  message: string;
  data: UserData;
}

// NEW: Today's Schedule Types
export interface TodayBooking {
  id: string;
  serviceId: string;
  specialistId: string;
  userId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    isVerified: boolean;
    // ... other user fields if needed
  };
  service: {
    id: string;
    storeId: string;
    name: string;
    price: number;
    description: string;
    duration: string;
    location: string;
    tags: string[];
    // ... other service fields
  };
}

export interface TodaysScheduleResponse {
  success: boolean;
  message: string;
  data: {
    message: string;
    todaySchedule: TodayBooking[];
  };
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Single logged-in user
    getUser: builder.query<UserResponse, void>({
      query: () => "/auth/me",
      providesTags: ["Users"],
    }),

    // NEW: Get Today's Booking Schedule for Specialist
    getTodaysSchedule: builder.query<TodaysScheduleResponse, void>({
      query: () => "/booking/specialist/today-booking-list",
      providesTags: ["TodaysSchedule"],
    }),

    // All users list (still commented as per your original)
    // getAllUsers: builder.query<UsersResponse, void>({ ... })
  }),
});

// Export hooks
export const {
  useGetUserQuery,
  useGetTodaysScheduleQuery, // Newly added
} = userApi;
