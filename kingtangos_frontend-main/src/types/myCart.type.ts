// Store info
export interface CartStore {
  id: string;
  name: string;
  logo: string;
}

// Category info
export interface CartCategory {
  id: string;
  name: string;
}

// Product info inside cart
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
  store: CartStore;
  category: CartCategory;
}

// Single cart item
export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product: CartProduct;
  variant: Variant;
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


// API response for GET /cart-item/my
export interface MyCartResponse {
  data: {
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
  };
}
