// import { TrendingUp } from "lucide-react";
// import React from "react";
// import {
//   CartesianGrid,
//   Cell,
//   Legend,
//   Line,
//   LineChart,
//   Pie,
//   PieChart,
//   ResponsiveContainer,
//   Tooltip,
//   XAxis,
//   YAxis,
// } from "recharts";

// interface LineDataPoint {
//   month: string;
//   revenue: number;
// }

// interface PieDataPoint {
//   name: string;
//   value: number;
//   percent?: number;
// }

// interface ChartsRowProps {
//   lineData: LineDataPoint[];
//   pieData: PieDataPoint[];
//   pieColors: string[];
// }

// // ✅ define our own label props that include percent
// interface CustomPieLabelProps {
//   name: string;
//   percent: number;
// }

// const ChartsRow: React.FC<ChartsRowProps> = ({
//   lineData,
//   pieData,
//   pieColors,
// }) => {
//   // ✅ define the label function separately
//   const renderCustomLabel = ({ name, percent }: CustomPieLabelProps) =>
//     `${name} ${(percent * 100).toFixed(0)}%`;

//   return (
//     <div>
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//         {/* ===== LINE CHART ===== */}
//         <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-lg font-semibold text-gray-900">
//               Monthly Subscription Revenue Trend
//             </h3>
//             <span className="text-green-600 text-sm font-medium flex items-center gap-1">
//               <TrendingUp className="h-4 w-4" />
//               +1.5%
//             </span>
//           </div>
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={lineData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="month" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Line
//                 type="monotone"
//                 dataKey="revenue"
//                 stroke="#8884d8"
//                 strokeWidth={2}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         {/* ===== PIE CHART ===== */}
//         <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">
//             Top Performing Subscription Plans
//           </h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie
//                 data={pieData}
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={80}
//                 fill="#8884d8"
//                 dataKey="value"
//                 // ✅ typecast the callback to match expected type
//                 label={renderCustomLabel as unknown as (
//                   props: unknown | CustomPieLabelProps | number | string
//                 ) => React.ReactNode}
//               >
//                 {pieData.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={pieColors[index]} />
//                 ))}
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChartsRow;



// import { TrendingUp } from "lucide-react";
// import React from "react";
// import {
//   CartesianGrid,
//   Cell,
//   Legend,
//   Line,
//   LineChart,
//   Pie,
//   PieChart,
//   ResponsiveContainer,
//   Tooltip,
//   XAxis,
//   YAxis,
// } from "recharts";

// // ====== Line Chart Data Type ======
// interface LineDataPoint {
//   month: string;
//   revenue: number;
// }

// // ====== Pie Chart Data Type ======
// // 👇 Added index signature to make it compatible with recharts' internal typings
// interface PieDataPoint {
//   [key: string]: string | number | undefined;
//   name: string;
//   value: number;
//   percent?: number;
// }

// interface ChartsRowProps {
//   lineData: LineDataPoint[];
//   pieData: PieDataPoint[];
//   pieColors: string[];
// }

// // ✅ Label props for pie chart
// interface CustomPieLabelProps {
//   name: string;
//   percent: number;
// }

// const ChartsRow: React.FC<ChartsRowProps> = ({
//   lineData,
//   pieData,
//   pieColors,
// }) => {
//   // ✅ Custom label function for Pie chart
//   const renderCustomLabel = ({ name, percent }: CustomPieLabelProps) =>
//     `${name} ${(percent * 100).toFixed(0)}%`;

//   return (
//     <div>
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//         {/* ===== LINE CHART ===== */}
//         <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-lg font-semibold text-gray-900">
//               Monthly Subscription Revenue Trend
//             </h3>
//             <span className="text-green-600 text-sm font-medium flex items-center gap-1">
//               <TrendingUp className="h-4 w-4" />
//               +1.5%
//             </span>
//           </div>
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={lineData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="month" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Line
//                 type="monotone"
//                 dataKey="revenue"
//                 stroke="#8884d8"
//                 strokeWidth={2}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         {/* ===== PIE CHART ===== */}
//         <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">
//             Top Performing Subscription Plans
//           </h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie
//                 // ✅ Type fixed: PieDataPoint[] is now compatible
//                 data={pieData}
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={80}
//                 fill="#8884d8"
//                 dataKey="value"
//                 label={renderCustomLabel as unknown as (
//                   props: unknown | CustomPieLabelProps | number | string
//                 ) => React.ReactNode}
//               >
//                 {pieData.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={pieColors[index]} />
//                 ))}
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChartsRow;







"use client";

import { TrendingUp } from "lucide-react";
import React from "react";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useGetSubscriptionTrackQuery } from "@/redux/features/stats/statsApi";

// ====== Line Chart Data Type ======
interface LineDataPoint {
  month: string;
  revenue: number;
}

// ====== Pie Chart Data Type ======
interface PieDataPoint {
  [key: string]: string | number | undefined;
  name: string;
  value: number;
  percent?: number;
}

// ✅ Label props for pie chart
interface CustomPieLabelProps {
  name: string;
  percent: number;
}

const DynamicChartsRow: React.FC = () => {
  const { data, isLoading, isError } = useGetSubscriptionTrackQuery();

  if (isLoading) return (<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Line Chart Skeleton */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="h-7 bg-gray-200 rounded w-80 mb-4 animate-pulse"></div>
          <div className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
        </div>

        {/* Pie Chart Skeleton */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="h-7 bg-gray-200 rounded w-64 mb-4 animate-pulse"></div>
          <div className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
        </div>
      </div>);
  if (isError || !data?.data) return <div>Error loading charts</div>;

  // ===== Convert monthlyRevenueTrend object to array =====
  const lineData: LineDataPoint[] = data.data.monthlyRevenueTrend
    ? Object.entries(data.data.monthlyRevenueTrend).map(([month, revenue]) => ({
        month,
        revenue: Number(revenue),
      }))
    : [];

  const pieData: PieDataPoint[] = Array.isArray(data.data.topPerformingPlans)
    ? data.data.topPerformingPlans.map((plan: { planName: string; revenue: number }) => ({
        name: plan.planName ?? "Unnamed Plan",
        value: plan.revenue ?? 0,
      }))
    : [];

  // Pie colors
  const pieColors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];

  // ✅ Custom label function for Pie chart
  const renderCustomLabel = ({ name, percent }: CustomPieLabelProps) =>
    `${name} ${(percent * 100).toFixed(0)}%`;

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* ===== LINE CHART ===== */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Monthly Subscription Revenue Trend
            </h3>
            <span className="text-green-600 text-sm font-medium flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              {lineData.length > 1
                ? `${(
                    ((lineData[lineData.length - 1].revenue -
                      lineData[0].revenue) /
                      lineData[0].revenue) *
                    100
                  ).toFixed(1)}%`
                : "+0%"}
            </span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#8884d8"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ===== PIE CHART ===== */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Performing Subscription Plans
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={renderCustomLabel as unknown as (
                  props: unknown | CustomPieLabelProps | number | string
                ) => React.ReactNode}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={pieColors[index % pieColors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DynamicChartsRow;
