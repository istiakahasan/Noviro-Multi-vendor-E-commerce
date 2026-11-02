// Store
export interface StoreInfo {
  id: string;
  name: string;
  logo: string;
}

// Product
export interface CartProduct {
  id: string;
  storeId: string;
  categoryId: string;
  subCategoryId: string;
  name: string;
  images: string[];
  price: number;
  description: string;
  type: string;
  stockQuantity: number;
  discount: number;
  finalPrice: number;
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
  store: StoreInfo;
}

// Cart Item
export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product: CartProduct;
  variant: Variant[];
}

// API response wrapper
export interface CartItemResponse {
  data: CartItem;
}


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
