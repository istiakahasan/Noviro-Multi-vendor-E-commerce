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

export interface PlansResponse {
  data: Plan[];
}
