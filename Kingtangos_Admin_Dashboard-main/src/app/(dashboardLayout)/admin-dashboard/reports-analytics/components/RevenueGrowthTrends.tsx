// "use client";
// import React from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// const RevenueGrowthTrends: React.FC = () => {
//   const data = [
//     { month: 'Jan', growth: 2 },
//     { month: 'Feb', growth: 5 },
//     { month: 'Mar', growth: 3 },
//     { month: 'Apr', growth: 8 },
//     { month: 'May', growth: 4 },
//     { month: 'Jun', growth: 12.1 },
//   ];

//   return (
//     <div className="bg-white rounded-lg shadow-sm p-6">
//       <h2 className="text-xl font-bold text-gray-900 mb-4">Revenue Growth Trends</h2>
//       <p className="text-gray-600 mb-6">Month-over-month growth percentage</p>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//         <div className="bg-purple-50 p-4 rounded-lg">
//           <h3 className="text-sm font-medium text-gray-600 mb-2">Current Month Growth</h3>
//           <p className="text-2xl font-bold text-purple-600 mb-1">12.1%</p>
//           <span className="text-green-600 text-sm">↑</span>
//         </div>
//         <div className="bg-purple-50 p-4 rounded-lg">
//           <h3 className="text-sm font-medium text-gray-600 mb-2">Average Growth (6mo)</h3>
//           <p className="text-2xl font-bold text-purple-600">6.3%</p>
//         </div>
//       </div>
//       <ResponsiveContainer width="100%" height={300}>
//         <LineChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="month" />
//           <YAxis />
//           <Tooltip />
//           <Line type="monotone" dataKey="growth" stroke="#a855f7" strokeWidth={2} />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default RevenueGrowthTrends;



"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useGetRevenueByFeatureOrMonthlyQuery, RevenueByFeatureResponse, MonthlyTrendItem } from "@/redux/features/stats/statsApi";

// ---------------------
// Types
// ---------------------
// Use the types exported from the stats API module

// ---------------------
// Skeleton Loader
// ---------------------
const SkeletonBox = ({ height }: { height: string }) => (
  <div
    className="w-full bg-gray-200 animate-pulse rounded-md"
    style={{ height }}
  />
);

const RevenueGrowthTrends: React.FC = () => {
  const { data, isLoading, isError } = useGetRevenueByFeatureOrMonthlyQuery();

    console.log(data);
  // ---------------------
  // Loading Skeleton
  // ---------------------
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        <SkeletonBox height="28px" />
        <SkeletonBox height="20px" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkeletonBox height="80px" />
          <SkeletonBox height="80px" />
        </div>
        <SkeletonBox height="300px" />
      </div>
    );
  }

  // ---------------------
  // Error State
  // ---------------------
  if (isError) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-red-500">Failed to load revenue trends.</p>
      </div>
    );
  }

  const revenueData: RevenueByFeatureResponse | undefined = data;
  const revenueGrowth = revenueData?.data?.revenueGrowth;
  const monthlyTrend: MonthlyTrendItem[] = revenueData?.data?.monthlyTrend ?? [];

  // Convert month "2025-11" → "Nov"
  const formattedTrend = monthlyTrend.map((item: MonthlyTrendItem) => {
    const monthName = new Date(item.month + "-01").toLocaleString("en-US", {
      month: "short",
    });

    return {
      month: monthName,
      growth: item.growth,
    };
  });

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Revenue Growth Trends
      </h2>
      <p className="text-gray-600 mb-6">Month-over-month growth percentage</p>

      {/* Growth Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-600 mb-2">
            Current Month Growth
          </h3>
          <p className="text-2xl font-bold text-purple-600 mb-1">
            {(revenueGrowth?.growthPercentage ?? 0)}%
          </p>
          {(revenueGrowth?.growthPercentage ?? 0) >= 0 ? (
            <span className="text-green-600 text-sm">↑</span>
          ) : (
            <span className="text-red-600 text-sm">↓</span>
          )}
        </div>

        <div className="bg-sky-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-600 mb-2">
            Average Growth (6mo)
          </h3>
          <p className="text-2xl font-bold text-purple-600">
            {revenueGrowth?.averageGrowth6Months ?? 0}%
          </p>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formattedTrend}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="growth"
            stroke="#a855f7"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueGrowthTrends;
