"use client";

import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { CustomPagination } from "@/components/shared/CustomPagination";
import {
  useDeleteCouponMutation,
  useGetAllCouponByStoreIdQuery,
} from "@/redux/api/couponApi/couponApi";
import { useGetMeQuery } from "@/redux/api/authApi";
import { toast } from "sonner";

interface Coupon {
  id: string;
  storeId: string;
  couponCode: string;
  discountType: "PERCENTAGE" | "FIXED";
  discount: number;
  minimumOrderAmount: number;
  maximumOrderAmount: number;
  maximumDiscountAmount: number | null;
  limitForSingleUser: number;
  startDate: string;
  expireDate: string;
  startTime: string;
  expireTime: string;
  tags: string[];
  barcode: string | null;
  createdAt: string;
  updatedAt: string;
}

export function CouponTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Get user data first
  const {
    data: userData,
    isLoading: isUserLoading,
    error: userError,
  } = useGetMeQuery({});

  // Extract store ID from user data
  const storeId = userData?.data?.stores?.id;

  // RTK Query hooks - only call when we have storeId
  const {
    data: couponsResponse,
    isLoading: isCouponsLoading,
    error: couponsError,
    isSuccess,
    refetch,
  } = useGetAllCouponByStoreIdQuery(
    {
      id: storeId, // Use the store ID from user data
      params: {
        page: currentPage,
        limit: itemsPerPage,
      },
    },
    {
      // Skip the query if storeId is not available
      skip: !storeId,
    },
  );

  const [deleteCoupon] = useDeleteCouponMutation();

  // Log the data to see what we're getting
  useEffect(() => {
    if (isSuccess && couponsResponse) {
      console.log("Coupons Response:", couponsResponse);
      console.log("Coupons Data:", couponsResponse.data);
    }
    if (couponsError) {
      console.error("Error fetching coupons:", couponsError);
    }
    if (userData) {
      console.log("User Data:", userData);
      console.log("Store ID:", storeId);
    }
  }, [isSuccess, couponsResponse, couponsError, userData, storeId]);

  const handleDelete = async (id: string, couponCode: string) => {
    toast.custom(
      (t) => (
        <div className="bg-white border border-border rounded-lg shadow-lg md:p-4 max-w-sm">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="h-3 w-3 text-red-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Delete Coupon</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Are you sure you want to delete coupon{" "}
                <strong>{couponCode}</strong>? This action cannot be undone.
              </p>
              <div className="flex gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.dismiss(t)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={async () => {
                    toast.dismiss(t);
                    try {
                      await deleteCoupon(id).unwrap();
                      toast.success(
                        `Coupon "${couponCode}" deleted successfully`,
                      );
                      // Refetch coupons after deletion
                      refetch();
                    } catch (error) {
                      console.error("Failed to delete coupon:", error);
                      toast.error(
                        `Failed to delete coupon "${couponCode}". Please try again.`,
                      );
                    }
                  }}
                  className="flex-1"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        duration: 10000,
      },
    );
  };

  const getStatus = (coupon: Coupon): "Active" | "Scheduled" | "Expired" => {
    const now = new Date();

    const startDate = new Date(coupon.startDate);
    const expireDate = new Date(coupon.expireDate);

    if (now < startDate) return "Scheduled";
    if (now > expireDate) return "Expired";
    return "Active";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Scheduled":
        return "bg-blue-100 text-blue-800";
      case "Expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatValidity = (coupon: Coupon) => {
    const startDate = new Date(coupon.startDate);
    const expireDate = new Date(coupon.expireDate);

    const formattedStartDate = startDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    const formattedExpireDate = expireDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    return `${formattedStartDate} - ${formattedExpireDate}`;
  };

  const formatDiscount = (coupon: Coupon) => {
    if (coupon.discountType === "PERCENTAGE") {
      return `${coupon.discount}%`;
    }
    return `€${coupon.discount.toFixed(2)}`;
  };

  const getUsageLimit = (coupon: Coupon) => {
    return coupon.limitForSingleUser === 0
      ? "Unlimited"
      : `${coupon.limitForSingleUser} per user`;
  };

  const formatOrderAmount = (amount: number) => {
    return `€${amount.toFixed(2)}`;
  };

  // Show loading state while fetching user data
  if (isUserLoading) {
    return (
      <div>
        <div className="mb-6 flex items-center justify-between flex-col lg:flex-row">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Coupon List
          </h2>
          <div className="flex flex-col lg:flex-row gap-2">
            <Link href={"/seller-dashboard/marketing-promotions/addCoupon"}>
              <Button className="gap-2 bg-foreground text-background hover:bg-foreground/90">
                <Plus className="h-4 w-4" />
                Add New Coupon
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading user data...</div>
        </div>
      </div>
    );
  }

  // Show error if user data fetch fails
  if (userError || !storeId) {
    return (
      <div>
        <div className="mb-6 flex items-center justify-between flex-col lg:flex-row">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Coupon List
          </h2>
          <div className="flex flex-col lg:flex-row gap-2">
            <Link href={"/seller-dashboard/marketing-promotions/addCoupon"}>
              <Button className="gap-2 bg-foreground text-background hover:bg-foreground/90">
                <Plus className="h-4 w-4" />
                Add New Coupon
              </Button>
            </Link>
          </div>
        </div>
        <div className="text-lg text-red-500 mt-32 text-center">
          {userError
            ? "Error loading user data. Please try again later."
            : "No store found for this user."}
        </div>
      </div>
    );
  }

  // Show loading state while fetching coupons
  if (isCouponsLoading) {
    return (
      <div>
        <div className="mb-6 flex items-center justify-between flex-col lg:flex-row">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Coupon List
          </h2>
          <div className="flex flex-col lg:flex-row gap-2">
            <Link href={"/seller-dashboard/marketing-promotions/addCoupon"}>
              <Button className="gap-2 bg-foreground text-background hover:bg-foreground/90">
                <Plus className="h-4 w-4" />
                Add New Coupon
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading coupons...</div>
        </div>
      </div>
    );
  }

  // Show error if coupons fetch fails
  if (couponsError) {
    return (
      <div>
        <div className="mb-6 flex items-center justify-between flex-col lg:flex-row">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Coupon List
          </h2>
          <div className="flex flex-col lg:flex-row gap-2">
            <Link href={"/seller-dashboard/marketing-promotions/addCoupon"}>
              <Button className="gap-2 bg-foreground text-background hover:bg-foreground/90">
                <Plus className="h-4 w-4" />
                Add New Coupon
              </Button>
            </Link>
          </div>
        </div>
        <div className="text-lg text-red-500 mt-32 text-center">
          Error loading coupons. Please try again later.
        </div>
      </div>
    );
  }

  // Safely access data with fallbacks
  const couponsData = couponsResponse?.data || [];
  const paginationMeta = couponsResponse?.meta || {
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 1,
  };

  // Log the final data that will be rendered
  console.log("Rendering coupons:", couponsData);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between flex-col lg:flex-row">
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Coupon List
        </h2>
        <div className="flex flex-col lg:flex-row gap-2">
          <Link href={"/seller-dashboard/marketing-promotions/addCoupon"}>
            <Button className="gap-2 bg-foreground text-background hover:bg-foreground/90">
              <Plus className="h-4 w-4" />
              Add New Coupon
            </Button>
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        {couponsData.length > 0 ? (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="border-b border-border">
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                  Coupon Code
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                  Discount Type
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                  Discount Value
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                  Min Order
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                  Max Order
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                  Validity
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                  Usage Limit
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-white">
              {couponsData.map((coupon: Coupon) => {
                const status = getStatus(coupon);
                return (
                  <tr
                    key={coupon.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {coupon.couponCode}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground capitalize">
                      {coupon.discountType.toLowerCase()}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {formatDiscount(coupon)}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {formatOrderAmount(coupon.minimumOrderAmount)}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {coupon.maximumOrderAmount === 0
                        ? "No limit"
                        : formatOrderAmount(coupon.maximumOrderAmount)}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {formatValidity(coupon)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-md px-3 py-1 text-xs font-semibold ${getStatusColor(
                          status,
                        )}`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {getUsageLimit(coupon)}
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        onClick={() =>
                          handleDelete(coupon.id, coupon.couponCode)
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg mb-2">No coupons found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {/* {couponsData.length > 0 && paginationMeta.total > 0 && (
        <CustomPagination
          totalItems={paginationMeta.total}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      )} */}

      {/* Pagination - Only show if total items > 10 */}
      {couponsData.length > 0 && paginationMeta.total > 10 && (
        <CustomPagination
          totalItems={paginationMeta.total}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      )}
    </div>
  );
}
