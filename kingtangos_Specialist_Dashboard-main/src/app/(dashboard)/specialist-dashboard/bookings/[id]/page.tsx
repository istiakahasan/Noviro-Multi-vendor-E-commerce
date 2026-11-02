// app/bookings/[id]/page.tsx

"use client";

import PageLoading from "@/components/ui/Loading";
import {
  useGetBookingByIdQuery,
  useCancelBookingAsSpecialistMutation,
} from "@/lib/bookings/bookingApi";
import Image from "next/image";
import { useParams } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Loader2, RotateCcw, Clock } from "lucide-react";
import Link from "next/link";
import SendMessageButton from "@/app/(dashboard)/component/SendMessage";
import RescheduleButton from "@/app/(dashboard)/component/RescheduleButton";

const DetailsPage = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useGetBookingByIdQuery(id as string);
  const [cancelBooking, { isLoading: isCancelling }] =
    useCancelBookingAsSpecialistMutation();
  console.log(data);

  if (isLoading) return <PageLoading />;
  if (error || !data?.data)
    return (
      <div className="p-8 text-center text-red-600">Booking not found</div>
    );

  const booking = data.data;
  const user = booking.user;
  const specialist = booking.specialist;

  // Use either service or consultation
  const service = booking.service || booking.consultation;

  // Format time
  const startTime = new Date(booking.startTime);
  const endTime = new Date(booking.endTime);
  const formattedDate = startTime.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
  const formattedTime = startTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });

  const durationMs = endTime.getTime() - startTime.getTime();
  const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
  const durationMinutes = Math.floor(
    (durationMs % (1000 * 60 * 60)) / (1000 * 60),
  );
  const formattedDuration = `${durationHours > 0 ? `${durationHours}h ` : ""}${durationMinutes}m`;

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
      .catch((err) => {
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
        {/* User (Customer) Profile Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start mb-10">
          {/* Left: User Image */}
          <div className="relative group">
            <Image
              src={
                user?.profilePic || service?.profilePic || "/images/user.jpeg"
              }
              alt={`${user?.firstName} ${user?.lastName}`}
              width={600}
              height={600}
              className="w-full h-full object-cover rounded-2xl shadow-xl transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <span
                className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
                  booking.status === "PENDING"
                    ? "bg-amber-100 text-amber-700"
                    : booking.status === "COMPLETED"
                      ? "bg-green-100 text-green-700"
                      : booking.status === "CANCELLED"
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700"
                }`}
              >
                {booking.status}
              </span>
              {booking.rescheduledAt && (
                <span className="px-4 py-2 rounded-full text-xs font-bold bg-indigo-600 text-white shadow-lg animate-pulse">
                  RESCHEDULED
                </span>
              )}
            </div>
          </div>

          {/* Right: User & Booking Summary */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-blue-600 font-semibold mb-2">
                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                <span>Customer Information</span>
              </div>
              <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-lg text-gray-500 mt-1 flex items-center gap-2">
                <span className="font-medium">{user?.email}</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">
                  Price
                </p>
                <p className="text-2xl font-black text-blue-600">
                  € {booking.amount || service?.price}
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">
                  Payment
                </p>
                <p
                  className={`text-sm font-bold ${booking.paymentStatus === "PAID" ? "text-green-600" : "text-amber-600"}`}
                >
                  {booking.paymentStatus}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-700 bg-white p-3 rounded-lg border border-gray-100">
                <div className="p-2 bg-gray-50 rounded-md">
                  <RotateCcw className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 font-bold uppercase">
                    Scheduled for
                  </p>
                  <p className="font-semibold">
                    {formattedDate} at {formattedTime}
                  </p>
                </div>
                <div className="text-right border-l pl-4 border-gray-100">
                  <p className="text-xs text-gray-400 font-bold uppercase">
                    Duration
                  </p>
                  <p className="font-semibold text-blue-600">
                    {formattedDuration}
                  </p>
                </div>
              </div>

              {booking.rescheduledAt && (
                <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase mb-2">
                    <Clock className="w-4 h-4" />
                    Reschedule Information
                  </div>
                  <p className="text-sm text-indigo-900 font-semibold">
                    Updated at:{" "}
                    {new Date(booking.rescheduledAt).toLocaleString("en-US", {
                      timeZone: "UTC",
                    })}
                  </p>
                  {booking.rescheduleReason && (
                    <div className="mt-2 text-sm text-indigo-600 italic bg-white/50 p-2 rounded-lg">
                      "{booking.rescheduleReason}"
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href={
                  booking.status === "COMPLETED"
                    ? "#"
                    : booking.meetingLink || "/"
                }
                target={booking.status === "COMPLETED" ? "_self" : "_blank"}
                className={`flex-1 min-w-[160px] px-8 py-4 rounded-xl font-bold transition flex items-center justify-center gap-3 ${
                  booking.status === "COMPLETED"
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed shadow-none"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200"
                }`}
                onClick={(e) => {
                  if (booking.status === "COMPLETED") e.preventDefault();
                }}
              >
                Join Video Meeting
              </Link>
              <RescheduleButton
                bookingId={booking.id}
                disabled={booking.status === "COMPLETED"}
              />

              <SendMessageButton
                receiverId={booking.userId}
                userType="Client"
                nextUrl={`/specialist-dashboard/communication`}
              />

              <button
                onClick={handleCancel}
                disabled={
                  isCancelling ||
                  booking.status === "CANCELLED" ||
                  booking.status === "COMPLETED"
                }
                className={`flex-1 min-w-[160px] px-8 py-4 rounded-xl font-bold transition flex items-center justify-center gap-3 border-2 ${
                  isCancelling ||
                  booking.status === "CANCELLED" ||
                  booking.status === "COMPLETED"
                    ? "bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed"
                    : "border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white"
                }`}
              >
                {isCancelling ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : null}
                {isCancelling
                  ? "Processing..."
                  : booking.status === "CANCELLED"
                    ? "Already Cancelled"
                    : booking.status === "COMPLETED"
                      ? "Booking Completed"
                      : "Cancel Booking"}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-gray-800">
          <div className="lg:col-span-2 space-y-8">
            {/* Booking Notes */}
            {booking.notes && (
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                  Customer Notes
                </h3>
                <p className="text-gray-600 leading-relaxed italic">
                  "{booking.notes}"
                </p>
              </div>
            )}

            {/* Service/Consultation Details */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                  Booking Information
                </h3>
              </div>
              <div className="p-0">
                <table className="w-full text-left">
                  <tbody className="divide-y divide-gray-100">
                    <DetailRow
                      label={`${booking.serviceId ? "Service" : "Consultation"} Name`}
                      value={service?.name || "N/A"}
                    />
                    <DetailRow label="Booking ID" value={booking.id} isMono />
                    <DetailRow
                      label="Booking Mode"
                      value={
                        booking.service?.serviceMode ||
                        booking.consultation?.consultationMode ||
                        "N/A"
                      }
                    />
                    <DetailRow label="Duration" value={formattedDuration} />
                    <DetailRow
                      label="Type"
                      value={
                        (service as any)?.type ||
                        (service as any)?.providerType ||
                        "N/A"
                      }
                    />
                    <DetailRow
                      label="Store"
                      value={service?.store?.name || "N/A"}
                    />
                    <DetailRow
                      label="Location"
                      value={service?.location || "Online"}
                    />
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Detailed Status Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">
                Payment Summary
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium text-sm">
                    Amount Paid
                  </span>
                  <span className="font-bold text-lg">€{booking.amount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium text-sm">
                    Method
                  </span>
                  <span className="font-bold uppercase text-xs p-1 px-2 bg-gray-100 rounded text-gray-700">
                    {booking.paymentMethod}
                  </span>
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-black text-blue-600">
                    €{booking.amount}
                  </span>
                </div>
                <div className="mt-6 p-4 rounded-xl bg-gray-50 flex items-center gap-3">
                  <CheckCircle2
                    className={`w-5 h-5 ${booking.paymentStatus === "PAID" ? "text-green-600" : "text-amber-500"}`}
                  />
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">
                      Payment Status
                    </p>
                    <p className="text-sm font-bold uppercase tracking-tight">
                      {booking.paymentStatus}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for table rows
const DetailRow = ({
  label,
  value,
  isMono = false,
  compact = false,
}: {
  label: string;
  value: string;
  isMono?: boolean;
  compact?: boolean;
}) => (
  <tr className="group hover:bg-gray-50/50 transition-colors">
    <td
      className={`${compact ? "py-2 px-0 text-[10px]" : "py-4 px-6 text-sm"} font-bold text-gray-400 uppercase tracking-wider w-1/3`}
    >
      {label}
    </td>
    <td
      className={`${compact ? "py-2 px-0 text-xs" : "py-4 px-6"} text-gray-700 font-semibold ${isMono ? "font-mono text-xs break-all" : ""}`}
    >
      {value || "N/A"}
    </td>
  </tr>
);

export default DetailsPage;
