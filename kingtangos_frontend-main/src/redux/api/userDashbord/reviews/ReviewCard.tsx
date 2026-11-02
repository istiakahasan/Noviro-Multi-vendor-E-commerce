"use client";

import React from "react";
import { Star, Edit, Trash2, Package, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatDistanceToNow } from "date-fns";
import {
  ConsultationReview,
  ProductReview,
  ReviewType,
  ServiceReview,
  SpecialistReview,
  SubscriptionReview,
} from "@/types/reviews-types";
import Image from "next/image";

interface ReviewCardProps {
  review:
    | ProductReview
    | ServiceReview
    | SpecialistReview
    | SubscriptionReview
    | ConsultationReview;
  type: ReviewType;
  onEdit?: (reviewId: string) => void;
  onDelete?: (reviewId: string) => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  type,
  onEdit,
  onDelete,
}) => {
  // Get item details based on review type
  const getItemDetails = () => {
    switch (type) {
      case "product":
      case "service":
      case "specialist":
        const productReview = review as ProductReview;
        return {
          name: productReview?.product?.name,
          image: productReview?.product?.image,
          subtitle: productReview?.product?.store?.name,
          icon: <Package className="w-4 h-4" />,
        };
      case "subscription":
        const subscriptionReview = review as SubscriptionReview;
        return {
          name: subscriptionReview.plan.planName,
          image: subscriptionReview.plan.image,
          subtitle: `$${subscriptionReview.plan.amount}/${subscriptionReview.plan.interval}`,
          icon: <Calendar className="w-4 h-4" />,
        };
      case "consultation":
        const consultationReview = review as ConsultationReview;
        return {
          name: consultationReview.consultation.name,
          image: consultationReview.consultation.profilePic || "",
          subtitle: consultationReview.consultation.location,
          icon: <User className="w-4 h-4" />,
        };
      default:
        return {
          name: "",
          image: "",
          subtitle: "",
          icon: null,
        };
    }
  };

  const itemDetails = getItemDetails();
  const userInitials = `${review.user.firstName[0]}${review.user.lastName[0]}`;
  const formattedDate = formatDistanceToNow(new Date(review.createdAt), {
    addSuffix: true,
  });

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={`w-4 h-4 ${
              index < rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium text-gray-700">
          {rating}.0
        </span>
      </div>
    );
  };

  const getReviewTypeBadge = () => {
    const badges: Record<
      ReviewType,
      { label: string; variant: "default" | "secondary" | "outline" }
    > = {
      product: { label: "Product", variant: "default" },
      service: { label: "Service", variant: "secondary" },
      specialist: { label: "Specialist", variant: "outline" },
      subscription: { label: "Subscription", variant: "default" },
      consultation: { label: "Consultation", variant: "secondary" },
    };

    const badge = badges[type];
    return <Badge variant={badge.variant}>{badge.label}</Badge>;
  };

  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="space-y-4">
        {/* User Info and Rating */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-cyan-400 text-white font-semibold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-gray-900">
                  {review.user.firstName} {review.user.lastName}
                </h3>
                {getReviewTypeBadge()}
              </div>
              <p className="text-sm text-gray-500">{formattedDate}</p>
            </div>
          </div>
          {renderStars(review.rating)}
        </div>

        {/* Item Details */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          {itemDetails.image ? (
            <Image
              src={itemDetails.image}
              alt={itemDetails.name}
              width={32}
              height={32}
              className="w-16 h-16 rounded-md object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-md bg-gray-200 flex items-center justify-center">
              {itemDetails.icon}
            </div>
          )}
          <div className="flex-1">
            <h4 className="font-medium text-gray-900">{itemDetails.name}</h4>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              {itemDetails.icon}
              <span>{itemDetails.subtitle}</span>
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Comment */}
        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
      </CardContent>

      <CardFooter className="flex gap-2 border-t pt-4">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => onEdit?.(review.id)}
        >
          <Edit className="w-4 h-4" />
          Edit
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Review</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this review? This action cannot
                be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete?.(review.id)}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default ReviewCard;
