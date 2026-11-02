export interface SubCategoryProductsResponse {
  data: SubCategoryProduct[];
}

export interface SubCategoryProduct {
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
  createdAt: string;
  updatedAt: string;
  isTopDeal: boolean;
  topDealFrom: string | null;
  topDealUntil: string | null;

  category: Category;
  subcategory: SubCategory;
  store: Store;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  type: "PRODUCT" | string;
  comment: string;
  createdAt: string;
  updatedAt: string;
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

export interface Store {
  id: string;
  userId: string;
  name: string;
  location: string;
  tags: string[];
  description: string;
  logo: string;
  banner: string;
  phone: string;
  email: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  shopStatus: "PENDING" | "APPROVED" | "REJECTED";
  status: "ONLINE" | "OFFLINE";
  createdAt: string;
  updatedAt: string;
  stripeAccountId: string;
  stripeAccountStatus: "pending" | "active" | "inactive";
}
