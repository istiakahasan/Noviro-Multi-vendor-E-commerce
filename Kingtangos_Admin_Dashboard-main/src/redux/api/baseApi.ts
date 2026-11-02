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
    return headers;
  },
});

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery,
  tagTypes: [
    "Users",
    "Project",
    "Stores",
    "Products",
    "Coupons",
    "Advertisements",
    "Bookings",
    "Orders",
    "Subscriptions",
    "CommissionSettings",
    "withdrawals",
    "analytics",
    "transactions",
    "Categories",
    "Subcategories",
    "Plans",
    "Consultations",
    "Service",
    "Marketing",
    "refunds",
    "MessageChat",
    "Staff",
    "ServiceTypes",
    "Notifications",
    "SpecialOffers",
  ],
  endpoints: () => ({}),
});

export default baseApi;
