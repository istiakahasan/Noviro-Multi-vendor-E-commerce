export interface OrderItemProduct {
  id: string;
  name: string;
  image: string;
  price: number;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  totalPrice: number;
  product: OrderItemProduct;
}

export interface ShippingAddress {
  id: string;
  fullName: string;
  country: string;
  phone: string;
  city: string;
  postalCode: string;
  address: string;
}

export interface Order {
  id: string;
  createdAt: string;
  totalAmount: number;
  orderStatus: string;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface OrdersResponse {
  orders: Order[];
  pagination: Pagination;
}
