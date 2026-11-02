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

export default function AllOrdersPage() {
  const router = useRouter()
  const { data, isLoading, isError } = useGetAllSellerDashboardActivityQuery({})

  if (isLoading) return <p className="text-center py-8">Loading...</p>
  if (isError || !data?.data?.recentActivity) return <p className="text-center py-8">Error loading data</p>

  const { orders, bookings, subscriptions } = data.data.recentActivity

  // Helper function to safely format dates
  const safeFormatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A"
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return "Invalid Date"
      return format(date, "PPpp")
    } catch {
      return "Invalid Date"
    }
  }

  // Helper function to safely create Date object
  const safeCreateDate = (dateString: string | null | undefined) => {
    if (!dateString) return new Date(0) // Return epoch date as fallback
    try {
      const date = new Date(dateString)
      return isNaN(date.getTime()) ? new Date(0) : date
    } catch {
      return new Date(0)
    }
  }

  // Map backend data to a unified structure for rendering
  const allActivity = [
    ...bookings.map((item: any) => ({
      id: item.id,
      name: `${item.user?.firstName || ""} ${item.user?.lastName || ""}`.trim() || "Unknown User",
      email: item.user?.email || "Unknown",
      type: "Order" as const,
      amount: `€${item.totalAmount?.toFixed(2) || "0.00"}`,
      status: item.orderStatus || item.paymentStatus || "UNKNOWN",
      time: safeFormatDate(item.createdAt),
      date: safeCreateDate(item.createdAt),
    })),
    
    ...subscriptions.map((booking: any) => ({
      id: booking.id,
      name: `${booking.user?.firstName || ""} ${booking.user?.lastName || ""}`.trim() || "Unknown User",
      email: booking.user?.email || "Unknown",
      type: "Booking" as const,
      amount: booking.service
        ? `€${booking.service.price?.toFixed(2) || "0.00"}`
        : booking.consultation
        ? `€${booking.consultation.price?.toFixed(2) || "0.00"}`
        : "€0.00",
      status: booking.status || "UNKNOWN",
      time: safeFormatDate(booking.createdAt),
      date: safeCreateDate(booking.createdAt),
    })),
    
    ...orders.map((order: any) => ({
      id: order.id,
      name: `${order.user?.firstName || ""} ${order.user?.lastName || ""}`.trim() || "Unknown User",
      email: order.user?.email || "Unknown",
      type: "Subscription" as const,
      amount: `€${order.amount?.toFixed(2) || "0.00"}`,
      status: order.paymentStatus || order.status || "UNKNOWN",
      time: safeFormatDate(order.createdAt),
      date: safeCreateDate(order.createdAt),
    })),
  ]

  // Sort by time (newest first)
  const sortedActivity = allActivity.sort((a, b) => b.date.getTime() - a.date.getTime())

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Orders & Bookings</h1>
          <p className="text-gray-600 mt-2">Total {sortedActivity.length} activities</p>
        </div>
        <button 
          onClick={() => router.back()}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="bg-white rounded-xl border">
        <div className="p-6">
          <div className="space-y-4">
            {sortedActivity.length > 0 ? (
              sortedActivity.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-4 border-b last:border-b-0">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500 mt-1">{item.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge 
                        className={typeColors[item.type as keyof typeof typeColors]}
                        variant="secondary"
                      >
                        {item.type}
                      </Badge>
                      <span className="text-sm text-gray-500">{item.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="font-semibold text-gray-900 text-lg">{item.amount}</span>
                    <Badge className={statusColors[item.status as keyof typeof statusColors] || "bg-gray-200 text-gray-700"}>
                      {item.status.toLowerCase()}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No activities found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}