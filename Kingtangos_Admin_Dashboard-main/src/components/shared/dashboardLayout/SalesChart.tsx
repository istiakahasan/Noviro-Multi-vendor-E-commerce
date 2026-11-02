// "use client"

// import PageLoader from "@/app/loading";
// import { useGetDashboardStatsQuery } from "@/redux/features/stats/statsApi";
// import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// const chartData = [
//   { day: "Mon", sales: 1200, earnings: 1100 },
//   { day: "Tue", sales: 1900, earnings: 1400 },
//   { day: "Wed", sales: 700, earnings: 800 },
//   { day: "Thu", sales: 1500, earnings: 1300 },
//   { day: "Fri", sales: 2100, earnings: 1700 },
//   { day: "Sat", sales: 2700, earnings: 2100 },
//   { day: "Sun", sales: 1400, earnings: 1200 },
// ]

// export function SalesChart() {




//    const { data: dashboardStats, isLoading: dashboardStatsLoading, isError: dashboardStatsError } = useGetDashboardStatsQuery(undefined);
  
//         console.log(dashboardStats);
  
//     if (dashboardStatsLoading) return <PageLoader/>;
//     if (dashboardStatsError) return <div>Something went wrong!</div>;
  



//   return (
//     <div className="rounded-xl border shadow-sm border-gray-100 p-6">
//       <div className="flex items-center justify-between md:flex-row flex-col mb-6">
//         <h2 className="text-lg font-semibold text-gray-900">Sales & Earnings Trend</h2>
//         {/* <Select defaultValue="current-week">
//           <SelectTrigger className="w-[180px]">
//             <SelectValue placeholder="Select period" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="current-week">Current Week</SelectItem>
//             <SelectItem value="last-week">Last Week</SelectItem>
//             <SelectItem value="last-month">Last Month</SelectItem>
//           </SelectContent>
//         </Select> */}
//       </div>
//       <div className="h-[400px]">
//         <ResponsiveContainer width="100%" height="100%">
//           <LineChart data={chartData}>
//             <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//             <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
//             <YAxis
//               axisLine={false}
//               tickLine={false}
//               tick={{ fill: "#6b7280", fontSize: 12 }}
//               domain={[0, 3000]}
//               ticks={[0, 700, 1400, 2100, 2800]}
//             />
//             <Tooltip />
//             <Line
//               type="monotone"
//               dataKey="sales"
//               stroke="#3b82f6"
//               strokeWidth={2}
//               dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
//             />
//             <Line
//               type="monotone"
//               dataKey="earnings"
//               stroke="#f97316"
//               strokeWidth={2}
//               dot={{ fill: "#f97316", strokeWidth: 2, r: 4 }}
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   )
// }




















// "use client"

// import PageLoader from "@/app/loading";
// import { useGetDashboardStatsQuery } from "@/redux/features/stats/statsApi";
// import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// export function SalesChart() {

//   const { data: dashboardStats, isLoading: dashboardStatsLoading, isError: dashboardStatsError } =
//     useGetDashboardStatsQuery(undefined);

//   if (dashboardStatsLoading) return <PageLoader />;
//   if (dashboardStatsError) return <div>Something went wrong!</div>;

//   // -----------------------------
//   // ✅ MAP API DATA → chartData
//   // -----------------------------
//   const salesTrend = dashboardStats?.data?.salesTrend || [];

//   const chartData = salesTrend.map((item: any) => ({
//       day: item.date,             // or format if needed
//       sales: item.revenue,        // using revenue as "sales"
//       earnings: item.revenue,     // same API doesn't provide separate earnings
//   }));

//   return (
//     <div className="rounded-xl border shadow-sm border-gray-100 p-6">
//       <div className="flex items-center justify-between md:flex-row flex-col mb-6">
//         <h2 className="text-lg font-semibold text-gray-900">Sales & Earnings Trend</h2>
//       </div>

//       <div className="h-[400px]">
//         <ResponsiveContainer width="100%" height="100%">
//           <LineChart data={chartData}>
//             <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//             <XAxis
//               dataKey="day"
//               axisLine={false}
//               tickLine={false}
//               tick={{ fill: "#6b7280", fontSize: 12 }}
//             />
//             <YAxis
//               axisLine={false}
//               tickLine={false}
//               tick={{ fill: "#6b7280", fontSize: 12 }}
//             />
//             <Tooltip />
//             <Line
//               type="monotone"
//               dataKey="sales"
//               stroke="#3b82f6"
//               strokeWidth={2}
//               dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
//             />
//             <Line
//               type="monotone"
//               dataKey="earnings"
//               stroke="#f97316"
//               strokeWidth={2}
//               dot={{ fill: "#f97316", strokeWidth: 2, r: 4 }}
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }



"use client"

import PageLoader from "@/app/loading";
import { useGetDashboardStatsQuery } from "@/redux/features/stats/statsApi";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

interface SalesTrendItem {
  date: string;
  revenue: number;
}

export function SalesChart() {

  const { data: dashboardStats, isLoading, isError } =
    useGetDashboardStatsQuery(undefined);

  if (isLoading) return <PageLoader />;
  if (isError) return <div>Something went wrong!</div>;

  // Extract actual trend array
  const apiTrend = (dashboardStats?.data?.salesTrend ?? []) as SalesTrendItem[];

  // Convert to chart format
  const trendData = apiTrend.map((item) => ({
    day: item.date,          // X-axis label
    sales: item.revenue,     // First line
    earnings: item.revenue,  // Second line
  }));

  // Ensure chart shows line even with only 1 point
  const normalizedData =
    trendData.length <= 1
      ? [
          { day: "Prev", sales: 0, earnings: 0 },
          ...trendData,
        ]
      : trendData;

  return (
    <div className="rounded-xl border shadow-sm border-gray-100 p-6">
      <div className="flex items-center justify-between md:flex-row flex-col mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Sales & Earnings Trend</h2>
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={normalizedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="earnings"
              stroke="#f97316"
              strokeWidth={2}
              dot={{ fill: "#f97316", strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
