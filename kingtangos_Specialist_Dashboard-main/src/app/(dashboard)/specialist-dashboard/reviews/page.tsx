"use client";

import { useGetAllReviewsForSpecialistQuery } from "@/lib/api/reviewsAndRatings/reviewsApi";
import RatingDistribution from "./_components/RatingDistribution";
import RatingSummary from "./_components/RatingSummary";
import ReviewList from "./_components/ReviewList";
import PageLoading from "@/components/ui/Loading";

export default function ReviewsPage() {
  const { data, isLoading } = useGetAllReviewsForSpecialistQuery({
    page: 1,
    limit: 10,
  });

  const reviews = data?.data.reviews || [];
  const averageRating = reviews[0]?.specialist?.averageRating || 0;
  const totalReviews = reviews.length;
  const distribution = data?.data.ratings || {
    "1": 0,
    "2": 0,
    "3": 0,
    "4": 0,
    "5": 0,
  };

  if (isLoading) {
    return <PageLoading />;
  }

  return (
    <div className="min-h-[calc(100vh-150px)] max-w-7xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Reviews & Ratings
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage and respond to customer feedback
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <RatingSummary average={averageRating} totalReviews={totalReviews} />
        <RatingDistribution distribution={distribution} />
      </div>

      <ReviewList />
    </div>
  );
}
