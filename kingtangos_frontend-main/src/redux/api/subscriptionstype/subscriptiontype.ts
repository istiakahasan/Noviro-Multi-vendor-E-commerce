export interface CreateSubscriptionResponse {
  success: boolean;
  message: string;
  data: {
    subscription: Subscription;
    clientSecret: string | null;
    paymentIntentId: string | null;
    subscriptionId: string;
    planType: string;
    planDetails: PlanDetails;
  };
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  currentPeriodStart: string; // ISO Date
  currentPeriodEnd: string; // ISO Date
  status: "INCOMPLETE" | "ACTIVE" | "CANCELED" | "PAST_DUE" | string;
  cancelAtPeriodEnd: boolean;
  lastPaymentDate: string | null;
  nextPaymentDate: string | null;
  renewalAttempts: number;
  autoRenew: boolean;
  startDate: string; // ISO Date
  endDate: string; // ISO Date
  amount: number;
  stripePaymentId: string | null;
  paymentStatus: "PENDING" | "PAID" | "FAILED" | string;
  description: string | null;
  benefitsIncluded: string[] | null;
  isActive: boolean;
  commissionAmount: number | null;
  commissionPaid: boolean;
  createdAt: string; // ISO Date
  updatedAt: string; // ISO Date
}

export interface PlanDetails {
  id: string;
  userId: string;
  categoryId: string;
  subCategoryId: string;
  storeId: string;
  planName: string;
  amount: number;
  currency: string;
  interval: "day" | "week" | "month" | "year" | string;
  intervalCount: number;
  freeTrialDays: number | null;
  productId: string;
  priceId: string;
  averageRating: number;
  totalReviews: number;
  active: boolean;
  description: string;
  features: string[];
  createdAt: string; // ISO Date
  updatedAt: string; // ISO Date
  image: string;
  status: string;
}
