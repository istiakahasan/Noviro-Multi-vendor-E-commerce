"use client";

import React, { useState } from "react";
import { Star, TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useGetProductsReviewsQuery,
  useGetServicesReviewsQuery,
  useGetSpecialistReviewsQuery,
  useGetSubscriptionReviewsQuery,
  useGetConsultationReviewsQuery,
} from "@/redux/api/userDashbord/userDashbordApi";
import { ConsultationReviewsList, ProductReviewsList, ServiceReviewsList, SpecialistReviewsList, SubscriptionReviewsList } from "@/redux/api/userDashbord/reviews/Reviewlists";
import EditReviewDialog from "@/redux/api/userDashbord/reviews/Editreviewdialog ";

interface EditReviewState {
  reviewId: string;
  rating: number;
  comment: string;
  type: string;
}

const ReviewsPageComplete = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editReview, setEditReview] = useState<EditReviewState | null>(null);

  // Fetch all review data
  const { data: productsData } = useGetProductsReviewsQuery({});
  const { data: servicesData } = useGetServicesReviewsQuery({});
  const { data: specialistsData } = useGetSpecialistReviewsQuery({});
  const { data: subscriptionsData } = useGetSubscriptionReviewsQuery({});
  const { data: consultationsData } = useGetConsultationReviewsQuery({});

  // Mutations
  //   const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();
  //   const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();

  // Calculate total reviews
  const totalReviews =
    (productsData?.data.pagination.total || 0) +
    (servicesData?.data.pagination.total || 0) +
    (specialistsData?.data.pagination.total || 0) +
    (subscriptionsData?.data.pagination.total || 0) +
    (consultationsData?.data.pagination.total || 0);

  // Calculate average rating
  const calculateAverageRating = () => {
    const allReviews = [
      ...(productsData?.data.reviews || []),
      ...(servicesData?.data.reviews || []),
      ...(specialistsData?.data.reviews || []),
      ...(subscriptionsData?.data.reviews || []),
      ...(consultationsData?.data.reviews || []),
    ];

    if (allReviews.length === 0) return "0.0";

    const totalRating = allReviews.reduce(
      (sum, review) => sum + review.rating,
      0,
    );
    return (totalRating / allReviews.length).toFixed(1);
  };

  // Find review by ID from all data sources
  const findReviewById = (reviewId: string) => {
    const allData = [
      { reviews: productsData?.data.reviews || [], type: "product" },
      { reviews: servicesData?.data.reviews || [], type: "service" },
      { reviews: specialistsData?.data.reviews || [], type: "specialist" },
      { reviews: subscriptionsData?.data.reviews || [], type: "subscription" },
      { reviews: consultationsData?.data.reviews || [], type: "consultation" },
    ];

    for (const { reviews, type } of allData) {
      const review = reviews.find((r: { id: string }) => r.id === reviewId);
      if (review) {
        return { review, type };
      }
    }
    return null;
  };

  // Handle Edit
  const handleEdit = (reviewId: string) => {
    const result = findReviewById(reviewId);
    if (result) {
      const { review, type } = result;
      setEditReview({
        reviewId: review.id,
        rating: review.rating,
        comment: review.comment,
        type,
      });
      setEditDialogOpen(true);
    }
  };

  // Handle Save Edit
  //   const handleSaveEdit = async (reviewId: string, rating: number, comment: string) => {
  //     try {
  //       const result = await updateReview({
  //         reviewId,
  //         rating,
  //         comment
  //       }).unwrap();

  //       toast({
  //         title: 'Success',
  //         description: result.message || 'Your review has been successfully updated.',
  //       });

  //       setEditDialogOpen(false);
  //     } catch (error: any) {
  //       toast({
  //         title: 'Error',
  //         description: error?.data?.message || 'Failed to update review. Please try again.',
  //         variant: 'destructive',
  //       });
  //     }
  //   };

  // Handle Delete
  //   const handleDelete = async (reviewId: string) => {
  //     try {
  //       const result = await deleteReview(reviewId).unwrap();

  //       toast({
  //         title: 'Success',
  //         description: result.message || 'Your review has been successfully deleted.',
  //       });
  //     } catch (error: any) {
  //       toast({
  //         title: 'Error',
  //         description: error?.data?.message || 'Failed to delete review. Please try again.',
  //         variant: 'destructive',
  //       });
  //     }
  //   };

  // Get count for each tab
  const getTabCount = (type: string) => {
    switch (type) {
      case "products":
        return productsData?.data.pagination.total || 0;
      case "services":
        return servicesData?.data.pagination.total || 0;
      case "specialists":
        return specialistsData?.data.pagination.total || 0;
      case "subscriptions":
        return subscriptionsData?.data.pagination.total || 0;
      case "consultations":
        return consultationsData?.data.pagination.total || 0;
      default:
        return 0;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Reviews</h1>
        <p className="text-gray-600">
          Manage and view all your reviews in one place
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReviews}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all categories
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Rating
            </CardTitle>
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateAverageRating()}</div>
            <p className="text-xs text-muted-foreground mt-1">Out of 5.0</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="overflow-x-auto">
          <TabsList className="inline-flex w-full md:w-auto min-w-full mb-6">
            <TabsTrigger value="products" className="flex-1 md:flex-initial">
              <span className="hidden sm:inline">Products</span>
              <span className="sm:hidden">Products</span>
              {getTabCount("products") > 0 && (
                <span className="ml-2 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-full">
                  {getTabCount("products")}
                </span>
              )}
            </TabsTrigger>

            <TabsTrigger value="services" className="flex-1 md:flex-initial">
              <span className="hidden sm:inline">Services</span>
              <span className="sm:hidden">Services</span>
              {getTabCount("services") > 0 && (
                <span className="ml-2 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-full">
                  {getTabCount("services")}
                </span>
              )}
            </TabsTrigger>

            <TabsTrigger value="specialists" className="flex-1 md:flex-initial">
              <span className="hidden sm:inline">Specialists</span>
              <span className="sm:hidden">Specialists</span>
              {getTabCount("specialists") > 0 && (
                <span className="ml-2 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-full">
                  {getTabCount("specialists")}
                </span>
              )}
            </TabsTrigger>

            <TabsTrigger
              value="subscriptions"
              className="flex-1 md:flex-initial"
            >
              <span className="hidden sm:inline">Subscriptions</span>
              <span className="sm:hidden">Subs</span>
              {getTabCount("subscriptions") > 0 && (
                <span className="ml-2 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-full">
                  {getTabCount("subscriptions")}
                </span>
              )}
            </TabsTrigger>

            <TabsTrigger
              value="consultations"
              className="flex-1 md:flex-initial"
            >
              <span className="hidden sm:inline">Consultations</span>
              <span className="sm:hidden">Consult</span>
              {getTabCount("consultations") > 0 && (
                <span className="ml-2 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-full">
                  {getTabCount("consultations")}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="products" className="space-y-4 mt-6">
          <ProductReviewsList onEdit={handleEdit} 
        //   onDelete={handleDelete} 
          />
        </TabsContent>

        <TabsContent value="services" className="space-y-4 mt-6">
          <ServiceReviewsList onEdit={handleEdit}
        //    onDelete={handleDelete} 
           />
        </TabsContent>

        <TabsContent value="specialists" className="space-y-4 mt-6">
          <SpecialistReviewsList onEdit={handleEdit}
        //    onDelete={handleDelete}
            />
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-4 mt-6">
          <SubscriptionReviewsList
            onEdit={handleEdit}
            // onDelete={handleDelete}
          />
        </TabsContent>

        <TabsContent value="consultations" className="space-y-4 mt-6">
          <ConsultationReviewsList
            onEdit={handleEdit}
            // onDelete={handleDelete}
          />
        </TabsContent>
      </Tabs>

      {/* Edit Review Dialog */}
      {editReview && (
        <EditReviewDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          currentRating={editReview.rating}
          currentComment={editReview.comment}
          reviewId={editReview.reviewId}
        //   onSave={handleSaveEdit}
        />
      )}

      {/* Loading Overlay (optional) */}
      {/* {(isUpdating || isDeleting) && ( */}
        {/* <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
              <p className="text-sm font-medium">
                {isUpdating ? "Updating review..." : "Deleting review..."}
              </p>
            </div>
          </div>
        </div> */}
      {/* )} */}
    </div>
  );
};

export default ReviewsPageComplete;
