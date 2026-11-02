/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Star } from 'lucide-react'
import Image from 'next/image';
import { ServiceReviewResponse } from '@/types/serviceReview.type';
import { toast } from 'sonner';
import { useAddServiceReviewMutation } from '@/redux/api/servicesApi';
import ServiceReviewModal from '@/components/common/ServiceReviewModal';


interface ReviewServiceProps {
    reviews?: ServiceReviewResponse;
    serviceId: string;
}

export default function ServiceReview({ reviews, serviceId }: ReviewServiceProps) {
    const [addReview] = useAddServiceReviewMutation();

    const handleSubmitReview = async (data: { rating: number; comment: string }) => {
        try {
            const response = await addReview({
                serviceId,
                rating: data.rating,
                comment: data.comment,
            }).unwrap();

            toast.success('Review submitted successfully!');
            console.log('Review response:', response);
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to submit review');
            throw error;
        }
    };

    return (
        <div className="md:container mx-auto py-6 md:py-10 md:px-4 px-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
                {/* Review Prompt Section */}
                <Card className="md:col-span-1 w-full border-0 bg-transparent shadow-none">
                    <div className="flex flex-col">
                        <span className="lg:text-2xl md:text-xl text-lg font-semibold text">Review this Service</span>
                        <p className="text-gray-500 md:text-base text-sm">Share your thoughts with other customers</p>
                        
                        <ServiceReviewModal 
                            serviceId={serviceId}
                            onSubmit={handleSubmitReview}
                        />
                        
                        <div className="border my-3" />
                    </div>
                </Card>

                {/* Reviews Section */}
                <Card className="md:col-span-2 w-full border-0 bg-transparent shadow-none">
                    <CardHeader className="my-5 p-0">
                        <div className="p-0">
                            <CardTitle className="lg:text-2xl md:text-xl text-lg font-semibold">
                                Reviews ({reviews?.data?.reviews?.length || 0})
                            </CardTitle>
                            <div className="border my-3" />
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        <div className="space-y-4">
                            {reviews?.data?.reviews && reviews.data.reviews.length > 0 ? (
                                reviews.data.reviews.map((review: any) => (
                                    <div key={review.id} className="border p-4 bg-white shadow-sm rounded-md">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <div className="flex items-center gap-2">
                                                <Image
                                                    src={review?.user?.profilePic || "/default-avatar.png"}
                                                    alt={`${review?.user?.firstName} ${review?.user?.lastName}`}
                                                    width={40}
                                                    height={40}
                                                    className="rounded-full h-16 w-16 object-cover"
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
                                                                        ? 'text-yellow-400 fill-yellow-400' 
                                                                        : 'text-gray-300'
                                                                }`}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-2">{review?.comment}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    No reviews yet. Be the first to review this Service!
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}