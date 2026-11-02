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

// export function MatrixForTrack() {
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













// components/subscriptions/MatrixForTrack.tsx
import {
  RefreshCw,
  DollarSign,
  TrendingUp,
  Crown,
  Wallet,
  AlertCircle,
} from "lucide-react";
import { useGetSubscriptionTrackQuery } from "@/redux/features/stats/statsApi";
import { cn } from "@/lib/utils";
import { FaEuroSign } from "react-icons/fa";

// -----------------------------
// FIXED TYPES
// -----------------------------
interface TopPlan {
  planName: string;
  revenue: number;
}

interface SubscriptionReportData {
  totalActiveSubscriptions: number;
  monthlyRecurringRevenue: number;
  churnRate: number;
  topPerformingPlans: TopPlan[];
  sellerEarnings: number;
}

export function MatrixForTrack() {
  const { data, isLoading, isError } = useGetSubscriptionTrackQuery();

  // SAFE extraction + fallback
  const subscriptionData: SubscriptionReportData = data?.data ?? {
    totalActiveSubscriptions: 0,
    monthlyRecurringRevenue: 0,
    churnRate: 0,
    topPerformingPlans: [],
    sellerEarnings: 0,
  };

  // -----------------------------
  // FIXED COLOR TYPE + MAP
  // -----------------------------
  type ColorKey = "blue" | "green" | "pink" | "purple" | "orange";

  const colorMap: Record<
    ColorKey,
    { bg: string; text: string; ring: string }
  > = {
    blue: { bg: "bg-blue-100", text: "text-blue-600", ring: "ring-blue-200" },
    green: {
      bg: "bg-green-100",
      text: "text-green-600",
      ring: "ring-green-200",
    },
    pink: { bg: "bg-pink-100", text: "text-pink-600", ring: "ring-pink-200" },
    purple: {
      bg: "bg-purple-100",
      text: "text-purple-600",
      ring: "ring-purple-200",
    },
    orange: {
      bg: "bg-orange-100",
      text: "text-orange-600",
      ring: "ring-orange-200",
    },
  };

  // -----------------------------
  // METRICS ARRAY FIXED
  // -----------------------------
  const metrics = [
    {
      title: "Total Active Subscriptions",
      value: subscriptionData.totalActiveSubscriptions,
      format: "number",
      icon: RefreshCw,
      color: "blue" as ColorKey,
    },
    {
      title: "Monthly Recurring Revenue",
      value: subscriptionData.monthlyRecurringRevenue,
      format: "currency",
      icon: FaEuroSign,
      color: "green" as ColorKey,
    },
    {
      title: "Churn Rate",
      value: subscriptionData.churnRate,
      format: "percent",
      icon: TrendingUp,
      color: "pink" as ColorKey,
      isNegative: true,
    },
    {
      title: "Top Performing Plan",
      planName: subscriptionData.topPerformingPlans[0]?.planName ?? "No plans yet",
      revenue: subscriptionData.topPerformingPlans[0]?.revenue ?? 0,
      icon: Crown,
      color: "purple" as ColorKey,
      highlighted: true,
    },
    {
      title: "Seller-wise Earnings",
      value: subscriptionData.sellerEarnings,
      format: "currency",
      subtitle: "Total paid to sellers this month",
      icon: Wallet,
      color: "orange" as ColorKey,
    },
  ];

  const gridClasses =
    "grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5";

  // -----------------------------
  // LOADING UI
  // -----------------------------
  if (isLoading) {
    return (
      <div className={gridClasses}>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm animate-pulse"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-9 bg-gray-300 rounded w-24"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
        ))}
      </div>
    );
  }

  // -----------------------------
  // ERROR UI
  // -----------------------------
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <AlertCircle className="w-12 h-12 mb-4 text-red-400" />
        <p className="text-lg font-medium">Failed to load subscription data</p>
        <p className="text-sm mt-1">Please try again later</p>
      </div>
    );
  }

  // -----------------------------
  // NORMAL RENDER
  // -----------------------------
  return (
    <div className={gridClasses}>
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        const colors = colorMap[metric.color];

        return (
          <div
            key={index}
            className={cn(
              "relative overflow-hidden rounded-2xl border p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
              metric.highlighted
                ? "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
                : "bg-white border-gray-100"
            )}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">{metric.title}</p>

                {/* Main Value */}
                <p className="text-3xl font-bold text-gray-900">
                  {metric.planName ??
                    (metric.format === "currency"
                      ? `€${Number(metric.value).toLocaleString()}`
                      : metric.format === "percent"
                      ? `${metric.value}%`
                      : Number(metric.value).toLocaleString())}
                </p>

                {metric.subtitle && (
                  <p className="text-xs text-gray-500">{metric.subtitle}</p>
                )}

                {metric.revenue !== undefined && (
                  <p className="text-xs font-medium text-purple-700 mt-2">
                    €{Number(metric.revenue).toLocaleString()} revenue
                  </p>
                )}
              </div>

              {/* Icon */}
              <div className="relative">
                <div
                  className={cn(
                    "absolute inset-0 rounded-full opacity-30 scale-150 blur-xl",
                    colors.ring.replace("ring-", "bg-")
                  )}
                />
                <div className={cn("relative rounded-full p-3", colors.bg)}>
                  <Icon className={cn("w-6 h-6", colors.text)} />
                </div>
              </div>
            </div>

            {metric.highlighted && (
              <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-purple-600 px-3 py-1.5 text-xs font-bold text-white">
                <Crown className="w-3.5 h-3.5" />
                Top Plan
              </div>
            )}

            {metric.isNegative && (
              <div className="mt-3 flex items-center gap-1">
                <span
                  className={cn(
                    "text-xs font-semibold",
                    metric.value <= 5 ? "text-green-600" : "text-red-600"
                  )}
                >
                  {metric.value <= 5 ? "Healthy" : "Needs Attention"}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
