import { baseApi } from "@/redux/api/baseApi";
import { CouponValidationRequest, CouponValidationResponse } from "@/types/couponValidate.type";
import { CouponListResponse } from "@/types/storeAllCoupon.type";

export const plansApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({

    createCouponValidate: builder.mutation<
      CouponValidationResponse,
      CouponValidationRequest
    >({
      query: (data) => ({
        url: "/coupon/validate",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Coupon"],
    }),

    getAllCouponByStoreId: builder.query<CouponListResponse, string>({
      query: (id) => ({
        url: `/coupon/storeAllCoupon/${id}`,
        method: "GET",
      }),
      providesTags: ["Coupon"],
    }),

  }),
});

export const {
  useCreateCouponValidateMutation,
  useGetAllCouponByStoreIdQuery,
} = plansApi;
