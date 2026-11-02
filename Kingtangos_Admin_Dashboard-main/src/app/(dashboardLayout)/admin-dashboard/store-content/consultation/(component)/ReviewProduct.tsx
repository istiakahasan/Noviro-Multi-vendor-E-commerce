import React from 'react'

import { Star } from 'lucide-react'

import Image from 'next/image';
import { ProductReviewsResponse } from '@/types/consultationTypes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ReviewProductProps {
    reviews?: ProductReviewsResponse;
}

export default function ReviewProduct({ reviews }: ReviewProductProps) {

    return (
        <div className="container mx-auto py-6 md:py-10 px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
                {/* Review Prompt Section */}
                <Card className="md:col-span-1 w-full border-0 bg-transparent shadow-none">
                    <div className="flex flex-col">
                        <span className="text-2xl font-semibold text">Review this product</span>
                        <p className="text-gray-500">Share your thoughts with other customers</p>
                        <Button className="rounded-xl py-5 text-primary bg-transparent border border-primary shadow-none mt-2" variant="outline">
                            Write a customer review
                        </Button>
                        <div className="border my-3" />
                    </div>
                </Card>

                {/* Reviews Section */}
                <Card className="md:col-span-2 w-full border-0 bg-transparent shadow-none">
                    <CardHeader className="my-5 p-0">
                        <div className="p-0">
                            <CardTitle className="text-2xl font-semibold">Reviews ({reviews?.data?.reviews.length})</CardTitle>
                            <div className="border my-3" />
                            {/* <div className="flex items-center gap-2 text-muted-foreground">
                                {Array.from({ length: 5 }, (_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                ))}
                                <span>4.9</span>
                            </div> */}
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        <div className="space-y-4">
                            {reviews?.data.reviews.map((review) => (
                                <div key={review.id} className="border p-4 bg-white shadow-sm rounded-md">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <div className="flex items-center gap-2">
                                            <Image
                                                src={review?.user?.profilePic || "/default-avatar.png"}
                                                alt={`${review?.user?.firstName} ${review?.user?.lastName}`}
                                                width={40}
                                                height={40}
                                                className="rounded-full"
                                            />
                                            <div>
                                                <span className="font-medium">{review?.user?.firstName} {review?.user?.lastName}</span>
                                                <div className="flex">
                                                    {Array.from({ length: review.rating }, (_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    <p className="text-sm text-muted-foreground mt-2">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>

    )
}
