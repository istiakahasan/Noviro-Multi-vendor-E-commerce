// Main response interface
// export interface ProductDetailsResponse {
//   success: boolean;
//   message: string;
//   data: Product;
// }

// // Product interface
// export interface Product {
//   id: string;
//   storeId: string;
//   categoryId: string;
//   name: string;
//   images: string;
//   price: number;
//   description: string;
//   subCategoryId: string;
//   type: string;
//   stockQuantity: number;
//   discount: number;
//   finalPrice: number;
//   averageRating: number;
//   totalReviews: number;
//   tags: string[];
//   barcode: string;
//   sponsored: boolean;
//   createdAt: string;
//   updatedAt: string;
//   isTopDeal: boolean;
//   topDealFrom: string | null;
//   topDealUntil: string | null;
//   store: Store;
//   category: Category;
//   subcategory: Subcategory;
//   review: Review[]; // New review array
// }

// // Review interface
// export interface Review {
//   id: string;
//   userId: string;
//   productId: string;
//   rating: number;
//   comment: string;
//   createdAt: string;
//   updatedAt: string;
// }

// // Store interface
// interface Store {
//   id: string;
//   name: string;
//   logo: string;
//   location: string;
//   phone: string;
//   email: string;
//   shopStatus: string;
//   status: string;
// }

// // Category interface
// interface Category {
//   id: string;
//   name: string;
//   type: string;
// }

// // Subcategory interface
// interface Subcategory {
//   id: string;
//   name: string;
//   description: string;
//   categoryId: string;
//   slug: string;
//   image: string;
//   isActive: boolean;
//   sortOrder: number;
//   createdAt: string;
//   updatedAt: string;
// }

export interface ProductDetailsResponse {
  data: Product;
}

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
  review: Review[];
}

export interface Store {
  id: string;
  name: string;
  logo: string;
  location: string;
  phone: string;
  email: string;
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

export interface Review {
  id?: string;
  userId?: string;
  rating?: number;
  comment?: string;
  createdAt?: string;
}
