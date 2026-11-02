"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const chartData = [
  { day: "Mon", sales: 1200, earnings: 1100 },
  { day: "Tue", sales: 1900, earnings: 1400 },
  { day: "Wed", sales: 700, earnings: 800 },
  { day: "Thu", sales: 1500, earnings: 1300 },
  { day: "Fri", sales: 2100, earnings: 1700 },
  { day: "Sat", sales: 2700, earnings: 2100 },
  { day: "Sun", sales: 1400, earnings: 1200 },
]

export function PaymentEarningChart() {
  return (
    <div className="bg-gray-50 rounded-xl p-6 mt-4">
      <div className="flex items-center justify-between md:flex-row flex-col mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Sales & Earnings Trend</h2>
        <Select defaultValue="current-week">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current-week">Current Week</SelectItem>
            <SelectItem value="last-week">Last Week</SelectItem>
            <SelectItem value="last-month">Last Month</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              domain={[0, 3000]}
              ticks={[0, 700, 1400, 2100, 2800]}
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
