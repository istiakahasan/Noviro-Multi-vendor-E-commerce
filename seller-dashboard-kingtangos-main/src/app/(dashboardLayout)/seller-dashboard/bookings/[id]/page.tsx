/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import Link from "next/link";
// import PageLoading from "@/components/ui/Loading";
import {
  useCancelBookingAsStoreOwnerMutation,
  useGetBookingByIdQuery,
} from "@/redux/api/bookings/bookingsApi";
// import PageLoading from "@/components/shared/PageLoading";

const DetailsPage = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useGetBookingByIdQuery(id as string);
  const [cancelBooking, { isLoading: isCancelling }] =
    useCancelBookingAsStoreOwnerMutation();
  console.log(data);

  // if (isLoading) return <PageLoading />;
  if (error || !data?.data)
    return (
      <div className="p-8 text-center text-red-600">Booking not found</div>
    );

  const booking = data.data;
  const specialist = booking.specialist;
  const service = booking.service;

  // Format time
  const startTime = new Date(booking.startTime);
  const formattedDate = startTime.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
  const formattedTime = startTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const durationMins = Math.round(
    (new Date(booking.endTime).getTime() - startTime.getTime()) / 60000,
  );

  const handleCancel = () => {
    const toastId = toast.loading(
      <div className="flex items-center gap-3">
        <div className="relative w-5 h-5"></div>
        <span className="text-gray-900 font-medium">Cancelling booking...</span>
      </div>,
      {
        duration: Infinity,
        position: "top-right",
      },
    );

    cancelBooking(booking.id)
      .unwrap()
      .then(() => {
        toast.dismiss(toastId);
        toast.success(
          <div className="flex gap-3 w-full">
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Booking Cancelled</p>
              <p className="text-sm text-gray-600 mt-0.5">
                Your appointment has been successfully cancelled.
              </p>
            </div>
          </div>,
          {
            duration: 5000,
            position: "top-right",
            className: "border border-green-200 bg-white",
          },
        );
      })
      .catch((err: any) => {
        toast.dismiss(toastId);
        toast.error(
          <div className="flex gap-3 w-full">
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Cancellation Failed</p>
              <p className="text-sm text-gray-600 mt-0.5">
                {err?.data?.message ||
                  "Something went wrong. Please try again."}
              </p>
            </div>
          </div>,
          {
            duration: 5000,
            position: "top-right",
            className: "border border-red-200 bg-white",
          },
        );
      });
  };

  return (
    <div className="min-h-[calc(100vh-150px)] bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start mb-10">
          {/* Left: Image */}
          <div>
            <Image
              src={
                service?.store?.logo ||
                "https://i.ibb.co/fdpnnBG4/woman-sitting-clinic-near-special-beauty-equipments-1.png"
              }
              alt={`${specialist?.firstName} ${specialist?.lastName}`}
              width={600}
              height={400}
              className="w-full h-auto object-cover rounded-xl shadow-lg"
            />
          </div>

          {/* Right: Details */}
          <div className="space-y-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">
                {specialist?.firstName} {specialist?.lastName}
              </h2>
              <p className="text-xl text-gray-600 mt-1">
                {specialist?.title || "Specialist"}
              </p>
            </div>

            <p className="text-3xl font-bold text-red-600">€{service?.price}</p>
            <p className="text-gray-700 font-medium">
              Experience: {specialist?.experience || "N/A"}
            </p>
            <p className="text-green-600 font-semibold text-lg">
              Available: {formattedDate} at {formattedTime}
            </p>

            <div className="flex gap-4 pt-6">
              <Link
                href="/meeting"
                // className={`px-8 py-3 rounded-lg font-medium transition flex items-center gap-2 ${
                //   booking.meetingLink
                //     ? "bg-blue-600 hover:bg-blue-700 text-white"
                //     : "bg-gray-400 text-gray-200 cursor-not-allowed"
                // }`}
                className="px-8 py-3 rounded-lg font-medium transition flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"

                // onClick={() =>
                //   booking.meetingLink && window.open(booking.meetingLink, "_blank")
                // }
              >
                Join Meeting
              </Link>

              <button
                onClick={handleCancel}
                disabled={isCancelling || booking.status === "CANCELLED"}
                className={`px-8 py-3 rounded-lg font-medium transition ${
                  isCancelling || booking.status === "CANCELLED"
                    ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                    : "bg-black hover:bg-gray-900 text-white"
                }`}
              >
                {isCancelling
                  ? "Cancelling..."
                  : booking.status === "CANCELLED"
                    ? "Cancelled"
                    : "Cancel Booking"}
              </button>
            </div>
          </div>
        </div>

        {/* Description */}
        {(specialist?.bio || service?.description) && (
          <div className="mb-10 max-w-[700px]">
            <h3 className="text-xl font-bold mb-3 text-gray-800">
              Description
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {specialist?.bio || service?.description}
            </p>
          </div>
        )}

        {/* Consultation Details */}
        <div>
          <h3 className="text-xl font-bold mb-5 text-gray-800">
            Consultation Details
          </h3>
          <div className="bg-white border border-gray-200 rounded-xl max-w-[700px] shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-4 px-6 font-medium text-gray-600 bg-gray-50 w-1/3">
                    Consultation Name
                  </td>
                  <td className="py-4 px-6 font-medium">{service?.name}</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-gray-600 bg-gray-50">
                    Duration
                  </td>
                  <td className="py-4 px-6">{durationMins} Minutes</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-gray-600 bg-gray-50">
                    Price
                  </td>
                  <td className="py-4 px-6 font-bold text-green-600">
                    €{service?.price}
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-gray-600 bg-gray-50">
                    Date & Time
                  </td>
                  <td className="py-4 px-6">
                    {formattedDate} at {formattedTime}
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-gray-600 bg-gray-50">
                    Type
                  </td>
                  <td className="py-4 px-6">Online Consultation</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-gray-600 bg-gray-50">
                    Experience
                  </td>
                  <td className="py-4 px-6">
                    {specialist?.experience || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-gray-600 bg-gray-50">
                    Title
                  </td>
                  <td className="py-4 px-6">
                    {specialist?.title || "Specialist"}
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-gray-600 bg-gray-50">
                    Booking ID
                  </td>
                  <td className="py-4 px-6 font-mono text-sm">{booking?.id}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;
