// "use client";
// import React from "react";
// import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// // 1️⃣ Data type - index signature যোগ করলাম
// interface RevenueData {
//   [key: string]: string | number | undefined;
//   name: "Products" | "Services" | "Consultations" | "Subscriptions";
//   value: number;
//   color: string;
// }

// // 2️⃣ Chart data
// const data: RevenueData[] = [
//   { name: "Products", value: 45, color: "#4285F4" },
//   { name: "Services", value: 30, color: "#34A853" },
//   { name: "Consultations", value: 15, color: "#FBBC05" },
//   { name: "Subscriptions", value: 10, color: "#9B59B6" },
// ];

// // 3️⃣ Custom Tooltip Component
// interface CustomTooltipProps {
//   active?: boolean;
//   payload?: Array<{
//     payload: RevenueData;
//   }>;
// }

// const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
//   if (active && payload && payload.length > 0) {
//     const dataItem = payload[0].payload;
//     return (
//       <div className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs shadow-sm">
//         <p className="m-0 font-medium" style={{ color: dataItem.color }}>
//           {`${dataItem.name}: ${dataItem.value}%`}
//         </p>
//       </div>
//     );
//   }
//   return null;
// };

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// const renderCustomLabel = (props: any) => {
//   const { cx, cy, midAngle, innerRadius, outerRadius, value, name } = props;

//   // 👇 Safely convert to numbers
//   const numericCx = typeof cx === "number" ? cx : Number(cx) || 0;
//   const numericCy = typeof cy === "number" ? cy : Number(cy) || 0;
//   const numericInner =
//     typeof innerRadius === "number" ? innerRadius : Number(innerRadius) || 0;
//   const numericOuter =
//     typeof outerRadius === "number" ? outerRadius : Number(outerRadius) || 0;
//   const numericMidAngle =
//     typeof midAngle === "number" ? midAngle : Number(midAngle) || 0;

//   const RADIAN = Math.PI / 180;
//   const radius = numericInner + (numericOuter - numericInner) * 1.3;
//   const x = numericCx + radius * Math.cos(-numericMidAngle * RADIAN);
//   const y = numericCy + radius * Math.sin(-numericMidAngle * RADIAN);

//   const color = data.find((item) => item.name === name)?.color || "#000";

//   return (
//     <text
//       x={x}
//       y={y}
//       fill={color}
//       textAnchor={x > numericCx ? "start" : "end"}
//       dominantBaseline="central"
//       className="text-[11px] font-medium"
//     >
//       {`${name} ${value}%`}
//     </text>
//   );
// };

// // 5️⃣ Main Chart Component
// const RevenueByCategoryChart: React.FC = () => {
//   return (
//     <div className="p-4 h-full rounded-xl shadow-sm">
//       <h3 className="text-base font-semibold text-gray-800 mb-3">
//         Revenue by Category
//       </h3>

//       <div className="w-full h-[240px]">
//         <ResponsiveContainer width="100%" height="100%">
//           <PieChart>
//             <Pie
//               data={data}
//               dataKey="value"
//               nameKey="name"
//               cx="50%"
//               cy="60%"
//               outerRadius={70}
//               labelLine={false}
//               label={renderCustomLabel}
//             >
//               {data.map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={entry.color} />
//               ))}
//             </Pie>
//             <Tooltip content={<CustomTooltip />} />
//           </PieChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default RevenueByCategoryChart;



"use client";

import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useGetDashboardStatsQuery } from "@/redux/features/stats/statsApi";

// 1️⃣ Type
interface RevenueData {
  [key: string]: string | number;
  name: string;
  value: number;
  color: string;
}

// 2️⃣ Color Mapping (Optional but recommended)
const COLOR_MAP: Record<string, string> = {
  Products: "#4285F4",
  Services: "#34A853",
  Consultations: "#FBBC05",
  Subscriptions: "#9B59B6",
};

// 3️⃣ Tooltip
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: RevenueData }>;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length > 0) {
    const dataItem = payload[0].payload;
    return (
      <div className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs shadow-sm">
        <p className="m-0 font-medium" style={{ color: dataItem.color }}>
          {`${dataItem.name}: ${dataItem.value}`}
        </p>
      </div>
    );
  }
  return null;
};

// 4️⃣ Label renderer
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderCustomLabel = (props: any) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, value, name } = props;

  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 1.3;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  const color = COLOR_MAP[name] || "#000";

  return (
    <text
      x={x}
      y={y}
      fill={color}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="text-[11px] font-medium"
    >
      {`${name} ${value}`}
    </text>
  );
};

// 5️⃣ Main Component
const RevenueByCategoryChart: React.FC = () => {
  const { data, isLoading, isError } = useGetDashboardStatsQuery();

  if (isLoading)
    return (
      <div className="p-4 h-full rounded-xl shadow-sm animate-pulse bg-gray-100"></div>
    );

  if (isError) return <div>Error loading chart</div>;

  // 6️⃣ Transform API → Chart Data
  const rawData = data?.data?.revenueByFeature || [];

  const chartData: RevenueData[] = rawData.map((item) => ({
    name: item.label,
    value: item.value,
    color: COLOR_MAP[item.label] || "#8884d8", // fallback color
  }));

  return (
    <div className="p-4 h-full rounded-xl shadow-sm">
      <h3 className="text-base font-semibold text-gray-800 mb-3">
        Revenue by Category
      </h3>

      <div className="w-full h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="60%"
              outerRadius={70}
              labelLine={false}
              label={renderCustomLabel}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>

            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueByCategoryChart;
