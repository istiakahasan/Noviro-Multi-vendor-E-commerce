export interface ServiceReviewResponse {
  data: {
    reviews: Review[];
  };
}

export interface Review {
  id: string
  userId: string
  serviceId: string
  rating: number
  comment: string
  createdAt: string
  updatedAt: string
  user: ReviewUser
  service: ReviewService
}

export interface ReviewUser {
  id: string
  firstName: string
  lastName: string
  email: string
}

export interface ReviewService {
  id: string
  name: string
  price: number
}
