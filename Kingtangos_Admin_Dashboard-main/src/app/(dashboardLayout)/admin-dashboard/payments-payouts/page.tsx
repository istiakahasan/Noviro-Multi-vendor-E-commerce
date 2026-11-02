// "use client";
// import { MatrixCard } from "@/components/shared/dashboardLayout/MatrixCard";
// import {
//   Transaction,
//   useGetTransactionHistoryQuery,
// } from "@/redux/features/withdrawalRequest/withdrawalApi";
// import { Search } from "lucide-react";
// import React, { useState } from "react";
// import SellerPayoutBreakdownModal from "./components/SallerPayoutBreakdownModal";

// // 1. Custom Skeleton Component
// const SkeletonLoader: React.FC<{ className?: string }> = ({ className }) => {
//   return (
//     <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
//   );
// };

// const SubscriptionsManagement: React.FC = () => {
//   const [txSearchTerm, setTxSearchTerm] = useState("");
//   const [txStatusFilter, setTxStatusFilter] = useState("All");
//   const [isBreakdownModalOpen, setIsBreakdownModalOpen] = useState(false);

//   const { data, isLoading, isError } = useGetTransactionHistoryQuery();
//   console.log("object", data);
//   // Filtered transactions based on search & status
//   const filteredTransactionHistory =
//     data?.data.filter(
//       (tx) =>
//         tx.sellerStripeId.toLowerCase().includes(txSearchTerm.toLowerCase()) &&
//         (txStatusFilter === "All" || tx.paymentStatus === txStatusFilter),
//     ) ?? [];

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "Pending":
//         return "bg-yellow-100 text-yellow-800";
//       case "Processing":
//         return "bg-blue-100 text-blue-800";
//       case "Paid":
//       case "Success":
//         return "bg-green-100 text-green-800";
//       case "Failed":
//         return "bg-red-100 text-red-800";
//       case "Refunded":
//         return "bg-orange-100 text-orange-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   return (
//     <div className="p-6 container mx-auto space-y-6">
//       {/* Header */}
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">
//           Subscriptions Management
//         </h1>
//         <p className="text-gray-600 mt-1">
//           Monitor and manage all product orders, service bookings, subscription
//           activities.
//         </p>
//       </div>

//       {/* Metrics Grid */}
//       <MatrixCard />

//       {/* Transaction History Section */}
//       <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//         <div className="p-6 border-b border-gray-200">
//           <h2 className="text-lg font-semibold text-gray-900">
//             Transaction History
//           </h2>
//           <div className="flex items-center justify-between mt-2">
//             <div className="relative flex-1 max-w-md">
//               <input
//                 type="text"
//                 placeholder="Search by Stripe ID"
//                 value={txSearchTerm}
//                 onChange={(e) => setTxSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               <span className="absolute left-3 top-2.5 text-gray-400">
//                 <Search size={16} />
//               </span>
//             </div>
//             <select
//               value={txStatusFilter}
//               onChange={(e) => setTxStatusFilter(e.target.value)}
//               className="ml-4 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="All">All Statuses</option>
//               <option value="COMPLETED">Success</option>
//               <option value="FAILED">Failed</option>
//               <option value="REFUNDED">Refunded</option>
//             </select>
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse min-w-[800px]">
//             <thead className="bg-gray-50 border-b border-gray-200">
//               <tr>
//                 <th className="px-4 py-3 text-xs font-medium text-gray-600">
//                   Transaction ID
//                 </th>
//                 <th className="px-4 py-3 text-xs font-medium text-gray-600">
//                   Stripe ID
//                 </th>
//                 <th className="px-4 py-3 text-xs font-medium text-gray-600">
//                   Description
//                 </th>
//                 <th className="px-4 py-3 text-xs font-medium text-gray-600">
//                   Amount
//                 </th>
//                 <th className="px-4 py-3 text-xs font-medium text-gray-600">
//                   Currency
//                 </th>
//                 <th className="px-4 py-3 text-xs font-medium text-gray-600">
//                   Payment Status
//                 </th>
//                 <th className="px-4 py-3 text-xs font-medium text-gray-600">
//                   Transfer Status
//                 </th>
//                 <th className="px-4 py-3 text-xs font-medium text-gray-600">
//                   Date
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {isLoading
//                 ? Array.from({ length: 6 }).map((_, i) => (
//                     <tr key={i}>
//                       {Array.from({ length: 7 }).map((_, j) => (
//                         <td key={j} className="px-4 py-3 text-sm">
//                           <SkeletonLoader className="h-4 w-full" />
//                         </td>
//                       ))}
//                     </tr>
//                   ))
//                 : filteredTransactionHistory.map((tx: Transaction) => (
//                     <tr key={tx.id} className="hover:bg-gray-50">
//                       <td className="px-4 py-3 text-sm text-gray-700">
//                         {tx.stripeTransferId}
//                       </td>
//                       <td className="px-4 py-3 text-sm text-gray-700 font-medium">
//                         {tx.sellerStripeId}
//                       </td>
//                       <td className="px-4 py-3 text-sm text-gray-700 font-medium">
//                         {tx.description}
//                       </td>
//                       <td className="px-4 py-3 text-sm text-gray-700 font-medium">
//                         {tx.amount}
//                       </td>
//                       <td className="px-4 py-3 text-sm text-gray-700 font-medium">
//                         {tx.currency.toUpperCase()}
//                       </td>
//                       <td className="px-4 py-3">
//                         <span
//                           className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(tx.paymentStatus)}`}
//                         >
//                           {tx.paymentStatus}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3">
//                         <span className="text-sm text-gray-700">
//                           {tx.transferStatus}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3 text-sm text-gray-700">
//                         {new Date(tx.transferDate).toLocaleDateString()}
//                       </td>
//                     </tr>
//                   ))}
//             </tbody>
//           </table>
//         </div>

//         {!isLoading && filteredTransactionHistory.length === 0 && (
//           <div className="p-8 text-center text-gray-500 text-sm">
//             No transactions found matching your criteria.
//           </div>
//         )}
//       </div>

//       {/* Breakdown Modal */}
//       <SellerPayoutBreakdownModal
//         isOpen={isBreakdownModalOpen}
//         onClose={() => setIsBreakdownModalOpen(false)}
//       />
//     </div>
//   );
// };

// export default SubscriptionsManagement;

"use client";
import { MatrixCard } from "@/components/shared/dashboardLayout/MatrixCard";
import { Eye, Search, ChevronLeft, ChevronRight, X } from "lucide-react";
import React, { useState } from "react";
import SellerPayoutBreakdownModal from "./components/SallerPayoutBreakdownModal";
import TransectionHistory from "./components/TransectionHistory";
import {
  useGetRefundRequestsQuery,
  useGetSingleRefundQuery,
  useAdminRespondToRefundMutation,
} from "@/redux/features/withdrawalRequest/withdrawalApi";
import { toast } from "sonner";

// Skeleton Loader
const SkeletonLoader: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
  );
};

// Shared Status Color Helper
const getStatusColor = (status: string) => {
  const upper = status?.toUpperCase() || "";
  if (upper === "PENDING") return "bg-yellow-100 text-yellow-800";
  if (upper === "APPROVED") return "bg-green-100 text-green-800";
  if (upper === "REJECTED") return "bg-red-100 text-red-800";
  if (upper === "REFUNDED") return "bg-orange-100 text-orange-800";
  return "bg-gray-100 text-gray-800";
};

// Refund Details Modal
const RefundDetailsModal = ({
  refundId,
  isOpen,
  onClose,
}: {
  refundId: string | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { data, isLoading, isError } = useGetSingleRefundQuery(refundId!, {
    skip: !refundId || !isOpen,
  });

  const [respond, { isLoading: isResponding }] =
    useAdminRespondToRefundMutation();

  const refund = data?.data;

  // State for reason input modal
  const [showReasonModal, setShowReasonModal] = useState<
    "approve" | "reject" | null
  >(null);
  const [adminReason, setAdminReason] = useState("");
  const [reasonError, setReasonError] = useState("");

  // Helper to safely format currency
  const formatCurrency = (
    value: string | number | undefined | null,
  ): string => {
    if (value == null) return "—";
    const num = typeof value === "string" ? parseFloat(value) : value;
    return isNaN(num) ? "—" : `$${num.toFixed(2)}`;
  };

  const handleRespond = (approved: boolean) => {
    if (!adminReason.trim()) {
      setReasonError("Reason is required");
      return;
    }

    respond({
      id: refundId!,
      adminApproved: approved,
      adminReason: adminReason.trim(),
    })
      .unwrap()
      .then(() => {
        toast.success(
          `Refund ${approved ? "approved" : "rejected"} successfully`,
        );
        setShowReasonModal(null);
        setAdminReason("");
        setReasonError("");
        onClose(); // close main modal after action
      })
      .catch((err) => {
        toast.error(
          "Failed to update: " + (err?.data?.message || "Unknown error"),
        );
      });
  };

  if (!isOpen) return null;

  const isAlreadyDecided = refund?.adminApproved !== null;
  const isFinalStatus = ["APPROVED", "REFUNDED", "REJECTED"].includes(
    refund?.status?.toUpperCase() || "",
  );

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full mx-4 max-h-[92vh] overflow-y-auto">
          <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
            <h2 className="text-xl font-bold">Refund Request Details</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 text-2xl leading-none"
            >
              ×
            </button>
          </div>

          {isLoading ? (
            <div className="p-10 space-y-6">
              <div className="animate-pulse bg-gray-200 h-8 w-3/4 rounded" />
              <div className="animate-pulse bg-gray-200 h-6 w-full rounded" />
              <div className="animate-pulse bg-gray-200 h-40 w-full rounded" />
            </div>
          ) : isError || !refund ? (
            <div className="p-12 text-center text-red-600 text-lg">
              Failed to load refund details. Please try again later.
            </div>
          ) : (
            <div className="p-6 space-y-10">
              {/* Refund Information */}
              <section>
                <h3 className="text-lg font-semibold mb-4 pb-2 border-b">
                  Refund Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Refund ID</p>
                    <p className="font-medium break-all">{refund.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span
                      className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                        refund.status,
                      )}`}
                    >
                      {refund.status || "—"}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Refund Amount</p>
                    <p className="font-bold text-lg">
                      {refund.refundAmount} EUR
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Quantity</p>
                    <p className="font-medium">{refund.quantity ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Created At</p>
                    <p>
                      {refund.createdAt
                        ? new Date(refund.createdAt).toLocaleString()
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Updated At</p>
                    <p>
                      {refund.updatedAt
                        ? new Date(refund.updatedAt).toLocaleString()
                        : "—"}
                    </p>
                  </div>
                </div>
              </section>

              {/* Reasons & Approvals */}
              <section className="border-t pt-8">
                <h3 className="text-lg font-semibold mb-4">
                  Reasons & Approval Status
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Customer Reason</p>
                    <p className="text-gray-800">
                      {refund.customerReason || "—"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Seller Reason</p>
                    <p className="text-gray-800">
                      {refund.sellerReason || "—"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Admin Reason</p>
                    <p className="text-gray-800">{refund.adminReason || "—"}</p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Seller Approved</p>
                    <p
                      className={`font-medium ${refund.sellerApproved ? "text-green-600" : "text-red-600"}`}
                    >
                      {refund.sellerApproved === null
                        ? "Pending"
                        : refund.sellerApproved
                          ? "Yes"
                          : "No"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Admin Approved</p>
                    <p
                      className={`font-medium ${refund.adminApproved ? "text-green-600" : "text-red-600"}`}
                    >
                      {refund.adminApproved === null
                        ? "Pending"
                        : refund.adminApproved
                          ? "Yes"
                          : "No"}
                    </p>
                  </div>
                </div>
              </section>
              {/* 3. Customer (User) Information */}
              <section className="border-t pt-8">
                <h3 className="text-lg font-semibold mb-4">
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">
                      {(refund.user?.firstName || "") +
                        " " +
                        (refund.user?.lastName || "—")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="break-all">{refund.user?.email || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">User ID</p>
                    <p className="font-mono text-sm break-all">
                      {refund.userId || "—"}
                    </p>
                  </div>
                </div>
              </section>

              {/* 4. Product Information */}
              <section className="border-t pt-8">
                <h3 className="text-lg font-semibold mb-4">
                  Product Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Product Name</p>
                    <p className="font-medium">{refund.product?.name || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Product ID</p>
                    <p className="font-mono text-sm break-all">
                      {refund.productId || "—"}
                    </p>
                  </div>
                  <div className="md:col-span-2 space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Store Name</p>
                      <p className="font-medium">
                        {refund.product?.store?.name || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Store Location</p>
                      <p>{refund.product?.store?.location || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Store Description</p>
                      <p className="text-sm leading-relaxed">
                        {refund.product?.store?.description || "—"}
                      </p>
                    </div>

                    {/* Tags - fixed TS warning */}
                    {(() => {
                      const tags = refund.product?.store?.tags ?? [];
                      return tags.length > 0 ? (
                        <div>
                          <p className="text-sm text-gray-500">Store Tags</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : null;
                    })()}
                  </div>
                </div>
              </section>

              {/* 5. Order Information */}
              <section className="border-t pt-8">
                <h3 className="text-lg font-semibold mb-4">
                  Order Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-medium break-all">
                      {refund.order?.id || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="font-medium">
                      {refund.order?.totalAmount} EUR
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Shipping Cost</p>
                    <p>{refund.order?.shippingCost} EUR</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p>{refund.order?.paymentMethod || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Order Status</p>
                    <p>{refund.order?.orderStatus || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Status</p>
                    <p>{refund.order?.paymentStatus || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Commission Amount</p>
                    <p>{refund.order?.commissionAmount || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Vendor Amount</p>
                    <p>{refund.order?.vendorAmount || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Commission Percent</p>
                    <p>{refund.order?.commissionPercent || "—"}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Commission Paid</p>
                    <p
                      className={
                        refund.order?.commissionPaid
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {refund.order?.commissionPaid ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              </section>

              {/* Action Buttons - Only show if not yet decided */}
              {!isAlreadyDecided && !isFinalStatus && (
                <section className="border-t pt-8 flex justify-end gap-4">
                  <button
                    onClick={() => {
                      setShowReasonModal("approve");
                      setAdminReason("");
                      setReasonError("");
                    }}
                    disabled={isResponding}
                    className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-60 transition-colors"
                  >
                    Approve Refund
                  </button>
                  <button
                    onClick={() => {
                      setShowReasonModal("reject");
                      setAdminReason("");
                      setReasonError("");
                    }}
                    disabled={isResponding}
                    className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-60 transition-colors"
                  >
                    Reject Refund
                  </button>
                </section>
              )}

              {/* Disabled message if already processed */}
              {isAlreadyDecided && (
                <section className="border-t pt-8 text-center text-gray-600">
                  <p className="text-lg">
                    This refund has already been{" "}
                    {refund.adminApproved ? "approved" : "rejected"}.
                  </p>
                </section>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Reason Input Modal */}
      {showReasonModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold">
                {showReasonModal === "approve"
                  ? "Approve Refund"
                  : "Reject Refund"}
              </h3>
              <button
                onClick={() => setShowReasonModal(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <p className="text-gray-600 mb-4">
              Please enter a reason for your decision (required):
            </p>

            <textarea
              value={adminReason}
              onChange={(e) => {
                setAdminReason(e.target.value);
                setReasonError("");
              }}
              placeholder="Write your reason here..."
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />

            {reasonError && (
              <p className="text-red-600 text-sm mt-2">{reasonError}</p>
            )}

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowReasonModal(null)}
                className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRespond(showReasonModal === "approve")}
                disabled={isResponding || !adminReason.trim()}
                className={`px-6 py-2.5 text-white rounded-lg transition-colors ${
                  showReasonModal === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                } disabled:opacity-50`}
              >
                {isResponding
                  ? "Processing..."
                  : showReasonModal === "approve"
                    ? "Confirm Approve"
                    : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Main Component
const SubscriptionsManagement: React.FC = () => {
  const [refundSearchTerm, setRefundSearchTerm] = useState("");
  const [refundStatusFilter, setRefundStatusFilter] = useState("All");
  const [refundPage, setRefundPage] = useState(1);
  const refundLimit = 10;

  const [selectedRefundId, setSelectedRefundId] = useState<string | null>(null);
  const [isBreakdownModalOpen, setIsBreakdownModalOpen] = useState(false);

  const { data: refundRes, isLoading: refundLoading } =
    useGetRefundRequestsQuery({ page: refundPage, limit: refundLimit });

  const refunds = refundRes?.data ?? [];
  const refundMeta = refundRes?.meta ?? { page: 1, totalPage: 1 };

  const filteredRefunds = refunds.filter((refund) => {
    const matchesSearch =
      !refundSearchTerm ||
      refund.id.toLowerCase().includes(refundSearchTerm.toLowerCase()) ||
      refund.customerReason
        ?.toLowerCase()
        .includes(refundSearchTerm.toLowerCase());

    const matchesStatus =
      refundStatusFilter === "All" ||
      refund.status === refundStatusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  const openRefundModal = (id: string) => setSelectedRefundId(id);
  const closeRefundModal = () => setSelectedRefundId(null);

  return (
    <div className="p-6 container mx-auto space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Payment and Refund Management
        </h1>
        <p className="text-gray-600 mt-1">
          Monitor and manage all product orders, service bookings, subscription
          activities.
        </p>
      </div>

      <MatrixCard />

      <div className="flex flex-col gap-10">
        <TransectionHistory />

        {/* Refund History */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Refund History
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search by Refund ID or Reason"
                  value={refundSearchTerm}
                  onChange={(e) => {
                    setRefundSearchTerm(e.target.value);
                    setRefundPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={16}
                />
              </div>
              <select
                value={refundStatusFilter}
                onChange={(e) => {
                  setRefundStatusFilter(e.target.value);
                  setRefundPage(1);
                }}
                className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                    Refund ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                    Order ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                    Reason
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {refundLoading ? (
                  Array(8)
                    .fill(0)
                    .map((_, i) => (
                      <tr key={i}>
                        {Array(8)
                          .fill(0)
                          .map((_, j) => (
                            <td key={j} className="px-4 py-4">
                              <SkeletonLoader className="h-5 w-full" />
                            </td>
                          ))}
                      </tr>
                    ))
                ) : filteredRefunds.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-gray-500">
                      No refund requests found.
                    </td>
                  </tr>
                ) : (
                  filteredRefunds.map((refund) => (
                    <tr key={refund.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm font-medium">
                        {refund.id}...
                      </td>
                      <td className="px-4 py-4 text-sm">
                        {refund.orderId ||
                          refund.bookingId ||
                          refund.subscriptionId ||
                          "—"}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        {refund.customerReason || "—"}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium">
                       € {refund.refundAmount.toFixed(2)}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        {refund.user?.email || "—"}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-2.5 py-1 text-xs rounded-full font-medium ${getStatusColor(refund.status)}`}
                        >
                          {refund.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm">
                        {new Date(refund.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => openRefundModal(refund.id)}
                          className="text-blue-600 hover:text-blue-800"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {refundMeta.totalPage > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <button
                onClick={() => setRefundPage((p) => Math.max(1, p - 1))}
                disabled={refundPage === 1 || refundLoading}
                className="flex items-center gap-1 px-4 py-2 text-sm border rounded disabled:opacity-50"
              >
                <ChevronLeft size={16} /> Prev
              </button>

              <span className="text-sm text-gray-600">
                Page {refundPage} of {refundMeta.totalPage}
              </span>

              <button
                onClick={() => setRefundPage((p) => p + 1)}
                disabled={refundPage >= refundMeta.totalPage || refundLoading}
                className="flex items-center gap-1 px-4 py-2 text-sm border rounded disabled:opacity-50"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <SellerPayoutBreakdownModal
        isOpen={isBreakdownModalOpen}
        onClose={() => setIsBreakdownModalOpen(false)}
      />

      <RefundDetailsModal
        refundId={selectedRefundId}
        isOpen={!!selectedRefundId}
        onClose={() => setSelectedRefundId(null)}
      />
    </div>
  );
};

export default SubscriptionsManagement;
