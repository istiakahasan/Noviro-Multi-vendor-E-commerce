/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  AlertCircle, 
  Calendar, 
  Clock, 
  Package, 
  Filter, 
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  Mail
} from "lucide-react"
import { format } from "date-fns"
import { useGetAllSellerDashboardActivityQuery } from "@/redux/api/dashboardOverviewApi/dashboardOverviewApi"

// Define TypeScript interfaces
interface SubscriptionUser {
  firstName: string
  lastName: string
  email: string
}

interface Service {
  id: string
  name: string
  price: number
}

interface Consultation {
  id: string
  name: string
  price: number
  startDate: string
}

interface Subscription {
  id: string
  user: SubscriptionUser
  bookingDate: string
  startTime: string
  endTime: string
  status: string
  service: Service | null
  consultation: Consultation | null
  createdAt: string
}

interface LowStockAlert {
  id: string
  name: string
  stockQuantity: number
  storeId: string
}

interface DashboardResponse {
  data?: {
    recentActivity?: {
      subscriptions?: Subscription[]
    }
    lowStockAlerts?: LowStockAlert[]
  }
}

type FilterType = "all" | "stock" | "bookings"

export function AllNotifications() {
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState<FilterType>("all")
  
  // Fetch all dashboard data with proper typing
  const { data: dashboardData, isLoading, error, refetch } = useGetAllSellerDashboardActivityQuery({}) as {
    data: DashboardResponse | undefined
    isLoading: boolean
    error: any
    refetch: () => void
  }
  
  // Extract data from API response with proper types
  const subscriptions: Subscription[] = dashboardData?.data?.recentActivity?.subscriptions || []
  const lowStockAlerts: LowStockAlert[] = dashboardData?.data?.lowStockAlerts || []
  
  // Filter subscriptions by status
  const pendingSubscriptions = subscriptions.filter((sub: Subscription) => sub.status === "PENDING")
  const completedSubscriptions = subscriptions.filter((sub: Subscription) => 
    sub.status === "COMPLETED" || sub.status === "CONFIRMED"
  )
  
  // Handle back navigation
  const handleBack = () => {
    router.back()
  }
  
  // Filter notifications based on active filter
  const getFilteredNotifications = () => {
    switch (activeFilter) {
      case "stock":
        return { lowStockAlerts, subscriptions: [] }
      case "bookings":
        return { lowStockAlerts: [], subscriptions: pendingSubscriptions }
      default:
        return { lowStockAlerts, subscriptions: pendingSubscriptions }
    }
  }
  
  const { lowStockAlerts: filteredLowStock, subscriptions: filteredSubscriptions } = getFilteredNotifications()
  
  // Calculate counts
  const totalCount = lowStockAlerts.length + pendingSubscriptions.length
  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <button 
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-full transition"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">All Notifications</h1>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
              <p className="text-gray-600">Loading notifications...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <button 
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-full transition"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">All Notifications</h1>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="flex flex-col items-center justify-center py-12">
              <XCircle className="w-12 h-12 text-red-500 mb-4" />
              <p className="text-gray-600 mb-2">Failed to load notifications</p>
              <button 
                onClick={() => refetch()}
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <button 
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-full transition"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">All Notifications</h1>
              <p className="text-gray-500 text-sm mt-1">
                {totalCount} total notification{totalCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
{/*           
          <div className="flex items-center gap-4">
            <button 
              onClick={() => refetch()}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div> */}
        </div>
        
        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
              activeFilter === "all" 
                ? "bg-blue-100 text-blue-700" 
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <span>All</span>
              {totalCount > 0 && (
                <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                  activeFilter === "all" ? "bg-blue-200" : "bg-gray-200"
                }`}>
                  {totalCount}
                </span>
              )}
            </div>
          </button>
          
          <button
            onClick={() => setActiveFilter("stock")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
              activeFilter === "stock" 
                ? "bg-red-100 text-red-700" 
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              <span>Low Stock</span>
              {lowStockAlerts.length > 0 && (
                <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                  activeFilter === "stock" ? "bg-red-200" : "bg-gray-200"
                }`}>
                  {lowStockAlerts.length}
                </span>
              )}
            </div>
          </button>
          
          <button
            onClick={() => setActiveFilter("bookings")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
              activeFilter === "bookings" 
                ? "bg-blue-100 text-blue-700" 
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Bookings</span>
              {pendingSubscriptions.length > 0 && (
                <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                  activeFilter === "bookings" ? "bg-blue-200" : "bg-gray-200"
                }`}>
                  {pendingSubscriptions.length}
                </span>
              )}
            </div>
          </button>
        </div>
        
        {/* Main content */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 border-b">
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{lowStockAlerts.length}</p>
                </div>
                <div className="p-2 bg-red-100 rounded-full">
                  <Package className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Bookings</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{pendingSubscriptions.length}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-full">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed Bookings</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{completedSubscriptions.length}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-full">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Notifications list */}
          <div className="divide-y">
            {/* Low stock alerts */}
            {filteredLowStock.length > 0 && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  Low Stock Alerts ({filteredLowStock.length})
                </h3>
                <div className="space-y-3">
                  {filteredLowStock.map((alert: LowStockAlert, index: number) => (
                    <div key={`stock-${alert.id}-${index}`} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-full">
                          <Package className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{alert.name}</p>
                          <p className="text-sm text-gray-600">Stock quantity: {alert.stockQuantity}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        alert.stockQuantity === 0 
                          ? "bg-red-100 text-red-800" 
                          : alert.stockQuantity <= 3 
                          ? "bg-orange-100 text-orange-800" 
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {alert.stockQuantity === 0 ? "Out of stock" : "Low stock"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Upcoming bookings */}
            {filteredSubscriptions.length > 0 && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  Upcoming Bookings ({filteredSubscriptions.length})
                </h3>
                <div className="space-y-4">
                  {filteredSubscriptions
                    .sort((a: Subscription, b: Subscription) => 
                      new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime()
                    )
                    .map((subscription: Subscription, index: number) => {
                      const itemName = subscription.service?.name || subscription.consultation?.name || "Unknown Service"
                      const userName = `${subscription.user.firstName} ${subscription.user.lastName}`
                      const userEmail = subscription.user.email
                      const bookingDate = format(new Date(subscription.bookingDate), "EEEE, MMMM d, yyyy")
                      const timeRange = `${format(new Date(subscription.startTime), "h:mm a")} - ${format(new Date(subscription.endTime), "h:mm a")}`
                      const createdAt = format(new Date(subscription.createdAt), "MMM d, h:mm a")
                      
                      return (
                        <div key={`sub-${subscription.id}-${index}`} className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-50 rounded-full">
                                  <Calendar className="w-5 h-5 text-blue-500" />
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900">{itemName}</h4>
                                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                      <span>👤</span>
                                      <span>{userName}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Mail className="w-4 h-4" />
                                      <span>{userEmail}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Clock className="w-4 h-4" />
                                      <span>{bookingDate}</span>
                                    </div>
                                  </div>
                                  <div className="mt-2">
                                    <span className="text-sm text-gray-500">Booked on: {createdAt}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col items-end gap-2">
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-semibold text-gray-900">
                                  {timeRange}
                                </span>
                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                  subscription.status === "PENDING" 
                                    ? "bg-yellow-100 text-yellow-800" 
                                    : "bg-green-100 text-green-800"
                                }`}>
                                  {subscription.status}
                                </span>
                              </div>
                              {/* <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                                View details
                              </button> */}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            )}
            
            {/* Empty state */}
            {filteredLowStock.length === 0 && filteredSubscriptions.length === 0 && (
              <div className="p-12 text-center">
                <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
                  <Filter className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
                <p className="text-gray-500 mb-6">
                  {activeFilter === "all" 
                    ? "You don&apos;t have any notifications at the moment." 
                    : `No ${activeFilter === "stock" ? "low stock alerts" : "upcoming bookings"} found.`
                  }
                </p>
                {activeFilter !== "all" && (
                  <button 
                    onClick={() => setActiveFilter("all")}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View all notifications
                  </button>
                )}
              </div>
            )}
          </div>
          
          {/* Pagination or additional actions */}
          {(lowStockAlerts.length > 0 || pendingSubscriptions.length > 0) && (
            <div className="p-6 border-t">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-sm text-gray-600">
                  Showing {filteredLowStock.length + filteredSubscriptions.length} of {totalCount} notifications
                </p>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleBack}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Back to Dashboard
                  </button>
                  <button 
                    onClick={() => refetch()}
                    className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh Data
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}