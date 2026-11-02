export interface SponsoredProductResponse {
  data: SponsoredProduct[];
}

export interface SponsoredProduct {
  id: string;
  storeId: string;
  productId: string;
  adminId: string;
  status: "APPROVED" | "PENDING" | "REJECTED";
  isActive: boolean;
  pricePerHour: number;
  totalDays: number;
  totalPrice: number;
  stripePaymentIntentId: string;
  stripeClientSecret: string;
  isPaid: boolean;
  paidAt: string | null;
  pausedAt: string | null;
  image: string;
  startDate: string;
  endDate: string;
  cancelledAt: string | null;
  impressions: number;
  clicks: number;
  createdAt: string;
  updatedAt: string;
  product: Product;
  store: Store;
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
  shopStatus: "APPROVED" | "PENDING" | "REJECTED";
  status: "ONLINE" | "OFFLINE";
  createdAt: string;
  updatedAt: string;
  stripeAccountId: string;
  stripeAccountStatus: string;
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