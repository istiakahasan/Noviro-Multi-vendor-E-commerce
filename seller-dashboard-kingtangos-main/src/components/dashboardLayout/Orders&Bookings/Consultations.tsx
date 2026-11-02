"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IoEye } from "react-icons/io5";
import { CustomPagination } from "@/components/shared/CustomPagination";
import { useGetAllConsultationBookingQuery } from "@/redux/api/dashboardOverviewApi/dashboardOverviewApi";
import Image from "next/image";

interface Booking {
  id: string;
  serviceId: string | null;
  consultationId: string;
  providerId: string;
  specialistId: string;
  userId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  status: string;
  meetingLink: string;
  notes: string;
  isProvidedByOwner: boolean;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  commissionAmount: number | null;
  commissionPaid: boolean;
  stripePaymentId: string;
  vendorAmount: number | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePic: string;
  };
  consultation: {
    id: string;
    name: string;
    price: number;
    duration: string;
    slotDuration: number;
    type: string;
    store: {
      id: string;
      name: string;
      logo: string;
    };
  };
  specialist: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    title: string;
  };
}

export default function Consultations() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const {
    data: dashboardData,
    isLoading,
    error,
    refetch,
  } = useGetAllConsultationBookingQuery({
    page: currentPage,
    limit: itemsPerPage,
  });

  const bookings: Booking[] = dashboardData?.data?.bookings || [];

  console.log("koju9oju", bookings.map(b => b.consultationId));
  const pagination = dashboardData?.data?.pagination;

  const getStatusColor = (status: string): string => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes("pending")) {
      return "bg-yellow-50 text-yellow-600 border-yellow-200";
    } else if (lowerStatus.includes("completed") || lowerStatus.includes("approved")) {
      return "bg-green-50 text-green-600 border-green-200";
    } else if (lowerStatus.includes("cancelled") || lowerStatus.includes("canceled")) {
      return "bg-red-50 text-red-600 border-red-200";
    } else if (lowerStatus.includes("active") || lowerStatus.includes("confirmed")) {
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

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getConsultationType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
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
          <p className="text-red-600">Error loading consultations data</p>
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
              Consultation Bookings
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              View and manage all consultation bookings
            </p>
          </div>
          <div className="text-sm text-gray-500">
            Total: {pagination?.total || bookings.length} consultations
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
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Consultation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Specialist
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Booking Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Payment Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Commission
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
                {bookings.length === 0 ? (
                  <tr>
                    <td
                      colSpan={13}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No consultation bookings found
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking, index) => {
                    const serialNumber = (currentPage - 1) * itemsPerPage + index + 1;
                    
                    return (
                      <tr
                        key={booking.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {serialNumber}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <span className="text-sm font-medium text-gray-900">
                              #{booking.id.slice(0, 8).toUpperCase()}...
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 flex-shrink-0">
                              <Image
                                className="h-8 w-8 rounded-full"
                                src={booking.user.profilePic || "/default-avatar.png"}
                                alt={booking.user.firstName}
                                width={32}
                                height={32}
                              />
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">
                                {booking.user.firstName} {booking.user.lastName}
                              </p>
                              <p className="text-xs text-gray-500 truncate max-w-[120px]">
                                {booking.user.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {booking.consultation.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              Store: {booking.consultation.store.name}
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {booking.specialist.firstName} {booking.specialist.lastName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {booking.specialist.title}
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          €{booking.amount.toFixed(2)}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm text-gray-900">
                              {formatDate(booking.bookingDate)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex rounded-md px-3 py-1 text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">
                            {getConsultationType(booking.consultation.type)}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex rounded-md px-3 py-1 text-xs font-medium border ${getStatusColor(booking.status)}`}
                          >
                            {booking.status}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex rounded-md px-3 py-1 text-xs font-medium border ${getStatusColor(booking.paymentStatus)}`}
                          >
                            {booking.paymentStatus}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm text-gray-900">
                              ${booking.commissionAmount || "0.00"}
                            </p>
                            <span
                              className={`text-xs ${booking.commissionPaid ? 'text-green-600' : 'text-yellow-600'}`}
                            >
                              {booking.commissionPaid ? 'Paid' : 'Pending'}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDateTime(booking.createdAt)}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <Link
                              href={`/seller-dashboard/order-booking/view-consultation/${booking.id}`}
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
        {bookings.length > 0 && pagination && (
          <CustomPagination
            totalItems={pagination.total}
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