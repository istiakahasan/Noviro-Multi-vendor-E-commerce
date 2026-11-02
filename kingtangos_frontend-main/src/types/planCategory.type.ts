// subscription.types.ts

export interface SubscriptionPlan {
  id: string;
  userId: string;
  categoryId: string;
  subCategoryId: string;
  storeId: string;

  planName: string;
  description: string;

  amount: number;
  currency: string; // e.g. "usd"
  interval: "day" | "week" | "month" | "year";
  intervalCount: number;
  freeTrialDays: number | null;

  productId: string;
  priceId: string;

  averageRating: number;
  totalReviews: number;
  active: boolean;

  features: string[];
  image: string;

  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface PlanCategoryResponse {
  data: SubscriptionPlan[];
}
