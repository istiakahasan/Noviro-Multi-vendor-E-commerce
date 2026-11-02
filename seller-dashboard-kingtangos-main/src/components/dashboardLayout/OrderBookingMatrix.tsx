import { Users, TrendingUp, Calendar } from "lucide-react";
import { FaEuroSign } from "react-icons/fa";

// Props interface for the component
interface DashboardOverview {
  status: {
    totalOrder: number;
    totalservieceBooking: number;
    totalSubscription: number;
    consultationBooking: number;
    totalPendingOrder: number;
  };
}

interface OrderBookingMatrixProps {
  data?: DashboardOverview;
}

const metricsData = (overviewData: DashboardOverview['status'] | null) => [
  {
    title: "Total Sales",
    value: overviewData?.totalOrder || 0,
    change: "+12.5%",
    changeLabel: "from yesterday",
    icon: FaEuroSign,
    bgColor: "bg-gradient-to-r from-[#FFDFD4] to-[#FF9E7D]",
    iconBgColor: "bg-white",
  },
  {
    title: "Active Subscriptions",
    value: overviewData?.totalSubscription || 0,
    change: "+15",
    changeLabel: "new this week",
    icon: Users,
    bgColor: "bg-gradient-to-r from-[#D0E4FF] to-[#78B3FF]",
    iconBgColor: "bg-white",
  },
  {
    title: "Total Earnings",
    value: `€${(overviewData?.totalOrder || 0) * 100}`, // Assuming each order is $100 for demonstration
    change: "+8.2%",
    changeLabel: "this month",
    icon: TrendingUp,
    bgColor: "bg-gradient-to-r from-[#FDCACA] to-[#FF8282]",
    iconBgColor: "bg-white",
  },
  {
    title: "Upcoming Consultations",
    value: overviewData?.consultationBooking || 0,
    change: "3 today,",
    changeLabel: "5 tomorrow",
    icon: Calendar,
    bgColor: "bg-gradient-to-r from-[#E6D2FF] to-[#C391FF]",
    iconBgColor: "bg-white",
  },
];

export function OrderBookingMatrix({ data }: OrderBookingMatrixProps) {
  // Use the API data if available, otherwise use empty state
  const metrics = metricsData(data?.status || null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => {
        const IconComponent = metric.icon;
        
        return (
          <div
            key={index}
            className={`${metric.bgColor} rounded-xl p-6 flex flex-col justify-between h-full`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-700 mb-14">{metric.title}</p>
                <p className="text-3xl font-bold text-gray-900">
                  {metric.value}
                </p>
              </div>
              <div className={`${metric.iconBgColor} p-2 rounded-lg`}>
                <IconComponent className="w-6 h-6 text-gray-700" />
              </div>
            </div>
            {/* <div className="mt-4">
              <span className="text-sm font-medium text-gray-700">
                {metric.change}
              </span>
              <span className="text-sm text-gray-600 ml-1">
                {metric.changeLabel}
              </span>
            </div> */}
          </div>
        );
      })}
    </div>
  );
}