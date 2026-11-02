/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { IoSearchOutline } from "react-icons/io5";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCancelSubscriptionsQuery } from "@/redux/api/userDashbord/userDashbordApi";

export default function MyCancellations() {
  const [currentPage, setCurrentPage] = useState(1);
  //   const limit = 10;

  const {
    data: response,
    isLoading,
    isError,
  } = useGetCancelSubscriptionsQuery({});

  // Fixed data extraction - your API returns { success: true, data: [array] }
  const cancellations = response?.data || [];
  const totalPages = 1; // Add real pagination from your API when available

  // Helper function to get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "refunded":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <h2 className="text-2xl font-bold tracking-tight">My Cancellations</h2>
        {/* Search row */}
        <div className="relative">
          <Input
            placeholder="Search cancellations..."
            className="w-full sm:w-64 md:w-80 pl-10 pr-4 h-10"
          />
          <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Plan Name</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Requested Date</TableHead>
              <TableHead>Refund Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <Skeleton className="h-4 w-48" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-16" />
                  </TableCell>
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Failed to load cancellations. Please try again later.
                </TableCell>
              </TableRow>
            ) : cancellations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No cancellations found
                </TableCell>
              </TableRow>
            ) : (
              cancellations.map((cancel: any) => (
                <TableRow key={cancel.id}>
                  <TableCell className="font-medium">
                    {cancel.subscription?.plan?.planName || "—"}
                  </TableCell>
                  <TableCell>
                    {cancel.subscription?.startDate
                      ? new Date(
                          cancel.subscription.startDate,
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {cancel.createdAt
                      ? new Date(cancel.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "—"}
                  </TableCell>
                  <TableCell className="font-medium">
                    ${cancel.refundAmount || 0}{" "}
                    {cancel.subscription?.plan?.currency?.toUpperCase() ||
                      "USD"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusVariant(
                        cancel.status,
                      )}`}
                    >
                      {cancel.status || "Unknown"}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-background rounded-md border">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1 || isLoading}
          >
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                disabled={isLoading}
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages || isLoading}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
