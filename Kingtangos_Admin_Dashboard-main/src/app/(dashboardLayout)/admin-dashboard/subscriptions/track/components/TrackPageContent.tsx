"use client";

import { useGetSubscriptionTrackQuery } from "@/redux/features/stats/statsApi";
import { Filter } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartsRow from "./ChartsRow";
import { MatrixForTrack } from "./MatrixForTrack";
import SubscriptionTable from "./SubscriptionTable";

const TrackPageContent = () => {
  const router = useRouter();
  const pathname = usePathname();
  const currentSegment = pathname.split("/")[2] || "";
  const initialTypeFilter =
    currentSegment === "subscriptions"
      ? "Subscriptions"
      : currentSegment === "track"
      ? "Track"
      : "Track";
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [typeFilter, setTypeFilter] = useState(initialTypeFilter);

  const typeOptions = ["Subscriptions", "Track"];

  const handleTypeChange = (option: string) => {
    setTypeFilter(option);

    if (option === "Subscriptions") {
      router.push("/admin-dashboard/subscriptions");
    } else if (option === "Track") {
      router.push("/admin-dashboard/subscriptions/track");
    }

    setShowTypeMenu(false);
  };

  const { data, isLoading, isError } = useGetSubscriptionTrackQuery();
  // console.log(data);

  return (
    <div className="  p-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Subscriptions Management
            </h1>
            <p className="text-gray-600 mt-1">
              Monitor and manage all product orders, service bookings, and
              subscription activities.
            </p>
          </div>
          <div className="flex gap-2">
            {/* Type Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowTypeMenu(!showTypeMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Filter size={16} />
                {typeFilter}
              </button>
              {showTypeMenu && (
                <ul className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                  {typeOptions.map((option) => (
                    <li key={option}>
                      <button
                        onClick={() => handleTypeChange(option)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                      >
                        {option}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Revenue Tracking Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Revenue Tracking (Reports)
          </h2>
          <p className="text-gray-600 mb-6">
            Overview of how tracking (reports) earnings
          </p>

          {/* KPI Cards */}
          <div className="mb-5">
            <MatrixForTrack />
          </div>

          {/* Charts Row */}
          <ChartsRow />
          {/* Bar Chart */}
          {/* <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Seller-wise Subscription Earnings (Top 5)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="seller" angle={-15} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="earnings" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div> */}

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Seller-wise Subscription Earnings (Top 5)
            </h3>

            {isLoading ? (
              // Skeleton while loading
              <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
            ) : isError || !data?.data?.topSellerEarnings?.length ? (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No seller earnings data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={data.data.topSellerEarnings.map(
                    (item: { storeName: string; earnings: number }) => ({
                      seller: item.storeName,
                      earnings: Number(item.earnings),
                    })
                  )}
                  margin={{ top: 10, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="seller"
                    angle={-15}
                    textAnchor="end"
                    height={80}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    tickFormatter={(value) => `€${value.toLocaleString()}`}
                  />
                  <Tooltip
                    formatter={(value: number) => `€${value.toLocaleString()}`}
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                    }}
                  />
                  <Bar
                    dataKey="earnings"
                    fill="#10B981"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div>
          <SubscriptionTable />
        </div>
      </div>
    </div>
  );
};

export default TrackPageContent;
