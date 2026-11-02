export type Currency = "€" | "bdt" | "eur" | "inr" | string;
export type Interval = "day" | "week" | "month" | "year" | string;

export interface SubscriptionDetails {
  id: string;
  userId: string;
  categoryId: string;
  subCategoryId: string;
  storeId: string;
  planName: string;
  amount: number;
  currency: Currency;
  interval: Interval;
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

export interface SubscriptionDetailsResponse {
  data: SubscriptionDetails | undefined;
}
