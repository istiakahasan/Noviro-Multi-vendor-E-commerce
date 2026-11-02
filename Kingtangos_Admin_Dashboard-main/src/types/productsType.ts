export interface ProductsResponse {
  data: Data;
}
 
export interface Data {
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
  status: "approved" | "pending" | "rejected";
  store: Store;
  category: Category;
  subcategory: SubCategory;
  variants: Variant[];
}
 
export interface Store {
  id: string;
  name: string;
  logo: string;
  shopStatus: "APPROVED" | "PENDING" | "REJECTED";
  status: "ONLINE" | "OFFLINE";
}
 
export interface Category {
  id: string;
  name: string;
  type: "PRODUCT" | "SERVICE";
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