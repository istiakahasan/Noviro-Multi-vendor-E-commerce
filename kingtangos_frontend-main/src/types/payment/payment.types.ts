// order.types.ts

export interface ApiResponse {
  success: boolean;
  message: string;
  data: OrderResponseData;
}

export interface OrderResponseData {
  order: Order;
  paymentUrl: string;
  sessionId: string;
}

export interface Order {
  id: string;
  userId: string;
  shippingId: string;
  totalAmount: number;
  shippingCost: number;
  paymentMethod: "stripe" | string;
  couponId: string | null;
  orderStatus: "PENDING" | "PAID" | "CANCELLED" | string;
  paymentStatus: "PENDING" | "PAID" | "FAILED" | string;

  commissionAmount: number | null;
  commissionPaid: boolean;
  commissionPercent: number | null;
  vendorAmount: number | null;
  commissionPaidAt: string | null;

  createdAt: string;
  updatedAt: string;

  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  user: OrderUser;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  totalPrice: number;
  product: Product;
}

export interface Product {
  id: string;
  storeId: string;
  categoryId: string;
  subCategoryId: string;

  name: string;
  description: string;
  images: string[];

  price: number;
  discount: number;
  finalPrice: number;

  stockQuantity: number;
  type: string;

  averageRating: number;
  totalReviews: number;

  tags: string[];
  barcode: string;

  sponsored: boolean;
  isTopDeal: boolean;
  topDealFrom: string | null;
  topDealUntil: string | null;

  createdAt: string;
  updatedAt: string;

  store: Store;
}

export interface Store {
  id: string;
  name: string;
  logo: string;
}

export interface ShippingAddress {
  id: string;
  userId: string;
  fullName: string;
  country: string;
  phone: string;
  city: string;
  state: string | null;
  postalCode: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderUser {
  id: string;
  firstName: string;
  email: string;
}
