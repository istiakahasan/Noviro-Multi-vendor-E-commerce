// products.types.ts

export interface ProductsResponse {
  data: ProductsData;
}

export interface ProductsData {
  products: Product[];
  pagination: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface Product {
  id: string;
  storeId: string;
  categoryId: string;
  subCategoryId: string;
  name: string;
  price: number;
  description: string;
  type: string;
  images: string[];
  hasVariants: boolean;
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
  status: string;

  store: Store;
  category: Category;
  subcategory: SubCategory;
  variants: Variant[];
}

export interface Store {
  id: string;
  name: string;
  logo: string;
  shopStatus: string;
  status: string;
}

export interface Category {
  id: string;
  name: string;
  type: string;
}

export interface SubCategory {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  slug: string;
  image: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Variant {
  id: string;
  productId: string;
  color: string;
  colorCode: string | null;
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