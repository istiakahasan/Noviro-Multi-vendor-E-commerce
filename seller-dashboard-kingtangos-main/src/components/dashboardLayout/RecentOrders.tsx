/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Badge } from "@/components/ui/badge"
import { useGetAllSellerDashboardActivityQuery } from "@/redux/api/dashboardOverviewApi/dashboardOverviewApi"
import { format } from "date-fns"
import { useRouter } from "next/navigation"

const statusColors = {
  PENDING: "bg-gray-200 text-gray-700 hover:bg-gray-300",
  CONFIRMED: "bg-gray-200 text-gray-700 hover:bg-gray-300",
  CANCELLED: "bg-gray-200 text-gray-700 hover:bg-gray-300",
  ACTIVE: "bg-gray-200 text-gray-700 hover:bg-gray-300",
  COMPLETED: "bg-gray-900 text-white hover:bg-gray-800",
  PAID: "bg-gray-900 text-white hover:bg-gray-800",
}

const typeColors = {
  Order: "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200",
  Booking: "bg-green-100 text-green-700 hover:bg-green-200 border-green-200",
  Subscription: "bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200",
}

// Helper function to safely format dates
const safeFormatDate = (dateString: any): string => {
  if (!dateString) return "N/A";
  
  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn("Invalid date string:", dateString);
      return "Invalid Date";
    }
    
    return format(date, "PPpp");
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Date Error";
  }
}

export function RecentOrders() {
  const router = useRouter()
  // Fetch backend data
  const { data, isLoading, isError } = useGetAllSellerDashboardActivityQuery({})

  if (isLoading) return <p>Loading...</p>
  if (isError || !data?.data?.recentActivity) return <p>Error loading data</p>

  const { orders, bookings, subscriptions } = data.data.recentActivity

  // Map backend data to a unified structure for rendering
  const activity = [
    // Process orders from bookings array (since that's where they are in the API response)
    ...bookings.map((item: any) => ({
      id: item.id,
      name: `${item.user?.firstName || "Unknown"} ${item.user?.lastName || ""}`.trim(),
      type: "Order" as const,
      amount: `€${item.totalAmount?.toFixed(2) || "0.00"}`,
      status: item.orderStatus || item.paymentStatus || "UNKNOWN",
      time: safeFormatDate(item.createdAt),
    })),
    
    // Process bookings from subscriptions array (since that's where they are in the API response)
    ...subscriptions.map((booking: any) => ({
      id: booking.id,
      name: `${booking.user?.firstName || "Unknown"} ${booking.user?.lastName || ""}`.trim(),
      type: "Booking" as const,
      amount: booking.service
      ? `€${booking.service.price?.toFixed(2) || "0.00"}`
      : booking.consultation
        ? `€${booking.consultation.price?.toFixed(2) || "0.00"}`
        : "€0.00",
      status: booking.status || "UNKNOWN",
      time: safeFormatDate(booking.createdAt),
    })),
    
    // Process orders
    ...orders.map((order: any) => ({
      id: order.id,
      name: `${order.user?.firstName || "Unknown"} ${order.user?.lastName || ""}`.trim(),
      type: "Subscription" as const,
      amount: `€${order.amount?.toFixed(2) || "0.00"}`,
      status: order.paymentStatus || order.status || "UNKNOWN",
      time: safeFormatDate(order.createdAt),
    })),
  ]

  // Sort by time (newest first) and take only 4-6 items
  const recentActivity = activity
    .filter(item => item.name !== "Unknown") // Optional: filter out items without names
    .sort((a, b) => {
      // Handle invalid dates in sorting
      try {
        const dateA = a.time === "N/A" || a.time === "Invalid Date" ? new Date(0) : new Date(a.time);
        const dateB = b.time === "N/A" || b.time === "Invalid Date" ? new Date(0) : new Date(b.time);
        return dateB.getTime() - dateA.getTime();
      } catch {
        return 0;
      }
    })
    .slice(0, 6) // Show only latest 6 items

  const handleViewAll = () => {
    router.push('/seller-dashboard/orders')
  }

  return (
    <div className="bg-white rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Recent Orders & Bookings</h2>
        <button 
          onClick={handleViewAll}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          View All
        </button>
      </div>
      <div className="space-y-4">
        {recentActivity.length > 0 ? (
          recentActivity.map((item) => (
            <div key={`${item.type}-${item.id}`} className="flex items-center justify-between py-3 border-b last:border-b-0">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge 
                    className={typeColors[item.type as keyof typeof typeColors]}
                    variant="secondary"
                  >
                    {item.type}
                  </Badge>
                  <span className="text-sm text-gray-500">{item.time}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold text-gray-900">{item.amount}</span>
                <Badge className={statusColors[item.status as keyof typeof statusColors] || "bg-gray-200 text-gray-700"}>
                  {item.status.toLowerCase()}
                </Badge>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-4">No recent activity found</p>
        )}
      </div>
    </div>
  )
}