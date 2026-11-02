/**
 * Base API Configuration using Redux Toolkit Query
 *
 * This file sets up the base API configuration with:
 * - Automatic token management
 * - Request/response interceptors
 * - Error handling
 * - Retry logic
 * - Cache management
 */

import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import { logout, setTokens } from "../features/user/authSlice";
import { RootState } from "../store";

// API Configuration
const API_BASE_URL =process.env.NEXT_PUBLIC_BASE_URL ;

// Create base query with authentication
const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.accessToken || Cookies.get("accessToken");


    // Add auth token if available
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

// Enhanced base query with token refresh logic
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Attempt the original request
  let result = await baseQuery(args, api, extraOptions);

  // If we get a 401 (Unauthorized) error
  if (result.error && result.error.status === 401) {
    const state = api.getState() as RootState;
    const refreshToken = state.auth.refreshToken || Cookies.get("refreshToken");

    if (refreshToken) {
      // Try to refresh the token
      const refreshResult = await baseQuery(
        {
          url: "/auth/refresh",
          method: "POST",
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        
        // Successfully refreshed token
        const newTokens = refreshResult.data as {
          accessToken: string;
          refreshToken: string;
        };
console.log(newTokens, "token get")
        // Update tokens in store and cookies
        api.dispatch(setTokens(newTokens));

        // Retry the original request with new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed, logout user
        api.dispatch(logout());
        // Redirect to login page
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    } else {
      // No refresh token, logout user
      api.dispatch(logout());
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  }

  return result;
};

// Create the base API
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,

  // Define tag types for cache invalidation
  tagTypes: ["User", "Store", "Product","Service","Consultation","Specialist","ServiceType","Subscription","Coupon","Advertisement","Dashboard","Report","Withdraw","MessageChat","Refund", "Booking", "Availability", "UpcomingBookings" , "BookingsTimeSlot","Notification", "SpecialOffer"],

  // Keep unused data for 60 seconds
  keepUnusedDataFor: 120,

  // Refetch on mount if data is older than 60 seconds
  refetchOnMountOrArgChange: 120,

  // Refetch on window focus
  //   refetchOnFocus: true,

  // Refetch on reconnect
  refetchOnReconnect: true,

  // Define endpoints
  endpoints: () => ({}),
});

// Export hooks for the defined endpoints
export const {} = baseApi;

// Export the api for use in store configuration
export default baseApi;