// // src/redux/api/userApi.ts
// import { baseApi } from "@/redux/api/baseApi";

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
// interface UsersResponse {
//   success: boolean;
//   message: string;
//   data: UserData[];
// }

// export const userApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     // ✅ Single logged-in user
//     getUser: builder.query<UserResponse, void>({
//       query: () => "/auth/me",
//       providesTags: ["Users"],
//     }),

//     // ✅ All users list
//     getAllUsers: builder.query<UsersResponse, void>({
//       query: () => "/users",
//       providesTags: ["Users"],
//     }),
//   }),

// });

// // ✅ হুক এক্সপোর্ট করা
// export const { useGetUserQuery, useGetAllUsersQuery } = userApi;

// src/redux/api/userApi.ts
import { baseApi } from "@/redux/api/baseApi";
import { ReactNode } from "react";

// 📦 User data structure (from your /auth/me response)
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

  stores?: ReactNode | null;
}

// 📦 Response for single user (/auth/me)
export interface UserResponse {
  success: boolean;
  message: string;
  data: UserData;
}

// 📦 Response for all users (/users)
export interface UsersResponse {
  success: boolean;
  message: string;
  data: UserData[];
}

// 📦 Fields allowed for update (PATCH /users/update-profile)
export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  // Add more fields here if your backend supports them
  // profilePic is sent separately as file
}

// 📦 Response after update
export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: UserData;
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get logged-in user
    getUser: builder.query<UserResponse, void>({
      query: () => "/auth/me",
      providesTags: ["Users"],
    }),

    // Get all users (admin only probably)
    getAllUsers: builder.query<UsersResponse, void>({
      query: () => "/users",
      providesTags: ["Users"],
    }),

    // ✨ NEW: Update profile (text + optional image)
    updateProfile: builder.mutation<
      UpdateProfileResponse,
      { formData: FormData } // We send FormData (file + data JSON)
    >({
      query: ({ formData }) => ({
        url: "/users/update-profile",
        method: "PATCH",
        body: formData,
        // IMPORTANT: Do NOT set 'Content-Type' header
        // Browser will automatically set multipart/form-data with boundary
      }),
      invalidatesTags: ["Users"], // Refetch profile after update
    }),
    deleteUser: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
    deleteSpecialist: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/specialist/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

// Export hooks
export const {
  useGetUserQuery,
  useGetAllUsersQuery,
  useUpdateProfileMutation,
  useDeleteUserMutation,
  useDeleteSpecialistMutation
} = userApi;
