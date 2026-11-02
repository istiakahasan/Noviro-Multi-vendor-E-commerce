"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useGetSingleBookingQuery } from "@/redux/features/order-bookings/orderBookingsApi";
import SectionCard from "@/components/shared/dashboardLayout/order-&-booking-management-details/SectionCard";
import ItemsTable from "@/components/shared/dashboardLayout/order-&-booking-management-details/ItemsTable";
import TransactionsTable from "@/components/shared/dashboardLayout/order-&-booking-management-details/TransactionsTable";
import CustomerCard from "@/components/shared/dashboardLayout/order-&-booking-management-details/CustomerCard";
import AddressCard from "@/components/shared/dashboardLayout/order-&-booking-management-details/AddressCard";
import PageLoader from "@/app/loading";

const OrderBookingManagementDetails = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetSingleBookingQuery(id as string);

  if (isLoading) {
    return <PageLoader />;
  }

  if (isError || !data?.data) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-red-600">
          Failed to load booking details.
        </div>
      </div>
    );
  }

  const booking = data.data;

  // Determine if it's a service or consultation
  const bookingType = booking.service ? "Service" : "Consultation";
  const detailData = booking.service || booking.consultation;

  // Add null checks for nested objects
  if (!detailData || !booking.user) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-red-600">
          Incomplete booking data. Missing service/consultation or user
          information.
        </div>
      </div>
    );
  }

  // Format dates
  const createdDate = new Date(booking.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const createdTime = new Date(booking.createdAt).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const bookingDate = new Date(booking.bookingDate).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    },
  );

  const startTime = new Date(booking.startTime).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const endTime = new Date(booking.endTime).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  // Dynamic item
  const serviceItem = {
    name: detailData.name,
    image:
      detailData.profilePic || "https://i.ibb.co.com/PyXSVMn/Ellipse-3.png",
    quantity: 1,
    price: detailData.price,
    total: booking.amount || detailData.price,
  };

  // Transactions
  const transactions = [
    {
      type: "Payment",
      method: booking.paymentMethod || "Paid via Platform",
      date: createdDate,
      amount: booking.amount || detailData.price,
    },
  ];

  return (
    <div className="container mx-auto grid grid-cols-1 xl:grid-cols-3 gap-6 p-6">
      {/* Left Section */}
      <div className="xl:col-span-2 space-y-6">
        <SectionCard title="Booking Details">
          <p className="text-gray-600 text-sm mb-5">
            Monitor and manage {bookingType.toLowerCase()} booking details.
          </p>

          <div className="text-sm text-gray-700 flex flex-wrap items-center gap-3 border-t border-gray-200 pt-3 mb-4">
            <span>
              {createdDate} at {createdTime}
            </span>
            <span className="text-gray-400">|</span>
            <span>{bookingType} Booking</span>
            <span className="text-gray-400">|</span>
            <span>
              Total ৳{(booking.amount || detailData.price).toLocaleString()}
            </span>
            <span className="text-gray-400">|</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                booking.status === "COMPLETED"
                  ? "bg-green-100 text-green-700"
                  : booking.status === "PENDING"
                    ? "bg-yellow-100 text-yellow-700"
                    : booking.status === "CANCELLED"
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-700"
              }`}
            >
              {booking.status}
            </span>
          </div>

          {/* Service as Item */}
          <ItemsTable
            items={[serviceItem]}
            shipping={0}
            total={booking.amount || detailData.price}
          />

          {booking.notes && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-900 mb-1">
                Notes:
              </h4>
              <p className="text-sm text-gray-600">{booking.notes}</p>
            </div>
          )}
        </SectionCard>

        {/* Transactions */}
        <TransactionsTable transactions={transactions} />
      </div>

      {/* Right Section */}
      <div className="space-y-6">
        {/* Customer */}
        <CustomerCard
          name={
            `${booking.user.firstName || ""} ${booking.user.lastName || ""}`.trim() ||
            "N/A"
          }
          email={booking.user.email || "N/A"}
          phone="+880 1XXX-XXXXXX"
          image={
            booking.user.profilePic ||
            "https://i.ibb.co.com/PyXSVMn/Ellipse-3.png"
          }
        />

        {/* Specialist Info or Store Info */}
        {booking.specialist ? (
          <AddressCard
            title="Specialist"
            name={
              `${booking.specialist.firstName || ""} ${booking.specialist.lastName || ""}`.trim() ||
              "N/A"
            }
            address={booking.specialist.title || "Professional Specialist"}
            postal={booking.specialist.email || "N/A"}
          />
        ) : booking.isProvidedByOwner && detailData.store ? (
          <AddressCard
            title="Provider (Store Owner)"
            name={detailData.store.name}
            address={detailData.store.location || "Store Location"}
            postal={detailData.store.email || "N/A"}
          />
        ) : (
          <AddressCard
            title="Specialist"
            name="Not Assigned"
            address="N/A"
            postal="N/A"
          />
        )}

        {/* Booking Schedule */}
        <AddressCard
          title="Booking Schedule"
          name={detailData.name}
          address={`${bookingDate} | ${startTime} - ${endTime}`}
          postal={`Duration: ${detailData.duration || detailData.slotDuration || "N/A"} ${detailData.duration ? "" : "minutes"}`}
        />

        {booking.meetingLink && (
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-900 mb-1">
              Meeting Link:
            </h4>
            <a
              href={booking.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 break-all hover:underline"
            >
              {booking.meetingLink}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderBookingManagementDetails;
