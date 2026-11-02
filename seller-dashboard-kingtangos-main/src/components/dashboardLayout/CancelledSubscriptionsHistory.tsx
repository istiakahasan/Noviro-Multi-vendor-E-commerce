/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Search, Eye, Clock, CheckCircle, XCircle, DollarSign, RefreshCw } from "lucide-react"
import Image from "next/image"
import { CustomPagination } from "../shared/CustomPagination"
import { useGetAllCancelledSubscriptionQuery, useUpdateSubscriptionCancellationStatusMutation } from "@/redux/api/subscriptionApi/subscriptionApi"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FaEuroSign } from "react-icons/fa"

interface CancelledSubscription {
  id: string
  subscriptionId: string
  userId: string
  customerReason: string
  sellerReason?: string
  adminReason?: string
  sellerApproved: boolean
  adminApproved: boolean | null
  status: "PENDING" | "APPROVED" | "REJECTED" | "REFUNDED" | "CANCELLED" | "SELLER_APPROVED" | "SELLER_REJECTED"
  refundAmount: number
  createdAt: string
  updatedAt: string
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    profilePic: string
  }
  subscription: {
    id: string
    planId: string
    startDate: string
    endDate: string
    amount: number
    paymentStatus: string
    plan: {
      id: string
      planName: string
      amount: number
      interval: string
      intervalCount: number
      description?: string
      image?: string
      status: string
    }
  }
}

interface ApiCancelledSubscription {
  id: string
  subscriptionId: string
  userId: string
  customerReason: string
  sellerReason?: string | null
  adminReason?: string | null
  sellerApproved: boolean
  adminApproved: boolean | null
  status: "PENDING" | "APPROVED" | "REJECTED" | "REFUNDED" | "CANCELLED" | "SELLER_APPROVED" | "SELLER_REJECTED"
  refundAmount: number
  createdAt: string
  updatedAt: string
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    profilePic: string
  }
  subscription: {
    id: string
    planId: string
    startDate: string
    endDate: string
    amount: number
    paymentStatus: string
    plan: {
      id: string
      planName: string
      amount: number
      interval: string
      intervalCount: number
      description?: string
      image?: string
      status: string
    }
  }
}

export default function CancelledSubscriptionsHistory() {
  const [searchQuery, setSearchQuery] = useState("")
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [selectedCancellation, setSelectedCancellation] = useState<CancelledSubscription | null>(null)
  const [sellerResponse, setSellerResponse] = useState("")
  const [updateAction, setUpdateAction] = useState<"approve" | "reject" | "">("")
  const [isUpdating, setIsUpdating] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // API call for cancelled subscriptions
  const { 
    data: cancellationData, 
    isLoading, 
    error,
    refetch 
  } = useGetAllCancelledSubscriptionQuery({
    page: currentPage,
    limit: itemsPerPage
  })

  const [updateCancellationStatus] = useUpdateSubscriptionCancellationStatusMutation()

  const getStatusConfig = (status: string) => {
    switch(status) {
      case "PENDING":
        return {
          color: "bg-yellow-100 text-yellow-800",
          icon: <Clock className="h-3 w-3 mr-1" />,
          label: "Pending"
        }
      case "SELLER_APPROVED":
        return {
          color: "bg-blue-100 text-blue-800",
          icon: <CheckCircle className="h-3 w-3 mr-1" />,
          label: "Seller Approved"
        }
      case "SELLER_REJECTED":
        return {
          color: "bg-red-100 text-red-800",
          icon: <XCircle className="h-3 w-3 mr-1" />,
          label: "Seller Rejected"
        }
      case "APPROVED":
        return {
          color: "bg-green-100 text-green-800",
          icon: <CheckCircle className="h-3 w-3 mr-1" />,
          label: "Approved"
        }
      case "REJECTED":
        return {
          color: "bg-red-100 text-red-800",
          icon: <XCircle className="h-3 w-3 mr-1" />,
          label: "Rejected"
        }
      case "REFUNDED":
        return {
          color: "bg-green-100 text-green-800",
          icon: <RefreshCw className="h-3 w-3 mr-1" />,
          label: "Refunded"
        }
      case "CANCELLED":
        return {
          color: "bg-gray-100 text-gray-800",
          icon: <XCircle className="h-3 w-3 mr-1" />,
          label: "Cancelled"
        }
      default:
        return {
          color: "bg-gray-100 text-gray-800",
          icon: <Clock className="h-3 w-3 mr-1" />,
          label: status
        }
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch(status) {
      case "COMPLETED":
      case "PAID":
        return "bg-green-100 text-green-700"
      case "REFUNDED":
        return "bg-blue-100 text-blue-700"
      case "FAILED":
        return "bg-red-100 text-red-700"
      case "PENDING":
        return "bg-yellow-100 text-yellow-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getApprovalStatus = (sellerApproved: boolean, adminApproved: boolean | null) => {
    if (adminApproved === true) return "Admin Approved"
    if (adminApproved === false) return "Admin Rejected"
    if (sellerApproved) return "Seller Approved"
    return "Pending Approval"
  }

  const getApprovalStatusColor = (sellerApproved: boolean, adminApproved: boolean | null) => {
    if (adminApproved === true) return "bg-green-100 text-green-700"
    if (adminApproved === false) return "bg-red-100 text-red-700"
    if (sellerApproved) return "bg-blue-100 text-blue-700"
    return "bg-yellow-100 text-yellow-700"
  }

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (detailsDialogOpen && selectedCancellation) {
      setSellerResponse(selectedCancellation.sellerReason || "")
      setUpdateAction("")
    } else {
      setSellerResponse("")
      setUpdateAction("")
      setIsUpdating(false)
    }
  }, [detailsDialogOpen, selectedCancellation])

  // Check if API returned an error response
  const hasApiError = useMemo(() => {
    return cancellationData?.success === false || cancellationData?.errorMessages
  }, [cancellationData])

  // Transform API data to match the expected format
  const transformedCancellations = useMemo((): CancelledSubscription[] => {
    // If API returned an error, return empty array
    if (hasApiError || !cancellationData?.data) {
      return []
    }

    return cancellationData.data.map((cancellation: ApiCancelledSubscription) => ({
      id: cancellation.id,
      subscriptionId: cancellation.subscriptionId,
      userId: cancellation.userId,
      customerReason: cancellation.customerReason,
      sellerReason: cancellation.sellerReason || undefined,
      adminReason: cancellation.adminReason || undefined,
      sellerApproved: cancellation.sellerApproved,
      adminApproved: cancellation.adminApproved,
      status: cancellation.status,
      refundAmount: cancellation.refundAmount,
      createdAt: cancellation.createdAt,
      updatedAt: cancellation.updatedAt,
      user: cancellation.user,
      subscription: cancellation.subscription
    }))
  }, [cancellationData, hasApiError])

  // Filter cancellations based on search query (client-side filtering)
  const filteredCancellations = useMemo((): CancelledSubscription[] => {
    if (!searchQuery) {
      return transformedCancellations
    }
    
    return transformedCancellations.filter(
      (cancellation: CancelledSubscription) =>
        cancellation.subscription?.plan?.planName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cancellation.user?.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cancellation.user?.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cancellation.user?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cancellation.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cancellation.customerReason.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [transformedCancellations, searchQuery])

  // Calculate total items
  const totalItems = cancellationData?.meta?.total || transformedCancellations.length
  
  // Paginate the filtered results client-side
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredCancellations.slice(startIndex, endIndex)
  }, [filteredCancellations, currentPage, itemsPerPage])

  const handleViewDetails = (cancellation: CancelledSubscription) => {
    setSelectedCancellation(cancellation)
    setDetailsDialogOpen(true)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }


  const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}


  const handleUpdateStatus = async () => {
    if (!selectedCancellation || !updateAction || isUpdating) return

    setIsUpdating(true)
    try {
      // Prepare data in the required format
      const updateData = {
        action: updateAction,
        reason: sellerResponse.trim() || (updateAction === "approve" ? "Cancellation approved" : "Cancellation rejected")
      }

      await updateCancellationStatus({
        id: selectedCancellation.id,
        data: updateData
      }).unwrap()

      toast.success(`Cancellation ${updateAction === "approve" ? "approved" : "rejected"} successfully`)
      
      // Close dialog and refetch data
      setDetailsDialogOpen(false)
      refetch()
    } catch (error: any) {
      console.error("Failed to update cancellation status:", error)
      toast.error("Failed to update status", {
        description: error?.data?.message || "Please try again later."
      })
    } finally {
      setIsUpdating(false)
    }
  }

  // Check if seller can update this cancellation
  // Seller can update if admin hasn't approved/rejected yet
  const canSellerUpdate = useMemo(() => {
    if (!selectedCancellation) return false
    // Seller can update if admin hasn't made a decision yet
    return selectedCancellation.adminApproved === null
  }, [selectedCancellation])

  // Handle page change for client-side filtered data
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Handle items per page change
  const handleItemsPerPageChange = (perPage: number) => {
    setItemsPerPage(perPage)
    setCurrentPage(1) // Reset to first page when changing items per page
  }

  // API Error state
  if (hasApiError) {
    return (
      <div className="min-h-screen bg-gray-50 md:p-8">
        <div className="mx-auto container">
          <div className="mb-6 flex items-center justify-between flex-col md:flex-row gap-4">
            <div>
              <h1 className="lg:text-3xl md:text-2xl text-xl font-bold text-gray-900">Cancelled Subscriptions History</h1>
              <p className="text-gray-600 mt-2">View all subscription cancellation requests and their status</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center h-64 bg-white rounded-lg border border-gray-200">
            <div className="text-center">
              <div className="bg-red-100 text-red-600 rounded-full p-3 inline-flex items-center justify-center mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">API Error</h3>
              <p className="text-gray-600 mb-4 max-w-md">
                {cancellationData?.message || "There was an error fetching cancelled subscriptions. Please try again later."}
              </p>
              <Button onClick={refetch} className="bg-gray-800 text-white hover:bg-gray-900">
                Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto container">
          <div className="mb-6">
            <h1 className="lg:text-3xl md:text-2xl text-xl font-bold text-gray-900">Cancelled Subscriptions History</h1>
            <p className="text-gray-600 mt-2">View all subscription cancellation requests and their status</p>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading cancelled subscriptions...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Network error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto container">
          <div className="mb-6">
            <h1 className="lg:text-3xl md:text-2xl text-xl font-bold text-gray-900">Cancelled Subscriptions History</h1>
            <p className="text-gray-600 mt-2">View all subscription cancellation requests and their status</p>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-600">Failed to load cancelled subscriptions</p>
              <Button onClick={refetch} className="mt-4">
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 md:p-8">
      <div className="mx-auto container">
        {/* Header */}
        <div className="mb-6">
          <h1 className="lg:text-3xl md:text-2xl text-xl font-bold text-gray-900">Cancelled Subscriptions History</h1>
          <p className="text-gray-600 mt-2">View all subscription cancellation requests and their status</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by plan name, customer name, email, status, or reason"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1) // Reset to first page when searching
              }}
              className="pl-10 bg-white border-gray-200"
            />
          </div>
          {searchQuery && (
            <p className="mt-2 text-sm text-gray-500">
              Showing {filteredCancellations.length} of {transformedCancellations.length} cancellation requests
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          )}
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Cancellations</p>
                <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
              </div>
              <div className="bg-gray-100 p-2 rounded-lg">
                <RefreshCw className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {transformedCancellations.filter(c => c.status === "PENDING").length}
                </p>
              </div>
              <div className="bg-yellow-100 p-2 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Refunded</p>
                <p className="text-2xl font-bold text-green-600">
                  {transformedCancellations.filter(c => c.status === "REFUNDED").length}
                </p>
              </div>
              <div className="bg-green-100 p-2 rounded-lg">
                <FaEuroSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Refunded</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(transformedCancellations.reduce((sum, c) => sum + c.refundAmount, 0))}
                </p>
              </div>
              <div className="bg-blue-100 p-2 rounded-lg">
                <FaEuroSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Plan Details</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Cancellation Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Refund Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Approval Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedItems.length > 0 ? (
                  paginatedItems.map((cancellation: CancelledSubscription) => {
                    const statusConfig = getStatusConfig(cancellation.status)
                    return (
                      <tr key={cancellation.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 flex-shrink-0 rounded bg-gray-200 flex items-center justify-center overflow-hidden">
                              {cancellation.subscription?.plan?.image ? (
                                <Image
                                  src={cancellation.subscription?.plan?.image} 
                                  alt={cancellation.subscription?.plan?.planName}
                                  width={500}
                                  height={500}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full bg-gray-300 flex items-center justify-center text-gray-600">
                                  <FaEuroSign className="h-5 w-5" />
                                </div>
                              )}
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-900 block">
                                {cancellation.subscription?.plan?.planName}
                              </span>
                              <span className="text-xs text-gray-500">
                                Original: {formatCurrency(cancellation.subscription?.amount)}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <span className="text-sm font-medium text-gray-900 block">
                              {cancellation.user.firstName} {cancellation.user.lastName}
                            </span>
                            <span className="text-xs text-gray-500">{cancellation.user.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600">
                            {formatDate(cancellation.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <FaEuroSign className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-sm font-medium text-gray-900">
                              {formatCurrency(cancellation.refundAmount)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <span
                              className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${statusConfig.color}`}
                            >
                              {statusConfig.icon}
                              {statusConfig.label}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getApprovalStatusColor(
                              cancellation.sellerApproved,
                              cancellation.adminApproved
                            )}`}
                          >
                            {getApprovalStatus(cancellation.sellerApproved, cancellation.adminApproved)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              className="rounded p-1.5 text-blue-600 hover:bg-blue-50 transition-colors"
                              onClick={() => handleViewDetails(cancellation)}
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      {searchQuery ? `No cancellation requests found matching "${searchQuery}"` : "No cancellation requests found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <CustomPagination
          totalItems={searchQuery ? filteredCancellations.length : totalItems}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />

        {/* Details Dialog */}
        <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Cancellation Request Details</DialogTitle>
              <DialogDescription>
                Detailed information about the subscription cancellation
              </DialogDescription>
            </DialogHeader>

            {selectedCancellation && (
              <div className="space-y-6">
                {/* Plan Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Plan Information</h3>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="h-12 w-12 flex-shrink-0 rounded bg-gray-200 flex items-center justify-center overflow-hidden">
                          {selectedCancellation.subscription.plan.image ? (
                            <Image
                              src={selectedCancellation.subscription.plan.image} 
                              alt={selectedCancellation.subscription.plan.planName}
                              width={500}
                              height={500}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <DollarSign className="h-6 w-6 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{selectedCancellation.subscription.plan.planName}</h4>
                          <p className="text-sm text-gray-600">
                            {selectedCancellation.subscription.plan.intervalCount} {selectedCancellation.subscription.plan.interval}(s) • 
                            Original: {formatCurrency(selectedCancellation.subscription.amount)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Subscription Period</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-500">Start Date</p>
                          <p className="text-sm font-medium text-gray-900">{formatDate(selectedCancellation.subscription.startDate)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">End Date</p>
                          <p className="text-sm font-medium text-gray-900">{formatDate(selectedCancellation.subscription.endDate)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Customer Information</h3>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                            {selectedCancellation.user.profilePic ? (
                              <Image
                                src={selectedCancellation.user.profilePic}
                                alt={`${selectedCancellation.user.firstName} ${selectedCancellation.user.lastName}`}
                                width={500}
                                height={500}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-gray-600 font-medium">
                                {selectedCancellation.user.firstName[0]}{selectedCancellation.user.lastName[0]}
                              </span>
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {selectedCancellation.user.firstName} {selectedCancellation.user.lastName}
                            </h4>
                            <p className="text-sm text-gray-600">{selectedCancellation.user.email}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Payment Status</h3>
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(
                          selectedCancellation.subscription.paymentStatus
                        )}`}
                      >
                        {selectedCancellation.subscription.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status & Refund Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Cancellation Status</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Overall Status</span>
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${getStatusConfig(selectedCancellation.status).color}`}>
                          {getStatusConfig(selectedCancellation.status).icon}
                          {getStatusConfig(selectedCancellation.status).label}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Seller Approval</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${selectedCancellation.sellerApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {selectedCancellation.sellerApproved ? 'Approved' : 'Pending'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Admin Approval</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          selectedCancellation.adminApproved === true 
                            ? 'bg-green-100 text-green-700' 
                            : selectedCancellation.adminApproved === false 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {selectedCancellation.adminApproved === true 
                            ? 'Approved' 
                            : selectedCancellation.adminApproved === false 
                            ? 'Rejected' 
                            : 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Refund Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Refund Amount</span>
                        <span className="text-lg font-bold text-gray-900">
                          {formatCurrency(selectedCancellation.refundAmount)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Original Amount</span>
                        <span className="text-sm text-gray-600">
                          {formatCurrency(selectedCancellation.subscription.amount)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Refund Percentage</span>
                        <span className="text-sm font-medium text-gray-900">
                          {((selectedCancellation.refundAmount / selectedCancellation.subscription.amount) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reasons */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Customer Reason</h3>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{selectedCancellation.customerReason}</p>
                    </div>
                  </div>

                  {selectedCancellation.sellerReason && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Seller Response</h3>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-700">{selectedCancellation.sellerReason}</p>
                      </div>
                    </div>
                  )}

                  {selectedCancellation.adminReason && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Admin Response</h3>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-gray-700">{selectedCancellation.adminReason}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Seller Action Section (show only if seller can update) */}
                {canSellerUpdate && (
                  <div className="space-y-4 border-t pt-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Seller Action Required</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Please review this cancellation request and provide your decision. Your response will be visible to the customer.
                      </p>
                      <div className="space-y-3">
                        <Select 
                          value={updateAction} 
                          onValueChange={(value: "approve" | "reject" | "") => setUpdateAction(value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select your decision" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="approve">Approve Cancellation</SelectItem>
                            <SelectItem value="reject">Reject Cancellation</SelectItem>
                          </SelectContent>
                        </Select>

                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Your Response to Customer (Required)
                          </label>
                          <Textarea
                            placeholder="Explain your decision to the customer..."
                            value={sellerResponse}
                            onChange={(e) => setSellerResponse(e.target.value)}
                            className="min-h-[100px]"
                            required
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            This will be shared with the customer
                          </p>
                        </div>

                        <div className="flex gap-3">
                          <Button
                            variant="outline"
                            onClick={() => setDetailsDialogOpen(false)}
                            className="flex-1"
                            disabled={isUpdating}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleUpdateStatus}
                            disabled={!updateAction || !sellerResponse.trim() || isUpdating}
                            className={`flex-1 ${
                              updateAction === "approve" 
                                ? "bg-green-600 hover:bg-green-700" 
                                : "bg-red-600 hover:bg-red-700"
                            }`}
                          >
                            {isUpdating ? (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              `${
                                updateAction === "approve" 
                                  ? "Approve" 
                                  : "Reject"
                              } Cancellation`
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Show message if admin has already made a decision */}
                {!canSellerUpdate && selectedCancellation.adminApproved !== null && (
                  <div className="space-y-4 border-t pt-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Action Status</h3>
                      <div className={`p-4 rounded-lg ${
                        selectedCancellation.adminApproved === true 
                          ? 'bg-green-50 border border-green-200' 
                          : 'bg-red-50 border border-red-200'
                      }`}>
                        <div className="flex items-center gap-2">
                          {selectedCancellation.adminApproved === true ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                          <p className="text-sm font-medium text-gray-900">
                            {selectedCancellation.adminApproved === true 
                              ? 'Admin has approved this cancellation' 
                              : 'Admin has rejected this cancellation'}
                          </p>
                        </div>
                        {selectedCancellation.adminReason && (
                          <p className="text-sm text-gray-600 mt-2">
                            <span className="font-medium">Admin Note:</span> {selectedCancellation.adminReason}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          Seller action is no longer required as admin has made the final decision.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Timeline */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Timeline</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="h-2 w-2 bg-gray-300 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Cancellation Requested</p>
                        <p className="text-xs text-gray-500">{formatDate(selectedCancellation.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className={`h-2 w-2 rounded-full mt-2 ${
                        selectedCancellation.sellerApproved ? 'bg-green-500' : 'bg-gray-300'
                      }`}></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedCancellation.sellerApproved ? 'Seller Approved' : 'Seller Pending'}
                        </p>
                        {selectedCancellation.sellerReason && (
                          <p className="text-xs text-gray-500">{selectedCancellation.sellerReason}</p>
                        )}
                        {!selectedCancellation.sellerApproved && canSellerUpdate && (
                          <p className="text-xs text-yellow-600 mt-1">Action required from seller</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className={`h-2 w-2 rounded-full mt-2 ${
                        selectedCancellation.adminApproved === true 
                          ? 'bg-green-500' 
                          : selectedCancellation.adminApproved === false 
                          ? 'bg-red-500' 
                          : 'bg-gray-300'
                      }`}></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedCancellation.adminApproved === true 
                            ? 'Admin Approved' 
                            : selectedCancellation.adminApproved === false 
                            ? 'Admin Rejected' 
                            : 'Admin Pending'}
                        </p>
                        {selectedCancellation.adminReason && (
                          <p className="text-xs text-gray-500">{selectedCancellation.adminReason}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Last Updated</p>
                        <p className="text-xs text-gray-500">{formatDate(selectedCancellation.updatedAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <DialogFooter className="flex gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setDetailsDialogOpen(false)} className="flex-1">
                    Close
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}