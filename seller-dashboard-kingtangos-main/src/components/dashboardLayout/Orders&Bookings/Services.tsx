"use client";

import { useState} from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IoEye } from "react-icons/io5";
import { CustomPagination } from "@/components/shared/CustomPagination";
import { useGetAllDashboardOverviewQuery } from "@/redux/api/dashboardOverviewApi/dashboardOverviewApi";

interface ServiceBooking {
  id: string;
  serviceId: string;
  specialistId: string;
  userId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  status: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  stripePaymentId: string;
  commissionAmount: string | null;
  commissionPaid: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function Services() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const {
    data: dashboardData,
    isLoading,
    error,
    refetch,
  } = useGetAllDashboardOverviewQuery({
    page: currentPage,
    limit: itemsPerPage,
  });

  const services: ServiceBooking[] = dashboardData?.data?.serviceBooking || [];

  const getStatusColor = (status: string): string => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes("pending")) {
      return "bg-yellow-50 text-yellow-600 border-yellow-200";
    } else if (lowerStatus.includes("completed") || lowerStatus.includes("approved") || lowerStatus.includes("delivered")) {
      return "bg-green-50 text-green-600 border-green-200";
    } else if (lowerStatus.includes("cancelled") || lowerStatus.includes("canceled") || lowerStatus.includes("refunded")) {
      return "bg-red-50 text-red-600 border-red-200";
    } else if (lowerStatus.includes("processing") || lowerStatus.includes("confirmed") || lowerStatus.includes("shipped")) {
      return "bg-blue-50 text-blue-600 border-blue-200";
    } else {
      return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-8">
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-8 h-8 rounded-full animate-pulse bg-primary dark:bg-primary"></div>
            <div className="w-8 h-8 rounded-full animate-pulse bg-primary dark:bg-primary"></div>
            <div className="w-8 h-8 rounded-full animate-pulse bg-primary dark:bg-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error loading services data</p>
          <Button onClick={refetch} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  md:p-8 mt-12 md:mt-0">
      <div className="mx-auto container">
        {/* Header */}
        <div className="mb-6 flex items-center lg:justify-between justify-center flex-col gap-4 md:flex-row">
          <div>
            <h1 className="lg:text-2xl text-xl font-semibold text-gray-900">
              Services Bookings
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              View and manage all service bookings
            </p>
          </div>
          <div className="text-sm text-gray-500">
            Total: {services.length} bookings
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Booking ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Booking Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Time Slot
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Payment Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {services.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No service bookings found
                    </td>
                  </tr>
                ) : (
                  services
                    .slice(
                      (currentPage - 1) * itemsPerPage,
                      currentPage * itemsPerPage
                    )
                    .map((service, index) => {
                      const serialNumber = (currentPage - 1) * itemsPerPage + index + 1;
                      
                      return (
                        <tr
                          key={service.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {serialNumber}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <span className="text-sm font-medium text-gray-900">
                                #{service.id.slice(0, 8).toUpperCase()}...
                              </span>
                              <p className="text-xs text-gray-500">
                                Service ID: {service.serviceId.slice(0, 8).toUpperCase()}...
                              </p>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {service.user?.firstName ? `${service.user.firstName} ${service.user.lastName}` : "User ID: " + service.userId.slice(0, 8).toUpperCase() + "..."}
                              </p>
                              {service.user?.email && (
                                <p className="text-xs text-gray-500">{service.user.email}</p>
                              )}
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {formatDate(service.bookingDate)}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <p className="text-sm text-gray-900">
                                {formatTime(service.startTime)} - {formatTime(service.endTime)}
                              </p>
                              <p className="text-xs text-gray-500">
                                Duration: {Math.round((new Date(service.endTime).getTime() - new Date(service.startTime).getTime()) / (1000 * 60))} mins
                              </p>
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            €{service.amount.toFixed(2)}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex rounded-md px-3 py-1 text-xs font-medium border ${getStatusColor(service.status)}`}
                            >
                              {service.status}
                            </span>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex rounded-md px-3 py-1 text-xs font-medium border ${getStatusColor(service.paymentStatus)}`}
                            >
                              {service.paymentStatus}
                            </span>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {formatDateTime(service.createdAt)}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <Link
                                href={`/seller-dashboard/order-booking/view-service/${service.id}`}
                              >
                                <Button className="rounded p-1.5 text-white hover:bg-blue-50 bg-blue-600 hover:text-blue-600 border hover:border-blue-600 transition-colors">
                                  <IoEye className="h-4 w-4" />
                                </Button>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {services.length > 0 && (
          <CustomPagination
            totalItems={services.length}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        )}
      </div>
    </div>
  );
}