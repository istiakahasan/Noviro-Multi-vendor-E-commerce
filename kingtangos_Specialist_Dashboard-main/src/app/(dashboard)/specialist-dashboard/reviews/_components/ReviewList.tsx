"use client";

import { useGetAllReviewsForSpecialistQuery } from "@/lib/api/reviewsAndRatings/reviewsApi";
import { Star } from "lucide-react";
import { useMemo, useState } from "react";
import ReviewCard from "./ReviewCard";

export default function ReviewList() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<{
    rating: "all" | number;
    search: string;
  }>({
    rating: "all",
    search: "",
  });
  const perPage = 10;

  const { data, isLoading, isFetching } = useGetAllReviewsForSpecialistQuery({
    page,
    limit: perPage,
  });

  const reviews = data?.data.reviews || [];
  const ratings = data?.data.ratings || {};
  const totalPages = data?.data.pagination?.pages || 1;

  const filteredReviews = useMemo(() => {
    let list = [...reviews];

    if (filters.rating !== "all") {
      list = list.filter((r) => r.rating === filters.rating);
    }

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (r) =>
          `${r.user.firstName} ${r.user.lastName}`.toLowerCase().includes(q) ||
          r.comment.toLowerCase().includes(q),
      );
    }

    return list;
  }, [reviews, filters]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-50 border border-gray-200 rounded-xl p-6 animate-pulse"
          >
            <div className="flex gap-5">
              <div className="w-12 h-12 bg-gray-300 rounded-full" />
              <div className="flex-1">
                <div className="h-5 w-40 bg-gray-300 rounded mb-2" />
                <div className="h-4 w-24 bg-gray-200 rounded mb-4" />
                <div className="h-20 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-gray-700">
            Filter by rating:
          </span>
          {["all", 5, 4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  rating: rating as "all" | number,
                }))
              }
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filters.rating === rating
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {rating === "all" ? (
                "All Reviews"
              ) : (
                <span className="flex items-center gap-1">
                  {rating}{" "}
                  <Star size={14} className="fill-yellow-400 text-yellow-400" />
                  {ratings[rating] > 0 && (
                    <span className="ml-1 text-xs">({ratings[rating]})</span>
                  )}
                </span>
              )}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search reviews..."
          value={filters.search}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, search: e.target.value }))
          }
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black w-full sm:w-64"
        />
      </div>

      <div className="space-y-6">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-16 text-gray-500 text-lg">
            {filters.rating !== "all" || filters.search
              ? "No reviews match your filters."
              : "No reviews yet. Be the first to get reviewed!"}
          </div>
        ) : (
          filteredReviews.map((review) => (
            <ReviewCard
              key={review.id}
              id={review.id}
              user={review.user}
              rating={review.rating}
              comment={review.comment}
              createdAt={review.createdAt}
              reviewReply={review.reviewReply}
            />
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-10">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || isFetching}
            className="px-6 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition font-medium"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600 font-medium">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || isFetching}
            className="px-6 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition font-medium"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
