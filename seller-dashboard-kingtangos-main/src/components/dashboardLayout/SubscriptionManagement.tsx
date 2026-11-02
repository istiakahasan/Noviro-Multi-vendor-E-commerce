/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Eye, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { CustomPagination } from "../shared/CustomPagination";
import {
  useDeleteSubscriptionPlanMutation,
  useGetAllSubscriptionPlanQuery,
} from "@/redux/api/subscriptionApi/subscriptionApi";
import Image from "next/image";

interface Subscription {
  id: string | number;
  name: string;
  avatar: string;
  type: string;
  subscriber: string;
  renewalStatus: "Auto" | "Manual";
  price: string;
  activeSubscribers?: number;
  autoRenew?: boolean;
  status: "approved" | "pending" | "rejected";
  interval: string;
  description?: string;
  averageRating?: number;
  totalReviews?: number;
}

interface ApiSubscription {
  id: string | number;
  planName?: string;
  image?: string;
  status?: "approved" | "pending" | "rejected";
  amount?: number | string;
  interval?: string;
  intervalCount?: number;
  active?: boolean;
  description?: string;
  averageRating?: number;
  totalReviews?: number;
  category?: {
    name?: string;
  };
}

export default function SubscriptionManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedSubscriptionPlan, setSelectedSubscriptionPlan] =
    useState<Subscription | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const {
    data: subscriptionData,
    isLoading,
    error,
    refetch,
  } = useGetAllSubscriptionPlanQuery({
    page: currentPage,
    limit: itemsPerPage,
  });

  const [deleteSubscriptionPlan] = useDeleteSubscriptionPlanMutation();

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
      case "active":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "rejected":
      case "inactive":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getRenewalStatusColor = (status: string) => {
    if (status === "Auto") {
      return "bg-green-100 text-green-700";
    }
    return "bg-gray-100 text-gray-700";
  };

  // Transform API data to component format
  const transformedSubscriptions = useMemo((): Subscription[] => {
    // Handle different response structures
    let subscriptions: ApiSubscription[] = [];
    
    if (subscriptionData?.data) {
      // If data is an array directly
      if (Array.isArray(subscriptionData.data)) {
        subscriptions = subscriptionData.data;
      } 
      // If data has a nested data property
      else if (subscriptionData.data.data && Array.isArray(subscriptionData.data.data)) {
        subscriptions = subscriptionData.data.data;
      }
    }

    return subscriptions.map((subscription: ApiSubscription) => ({
      id: subscription.id,
      name: subscription.planName || "Unnamed Subscription",
      avatar: subscription.image || "📄",
      type: subscription.interval 
        ? subscription.interval.charAt(0).toUpperCase() + subscription.interval.slice(1) + "ly"
        : "N/A",
      subscriber: `${subscription.totalReviews || 0} Reviews`,
      renewalStatus: subscription.active ? "Auto" : "Manual",
      price: `$${typeof subscription.amount === "number" 
        ? subscription.amount.toFixed(2) 
        : parseFloat(subscription.amount as string || "0").toFixed(2)}`,
      status: subscription.status || "pending",
      interval: subscription.interval || "N/A",
      description: subscription.description,
      activeSubscribers: subscription.totalReviews,
      autoRenew: subscription.active,
      averageRating: subscription.averageRating,
      totalReviews: subscription.totalReviews,
    }));
  }, [subscriptionData]);

  const filteredSubscriptions = useMemo((): Subscription[] => {
    if (!searchQuery.trim()) {
      return transformedSubscriptions;
    }

    const query = searchQuery.toLowerCase();
    return transformedSubscriptions.filter(
      (subscription: Subscription) =>
        subscription.name.toLowerCase().includes(query) ||
        subscription.type.toLowerCase().includes(query) ||
        subscription.status.toLowerCase().includes(query) ||
        subscription.interval.toLowerCase().includes(query)
    );
  }, [transformedSubscriptions, searchQuery]);

  // Get total items from meta or array length
  const totalItems = useMemo(() => {
    if (subscriptionData?.meta?.total) {
      return subscriptionData.meta.total;
    }
    return transformedSubscriptions.length;
  }, [subscriptionData, transformedSubscriptions]);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredSubscriptions.slice(startIndex, endIndex);
  }, [filteredSubscriptions, currentPage, itemsPerPage]);

  const handleDeleteClick = (subscription: Subscription) => {
    setSelectedSubscriptionPlan(subscription);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = useCallback(async () => {
    if (!selectedSubscriptionPlan) return;

    setIsDeleting(true);
    const loadingToast = toast.loading(
      `Deleting ${selectedSubscriptionPlan.name}...`,
    );

    try {
      console.log(
        "Attempting to delete subscription with ID:",
        selectedSubscriptionPlan.id,
      );

      const result = await deleteSubscriptionPlan(
        selectedSubscriptionPlan.id
      ).unwrap();

      console.log("Delete response:", result);

      toast.dismiss(loadingToast);
      toast.success("Subscription plan deleted successfully", {
        description: `${selectedSubscriptionPlan.name} has been removed.`,
        duration: 5000,
      });

      setDeleteDialogOpen(false);
      setSelectedSubscriptionPlan(null);

      // Refetch the data
      await refetch();

      // Adjust page if current page becomes empty
      if (paginatedItems.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
    } catch (error: any) {
      toast.dismiss(loadingToast);

      console.error("Delete subscription error details:", {
        error,
        message: error?.message,
        data: error?.data,
        status: error?.status,
      });

      let errorMessage = "Please try again later.";

      if (error?.status === 404) {
        errorMessage =
          "Subscription not found. It may have been already deleted.";
      } else if (error?.status === 401 || error?.status === 403) {
        errorMessage = "You don't have permission to delete this subscription.";
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast.error("Failed to delete subscription", {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setIsDeleting(false);
    }
  }, [
    selectedSubscriptionPlan,
    deleteSubscriptionPlan,
    refetch,
    paginatedItems.length,
    currentPage,
  ]);

  const handleViewClick = (subscription: Subscription) => {
    setSelectedSubscriptionPlan(subscription);
    setViewDialogOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (perPage: number) => {
    setItemsPerPage(perPage);
    setCurrentPage(1);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto container">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading subscriptions...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto container">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-600">Failed to load subscriptions</p>
              <Button onClick={refetch} className="mt-4 bg-gray-800 text-white hover:bg-gray-900">
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (transformedSubscriptions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto container">
          <div className="mb-6 flex items-center justify-between flex-col md:flex-row gap-4">
            <div>
              <h1 className="lg:text-3xl md:text-2xl text-xl font-bold text-gray-900">
                Subscription Management
              </h1>
            </div>
            <Link href={"/seller-dashboard/subscription/add-subscription"}>
              <Button className="bg-gray-800 text-white hover:bg-gray-900">
                Add New Subscription
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center h-64 bg-white rounded-lg border border-gray-200">
            <div className="text-center">
              <div className="bg-blue-100 text-blue-600 rounded-full p-3 inline-flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Subscriptions Found
              </h3>
              <p className="text-gray-600 mb-4">
                Get started by creating your first subscription plan.
              </p>
              <Link href={"/seller-dashboard/subscription/add-subscription"}>
                <Button className="bg-gray-800 text-white hover:bg-gray-900">
                  Add Subscription
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 md:p-8">
      <div className="mx-auto container">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between flex-col md:flex-row gap-4">
          <div>
            <h1 className="lg:text-3xl md:text-2xl text-xl font-bold text-gray-900">
              Subscription Management
            </h1>
          </div>
          <Link href={"/seller-dashboard/subscription/add-subscription"}>
            <Button className="bg-gray-800 text-white hover:bg-gray-900">
              Add New Subscription
            </Button>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search subscriptions by name, type, or status"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 bg-white border-gray-200"
            />
          </div>
          {searchQuery && (
            <p className="mt-2 text-sm text-gray-500">
              Showing {filteredSubscriptions.length} of{" "}
              {transformedSubscriptions.length} subscriptions
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          )}
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Service
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Reviews
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedItems.length > 0 ? (
                  paginatedItems.map((subscription: Subscription) => (
                    <tr
                      key={subscription.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-200 flex items-center justify-center text-lg overflow-hidden">
                            {subscription.avatar && subscription.avatar.startsWith("http") ? (
                              <Image
                                src={subscription.avatar}
                                alt={subscription.name}
                                width={40}
                                height={40}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-xl">{subscription.avatar}</span>
                            )}
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-900 block">
                              {subscription.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              Renewal: {subscription.renewalStatus}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {subscription.type}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {subscription.subscriber}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(subscription.status)}`}
                        >
                          {subscription.status.charAt(0).toUpperCase() +
                            subscription.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {subscription.price}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            className="rounded p-1.5 text-blue-600 hover:bg-blue-50 transition-colors"
                            onClick={() => handleViewClick(subscription)}
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <Link
                            href={`/seller-dashboard/subscription/update-subscription/${subscription.id}`}
                          >
                            <button
                              className="rounded p-1.5 text-blue-600 hover:bg-blue-50 transition-colors"
                              title="Edit"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                          </Link>
                          <button
                            className="rounded p-1.5 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => handleDeleteClick(subscription)}
                            disabled={isDeleting}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      {searchQuery
                        ? `No subscriptions found matching "${searchQuery}"`
                        : "No subscriptions found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {filteredSubscriptions.length > 0 && (
          <CustomPagination
            totalItems={searchQuery ? filteredSubscriptions.length : totalItems}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        )}

        {/* Delete Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Subscription</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete{" "}
                <strong>{selectedSubscriptionPlan?.name}</strong>? This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                disabled={isDeleting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Subscription Details</DialogTitle>
            </DialogHeader>

            {selectedSubscriptionPlan && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="h-12 w-12 flex-shrink-0 rounded-full bg-gray-200 flex items-center justify-center text-2xl overflow-hidden">
                    {selectedSubscriptionPlan.avatar?.startsWith("http") ? (
                      <Image
                        src={selectedSubscriptionPlan.avatar}
                        alt={selectedSubscriptionPlan.name}
                        className="h-full w-full object-cover"
                        width={48}
                        height={48}
                      />
                    ) : (
                      <span className="text-2xl">{selectedSubscriptionPlan.avatar}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {selectedSubscriptionPlan.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedSubscriptionPlan.type} Subscription
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">
                      Type
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedSubscriptionPlan.type}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">
                      Reviews
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedSubscriptionPlan.subscriber}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">
                      Status
                    </p>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                        selectedSubscriptionPlan.status,
                      )}`}
                    >
                      {selectedSubscriptionPlan.status.charAt(0).toUpperCase() +
                        selectedSubscriptionPlan.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">
                      Renewal Status
                    </p>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getRenewalStatusColor(
                        selectedSubscriptionPlan.renewalStatus,
                      )}`}
                    >
                      {selectedSubscriptionPlan.renewalStatus}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">
                      Price
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedSubscriptionPlan.price}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">
                      Interval
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedSubscriptionPlan.interval}
                    </p>
                  </div>
                </div>

                {selectedSubscriptionPlan.description && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-2">
                      Description
                    </p>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {selectedSubscriptionPlan.description}
                    </p>
                  </div>
                )}

                <DialogFooter className="flex gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setViewDialogOpen(false)}
                    className="flex-1"
                  >
                    Close
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}