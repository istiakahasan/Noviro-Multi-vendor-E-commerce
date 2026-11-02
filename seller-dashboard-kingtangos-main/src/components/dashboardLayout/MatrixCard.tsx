"use client"

import { useGetAllSellerDashboardActivityQuery } from "@/redux/api/dashboardOverviewApi/dashboardOverviewApi";
import {  Users, TrendingUp} from "lucide-react";
import { FaEuroSign } from "react-icons/fa";

export function MatrixCard() {
  const { data, isLoading, error } = useGetAllSellerDashboardActivityQuery({});

  if (isLoading) {
    return (
       <div className="min-h-screen bg-gray-50">
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
      <div className="text-center text-red-500 py-8">
        Error loading dashboard data
      </div>
    );
  }

  const dashboardData = data?.data?.totals || {
    monthlyOrderSales: 0,
    activePlans: 0,
    totalEarnings: 0,
  };

  const metricsData = [
    {
      title: "Monthly Sales",
      value: dashboardData.monthlyOrderSales?.toLocaleString() || "0",
      icon: FaEuroSign,
      bgColor: "bg-gradient-to-r from-[#FFDFD4] to-[#FF9E7D]",
      iconBgColor: "bg-white",
    },
    {
      title: "Active Plans",
      value: dashboardData.activePlans?.toLocaleString() || "0",
      icon: Users,
      bgColor: "bg-gradient-to-r from-[#D0E4FF] to-[#78B3FF]",
      iconBgColor: "bg-white",
    },
    {
      title: "Total Earnings",
      value: `€${dashboardData.totalEarnings?.toLocaleString() || "0"}`,
      icon: TrendingUp,
      bgColor: "bg-gradient-to-r from-[#BCFBC1] to-[#12AA29]",
      iconBgColor: "bg-white",
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {metricsData.map((metric, index) => {
        const IconComponent = metric.icon;
        return (
          <div
            key={index}
            className={`${metric.bgColor} rounded-xl p-6 flex flex-col justify-between h-full`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-700 mb-14">{metric.title}</p>
                <p className="text-3xl font-bold text-gray-900">
                  {metric.value}
                </p>
              </div>
              <div className={`${metric.iconBgColor} p-2 rounded-lg`}>
                <IconComponent className="w-5 h-5 text-gray-700" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}