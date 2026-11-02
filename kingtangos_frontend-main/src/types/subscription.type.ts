// subscription.types.ts

export interface SubscriptionResponse {
  data: Subscription[];
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  startDate: string;
  endDate: string;
  amount: number;
  stripePaymentId: string;
  paymentStatus: "PENDING" | "COMPLETED" | "FAILED";
  description: string | null;
  benefitsIncluded: string | null;
  commissionAmount: number | null;
  commissionPaid: boolean;
  createdAt: string;
  updatedAt: string;
  user: User;
  plan: Plan;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePic: string;
  role: "SUPER_ADMIN" | "USER" | string;
  isSubscribed: boolean;
  planExpiration: string | null;
}

export interface Plan {
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
