// product.types.ts

export interface YouMayLikeProductResponse {
  data: {
    products: Product[];
    pagination: Pagination;
  };
}

/* ===================== PRODUCT ===================== */

export interface Product {
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
  variants: Variant[];
  store: Store;
  category: Category;
}

/* ===================== STORE ===================== */

export interface Store {
  id: string;
  name: string;
  logo: string;
  location: string;
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


/* ===================== CATEGORY ===================== */

export interface Category {
  id: string;
  name: string;
  type: "PRODUCT" | string;
}

/* ===================== PAGINATION ===================== */

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}
