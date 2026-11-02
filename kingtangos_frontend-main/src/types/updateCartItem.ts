export interface UpdateCartItemResponse {
  data: CartItem;
}

export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product: Product;
}

export interface Product {
  id: string;
  storeId: string;
  categoryId: string;
  subCategoryId: string;
  name: string;
  images: string[];
  price: number;
  finalPrice: number;
  discount: number;
  description: string;
  type: string;
  stockQuantity: number;
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
