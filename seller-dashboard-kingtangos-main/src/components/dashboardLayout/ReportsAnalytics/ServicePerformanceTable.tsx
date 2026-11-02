"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { CustomPagination } from "@/components/shared/CustomPagination";
import { useGetAllReportQuery } from "@/redux/api/report api/reportApi";

// Define the Service type based on your API response
interface Service {
  id: string;
  name: string;
  bookings: number;
  revenue: number;
  refunds: string;
  averageRating: number;
}

export function ServicePerformanceTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Use the query hook with pagination params
  const { data, isLoading, isError } = useGetAllReportQuery({
    page: currentPage,
    limit: itemsPerPage,
  });
  
  // Extract servicePerformance from the response
  const servicePerformance = data?.data?.consultationPerformance || [];
  const totalItems = data?.data?.totalCount || servicePerformance.length;


  // Format revenue to currency
  const formatRevenue = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Format bookings count with "sessions"
  const formatBookings = (count: number) => {
    return `${count} ${count === 1 ? 'session' : 'sessions'}`;
  };

  // Format rating with stars
  const formatRating = (rating: number) => {
    return rating.toFixed(1);
  };

  // Loading state
  if (isLoading) {
    return (
      <Card className="p-6 rounded-xl border border-border">
        <div className="text-center py-8">Loading service performance data...</div>
      </Card>
    );
  }

  // Error state
  if (isError) {
    return (
      <Card className="p-6 rounded-xl border border-border">
        <div className="text-center py-8 text-red-500">
          Error loading service performance data. Please try again.
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 rounded-xl border border-border">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-3">Service Performance</h3>
        {/* 
        Optional: Add search functionality if needed
        <input
          type="text"
          placeholder="Search service by name"
          className="w-full px-4 py-2 border border-border rounded-lg text-sm"
        />
        */}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="border-b border-border">
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                Service Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                Bookings
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                Revenue
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                Refunds
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                Avg. Rating
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-white">
            {servicePerformance.length > 0 ? (
              servicePerformance.map((service: Service) => (
                <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">
                    {service.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {formatBookings(service.bookings)}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {formatRevenue(service.revenue)}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {service.refunds}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-foreground mr-1">
                        {formatRating(service.averageRating)}
                      </span>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, index) => (
                          <svg
                            key={index}
                            className={`w-4 h-4 ${index < Math.floor(service.averageRating) ? 'fill-current' : 'fill-gray-300'}`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                  No service performance data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {servicePerformance.length > 0 && totalItems > itemsPerPage && (
        <CustomPagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(newItemsPerPage) => {
            setItemsPerPage(newItemsPerPage);
            setCurrentPage(1); // Reset to first page when changing items per page
          }}
        />
      )}
    </Card>
  );
}