/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FiCheckCircle } from "react-icons/fi";
import { Package, Truck, RefreshCw } from "lucide-react";
import Image from "next/image";
import processImg from "@/assets/user-dashboard/prossed.png";
import shippImg from "@/assets/user-dashboard/shipp.png";
import routeImg from "@/assets/user-dashboard/route.png";
import arrivedImg from "@/assets/user-dashboard/arrived.png";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrderTrack({ order, isLoading, isError }: any) {
  // ============================ Loading State ============================
  if (isLoading) {
    return (
      <div className="w-full max-w-5xl mx-auto p-4">
        {/* Step Skeleton */}
        <div className="flex flex-col md:flex-row md:justify-between mb-10">
          {[1, 2, 3, 4].map((_, i) => (
            <div key={i} className="flex flex-col items-center flex-1">
              <Skeleton className="h-12 w-12 rounded-full mb-3" />
            </div>
          ))}
        </div>

        {/* Bottom Image Skeleton */}
        <div className="flex md:flex-row flex-col items-center md:justify-between gap-6">
          {[1, 2, 3, 4].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <Skeleton className="h-[60px] w-[60px] rounded-lg mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ============================ Error State ============================
  if (isError) {
    return (
      <p className="text-red-500 text-center py-10">Failed to load tracking info</p>
    );
  }

  // ============================ Normal State ============================
  const status = order?.orderStatus;

  // Corrected status flow
  const flow = ["PENDING", "SHIPPED", "ENROUTE", "ARRIVED"];

  const getStepStatus = (step: string) => {
    const current = flow.indexOf(status);
    const target = flow.indexOf(step);

    if (target < current) return "completed";
    if (target === current) return "current";
    return "upcoming";
  };

  const steps = [
    {
      label: "Order Processed",
      icon: <RefreshCw className="h-5 w-5" />,
      status: getStepStatus("PENDING"),
    },
    {
      label: "Order Shipped",
      icon: <Package className="h-5 w-5" />,
      status: getStepStatus("SHIPPED"),
    },
    {
      label: "Order En Route",
      icon: <Truck className="h-5 w-5" />,
      status: getStepStatus("ENROUTE"),
    },
    {
      label: "Order Arrived",
      icon: <FiCheckCircle className="h-5 w-5" />,
      status: getStepStatus("ARRIVED"),
    },
  ];

  const completedCount = steps.filter((s) => s.status === "completed").length;

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <div className="md:flex-col flex gap-6">
        {/* ===================== Top Progress Steps ===================== */}
        <div className="relative my-7">
          {/* Horizontal Progress Line */}
          <div className="absolute left-0 top-6 w-full h-1 bg-gray-200 hidden md:block">
            <div
              className="h-full bg-blue-600 transition-all duration-500"
              style={{
                width: `${(completedCount / (steps.length - 1)) * 100}%`,
              }}
            />
          </div>

          {/* Steps Icons */}
          <div className="flex flex-col md:flex-row md:justify-between relative">
            {steps.map((step, index) => {
              const isCompleted = step.status === "completed";
              const isCurrent = step.status === "current";
              const isUpcoming = step.status === "upcoming";

              return (
                <div
                  key={index}
                  className={cn(
                    "flex flex-col items-center md:items-start",
                    "mb-6 md:mb-0 flex-1"
                  )}
                >
                  <div
                    className={cn(
                      "relative z-10 flex items-center justify-center",
                      "w-12 h-12 rounded-full border-2",
                      isCompleted && "bg-blue-600 border-blue-600 text-white",
                      isCurrent &&
                        "bg-white border-blue-600 text-blue-600 ring-4 ring-blue-100",
                      isUpcoming &&
                        "bg-white border-gray-300 text-gray-400"
                    )}
                  >
                    {isCompleted ? (
                      <FiCheckCircle className="h-6 w-6" />
                    ) : (
                      step.icon
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===================== Bottom Images ===================== */}
        <div className="flex md:flex-row flex-col items-center md:justify-between my-7 gap-6 md:gap-0">
          <div className="flex flex-col items-center">
            <Image src={processImg} height={60} width={60} alt="" />
            <p className="text-primary mt-2 text-center">Order Processed</p>
          </div>

          <div className="flex flex-col items-center">
            <Image src={shippImg} height={60} width={60} alt="" />
            <p className="text-primary mt-2 text-center">Order Shipped</p>
          </div>

          <div className="flex flex-col items-center">
            <Image src={routeImg} height={60} width={60} alt="" />
            <p className="text-primary mt-2 text-center">En Route</p>
          </div>

          <div className="flex flex-col items-center">
            <Image src={arrivedImg} height={60} width={60} alt="" />
            <p className="text-primary mt-2 text-center">Order Arrived</p>
          </div>
        </div>
      </div>
    </div>
  );
}
