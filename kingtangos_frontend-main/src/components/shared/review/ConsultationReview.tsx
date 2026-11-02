/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Star } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { ConsultationReviewResponse } from "@/types/consultationReview.type";
import { useAddConsultationReviewMutation } from "@/redux/api/consultationsApi";
import ConsultaionReviewModal from "@/components/common/ConsultationReviewModal";

interface ReviewConsultationProps {
  reviews?: ConsultationReviewResponse;
  consultationId: string;
}

export default function ConsultationReview({ reviews, consultationId }: ReviewConsultationProps) {
  const [addReview] = useAddConsultationReviewMutation();

  const handleSubmitReview = async (data: {
    rating: number;
    comment: string;
  }) => {
    try {
      const response = await addReview({
        consultationId,
        rating: data.rating,
        comment: data.comment,
      }).unwrap();

      toast.success("Review submitted successfully!");
      console.log("Review response:", response);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to submit review");
      throw error;
    }
  };

  return (
    <div className="container mx-auto py-6 md:py-10 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
        {/* Review Prompt Section */}
        <Card className="md:col-span-1 w-full border-0 bg-transparent shadow-none">
          <div className="flex flex-col">
            <span className="text-2xl font-semibold text">
              Review this Consultation
            </span>
            <p className="text-gray-500">
              Share your thoughts with other customers
            </p>

            <ConsultaionReviewModal
              consultationId={consultationId}
              onSubmit={handleSubmitReview}
            />

            <div className="border my-3" />
          </div>
        </Card>

        {/* Reviews Section */}
        <Card className="md:col-span-2 w-full border-0 bg-transparent shadow-none">
          <CardHeader className="my-5 p-0">
            <div className="p-0">
              <CardTitle className="text-2xl font-semibold">
                Reviews ({reviews?.data?.reviews?.length || 0})
              </CardTitle>
              <div className="border my-3" />
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="space-y-4">
              {reviews?.data?.reviews && reviews.data.reviews.length > 0 ? (
                reviews.data.reviews.map((review: any) => (
                  <div
                    key={review.id}
                    className="border p-4 bg-white shadow-sm rounded-md"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <Image
                          src={
                            review?.user?.profilePic || "/default-avatar.png"
                          }
                          alt={`${review?.user?.firstName} ${review?.user?.lastName}`}
                          width={40}
                          height={40}
                          className="rounded-full h-5"
                        />
                        <div>
                          <span className="font-medium">
                            {review?.user?.firstName} {review?.user?.lastName}
                          </span>
                          <div className="flex">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {review?.comment}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No reviews yet. Be the first to review this Consultation!
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
