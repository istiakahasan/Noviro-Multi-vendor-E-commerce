"use client";

import React from 'react';
import { Loader2, PackageX } from 'lucide-react';
import ReviewCard from './ReviewCard';
import {
  useGetProductsReviewsQuery,
  useGetServicesReviewsQuery,
  useGetSpecialistReviewsQuery,
  useGetSubscriptionReviewsQuery,
  useGetConsultationReviewsQuery,
} from '@/redux/api/userDashbord/userDashbordApi';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Review } from '@/types/reviews-types';

interface ReviewListProps {
  onEdit?: (reviewId: string) => void;
  onDelete?: (reviewId: string) => void;
}

// Loading Component
const LoadingState = () => (
  <div className="flex items-center justify-center py-12">
    <div className="flex flex-col items-center gap-3">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      <p className="text-sm text-gray-600">Loading reviews...</p>
    </div>
  </div>
);

// Empty State Component
const EmptyState = ({ type }: { type: string }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <PackageX className="w-16 h-16 text-gray-300 mb-4" />
    <h3 className="text-lg font-semibold text-gray-900 mb-2">No {type} reviews yet</h3>
    <p className="text-sm text-gray-600">You haven&apos;t reviewed any {type.toLowerCase()} yet.</p>
  </div>
);

// Error State Component
const ErrorState = ({ message }: { message?: string }) => (
  <Alert variant="destructive">
    <AlertDescription>
      {message || 'Failed to load reviews. Please try again later.'}
    </AlertDescription>
  </Alert>
);

// Product Reviews Tab
export const ProductReviewsList: React.FC<ReviewListProps> = ({ onEdit, onDelete }) => {
  const { data, isLoading, error } = useGetProductsReviewsQuery({});

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState />;
  if (!data?.data.reviews.length) return <EmptyState type="Product" />;

  return (
    <div className="grid gap-6">
      {data.data.reviews.map((review:Review) => (
        <ReviewCard
          key={review.id}
          review={review}
          type="product"
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

// Service Reviews Tab
export const ServiceReviewsList: React.FC<ReviewListProps> = ({ onEdit, onDelete }) => {
  const { data, isLoading, error } = useGetServicesReviewsQuery({});

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState />;
  if (!data?.data.reviews.length) return <EmptyState type="Service" />;

  return (
    <div className="grid gap-6">
      {data.data.reviews.map((review:Review) => (
        <ReviewCard
          key={review.id}
          review={review}
          type="service"
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

// Specialist Reviews Tab
export const SpecialistReviewsList: React.FC<ReviewListProps> = ({ onEdit, onDelete }) => {
  const { data, isLoading, error } = useGetSpecialistReviewsQuery({});

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState />;
  if (!data?.data.reviews.length) return <EmptyState type="Specialist" />;

  return (
    <div className="grid gap-6">
      {data.data.reviews.map((review:Review) => (
        <ReviewCard
          key={review.id}
          review={review}
          type="specialist"
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

// Subscription Reviews Tab
export const SubscriptionReviewsList: React.FC<ReviewListProps> = ({ onEdit, onDelete }) => {
  const { data, isLoading, error } = useGetSubscriptionReviewsQuery({});

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState />;
  if (!data?.data.reviews.length) return <EmptyState type="Subscription" />;

  return (
    <div className="grid gap-6">
      {data.data.reviews.map((review:Review) => (
        <ReviewCard
          key={review.id}
          review={review}
          type="subscription"
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

// Consultation Reviews Tab
export const ConsultationReviewsList: React.FC<ReviewListProps> = ({ onEdit, onDelete }) => {
  const { data, isLoading, error } = useGetConsultationReviewsQuery({});

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState />;
  if (!data?.data.reviews.length) return <EmptyState type="Consultation" />;

  return (
    <div className="grid gap-6">
      {data.data.reviews.map((review:Review) => (
        <ReviewCard
          key={review.id}
          review={review}
          type="consultation"
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};