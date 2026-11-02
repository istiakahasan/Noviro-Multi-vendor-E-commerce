"use client";

import { useState} from "react";
import { Card } from "@/components/ui/card";
import { CustomPagination } from "@/components/shared/CustomPagination";
import { useGetAllReportQuery } from "@/redux/api/report api/reportApi";

// Define the Product type based on your API response
interface Product {
  id: string;
  name: string;
  sold: number;
  revenue: number;
  refunds: string;
  stockStatus: string;
  averageRating: number;
}

export function ProductPerformanceTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Use the query hook with pagination params
  const { data, isLoading, isError } = useGetAllReportQuery({
    page: currentPage,
    limit: itemsPerPage,
  });
  
  // Extract productPerformance from the response
  const productPerformance = data?.data?.productPerformance || [];
  const totalItems = data?.data?.totalCount || data?.data?.total || productPerformance.length;
  


  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "bg-green-100 text-green-800";
      case "Stock Out":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format revenue to currency
  const formatRevenue = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Format sold count with "pcs"
  const formatSold = (count: number) => {
    return `${count} pcs`;
  };

  // Loading state
  if (isLoading) {
    return (
      <Card className="p-6 rounded-xl border border-border">
        <div className="text-center py-8">Loading product data...</div>
      </Card>
    );
  }

  // Error state
  if (isError) {
    return (
      <Card className="p-6 rounded-xl border border-border">
        <div className="text-center py-8 text-red-500">
          Error loading product data. Please try again.
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 rounded-xl border border-border">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-3">Product Performance</h3>
        {/* <input
          type="text"
          placeholder="Search product by name"
          className="w-full px-4 py-2 border border-border rounded-lg text-sm"

        /> */}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="border-b border-border">
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                Product
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                Sold
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                Revenue
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                Refunds
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                Stock Status
              </th>
              {/* <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                Action
              </th> */}
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-white">
            {productPerformance.length > 0 ? (
              productPerformance.map((item: Product) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {formatSold(item.sold)}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {formatRevenue(item.revenue)}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {item.refunds}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-md px-3 py-1 text-xs font-semibold ${getStatusColor(
                        item.stockStatus
                      )}`}
                    >
                      {item.stockStatus}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {productPerformance.length > 0 && (
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