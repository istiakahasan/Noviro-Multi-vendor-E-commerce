"use client"

import { Card } from "@/components/ui/card"
import { useGetAllReportQuery } from "@/redux/api/report api/reportApi"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"


// Define the type for API response
interface SalesTrendData {
  period: string
  sales: number
}

// interface ApiResponse {
//   success: boolean
//   message: string
//   data: {
//     salesTrend: SalesTrendData[]
//     // Add other fields if they exist in your API response
//   }
// }

export function SalesTrendChart() {
  // Fetch data from API
  const { data: apiData, isLoading, isError } = useGetAllReportQuery({})
  
  // Transform API data to match chart format
  const transformData = (salesTrend: SalesTrendData[]) => {
    // Map days to proper order starting from Monday
    const dayOrder = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
    
    // Sort data based on day order
    const sortedData = [...salesTrend].sort((a, b) => {
      return dayOrder.indexOf(a.period) - dayOrder.indexOf(b.period)
    })
    
    // Transform to chart data format (using earnings = 0 if not provided)
    return sortedData.map(item => ({
      name: item.period,
      sales: item.sales,
      earnings: 0 // Add earnings if available in API response, otherwise keep as 0
    }))
  }
  
  // Prepare chart data
  const chartData = apiData?.data?.salesTrend 
    ? transformData(apiData.data.salesTrend)
    : []
  
  // Loading state
  if (isLoading) {
    return (
      <Card className="p-6 rounded-xl border border-border">
        <h3 className="text-lg font-semibold mb-4">Sales & Earnings Trend</h3>
        <div className="h-[300px] flex items-center justify-center">
          <p>Loading chart data...</p>
        </div>
      </Card>
    )
  }
  
  // Error state
  if (isError) {
    return (
      <Card className="p-6 rounded-xl border border-border">
        <h3 className="text-lg font-semibold mb-4">Sales & Earnings Trend</h3>
        <div className="h-[300px] flex items-center justify-center">
          <p className="text-red-500">Failed to load chart data</p>
        </div>
      </Card>
    )
  }
  
  return (
    <Card className="p-6 rounded-xl border border-border">
      <h3 className="text-lg font-semibold mb-4">Sales & Earnings Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="sales" 
            stroke="#3b82f6" 
            strokeWidth={2}
            name="Sales"
          />
          <Line 
            type="monotone" 
            dataKey="earnings" 
            stroke="#f97316" 
            strokeWidth={2}
            name="Earnings"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}