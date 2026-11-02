// import { DollarSign, Users, Store, ShoppingBag, Clock, TrendingUp } from "lucide-react"

// const metricsData = [
//   {
//     title: "Total Sellers",
//     value: "1,247",
//     change: "+12.5%",
//     positive: true,
//     icon: Store,
//     iconBgColor: "bg-blue-100 text-blue-500",
//   },
//   {
//     title: "Total Customers",
//     value: "15,384",
//     change: "+15.2%",
//     positive: true,
//     icon: Users,
//     iconBgColor: "bg-purple-100 text-purple-500",
//   },
//   {
//     title: "Active Orders Today",
//     value: "234",
//     change: "+5.1%",
//     positive: true,
//     icon: ShoppingBag,
//     iconBgColor: "bg-orange-100 text-orange-500",
//   },
//   {
//     title: "Platform Revenue",
//     value: "$48,392",
//     change: "+18.7%",
//     positive: true,
//     icon: DollarSign ,
//     iconBgColor: "bg-yellow-100 text-yellow-500",
//   },
//   {
//     title: "Pending Payouts",
//     value: "$12,450",
//     change: "-3.2%",
//     positive: false,
//     icon: Clock,
//     iconBgColor: "bg-red-100 text-red-500",
//   },
// ]

// export function MatrixCard() {
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
//       {metricsData.map((metric, index) => {
//         const Icon = metric.icon
//         return (
//           <div key={index} className="bg-white/30 rounded-xl p-6 flex flex-col justify-between shadow-sm">
//             <div className="flex items-start justify-between mb-4">
//               <div>
//                 <p className="text-sm text-gray-500 mb-1">{metric.title}</p>
//                 <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
//               </div>
//               <div className={`rounded-full p-3 ${metric.iconBgColor}`}>
//                 <Icon className="w-6 h-6" />
//               </div>
//             </div>
//             <p className={`text-sm font-medium flex items-center gap-2 ${metric.positive ? "text-green-500" : "text-red-500"}`}>
//              <TrendingUp size={16}/> 
//               {metric.change}
//             </p>
//           </div>
//         )
//       })}
//     </div>
//   )
// }



"use client";

import { DollarSign, Users, Store, ShoppingBag, Clock } from "lucide-react";
import { useGetDashboardStatsQuery } from "@/redux/features/stats/statsApi";
import { FaEuroSign } from "react-icons/fa";

export function MatrixCard() {
  const { data, isLoading, isError } = useGetDashboardStatsQuery();

  if (isLoading)
    return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-28 bg-gray-200 animate-pulse rounded-xl"></div>
      ))}
    </div>;

  if (isError) return <div>Failed to load stats</div>;

  const totals = data?.data?.totals;

  const metrics = [
    {
      title: "Total Sellers",
      value: totals?.sellers ?? 0,
      icon: Store,
      iconBgColor: "bg-blue-100 text-blue-500",
    },
    {
      title: "Total Customers",
      value: totals?.customers ?? 0,
      icon: Users,
      iconBgColor: "bg-purple-100 text-purple-500",
    },
    {
      title: "Active Orders Today",
      value: totals?.activeOrdersToday ?? 0,
      icon: ShoppingBag,
      iconBgColor: "bg-orange-100 text-orange-500",
    },
    {
      title: "Platform Revenue",
      value: totals?.totalRevenue?.toFixed(2) ?? 0,
      icon: FaEuroSign,
      iconBgColor: "bg-yellow-100 text-yellow-500",
    },
    {
      title: "Pending Payouts",
      value: totals?.pendingPayouts?.toFixed(2) ?? 0,
      icon: Clock,
      iconBgColor: "bg-red-100 text-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;

        return (
          <div
            key={index}
            className="bg-white/30 rounded-xl p-6 flex flex-col justify-between shadow-sm"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
              </div>

              <div className={`rounded-full p-3 ${metric.iconBgColor}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
