import { baseApi } from "@/redux/api/baseApi";

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    createAddToCartPayment: builder.mutation({
      query: (data) => ({
        url: "/orders/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Payment"],
    }),

    createProductBookingPayment: builder.mutation({
      query: (data) => ({
        url: "/orders/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Payment"],
    }),

    createBookingPayment: builder.mutation({
      query: (data) => ({
        url: "/booking",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Payment"],
    }),

  }),
});

export const { useCreateAddToCartPaymentMutation, useCreateBookingPaymentMutation, useCreateProductBookingPaymentMutation } =
  paymentApi;
