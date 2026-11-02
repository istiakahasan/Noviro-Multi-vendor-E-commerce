export interface ConsultationReviewResponse {
  data: {
    reviews: Review[];
  };
}

export interface Review {
  id: string
  userId: string
  consultationId: string
  rating: number
  comment: string
  createdAt: string
  updatedAt: string
  user: ReviewUser
  consultation: ReviewConsultation
}

export interface ReviewUser {
  id: string
  firstName: string
  lastName: string
  email: string
}

export interface ReviewConsultation {
  id: string
  name: string
  price: number
}

