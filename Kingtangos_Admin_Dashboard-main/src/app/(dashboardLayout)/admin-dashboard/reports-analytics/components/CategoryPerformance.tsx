

// "use client";
// import { useGetRevenueByFeatureOrMonthlyQuery } from "@/redux/features/stats/statsApi";
// import React from "react";
// import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

// const CategoryPerformance: React.FC = () => {

// const {data, isLoading, isError} = useGetRevenueByFeatureOrMonthlyQuery();

// console.log(data);



//   const pieData = [
//     { name: "Product", value: 47 },
//     { name: "Service", value: 29 },
//     { name: "Subscription", value: 8 },
//     { name: "Consultation", value: 16 },
//   ];
//   const COLORS = ["#3b82f6", "#ef4444", "#f59e0b", "#8b5cf6"];

//   const renderCustomLabel = (entry: {
//     name?: string;
//     value?: string | number;
//   }): React.ReactNode => {
//     const val = typeof entry.value === "number" ? entry.value : 0;
//     const percent = val / pieData.reduce((sum, item) => sum + item.value, 0);
//     return `${entry.name || "Unknown"} ${(percent * 100).toFixed(0)}%`;
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-sm p-6">
//       <h2 className="text-xl font-bold text-gray-900 mb-4">
//         Category Performance
//       </h2>
//       <p className="text-gray-600 mb-6">Revenue by category</p>
//       ;

//       {/* Pie Chart */}
//       <div>
//         <ResponsiveContainer width="100%" height={300}>
//           <PieChart>
//             <Pie
//               data={pieData}
//               cx="50%"
//               cy="50%"
//               outerRadius={80}
//               fill="#8884d8"
//               dataKey="value"
//               label={renderCustomLabel}
//             >
//               {pieData.map((entry, index) => (
//                 <Cell
//                   key={`cell-${index}`}
//                   fill={COLORS[index % COLORS.length]}
//                 />
//               ))}
//             </Pie>
//             <Tooltip />
//           </PieChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default CategoryPerformance;










// "use client";

// import React from "react";
// import { useGetRevenueByFeatureOrMonthlyQuery } from "@/redux/features/stats/statsApi";
// import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, PieLabelRenderProps } from "recharts";

// // -----------------------
// // Types
// // -----------------------
// type RevenueCategory = {
//   label: string;
//   value: number;
//   percentage: number;
// };

// type PieDataItem = {
//   name: string;
//   value: number;
// };

// type RevenueApiResponse = {
//   success: boolean;
//   message: string;
//   data: {
//     revenueByCategory: RevenueCategory[];
//     revenueGrowth: {
//       currentMonthGrowth: number;
//       averageGrowth6Months: number;
//     };
//     monthlyTrend: {
//       month: string;
//       revenue: number;
//       growth: number;
//     }[];
//   };
// };

// // -----------------------
// // Skeleton Loader
// // -----------------------
// const SkeletonBox = ({ height }: { height: string }) => (
//   <div
//     className="animate-pulse bg-gray-200 rounded-md w-full"
//     style={{ height }}
//   />
// );

// const CircleSkeleton = () => (
//   <div className="w-full flex justify-center">
//     <div 
//       className="animate-pulse bg-gray-200 rounded-full" 
//       style={{ width: "180px", height: "180px" }} 
//     />
//   </div>
// );

// // -----------------------
// // Component
// // -----------------------
// const CategoryPerformance: React.FC = () => {
//   const { data, isLoading, isError } = useGetRevenueByFeatureOrMonthlyQuery();
// console.log(data);
//   // -----------------------
//   // Loading UI 
//   // -----------------------
//   if (isLoading) {
//     return (
//       <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
//         <SkeletonBox height="28px" /> {/* Title */}
//         <SkeletonBox height="20px" /> {/* Subtitle */}
//         <CircleSkeleton /> {/* Circular Pie Chart Skeleton */}
//       </div>
//     );
//   }

//   // -----------------------
//   // Error UI
//   // -----------------------
//   if (isError || !data?.data?.revenueByCategory || !Array.isArray(data.data.revenueByCategory) || data.data.revenueByCategory.length === 0) {
//     return (
//       <div className="bg-white rounded-lg shadow-sm p-6">
//         <p className="text-red-500">Failed to load category performance.</p>
//       </div>
//     );
//   }

//   // -----------------------
//   // Parse API Data
//   // -----------------------

//   const pieData: PieDataItem[] = data.data.revenueByCategory.map((item: RevenueCategory) => ({
//     name: item.label,
//     value: item.value,
//   }));

//   const TOTAL = pieData.reduce((sum: number, item: PieDataItem) => sum + item.value, 0);

//   const COLORS = ["#3b82f6", "#ef4444", "#f59e0b", "#8b5cf6"];

//   const renderCustomLabel = (props: PieLabelRenderProps): string => {
//     const { name, value } = props;
//     if (!name || value === undefined) return "";
//     const percentage = TOTAL === 0 ? 0 : (value / TOTAL) * 100;
//     return `${name} ${percentage.toFixed(0)}%`;
//   };

//   // -----------------------
//   // UI
//   // -----------------------
//   return (
//     <div className="bg-white rounded-lg shadow-sm p-6">
//       <h2 className="text-xl font-bold text-gray-900 mb-4">
//         Category Performance
//       </h2>
//       <p className="text-gray-600 mb-6">Revenue by category</p>

//       <ResponsiveContainer width="100%" height={300}>
//         <PieChart>
//           <Pie
//             data={pieData}
//             cx="50%"
//             cy="50%"
//             outerRadius={80}
//             dataKey="value"
//             label={renderCustomLabel}
//           >
//             {pieData.map((_: PieDataItem, i: number) => (
//               <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
//             ))}
//           </Pie>
//           <Tooltip />
//         </PieChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default CategoryPerformance;




"use client";

import React from "react";
import { useGetRevenueByFeatureOrMonthlyQuery } from "@/redux/features/stats/statsApi";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, PieLabelRenderProps } from "recharts";

// -----------------------
// Types
// -----------------------
type RevenueCategory = {
  label: string;
  value: number;
  percentage: number;
};

type PieDataItem = {
  name: string;
  value: number;
};

type RevenueApiResponse = {
  success: boolean;
  message: string;
  data: {
    revenueByCategory: RevenueCategory[];
    revenueGrowth: {
      currentMonthGrowth: number;
      averageGrowth6Months: number;
    };
    monthlyTrend: {
      month: string;
      revenue: number;
      growth: number;
    }[];
  };
};

// -----------------------
// Skeleton Loader
// -----------------------
const SkeletonBox = ({ height }: { height: string }) => (
  <div
    className="animate-pulse bg-gray-200 rounded-md w-full"
    style={{ height }}
  />
);

const CircleSkeleton = () => (
  <div className="w-full flex justify-center">
    <div 
      className="animate-pulse bg-gray-200 rounded-full" 
      style={{ width: "180px", height: "180px" }} 
    />
  </div>
);

// -----------------------
// Component
// -----------------------
const CategoryPerformance: React.FC = () => {
  const { data, isLoading, isError } = useGetRevenueByFeatureOrMonthlyQuery();
  console.log(data);

  // -----------------------
  // Loading UI 
  // -----------------------
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        <SkeletonBox height="28px" /> {/* Title */}
        <SkeletonBox height="20px" /> {/* Subtitle */}
        <CircleSkeleton /> {/* Circular Pie Chart Skeleton */}
      </div>
    );
  }

  // -----------------------
  // Error UI
  // -----------------------
  if (isError || !data?.data?.revenueByCategory || !Array.isArray(data.data.revenueByCategory) || data.data.revenueByCategory.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-red-500">Failed to load category performance.</p>
      </div>
    );
  }

  // -----------------------
  // Parse API Data
  // -----------------------
  const pieData: PieDataItem[] = data.data.revenueByCategory.map((item: RevenueCategory) => ({
    name: item.label,
    value: item.value,
  }));

  const TOTAL = pieData.reduce((sum: number, item: PieDataItem) => sum + item.value, 0);

  const COLORS = ["#3b82f6", "#ef4444", "#f59e0b", "#8b5cf6"];

  const renderCustomLabel = (props: PieLabelRenderProps): string => {
    const { name, value } = props;
    if (!name || value === undefined || value === null) return "";
    const numericValue = Number(value); // <- convert to number
    const percentage = TOTAL === 0 ? 0 : (numericValue / TOTAL) * 100;
    return `${name} ${percentage.toFixed(0)}%`;
  };

  // -----------------------
  // UI
  // -----------------------
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Category Performance
      </h2>
      <p className="text-gray-600 mb-6">Revenue by category</p>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            label={renderCustomLabel}
          >
            {pieData.map((_: PieDataItem, i: number) => (
              <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryPerformance;
