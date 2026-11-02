/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { AlertCircle, Calendar, Clock, Loader2, RefreshCw } from "lucide-react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { useGetAllSellerDashboardActivityQuery } from "@/redux/api/dashboardOverviewApi/dashboardOverviewApi"

// Define TypeScript interfaces for the API response
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

export function NotificationsAlerts() {
  const router = useRouter()
  
  // Fetch data from API with proper typing
  const { data: dashboardData, isLoading, error, refetch } = useGetAllSellerDashboardActivityQuery({}) as {
    data: DashboardResponse | undefined
    isLoading: boolean
    error: any
    refetch: () => void
  }
  
  // Extract data from API response with proper types
  const subscriptions: Subscription[] = dashboardData?.data?.recentActivity?.subscriptions || []
  const lowStockAlerts: LowStockAlert[] = dashboardData?.data?.lowStockAlerts || []
  
  // Filter pending subscriptions
  const pendingSubscriptions = subscriptions.filter((sub: Subscription) => sub.status === "PENDING")
  const totalAlerts = lowStockAlerts.length + pendingSubscriptions.length
  
  // Handle View All click
  const handleViewAllClick = () => {
    router.push("/seller-dashboard/notifications")
  }
  
  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Notifications & Alerts</h2>
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
            <span className="text-xs text-gray-500">Loading...</span>
          </div>
        </div>
        
        <div className="space-y-4">
          {[...Array(3)].map((_, index: number) => (
            <div key={index} className="flex items-start gap-3 animate-pulse">
              <div className="bg-gray-200 rounded-full p-2">
                <div className="w-5 h-5 bg-gray-300 rounded-full" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
        
        <button 
          onClick={handleViewAllClick}
          className="w-full mt-6 text-center text-sm font-medium text-gray-900 hover:text-gray-700 border border-gray-200 rounded-md py-2 hover:bg-gray-50 transition"
        >
          View All Notifications
        </button>
      </div>
    )
  }
  
  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Notifications & Alerts</h2>
        
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-sm text-gray-600 mb-2">Failed to load notifications</p>
          <button 
            onClick={() => refetch()}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Retry loading data
          </button>
        </div>
        
        <button 
          onClick={handleViewAllClick}
          className="w-full mt-6 text-center text-sm font-medium text-gray-900 hover:text-gray-700 border border-gray-200 rounded-md py-2 hover:bg-gray-50 transition"
        >
          View All Notifications
        </button>
      </div>
    )
  }
  
  // No data state
  if (subscriptions.length === 0 && lowStockAlerts.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Notifications & Alerts</h2>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            No alerts
          </span>
        </div>
        
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-600">No notifications at the moment</p>
          <p className="text-xs text-gray-500 mt-1">You&apos;re all caught up!</p>
        </div>
        
        <button 
          onClick={handleViewAllClick}
          className="w-full mt-4 text-center text-sm font-medium text-gray-900 hover:text-gray-700 border border-gray-200 rounded-md py-2 hover:bg-gray-50 transition"
        >
          View All Notifications
        </button>
      </div>
    )
  }
  
  // Sort pending subscriptions by booking date (earliest first)
  const sortedPendingSubscriptions = [...pendingSubscriptions].sort(
    (a: Subscription, b: Subscription) => new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime()
  ).slice(0, 3) // Show only 3 most recent pending subscriptions
  
  return (
    <div className="bg-white rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Notifications & Alerts</h2>
        
        {/* Show alert count badge */}
        {totalAlerts > 0 && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
              <span className="font-medium">{lowStockAlerts.length}</span>
              <span className="text-gray-400 mx-1">•</span>
              <span className="font-medium">{pendingSubscriptions.length}</span>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              {totalAlerts} alert{totalAlerts !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        {/* Show low stock alerts first */}
        {lowStockAlerts.slice(0, 2).map((alert: LowStockAlert, index: number) => (
          <div key={`stock-${index}`} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="bg-red-50 rounded-full p-2 flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-700">
                Low stock alert: <span className="font-medium">{alert.name}</span> ({alert.stockQuantity} left)
              </p>
              <p className="text-xs text-gray-500 mt-1">Requires immediate attention</p>
            </div>
          </div>
        ))}
        
        {/* Show upcoming pending subscriptions */}
        {sortedPendingSubscriptions.slice(0, 2).map((subscription: Subscription, index: number) => {
          const itemName = subscription.service?.name || subscription.consultation?.name || "Unknown Item"
          const userName = `${subscription.user.firstName} ${subscription.user.lastName}`
          const bookingDate = format(new Date(subscription.bookingDate), "MMM d, yyyy")
          const timeRange = `${format(new Date(subscription.startTime), "h:mm a")} - ${format(new Date(subscription.endTime), "h:mm a")}`
          
          return (
            <div key={`sub-${index}`} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="bg-blue-50 rounded-full p-2 flex-shrink-0">
                <Calendar className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700">
                  Upcoming booking: <span className="font-medium">{itemName}</span>
                </p>
                <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <span>👤</span>
                    <span>{userName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{bookingDate} • {timeRange}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        
        {/* Show summary if we have more items than displayed */}
        {(lowStockAlerts.length > 2 || pendingSubscriptions.length > 2) && (
          <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="bg-green-50 rounded-full p-2 flex-shrink-0">
              <RefreshCw className="w-5 h-5 text-green-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-700">
                {lowStockAlerts.length > 2 && `+${lowStockAlerts.length - 2} more low stock alerts `}
                {lowStockAlerts.length > 2 && pendingSubscriptions.length > 2 && "and "}
                {pendingSubscriptions.length > 2 && `+${pendingSubscriptions.length - 2} more bookings`}
              </p>
              <p className="text-xs text-gray-500 mt-1">Click View All to see complete list</p>
            </div>
          </div>
        )}
      </div>
      
      {/* View All button - always show, but change text based on data */}
      <button 
        onClick={handleViewAllClick}
        className="w-full mt-6 text-center text-sm font-medium text-gray-900 hover:text-gray-700 border border-gray-200 rounded-md py-2 hover:bg-gray-50 transition"
      >
        {totalAlerts > 0 
          ? `View All ${totalAlerts} Notifications` 
          : "View All Notifications"
        }
      </button>
      
      {/* Summary section */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            {lowStockAlerts.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className="text-gray-600">
                  {lowStockAlerts.length} low stock item{lowStockAlerts.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
            {pendingSubscriptions.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-gray-600">
                  {pendingSubscriptions.length} pending booking{pendingSubscriptions.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
          <button 
            onClick={() => refetch()}
            className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            Refresh
          </button>
        </div>
      </div>
    </div>
  )
}