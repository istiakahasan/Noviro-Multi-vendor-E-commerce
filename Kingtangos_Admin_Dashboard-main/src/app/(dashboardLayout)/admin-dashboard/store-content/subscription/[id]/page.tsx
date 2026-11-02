/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import PageLoader from "@/app/loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGetPlansDetailsQuery } from "@/redux/features/mainScreen/planApi";
import { CircleCheckBig, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaRegStar } from "react-icons/fa6";

export default function SubscriptionDetailsPage() {
  const { id } = useParams();
  const {
    data: planData,
    isLoading,
    isError,
  } = useGetPlansDetailsQuery(id as string);
  const plan: any = planData?.data;

  if (isLoading) return <PageLoader />;
  if (isError || !plan) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4 px-4">
          <p className="text-xl font-bold text-red-500">Plan Not Found</p>
          <p className="text-gray-500 text-sm max-w-xs mx-auto">
            The subscription plan you are looking for might have been removed or
            is currently unavailable.
          </p>
          <Link
            href="/admin-dashboard/store-content"
            className="inline-block text-blue-600 hover:underline font-medium"
          >
            Back to Item Management
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <div className="mb-10 lg:mb-12">
        <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
          {plan.planName}
        </h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 xl:gap-12">
        {/* Left Section (9/12) */}
        <div className="xl:col-span-9 space-y-8">
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
            <Image
              src={plan.image || "/placeholder.svg"}
              alt={plan.planName}
              fill
              className="object-cover"
              priority
              unoptimized
            />
            {plan.status && (
              <div className="absolute top-4 left-4">
                <Badge
                  className={cn(
                    "px-3 py-1 text-[10px] font-black uppercase tracking-wider",
                    plan.status === "approved"
                      ? "bg-green-500 text-white"
                      : "bg-yellow-500 text-white",
                  )}
                >
                  {plan.status}
                </Badge>
              </div>
            )}
          </div>

          <div className="bg-white p-6 lg:p-10 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Description</h2>
            <p className="text-gray-600 leading-relaxed text-base italic">
              "{plan.description}"
            </p>
          </div>
        </div>

        {/* Right Sidebar (3/12) */}
        <div className="xl:col-span-3 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-8">
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                Subscription Details
              </h3>

              <div className="space-y-1">
                <p className="text-3xl sm:text-4xl font-black text-blue-600">
                  €{plan.amount}
                </p>
                <p className="text-xs font-bold text-gray-500">
                  {plan.intervalCount > 1 ? `${plan.intervalCount} ` : ""}
                  {plan.interval}s Billing Cycle
                </p>
              </div>

              <div className="flex items-center gap-3 py-2 border-y border-gray-50">
                <div className="flex items-center gap-1 text-yellow-500">
                  {[...Array(5)].map((_, i) =>
                    i < Math.floor(plan.averageRating || 0) ? (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ) : (
                      <FaRegStar key={i} className="w-4 h-4" />
                    ),
                  )}
                </div>
                <span className="text-xs font-bold text-gray-700">
                  {plan.averageRating?.toFixed(1)} ({plan.totalReviews})
                </span>
              </div>
            </div>

            <div className="space-y-5">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                Key Features
              </h3>
              <ul className="space-y-3">
                {plan.features?.map((feature: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CircleCheckBig className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-sm font-medium text-gray-700">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <Button
              disabled={true}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 rounded-xl transition-all shadow-lg shadow-blue-500/10"
            >
              Buy Now
            </Button>

            {plan.freeTrialDays && (
              <p className="text-center text-[10px] font-black text-green-600 uppercase tracking-widest bg-green-50 py-2 rounded-lg">
                Includes {plan.freeTrialDays} Days Free Trial
              </p>
            )}
          </div>

          <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 border-dashed">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.15em] text-center">
              Plan ID: {plan.id}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
