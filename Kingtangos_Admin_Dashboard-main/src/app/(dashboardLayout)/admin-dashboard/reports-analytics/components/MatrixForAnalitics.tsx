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

// const MatrixForAnalitics = () => {
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

// export default MatrixForAnalitics
"use client";
import {
  DollarSign,
  ShoppingBag,
  Store,
  Users,
  TrendingUp,
  TrendingDown,
  LucideIcon,
  EuroIcon,
} from "lucide-react";
import { useGetReportAnaliticsStatsQuery } from "@/redux/features/stats/statsApi";
import { FaEuroSign } from "react-icons/fa";

// Types
interface MonthlyRevenue {
  month: string;
  revenue: number;
}

interface RevenueStats {
  totalRevenue: number;
}

interface OrderStats {
  totalOrders: number;
  growthRate: number;
}

interface SellerStats {
  totalSellers: number;
  growthRate: number;
}

interface UserStats {
  totalUsers: number;
  growthRate: number;
}

interface StatsData {
  revenuests?: RevenueStats;
  revenueGrowth?: number;
  monthlyRevenueTrend?: MonthlyRevenue[];
  orders?: OrderStats;
  activeSellers?: SellerStats;
  activeUsers?: UserStats;
}

interface StatsResponse {
  data?: StatsData;
}

interface Metric {
  title: string;
  value: number;
  change?: number;
  prefix?: string;
  suffix?: string;
  icon: LucideIcon;
  bgColor: string;
  textColor: string;
  changeText: string;
  positive: boolean;
}

const MatrixForAnalitics = () => {
  const { data, isLoading } = useGetReportAnaliticsStatsQuery();
  const stats = data?.data as StatsData | undefined;

  console.log(stats);

  // Find current month revenue (Nov has 150.99, others 0)
  const currentMonthRevenue =
    stats?.monthlyRevenueTrend?.find((item: MonthlyRevenue) => item.revenue > 0)
      ?.revenue || 0;

  const metrics: Metric[] = [
    {
      title: "Total Revenue",
      value: stats?.revenuests?.totalRevenue ?? 0,
      change: stats?.revenueGrowth ?? 0,
      prefix: "€",
      icon: EuroIcon,
      bgColor: "bg-green-100",
      textColor: "text-green-600",
      changeText:
        currentMonthRevenue > 0
          ? `${currentMonthRevenue.toFixed(2)} earned in November`
          : "No revenue yet",
      positive: currentMonthRevenue > 0,
    },
    {
      title: "Total Orders",
      value: stats?.orders?.totalOrders ?? 0,
      change: stats?.orders?.growthRate ?? 0,
      icon: ShoppingBag,
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-600",
      changeText: `${stats?.orders?.totalOrders ?? 0} orders all time`,
      positive: true,
    },
    {
      title: "Active Sellers",
      value: stats?.activeSellers?.totalSellers ?? 0,
      change: stats?.activeSellers?.growthRate ?? 0,
      icon: Store,
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
      changeText: `${
        stats?.activeSellers?.totalSellers ?? 0
      } sellers registered`,
      positive: true,
    },
    {
      title: "Active Users",
      value: stats?.activeUsers?.totalUsers ?? 0,
      change: stats?.activeUsers?.growthRate ?? 0,
      icon: Users,
      bgColor: "bg-pink-100",
      textColor: "text-pink-600",
      changeText: `${stats?.activeUsers?.totalUsers ?? 0} users registered`,
      positive: true,
    },
    {
      title: "Revenue Growth",
      value: stats?.revenueGrowth ?? 0,
      suffix: "%",
      icon: TrendingUp,
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
      changeText:
        (stats?.revenueGrowth ?? 0) > 0
          ? `${stats?.revenueGrowth}% growth recorded`
          : "No growth data yet",
      positive: (stats?.revenueGrowth ?? 0) >= 0,
    },
  ];

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm animate-pulse"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-9 bg-gray-300 rounded w-24"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-40"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        const isPositive = metric.positive;

        return (
          <div
            key={index}
            className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {metric.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {metric.prefix && (
                    <span className="text-2xl">{metric.prefix}</span>
                  )}
                  {metric.value.toLocaleString()}
                  {metric.suffix && (
                    <span className="text-xl ml-1">{metric.suffix}</span>
                  )}
                </p>
              </div>
              <div className={`p-3 rounded-full ${metric.bgColor}`}>
                <Icon className={`w-6 h-6 ${metric.textColor}`} />
              </div>
            </div>
            <div
              className={`flex items-center gap-1 text-sm font-medium ${
                isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{metric.changeText}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MatrixForAnalitics;