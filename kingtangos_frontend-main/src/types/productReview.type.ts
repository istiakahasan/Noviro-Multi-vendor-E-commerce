// types/productReviews.type.ts

export interface ProductReviewsResponse {
  data: {
    reviews: Review[];
    pagination: Pagination;
  };
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user: User;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePic: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}
