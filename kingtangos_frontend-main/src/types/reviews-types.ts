// Base types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Store {
  id: string;
  name: string;
}

// Product Review Types
export interface Product {
  id: string;
  name: string;
  image: string;
  store: Store;
}

export interface ProductReview {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  product: Product;
}

// Service & Specialist Review Types (same structure as product)
export type ServiceReview = ProductReview;
export type SpecialistReview = ProductReview;

// Subscription Review Types
export interface SubscriptionPlan {
  id: string;
  userId: string;
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
  averageRating: number;
  totalReviews: number;
  active: boolean;
  description: string;
  features: string[];
  createdAt: string;
  updatedAt: string;
  image: string;
}

export interface SubscriptionReview {
  id: string;
  userId: string;
  subscriptionId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  plan: SubscriptionPlan;
}

// Consultation Review Types
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
  type: string;
  averageRating: number;
  totalReviews: number;
  totalSlot: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConsultationReview {
  id: string;
  userId: string;
  consultationId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  consultation: Consultation;
}

// Union type for all reviews
export type Review = 
  | ProductReview 
  | ServiceReview 
  | SpecialistReview 
  | SubscriptionReview 
  | ConsultationReview;

// API Response Types
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ReviewsResponse<T> {
  success: boolean;
  message: string;
  data: {
    reviews: T[];
    pagination: Pagination;
  };
}

// Review Type Enum
export type ReviewType = 'product' | 'service' | 'specialist' | 'subscription' | 'consultation';