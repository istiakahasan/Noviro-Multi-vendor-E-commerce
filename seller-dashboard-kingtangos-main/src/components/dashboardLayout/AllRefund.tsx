/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Eye, Check, X } from "lucide-react"
import Image from "next/image"
import { useGetRefundQuery, useUpdateRefundStatusMutation } from "@/redux/api/refundApi/refundApi"
import { CustomPagination } from "../shared/CustomPagination"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function AllRefund() {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [selectedRefund, setSelectedRefund] = useState<any>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [actionDialogOpen, setActionDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<"approve" | "reject">("approve")
  const [sellerReason, setSellerReason] = useState("")

  // Fetch refund data using RTK Query
  const { data, isLoading, error, refetch } = useGetRefundQuery({
    page: currentPage,
    limit: itemsPerPage,
  })

  // Update refund status mutation
  const [updateRefundStatus, { isLoading: isUpdating }] = useUpdateRefundStatusMutation()

  // Memoize refunds to prevent unnecessary recalculations
  const refunds = useMemo(() => data?.data || [], [data?.data])
  const totalItems = data?.meta?.total || 0

  // Calculate pagination for current page
  const currentItems = useMemo(() => {
    return refunds.slice(0, itemsPerPage)
  }, [refunds, itemsPerPage])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>
      case "SELLER_APPROVED":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Seller Approved</Badge>
      case "SELLER_REJECTED":
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Seller Rejected</Badge>
      case "APPROVED":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Approved</Badge>
      case "REJECTED":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Confirmed</Badge>
      case "DELIVERED":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Delivered</Badge>
      case "CANCELLED":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleViewClick = (refund: any) => {
    setSelectedRefund(refund)
    setViewDialogOpen(true)
  }

  const handleActionClick = (refund: any, type: "approve" | "reject") => {
    setSelectedRefund(refund)
    setActionType(type)
    setSellerReason("") // Reset reason when opening dialog
    setActionDialogOpen(true)
  }

  const handleConfirmAction = async () => {
    if (selectedRefund) {
      try {
        const payload = {
          sellerApproved: actionType === "approve",
          sellerReason: sellerReason.trim() || undefined
        }

        await updateRefundStatus({
          id: selectedRefund.id,
          data: payload
        }).unwrap()

        toast.success(`Refund ${actionType === "approve" ? "approved" : "rejected"} successfully`, {
          description: `Refund request #${selectedRefund.id.slice(0, 8)} has been ${actionType === "approve" ? "approved" : "rejected"}.`,
        })

        // Reset states
        setActionDialogOpen(false)
        setSelectedRefund(null)
        setSellerReason("")
        
        // Refetch data to update the table
        refetch()
      } catch (error: any) {
        toast.error("Failed to update refund status", {
          description: error?.data?.message || "Please try again later.",
        })
      }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Check if refund can be acted upon by seller
  const canSellerAct = (status: string) => {
    return status === "PENDING"
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto container">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto container">
          <div className="rounded-lg bg-red-50 p-4">
            <h3 className="text-red-800 font-medium">Error loading refunds</h3>
            <p className="text-red-600 text-sm mt-1">Please try again later.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 md:p-8">
      <div className="mx-auto container">
        {/* Header */}
        <div className="mb-6">
          <h1 className="lg:text-3xl md:text-2xl text-xl font-bold text-gray-900">All Refund Requests</h1>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Order ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Product</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentItems.length > 0 ? (
                  currentItems.map((refund: any) => (
                    <tr key={refund.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {refund.orderId?.slice(0, 8)}...
                        </div>
                        <div className="text-xs text-gray-500">
                          {getOrderStatusBadge(refund.order?.orderStatus)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {refund.user?.firstName} {refund.user?.lastName}
                        </div>
                        <div className="text-xs text-gray-500">{refund.user?.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {refund.product?.images?.[0] && (
                            <div className="h-10 w-10 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                              <Image
                                src={refund.product.images[0]}
                                alt={refund.product.name}
                                width={40}
                                height={40}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900 line-clamp-1">
                              {refund.product?.name}
                            </div>
                            <div className="text-xs text-gray-500">Qty: {refund.quantity}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        €{refund.refundAmount?.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(refund.status)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(refund.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            className="rounded p-1.5 text-blue-600 hover:bg-blue-50 transition-colors"
                            onClick={() => handleViewClick(refund)}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {canSellerAct(refund.status) && (
                            <>
                              <button
                                className="rounded p-1.5 text-green-600 hover:bg-green-50 transition-colors"
                                onClick={() => handleActionClick(refund, "approve")}
                                title="Approve"
                                disabled={isUpdating}
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                className="rounded p-1.5 text-red-600 hover:bg-red-50 transition-colors"
                                onClick={() => handleActionClick(refund, "reject")}
                                title="Reject"
                                disabled={isUpdating}
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center">
                      <div className="text-gray-500">No refund requests found</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination - only show if there are items */}
        {totalItems > 0 && (
          <CustomPagination
            totalItems={totalItems}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        )}

        {/* View Refund Details Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Refund Request Details</DialogTitle>
            </DialogHeader>

            {selectedRefund && (
              <div className="space-y-6">
                {/* Refund Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Refund ID</p>
                    <p className="text-sm font-medium text-gray-900">{selectedRefund.id}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Order ID</p>
                    <p className="text-sm font-medium text-gray-900">{selectedRefund.orderId}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Status</p>
                    <div className="mt-1">{getStatusBadge(selectedRefund.status)}</div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Date</p>
                    <p className="text-sm font-medium text-gray-900">{formatDate(selectedRefund.createdAt)}</p>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="rounded-lg border border-gray-200 p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Customer Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium text-gray-900">
                        {selectedRefund.user?.firstName} {selectedRefund.user?.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{selectedRefund.user?.email}</p>
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="rounded-lg border border-gray-200 p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Product Information</h4>
                  <div className="flex items-start gap-4">
                    {selectedRefund.product?.images?.[0] && (
                      <div className="h-20 w-20 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                        <Image
                          src={selectedRefund.product.images[0]}
                          alt={selectedRefund.product.name}
                          width={80}
                          height={80}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">{selectedRefund.product?.name}</h5>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                          <p className="text-sm text-gray-500">Quantity</p>
                          <p className="font-medium text-gray-900">{selectedRefund.quantity}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Price</p>
                          <p className="font-medium text-gray-900">€{selectedRefund.product?.price?.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reason & Amount */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border border-gray-200 p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Refund Reason</h4>
                    <p className="text-sm text-gray-700">{selectedRefund.customerReason}</p>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Refund Amount</h4>
                    <p className="text-2xl font-bold text-gray-900">€{selectedRefund.refundAmount?.toFixed(2)}</p>
                    <p className="text-sm text-gray-500 mt-1">Order Total: €{selectedRefund.order?.totalAmount?.toFixed(2)}</p>
                  </div>
                </div>

                {/* Seller Response (if available) */}
                {selectedRefund.sellerReason && (
                  <div className="rounded-lg border border-gray-200 p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Seller Response</h4>
                    <p className="text-sm text-gray-700">{selectedRefund.sellerReason}</p>
                    <div className="mt-2 text-xs text-gray-500">
                      Status: {selectedRefund.sellerApproved ? "Approved" : "Rejected"}
                    </div>
                  </div>
                )}
              </div>
            )}

            <DialogFooter className="flex gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setViewDialogOpen(false)} className="flex-1">
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Action Confirmation Dialog */}
        <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {actionType === "approve" ? "Approve Refund Request" : "Reject Refund Request"}
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to {actionType} this refund request?
                {actionType === "reject" && " You may want to provide a reason for rejection."}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="sellerReason">
                  Reason (Optional)
                </Label>
                <Textarea
                  id="sellerReason"
                  placeholder={
                    actionType === "approve" 
                      ? "Optional: Add any notes about this approval..." 
                      : "Optional: Explain why you're rejecting this refund..."
                  }
                  value={sellerReason}
                  onChange={(e) => setSellerReason(e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <DialogFooter className="flex gap-2 sm:gap-0 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setActionDialogOpen(false)
                    setSellerReason("")
                  }} 
                  className="flex-1"
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button
                  variant={actionType === "approve" ? "default" : "destructive"}
                  onClick={handleConfirmAction}
                  className="flex-1"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <span className="animate-spin mr-2">⟳</span>
                      Processing...
                    </>
                  ) : (
                    actionType === "approve" ? "Approve" : "Reject"
                  )}
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}