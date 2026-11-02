export type CouponValidationRequest = {
  couponCode: string;
  userId: string;
  orderAmount: number;
  storeId: string;
  size?: string;
  color?: string;
};

export type CouponValidationResponse = {
  data: {
    coupon: {
      discountType: "PERCENTAGE" | "FLAT";
      discount: number;
    };
    discountAmount: number;
    finalAmount: number;
    isValid: boolean;
  };
};

export interface Variant {
  id: string;
  productId: string;
  color: string;
  colorCode: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  sizes: Size[];
}

export interface Size {
  id: string;
  variantId: string;
  size: string;
  quantity: number;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}

