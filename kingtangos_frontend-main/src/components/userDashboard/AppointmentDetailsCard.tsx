"use client";
import React, { useState, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LuCalendarDays, LuCalendarSync } from "react-icons/lu";
import { FaCalendarXmark } from "react-icons/fa6";
import UpComingCard from "./UpComingCard";
import CancelModal from "./CancelModal";
import { toast } from "sonner";
import { parse } from "date-fns"; // Added for better date/time parsing
import {
  useCancelBookingMutation,
  useRescheduleBookingMutation,
} from "@/redux/api/userDashbord/userDashbordApi";
import { AppointmentBookingCalendarUser } from "../shared/AppointmentBookingCalendarUser";
interface AppointmentDetailsCardProps {
  id: string;
  infoImage: string;
  confirmationStatus: string;
  dateLabel: string;
  duration: string; // e.g., "30 minutes"
  serviceName: string;
  servicePrice: string;
  totalPrice: string;
  importantInfo: string;
  upcomingImage: string;
  upcomingTitle: string;
  upcomingTime: string;
  upcomingPrice: string;
  upcomingItems: string;
}
export default function AppointmentDetailsCard({
  id,
  infoImage,
  confirmationStatus,
  dateLabel,
  duration,
  serviceName,
  servicePrice,
  totalPrice,
  importantInfo,
  upcomingImage,
  upcomingTitle,
  upcomingTime,
  upcomingPrice,
  upcomingItems,
}: AppointmentDetailsCardProps) {
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [cancelBooking, { isLoading: isCancelLoading }] =
    useCancelBookingMutation();
  const [rescheduleBooking, { isLoading: isRescheduleLoading }] =
    useRescheduleBookingMutation(); // Added loading state
  const openManageModal = useCallback(() => setIsManageModalOpen(true), []);
  const closeManageModal = useCallback(() => setIsManageModalOpen(false), []);
  const openCancelModal = useCallback(() => {
    closeManageModal();
    setIsCancelModalOpen(true);
  }, [closeManageModal]);
  const closeCancelModal = useCallback(() => setIsCancelModalOpen(false), []);
  const openRescheduleModal = useCallback(() => {
    closeManageModal();
    setIsRescheduleModalOpen(true);
  }, [closeManageModal]);
  const closeRescheduleModal = useCallback(
    () => setIsRescheduleModalOpen(false),
    [],
  );
  const handleCancelConfirm = async () => {
    try {
      await cancelBooking(id).unwrap();
      toast.success("Booking cancelled successfully");
      setIsCancelModalOpen(false);
    } catch (err: unknown) {
      console.error("Cancellation failed:", err);
      const msg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to cancel booking. Please try again.";
      toast.error(msg);
    }
  };
  const handleRescheduleComplete = async (
    date: Date,
    time: string,
    reason: string,
  ) => {
    try {
      // Parse time using date-fns (assuming 24h format like "04:30")
      const parsedTime = parse(time, "HH:mm", new Date());
      const hour = parsedTime.getHours();
      const min = parsedTime.getMinutes();
      const newDate = new Date(date);
      newDate.setHours(hour, min, 0, 0);
      // Dynamic duration parsing (e.g., "30 minutes" -> 30)
      const durationMinutes = parseInt(duration.split(" ")[0], 10) || 30; // Default to 30 if parsing fails
      const newStartTime = newDate.toISOString();
      const newEndTime = new Date(
        newDate.getTime() + durationMinutes * 60 * 1000,
      ).toISOString();
      const newBookingDate = newDate.toISOString().slice(0, 10);
      const data = {
        newBookingDate,
        newStartTime,
        newEndTime,
        reason,
      };
      await rescheduleBooking({ data, bookingId: id }).unwrap();
      toast.success("Booking rescheduled successfully");
      closeRescheduleModal();
    } catch (err: unknown) {
      console.error("Reschedule failed:", err);
      const msg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to reschedule booking. Please try again.";
      toast.error(msg);
    }
  };
  const handleBackFromCancel = useCallback(() => {
    setIsCancelModalOpen(false);
    setIsManageModalOpen(true);
  }, []);
  const handleDateSelect = (date: Date) => {
    // Implement if needed, e.g., fetch available slots for the date
    console.log("Selected date:", date);
  };
  return (
    <>
      {/* Main Card */}
      <div className="bg-white rounded-2xl max-w-xl">
        <Image
          src={infoImage}
          alt="Appointment information image"
          height={349}
          width={580}
          className="w-full h-auto"
        />
        <div className="p-10">
          <Button className="bg-[#0066FF] hover:bg-[#0066FF]/85 px-7">
            {confirmationStatus}
          </Button>
          <h3 className="font-semibold py-3 text-3xl text-primary">
            {dateLabel}
          </h3>
          <p className="text-primary">{duration}</p>
          <div
            className="flex items-center my-5 gap-3 bg-text/15 p-5 rounded-xl cursor-pointer"
            onClick={openManageModal}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && openManageModal()}
          >
            <LuCalendarDays className="text-2xl text-[#0066FF]" />
            <div>
              <p className="text-primary font-semibold">Manage booking</p>
              <p>Reschedule or cancel your appointment</p>
            </div>
          </div>
          <div className="flex justify-between border-b pb-4">
            <p className="text-primary font-semibold">{serviceName}</p>
            <p className="text-primary font-semibold">{servicePrice}</p>
          </div>
          <div className="flex justify-between border-t pt-4">
            <p className="text-primary font-semibold">Total</p>
            <p className="text-primary font-semibold">{totalPrice}</p>
          </div>
          <h4 className="text-2xl font-semibold text-primary pt-6">
            Important info
          </h4>
          <p className="text-text">{importantInfo}</p>
        </div>
      </div>
      {/* Manage Booking Modal */}
      {isManageModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-auto"
          onClick={closeManageModal}
        >
          <div
            className="bg-white rounded-xl p-10 w-full max-w-xl shadow-lg relative max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              onClick={closeManageModal}
              className="absolute top-4 right-4 bg-transparent shadow-none text-text hover:text-gray-900 text-2xl font-bold"
              aria-label="Close modal"
            >
              × {/* Replaced &times; with × for better rendering */}
            </Button>
            <UpComingCard
              image={upcomingImage}
              title={upcomingTitle}
              time={upcomingTime}
              price={upcomingPrice}
              items={upcomingItems}
            />
            <div
              className="flex items-center gap-3 cursor-pointer border-b mt-7 pb-5"
              onClick={openRescheduleModal}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && openRescheduleModal()}
            >
              <LuCalendarSync className="text-xl text-primary" />
              <p className="text-primary hover:text-[#0066FF]">
                Reschedule Booking
              </p>
            </div>
            <div
              className="flex items-center gap-3 cursor-pointer pt-5"
              onClick={openCancelModal}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && openCancelModal()}
            >
              <FaCalendarXmark className="text-xl text-primary" />
              <p className="text-primary hover:text-[#0066FF]">
                Cancel Booking
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Reschedule Confirmation Modal */}
      <AppointmentBookingCalendarUser
        isOpen={isRescheduleModalOpen}
        onClose={closeRescheduleModal}
        onComplete={handleRescheduleComplete}
        onDateSelect={handleDateSelect}
        isLoading={isRescheduleLoading} // Added prop for loading
      />
      {/* Cancel Confirmation Modal */}
      <CancelModal
        isOpen={isCancelModalOpen}
        onClose={closeCancelModal}
        onConfirm={handleCancelConfirm}
        onBack={handleBackFromCancel}
        isLoading={isCancelLoading}
      />
    </>
  );
}
