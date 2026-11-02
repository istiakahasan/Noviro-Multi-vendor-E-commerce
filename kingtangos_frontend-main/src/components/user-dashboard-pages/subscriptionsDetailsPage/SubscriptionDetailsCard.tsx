/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LuCalendarDays } from "react-icons/lu";
import { toast } from "sonner";
import {
  useCancelSubscriptionMutation,
  useReActiveSubscriptionMutation,
} from "@/redux/api/userDashbord/userDashbordApi";
import UpComingCard from "@/components/userDashboard/UpComingCard";
import { FaSyncAlt } from "react-icons/fa";
import { FaCalendarXmark } from "react-icons/fa6";
import CancelSubscriptionModal from "./CancelSubscriptionModal";
import { Skeleton } from "antd";

interface SubscriptionDetailsCardProps {
  id: string;
  infoImage: string;
  confirmationStatus: string;
  dateLabel: string;
  duration: string;
  serviceName: string;
  servicePrice: string;
  totalPrice: string;
  importantInfo: string;
  upcomingImage: string;
  upcomingTitle: string;
  upcomingTime: string;
  upcomingPrice: string;
  upcomingItems: string;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
}

export default function SubscriptionDetailsCard({
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
  endDate,
  autoRenew: initialAutoRenew,
}: SubscriptionDetailsCardProps) {
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [autoRenew, setAutoRenew] = useState(initialAutoRenew);
  const [cancelSubscription, { isLoading: isCancelLoading }] =
    useCancelSubscriptionMutation();
  const [reActiveSubscription, { isLoading: isReActiveLoading }] =
    useReActiveSubscriptionMutation();

  const isExpired = new Date(endDate) < new Date();

  const openManageModal = () => setIsManageModalOpen(true);
  const closeManageModal = () => setIsManageModalOpen(false);

  const openCancelModal = () => {
    if (isExpired) {
      toast.error("Subscription expired; cannot modify.");
      return;
    }
    closeManageModal();
    setIsCancelModalOpen(true);
  };

  const closeCancelModal = () => setIsCancelModalOpen(false);

  const handleCancelConfirm = async () => {
    const subscriptionId = id;
    try {
      await cancelSubscription(subscriptionId).unwrap();
      toast.success("Subscription cancelled successfully");
      closeCancelModal();
    } catch (err: any) {
      const msg = err?.data?.message || "Failed to cancel. Please try again.";
      toast.error(msg);
    }
  };

  const handleToggleAutoRenew = async () => {
    if (isExpired) {
      toast.error("Subscription expired; cannot modify auto-renewal.");
      return;
    }
    const newAutoRenew = !autoRenew;
    const subscriptionId = id;
    try {
      await reActiveSubscription(subscriptionId).unwrap();
      setAutoRenew(newAutoRenew);
      toast.success(
        `Auto-renewal ${newAutoRenew ? "enabled" : "disabled"} successfully. ${
          newAutoRenew
            ? "Subscription will renew automatically on next billing date."
            : ""
        }`,
      );
    } catch (err: any) {
      console.log(err);
      toast.error("Failed to toggle auto-renewal.");
    }
  };

  const handleBackFromCancel = () => {
    setIsCancelModalOpen(false);
    setIsManageModalOpen(true);
  };

  if (isReActiveLoading) {
    return <Skeleton active avatar paragraph={{ rows: 8 }} />;
  }

  return (
    <>
      {/* Main Card */}
      <div className="bg-white rounded-2xl max-w-xl overflow-hidden">
        <Image
          src={infoImage}
          alt="Subscription Image"
          height={349}
          width={580}
          className="w-full h-auto"
        />

        <div className="p-6 md:p-10">
          <Button className="bg-[#0066FF] hover:bg-[#0066FF]/85 px-7">
            {confirmationStatus}
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-500/85 px-7 ml-2">
            Auto Renewal {autoRenew === true ? "On" : "Off"}
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
            aria-label="Manage subscription"
          >
            <LuCalendarDays className="text-2xl text-[#0066FF]" />
            <div>
              <p className="text-primary font-semibold">Manage subscription</p>
              <p>Check auto-renewal or cancel your subscription</p>
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

      {/* Manage Subscription Modal */}
      {isManageModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={closeManageModal}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white rounded-xl p-10 w-full max-w-xl shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              onClick={closeManageModal}
              className="absolute top-4 right-4 bg-transparent shadow-none text-text hover:text-gray-900 text-2xl font-bold"
              aria-label="Close manage modal"
            >
              &times;
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
              onClick={handleToggleAutoRenew}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleToggleAutoRenew()}
              aria-label="Toggle auto-renewal"
            >
              <FaSyncAlt className="text-xl text-primary" />
              <p className="text-primary hover:text-[#0066FF]">
                {autoRenew ? "Disable" : "Enable"} Auto-Renewal
              </p>
            </div>

            <div
              className="flex items-center gap-3 cursor-pointer pt-5"
              onClick={openCancelModal}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && openCancelModal()}
              aria-label="Cancel subscription"
            >
              <FaCalendarXmark className="text-xl text-primary" />
              <p className="text-primary hover:text-[#0066FF]">
                Cancel Subscription
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      <CancelSubscriptionModal
        isOpen={isCancelModalOpen}
        onClose={closeCancelModal}
        onConfirm={handleCancelConfirm}
        onBack={handleBackFromCancel}
        isLoading={isCancelLoading}
      />
    </>
  );
}
