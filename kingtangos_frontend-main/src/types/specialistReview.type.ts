// serviceReviews.types.ts

export interface SpecialistReviewsResponse {
  data: {
    specialistId: string;
    type: string | undefined;
    serviceReviews: {
      reviews: Review[];
      pagination: Pagination;
    };
    consultationReviews: {
      reviews: Review[];
      pagination: Pagination;
    };
  };
}

export interface Review {
  id: string;
  userId: string;
  serviceId: string;
  rating: number;
  comment: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  user: User;
  service: Service;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}
