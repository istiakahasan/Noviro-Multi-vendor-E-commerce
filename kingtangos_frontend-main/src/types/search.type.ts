// searchResults.types.ts

/* ---------- Common Types ---------- */

export type CategoryType = "SERVICE" | "PRODUCT";
export type ConsultationType = "VIDEO" | "IN_PERSON" | "CHAT" | "AUDIO";
export type ConsultationStatus = "AVAILABLE" | "UNAVAILABLE";

export interface Store {
  id: string;
  name: string;
  logo: string;
  location: string;
}

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
}

export interface ServiceType {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  storeId: string;
  categoryId: string;
  name: string;
  image: string;
  price: number;
  description: string;
  subCategoryId: string;
  type: string;
  stockQuantity: number;
  tags: string[];
  barcode: string;
  createdAt: string;
  updatedAt: string;
  isTopDeal: boolean;
  topDealFrom: string | null;
  topDealUntil: string | null;
  store: Store;
  category: Category;
  totalReviews: number;
  averageRating: number;
  discount: number;
  
}

/* ---------- Service ---------- */

export interface Service {
  id: string;
  storeId: string;
  categoryId: string;
  serviceTypeId: string;
  subCategoryId: string;
  name: string;
  profilePic: string;
  price: number;
  description: string;
  duration: string;
  location: string;
  slotDuration: number;
  startDate: string; // ISO date
  endDate: string;   // ISO date
  startTime: string; // ISO datetime
  endTime: string;   // ISO datetime
  tags: string[];
  averageRating: number;
  totalReviews: number;
  totalSlot: number;
  features: string[] | null;
  createdAt: string;
  updatedAt: string;
  store: Store;
  category: Category;
  serviceType: ServiceType;
}

/* ---------- Consultation ---------- */

export interface Consultation {
  id: string;
  storeId: string;
  categoryId: string;
  subCategoryId: string;
  name: string;
  profilePic: string | null;
  price: number;
  description: string;
  duration: string;
  location: string;
  slotDuration: number;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  tags: string[];
  type: ConsultationType;
  averageRating: number;
  totalReviews: number;
  totalSlot: number;
  status: ConsultationStatus;
  createdAt: string;
  updatedAt: string;
  store: Store;
  category: Category;
}

/* ---------- Plan ---------- */
export interface Plan {
  id: string;
  userId: string;
  image: string;
  categoryId: string;
  subCategoryId: string;
  storeId: string;
  planName: string;
  amount: number;
  currency: string;
  interval: string;
  intervalCount: number;
  freeTrialDays: number | null;
  productId: string;
  priceId: string;
  active: boolean;
  averageRating: number;
  totalReviews: number;
  description: string;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

/* ---------- Results ---------- */

export interface SearchResults {
  products: Product[]; 
  plans: Plan[];    
  services: Service[];
  consultations: Consultation[];
}

/* ---------- Pagination ---------- */

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

/* ---------- API Response ---------- */

export interface SearchResponse {
  results: SearchResults;
  pagination: Pagination;
  totalResults: number;
}
