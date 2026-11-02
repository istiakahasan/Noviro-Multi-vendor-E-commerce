"use client";
import React from "react";
import importantInfo from "@/assets/user-dashboard/sub.png"; // Assume correct import
import UpComingCard from "@/components/userDashboard/UpComingCard";
import { useGetSingleSubscriptionQuery } from "@/redux/api/userDashbord/userDashbordApi";
import SubscriptionDetailsCard from "./SubscriptionDetailsCard";
import { Skeleton } from 'antd';

export default function SubscriptionDetailsPage({
  subscriptionsId,
}: {
  subscriptionsId: string;
}) {
  const { data, isLoading } = useGetSingleSubscriptionQuery(
    subscriptionsId,
  );
  console.log(subscriptionsId, " unique id");

  if (isLoading) {
    return (
      <div className="p-4 md:p-0">
        <Skeleton active paragraph={{ rows: 1 }} />
        <Skeleton active paragraph={{ rows: 1 }} className="mt-4" />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12">
          <div className="col-span-1 md:col-span-5">
            <Skeleton active avatar paragraph={{ rows: 4 }} />
          </div>
          <div className="col-span-1 md:col-span-7 rounded-2xl">
            <Skeleton active avatar paragraph={{ rows: 6 }} />
          </div>
        </div>
      </div>
    );
  }

  const sub = data?.data; // From fixed JSON

  return (
    <div className="p-4 md:p-0">
      <h1 className="text-4xl font-semibold text-primary">
        {sub?.plan.planName || "Subscription Details"}
      </h1>
      <h2 className="text-2xl font-semibold text-primary pt-4">Upcoming</h2>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12">
        <div className="col-span-1 md:col-span-5">
          <UpComingCard
            image={importantInfo.src}
            title={sub?.plan.planName || "Subscription Plan"}
            time={`Starts: ${new Date(sub?.startDate).toLocaleString()}`}
            price={`$${sub?.amount.toLocaleString()}`}
            items={`${sub?.plan.features.length} benefits`}
          />
        </div>
        <div className="col-span-1 md:col-span-7 rounded-2xl">
          <SubscriptionDetailsCard
            id={sub?.id}
            infoImage={sub?.plan.image || importantInfo.src}
            confirmationStatus={sub?.isActive ? "Active" : "Inactive"}
            dateLabel={`Next Billing: ${new Date(sub?.endDate).toLocaleDateString()}`}
            duration={`Interval: ${sub?.plan.interval} (${sub?.plan.intervalCount})`}
            serviceName={sub?.plan.planName}
            servicePrice={`$${sub?.amount}`}
            totalPrice={`$${sub?.amount}`}
            importantInfo={
              sub?.plan.description ||
              "If you cancel, no refund after start date."
            }
            upcomingImage={importantInfo.src}
            upcomingTitle={sub?.plan.planName}
            upcomingTime={`Next: ${new Date(sub?.endDate).toLocaleString()}`}
            upcomingPrice={`$${sub?.amount}`}
            upcomingItems={`${sub?.plan.features.length} items`}
            startDate={sub?.startDate}
            endDate={sub?.endDate}
            autoRenew={sub?.autoRenew}
          />
        </div>
      </div>
    </div>
  );
}