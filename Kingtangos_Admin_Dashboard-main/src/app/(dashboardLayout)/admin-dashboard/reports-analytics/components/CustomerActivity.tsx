// "use client";
// import React from "react";
// import { Users, UserX, Repeat2 } from "lucide-react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import { useGetCustomerActivityQuery } from "@/redux/features/stats/statsApi";
// // --- Helper Components & Data ---
// // Props for the KPI Card
// interface KpiCardProps {
//   title: string;
//   value: string;
//   icon: React.ElementType;
//   bgColor: string;
//   textColor: string;
// }
// // Reusable KPI Card Component
// const KpiCard: React.FC<KpiCardProps> = ({
//   title,
//   value,
//   icon: Icon,
//   bgColor,
//   textColor,
// }) => (
//   // Styling adjusted to match the distinct background colors in the image
//   <div
//     className={`p-5 rounded-xl flex flex-col justify-between h-32 ${bgColor} border border-gray-100`}
//   >
//     <div className="flex items-center justify-between">
//       <p className={`text-sm font-medium ${textColor}`}>{title}</p>
//     </div>
//     <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
//   </div>
// );
// // Chart Data (Based on image approximation)
// const chartData = [
//   { name: "Jan", Active: 4200, Inactive: 1800 },
//   { name: "Feb", Active: 4500, Inactive: 1200 },
//   { name: "Mar", Active: 5000, Inactive: 900 },
//   { name: "Apr", Active: 5200, Inactive: 600 },
//   { name: "May", Active: 5800, Inactive: 400 },
//   { name: "Jun", Active: 6100, Inactive: 200 },
// ];
// // Custom Tooltip content for Recharts
// interface CustomTooltipProps {
//   active?: boolean;
//   payload?: Array<{
//     name: string;
//     value: number;
//     color: string;
//   }>;
//   label?: string;
// }
// const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="p-3  rounded-lg text-sm text-gray-700">
//         <p className="font-semibold text-gray-900 mb-1">{label}</p>
//         {payload.map((p, index: number) => (
//           <p key={index} style={{ color: p.color }}>
//             {`${p.name}: ${p.value.toLocaleString()}`}
//           </p>
//         ))}
//       </div>
//     );
//   }
//   return null;
// };
// // --- Main Component ---
// const CustomerActivity: React.FC = () => {

// const {data, isLoading, isError} = useGetCustomerActivityQuery();
// console.log(data);

//   return (
//     <div className="shadow-sm rounded-xl w-full mx-auto border border-gray-100 font-sans p-6">
//       {/* Header */}
//       <h2 className="text-xl font-semibold text-gray-900">Customer Activity</h2>
//       <p className="mt-0.5 text-sm text-gray-500 mb-6">
//         Active vs inactive customers over time
//       </p>
//       {/* KPI Cards Grid - Matching Image exactly */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//         {/* Active Customers (Light Blue/Indigo) */}
//         <KpiCard
//           title="Active Customers"
//           value="6,200"
//           icon={Users}
//           bgColor="bg-indigo-50/70"
//           textColor="text-indigo-800"
//         />
//         {/* Inactive Customers (Light Gray) */}
//         <KpiCard
//           title="Inactive Customers"
//           value="300"
//           icon={UserX}
//           bgColor="bg-gray-50/70"
//           textColor="text-gray-800"
//         />
//         {/* Repeat Booking Rate (Light Green) */}
//         <KpiCard
//           title="Repeat Booking Rate"
//           value="68%"
//           icon={Repeat2}
//           bgColor="bg-green-50/70"
//           textColor="text-green-800"
//         />
//       </div>
//       {/* Chart Area */}
//       <div className="h-80 w-full">
//         <ResponsiveContainer width="100%" height="100%">
//           <BarChart
//             data={chartData}
//             margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
//             barCategoryGap="15%"
//           >
//             {/* Only horizontal grid lines visible in the image */}
//             <CartesianGrid
//               strokeDasharray="3 3"
//               vertical={false}
//               stroke="#E5E7EB"
//             />

//             <XAxis
//               dataKey="name"
//               stroke="#4B5563"
//               tickLine={false}
//               axisLine={false}
//               fontSize={12}
//             />
//             <YAxis
//               stroke="#D1D5DB"
//               tickLine={false}
//               axisLine={false}
//               fontSize={12}
//               tickFormatter={(value) => value / 1000 + "k"}
//               domain={[0, 8000]}
//             />
//             <Tooltip content={<CustomTooltip />} />

//             <Legend
//               align="center"
//               verticalAlign="bottom"
//               height={36}
//               iconType="square"
//               wrapperStyle={{ paddingTop: "10px" }}
//             />

//             {/* Active Customers Bar (Primary Blue color) */}
//             <Bar
//               dataKey="Active"
//               fill="#4F46E5"
//               radius={[6, 6, 0, 0]}
//               minPointSize={1}
//             />

//             {/* Inactive Customers Bar (Secondary Gray color) */}
//             <Bar
//               dataKey="Inactive"
//               fill="#9CA3AF"
//               radius={[6, 6, 0, 0]}
//               minPointSize={1}
//             />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };
// export default CustomerActivity;



"use client";
import React from "react";
import { Users, UserX, Repeat2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useGetCustomerActivityQuery } from "@/redux/features/stats/statsApi";

// --- Reusable KPI Card ---
interface KpiCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  bgColor: string;
  textColor: string;
}
interface Something{
  name?: string;
  Active?: number;
  Inactive?: number
  color?:string;
  value?:string;
}

const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  icon: Icon,
  bgColor,
  textColor,
}) => (
  <div className={`p-5 rounded-xl flex flex-col justify-between h-32 ${bgColor} border border-gray-100`}>
    <div className="flex items-center justify-between">
      <p className={`text-sm font-medium ${textColor}`}>{title}</p>
      <Icon className={`w-5 h-5 ${textColor} opacity-80`} />
    </div>
    <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
  </div>
);

// --- Custom Tooltip ---
const CustomTooltip = ({ active, payload, label }: {active?: boolean; payload?: Something[]; label?: string}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 text-sm">
        <p className="font-semibold text-gray-900 mb-2">{label}</p>
        {payload.map((entry: Something) => (
          <p key={entry.name} style={{ color: entry.color }}>
            {entry.name}: <strong>{entry.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// --- Main Component ---
const CustomerActivity: React.FC = () => {
  const { data, isLoading, isError } = useGetCustomerActivityQuery();
console.log(data);
  const summary = data?.data?.summary;
  const monthlyTrend = data?.data?.monthlyTrend || [];

  // Transform: Show ALL months (including zero activity)
  const chartData = monthlyTrend.map((item) => ({
    name: item.month,
    Active: item.activeCustomers,
    Inactive: item.inactiveCustomers,
  }));

  // Loading State
  if (isLoading) {
    return (
      <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-xl"></div>
          ))}
        </div>
        <div className="h-80 bg-gray-100 rounded-lg"></div>
      </div>
    );
  }

  // Error State
  if (isError || !data?.success) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-6 text-center text-red-600">
        Failed to load customer activity data
      </div>
    );
  }

  // True Empty State (no customers ever)
  if (!summary || (summary.totalCustomers === 0 && chartData.length === 0)) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-6 text-center">
        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No customers registered yet</p>
        <p className="text-sm text-gray-400 mt-2">Activity will appear as users join</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-xl w-full border border-gray-100 p-6">
      {/* Header */}
      <h2 className="text-xl font-semibold text-gray-900">Customer Activity</h2>
      <p className="mt-0.5 text-sm text-gray-500 mb-6">
        Active vs inactive customers over time
      </p>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <KpiCard
          title="Active Customers"
          value={summary.activeCustomers}
          icon={Users}
          bgColor="bg-indigo-50"
          textColor="text-indigo-800"
        />
        <KpiCard
          title="Inactive Customers"
          value={summary.inactiveCustomers}
          icon={UserX}
          bgColor="bg-gray-50"
          textColor="text-gray-800"
        />
        <KpiCard
          title="Active Rate"
          value={`${summary.activePercentage.toFixed(1)}%`}
          icon={Repeat2}
          bgColor="bg-green-50"
          textColor="text-green-800"
        />
      </div>

      {/* Chart - Now shows all months including zeros */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis
              dataKey="name"
              stroke="#6B7280"
              tickLine={false}
              axisLine={false}
              fontSize={13}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis
              stroke="#D1D5DB"
              tickLine={false}
              axisLine={false}
              fontSize={12}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.025)" }} />
            <Legend
              verticalAlign="bottom"
              height={40}
              iconType="square"
              wrapperStyle={{ paddingTop: "20px" }}
            />

            <Bar dataKey="Active" fill="#4F46E5" radius={[8, 8, 0, 0]} />
            <Bar dataKey="Inactive" fill="#9CA3AF" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Optional: Subtle note */}
      {chartData.length > 0 && (
        <p className="text-xs text-gray-400 text-center mt-4">
          Showing data from {chartData[0].name} to {chartData[chartData.length - 1].name}
        </p>
      )}
    </div>
  );
};

export default CustomerActivity;