// types/review.ts
export interface Review {
  id: string;
  name: string;
  service?: string;
  review?: string;
  comment: string;
  date: string;
  rating: number;
  avatar?: string;
  likes?: number;
  replied?: boolean;
  replyText?: string;
}
