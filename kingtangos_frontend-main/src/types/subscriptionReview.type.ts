export interface SubscriptionReviewResponse {
  data: {
    reviews: Review[];
    pagination: Pagination;
  };
}

export interface Review {
  id: string;
  userId: string;
  subscriptionId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user: ReviewUser;
}

export interface ReviewUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}
