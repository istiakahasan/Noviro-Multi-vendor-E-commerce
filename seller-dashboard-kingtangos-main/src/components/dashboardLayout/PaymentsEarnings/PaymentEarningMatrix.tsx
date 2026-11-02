import { DollarSign, Users, TrendingUp, Calendar } from "lucide-react"

const metricsData = [
  {
    title: "Total Sales",
    value: "2,350",
    change: "+12.5%",
    changeLabel: "from yesterday",
    icon: DollarSign,
    bgColor: "bg-gradient-to-r from-[#FFDFD4] to-[#FF9E7D]",
    iconBgColor: "bg-white",
  },
  {
    title: "Upcoming Payouts",
    value: "790",
    change: "+15",
    changeLabel: "new this week",
    icon: Users,
    bgColor: "bg-gradient-to-r from-[#D0E4FF] to-[#78B3FF]",
    iconBgColor: "bg-white",
  },
  {
    title: "Pending Payouts",
    value: "18,420",
    change: "+8.2%",
    changeLabel: "this month",
    icon: TrendingUp,
    bgColor: "bg-gradient-to-r from-[#FDCACA] to-[#FF8282]",
    iconBgColor: "bg-white",
  },
  {
    title: "Withdrawable Balance",
    value: "2,350",
    change: "3 today,",
    changeLabel: "5 tomorrow",
    icon: Calendar,
    bgColor: "bg-gradient-to-r from-#E6D2FF] to-[#C391FF]",
    iconBgColor: "bg-white",
  },
]


export function PaymentEarningMatrix() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metricsData.map((metric, index) => {
        return (
          <div key={index} className={`${metric.bgColor} rounded-xl p-6 flex flex-col justify-between h-full`}>
            <div className="flex items-start justify-between ">
              <div>
                <p className="text-sm text-gray-700 mb-14">{metric.title}</p>
                <p className="text-3xl font-bold text-gray-900">€{metric.value}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}