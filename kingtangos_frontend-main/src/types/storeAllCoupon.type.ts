// coupon.types.ts

export type DiscountType = "PERCENTAGE" | "FLAT";

export interface Coupon {
  id: string;
  storeId: string;
  couponCode: string;
  discountType: DiscountType;
  discount: number;
  minimumOrderAmount: number;
  maximumOrderAmount: number;
  maximumDiscountAmount: number | null;
  limitForSingleUser: number;
  startDate: string;   // ISO date string
  expireDate: string;  // ISO date string
  startTime: string;   // HH:mm
  expireTime: string;  // HH:mm
  tags: string[];
  barcode: string | null;
  createdAt: string;   // ISO date string
  updatedAt: string;   // ISO date string
}

export interface CouponListResponse {
  data: Coupon[];
}
