import baseApi from "../baseApi";



export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // =====================
    // LOGIN USER
    // =====================
    loginUser: build.mutation({
      query: (payload) => ({
        url: "/auth/login",
        method: "POST",
        body: payload,
      }),
    }),

    // =====================
    // FORGOT PASSWORD
    // =====================
    forgotPassword: build.mutation({
      query: (payload) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: payload, // { email }
      }),
    }),

    // =====================
    // VERIFY OTP
    // =====================
    verifyOtp: build.mutation({
      query: (payload) => ({
        url: "/auth/verify-reset-password-otp",
        method: "POST",
        body: payload, // { email, otp }
      }),
    }),

    // =====================
    // VERIFY RESET PASSWORD OTP (RESET PASSWORD)
    // =====================
    verifyResetPasswordOtp: build.mutation({
      query: (payload) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: payload, // { email, newPassword, confirmPassword }
      }),
    }),
  }),
});

export const {
  useLoginUserMutation,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useVerifyResetPasswordOtpMutation,
} = authApi;
