"use client"

import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGetAllSellerDashboardActivityQuery } from "@/redux/api/dashboardOverviewApi/dashboardOverviewApi"


// Types for the API response
interface TrendData {
  date?: string
  day?: string
  week?: string
  month?: string
  sales?: number
  earnings?: number
  revenue?: number
  profit?: number
}

interface ChartData {
  period: string
  sales: number
  earnings: number
}

export function SalesChart() {
  const [selectedPeriod, setSelectedPeriod] = useState<"daily" | "weekly" | "monthly">("weekly")
  
  const { data: dashboardData, isLoading, error } = useGetAllSellerDashboardActivityQuery({})

  // Get the appropriate data based on selected period
  const getChartData = (): ChartData[] => {
    if (!dashboardData?.data?.trends) {
      return []
    }

    const trends = dashboardData.data.trends

    return transformData(trends[selectedPeriod] || [], selectedPeriod)
  }

  // Transform data based on period type
  const transformData = (data: TrendData[], periodType: "daily" | "weekly" | "monthly"): ChartData[] => {
    if (data.length === 0) return []

    return data.map((item, index) => ({
      period: getPeriodLabel(item, index, periodType),
      sales: item.sales || item.revenue || 0,
      earnings: item.earnings || item.profit || 0,
    }))
  }

  // Helper function to generate period labels
  const getPeriodLabel = (item: TrendData, index: number, periodType: string): string => {
    // First try to use the item's own properties
    if (item.day) return item.day
    if (item.week) return item.week
    if (item.month) return item.month
    if (item.date) {
      return new Date(item.date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
    }

    // Fallback to default labels based on period type
    switch (periodType) {
      case "daily":
        const hours = ["12 AM", "2 AM", "4 AM", "6 AM", "8 AM", "10 AM", "12 PM", "2 PM", "4 PM", "6 PM", "8 PM", "10 PM"]
        return hours[index] || `Hour ${index + 1}`
      case "weekly":
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        return days[index] || `Day ${index + 1}`
      case "monthly":
        return `Week ${index + 1}`
      default:
        return `Period ${index + 1}`
    }
  }

  const chartData = getChartData()
  
  // Calculate dynamic YAxis domain
  const getYAxisDomain = () => {
    if (chartData.length === 0) return [0, 1000]
    
    const maxValue = Math.max(
      ...chartData.map(item => Math.max(item.sales, item.earnings))
    )
    return [0, Math.ceil(maxValue * 1.1)] // Add 10% padding
  }

  const [yMin, yMax] = getYAxisDomain()

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6">
        <div className="flex items-center justify-between md:flex-row flex-col mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Sales & Earnings Trend</h2>
          <Select value={selectedPeriod} disabled>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
          </Select>
        </div>
        <div className="h-[400px] flex items-center justify-center">
          <div className="text-gray-500">Loading chart data...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl p-6">
        <div className="flex items-center justify-between md:flex-row flex-col mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Sales & Earnings Trend</h2>
          <Select value={selectedPeriod} onValueChange={(value: "daily" | "weekly" | "monthly") => setSelectedPeriod(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="h-[400px] flex items-center justify-center">
          <div className="text-red-500">Error loading chart data</div>
        </div>
      </div>
    )
  }

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6">
        <div className="flex items-center justify-between md:flex-row flex-col mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Sales & Earnings Trend</h2>
          <Select value={selectedPeriod} onValueChange={(value: "daily" | "weekly" | "monthly") => setSelectedPeriod(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="h-[400px] flex items-center justify-center">
          <div className="text-gray-500">No data available for {selectedPeriod} period</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl p-6">
      <div className="flex items-center justify-between md:flex-row flex-col mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Sales & Earnings Trend</h2>
        <Select value={selectedPeriod} onValueChange={(value: "daily" | "weekly" | "monthly") => setSelectedPeriod(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="period" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#6b7280", fontSize: 12 }} 
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              domain={[yMin, yMax]}
              tickCount={6}
            />
            <Tooltip 
              formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]}
              labelFormatter={(label) => `Period: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="sales"
              name="Sales"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="earnings"
              name="Earnings"
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