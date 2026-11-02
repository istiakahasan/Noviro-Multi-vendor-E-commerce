export interface SubscriptionItem {
  id: string;
  userId: string;
  categoryId: string;
  subCategoryId: string;
  storeId: string;
  planName: string;
  amount: number;
  currency: string;
  interval: string;       // e.g., "month"
  intervalCount: number;  // how many cycles per interval
  freeTrialDays: number | null;
  productId: string;
  priceId: string;
  averageRating: number;
  totalReviews: number;
  active: boolean;
  description: string;
  features: string[];
  createdAt: string;   // ISO date string
  updatedAt: string;   // ISO date string
}


export interface CategorySubscriptionResponse {
  success?: boolean;
  message?: string;
  data: SubscriptionItem[];
}
