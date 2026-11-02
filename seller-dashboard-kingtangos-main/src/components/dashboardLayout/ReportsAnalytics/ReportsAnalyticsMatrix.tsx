import { useGetAllReportQuery } from "@/redux/api/report api/reportApi"
import { Users, TrendingUp, Calendar } from "lucide-react"
import { FaEuroSign } from "react-icons/fa"


const metricsConfig = [
  {
    title: "Total Sales",
    valueKey: "totalRevenue",
    change: "+12.5%",
    changeLabel: "from yesterday",
    icon: FaEuroSign,
    bgColor: "bg-gradient-to-r from-[#FFDFD4] to-[#FF9E7D]",
    iconBgColor: "bg-white",
    formatValue: (value: number) => `€${value.toLocaleString()}`,
  },
  {
    title: "Upcoming Payouts",
    valueKey: "totalOrders",
    change: "+15",
    changeLabel: "new this week",
    icon: Users,
    bgColor: "bg-gradient-to-r from-[#D0E4FF] to-[#78B3FF]",
    iconBgColor: "bg-white",
    formatValue: (value: number) => value.toLocaleString(),
  },
  {
    title: "Pending Payouts",
    valueKey: "averageOrderValue",
    change: "+8.2%",
    changeLabel: "this month",
    icon: TrendingUp,
    bgColor: "bg-gradient-to-r from-[#FDCACA] to-[#FF8282]",
    iconBgColor: "bg-white",
    formatValue: (value: number) => `€${value.toLocaleString()}`,
  },
  {
    title: "Withdrawable Balance",
    valueKey: "totalCancellations",
    change: "3 today,",
    changeLabel: "5 tomorrow",
    icon: Calendar,
    bgColor: "bg-gradient-to-r from-[#E6D2FF] to-[#C391FF]",
    iconBgColor: "bg-white",
    formatValue: (value: number) => value.toLocaleString(),
  },
]

export function ReportsAnalyticsMatrix() {
  // Fetch report data from API
  const { data, isLoading, error } = useGetAllReportQuery({})
  
  // Extract summary data from API response
  const summaryData = data?.data?.summary || {
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    totalCancellations: 0
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricsConfig.map((_, index) => (
          <div key={index} className="rounded-xl p-6 bg-gray-100 animate-pulse h-32"></div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl p-6 bg-red-50 border border-red-200 text-red-600">
        <p>Error loading analytics data. Please try again.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metricsConfig.map((metric, index) => {
        // Get the actual value from the API response
        const rawValue = summaryData[metric.valueKey as keyof typeof summaryData] || 0
        // Format the value according to the metric configuration
        const formattedValue = metric.formatValue(Number(rawValue))
        
        return (
          <div key={index} className={`${metric.bgColor} rounded-xl p-6 flex flex-col justify-between h-full`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-700 mb-14">{metric.title}</p>
                <p className="text-3xl font-bold text-gray-900">{formattedValue}</p>
                {/* <div className="flex items-center mt-2">
                  <span className="text-sm font-medium text-gray-800">{metric.change}</span>
                  <span className="text-sm text-gray-600 ml-1">{metric.changeLabel}</span>
                </div> */}
              </div>
              <div className={`${metric.iconBgColor} p-2 rounded-lg`}>
                <metric.icon className="h-6 w-6 text-gray-700" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}