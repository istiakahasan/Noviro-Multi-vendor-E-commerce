// types/categoryProductResponse.ts

export interface Store {
  id: string;
  name: string;
  logo: string;
  location: string;
}

export interface CategoryInfo {
  id: string;
  name: string;
  type: string;
}

export interface Product {
  id: string;
  storeId: string;
  categoryId: string;
  subCategoryId: string;
  name: string;
  image: string;
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
  createdAt: string;
  updatedAt: string;
  isTopDeal: boolean;
  topDealFrom: string | null;
  topDealUntil: string | null;
  store: Store;
  category: CategoryInfo;
}

export interface CategoryProductData {
  products: Product[];
}

export interface CategoryProductResponse {
  success: boolean;
  message: string;
  data: CategoryProductData;
}
