// // components/PayoutReviewModal.tsx
// "use client";
// import { Calendar, CircleMinus, CircleX, CreditCard, Mail, ShoppingBag, User, X } from "lucide-react";
// import React, { useState } from "react";

// interface WithdrawRequest {
//   id: string;
//   sellerName: string;
//   sellerEmail: string;
//   amount: number;
//   accountDetails: string;
//   requestedDate: string;
//   linkedOrders: string[];
//   status: "PENDING" | "APPROVED" | "REJECTED" | "PROCESSING" | "COMPLETED" | "FAILED";
// }

// interface PayoutReviewModalProps {
//   request: WithdrawRequest;
//   isOpen: boolean;
//   onClose: () => void;
//   onApprove: () => void;
//   onDecline: (reason: string) => void;
// }

// const PayoutReviewModal: React.FC<PayoutReviewModalProps> = ({
//   request,
//   isOpen,
//   onClose,
//   onApprove,
//   onDecline,
// }) => {
//   const [declineReason, setDeclineReason] = useState("");

//   if (!isOpen) return null;

//   const handleDecline = () => {
//     if (!declineReason.trim()) {
//       alert("Please provide a reason for declining.");
//       return;
//     }
//     onDecline(declineReason);
//     setDeclineReason("");
//   };

//   const handleApprove = () => {
//     onApprove();
//     setDeclineReason("");
//   };

//   const handleClose = () => {
//     setDeclineReason("");
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="flex justify-between items-center p-6 border-b border-gray-200">
//           <h2 className="text-xl font-bold text-gray-900">Review Payout Request</h2>
//           <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
//             <X size={24} />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="p-6 space-y-6">
//           <p className="text-sm text-gray-600">
//             Review the seller&apos;s information and linked orders before approving or declining
//           </p>

//           {/* Seller Information */}
//           <div>
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Seller Information</h3>
//             <div className="bg-gray-50 rounded-lg p-4 space-y-3">
//               <div className="flex items-center gap-3 text-gray-700">
//                 <User size={18} />
//                 <span>Name: <strong className="ml-2">{request.sellerName}</strong></span>
//               </div>
//               <div className="flex items-center gap-3 text-gray-700">
//                 <Mail size={18} />
//                 <span>Email: <strong className="ml-2">{request.sellerEmail}</strong></span>
//               </div>
//             </div>
//           </div>

//           {/* Amount & Date */}
//           <div className="grid grid-cols-2 gap-6">
//             <div>
//               <p className="text-sm text-gray-600">Requested Amount</p>
//               <p className="text-3xl font-bold text-gray-900 mt-1">
//                 ${request.amount.toLocaleString()}
//               </p>
//             </div>
//             <div className="flex items-center gap-3 text-gray-700">
//               <Calendar size={20} className="text-gray-500" />
//               <div>
//                 <p className="text-sm text-gray-600">Request Date</p>
//                 <p className="font-medium">{request.requestedDate}</p>
//               </div>
//             </div>
//           </div>

//           {/* Account Details */}
//           <div>
//             <p className="text-sm text-gray-600 mb-2">Account Details</p>
//             <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-3">
//               <CreditCard size={18} className="text-gray-600" />
//               <span className="text-gray-800">{request.accountDetails}</span>
//             </div>
//           </div>

//           {/* Linked Orders */}
//           <div>
//             <div className="flex items-center gap-2 mb-3">
//               <ShoppingBag size={18} className="text-gray-600" />
//               <p className="font-medium text-gray-900">Linked Orders</p>
//             </div>
//             <div className="flex flex-wrap gap-2">
//               {request.linkedOrders.length > 0 ? (
//                 request.linkedOrders.map((order) => (
//                   <span
//                     key={order}
//                     className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
//                   >
//                     {order}
//                   </span>
//                 ))
//               ) : (
//                 <span className="text-gray-500 text-sm">No linked orders</span>
//               )}
//             </div>
//           </div>

//           {/* Decline Reason */}
//           <div>
//             <p className="text-sm font-medium text-gray-900 mb-2">
//               Decline Reason (if declining)
//             </p>
//             <textarea
//               value={declineReason}
//               onChange={(e) => setDeclineReason(e.target.value)}
//               placeholder="Provide a reason for declining this request..."
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm resize-none"
//               rows={3}
//             />
//           </div>

//           {/* Action Buttons */}
//           <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
//             <button
//               onClick={handleClose}
//               className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleDecline}
//               className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
//             >
//               <CircleX />
//               Decline Request
//             </button>
//             <button
//               onClick={handleApprove}
//               className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
//             >
//               <CircleMinus />
//               Approve Request
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PayoutReviewModal;

"use client";
import {
  Calendar,
  CircleMinus,
  CircleX,
  CreditCard,
  User,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import {
  useApproveWithdrawMutation,
  useRejectWithdrawMutation,
} from "@/redux/features/withdrawalRequest/withdrawalApi";

interface WithdrawRequest {
  id: string;
  amount: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  status:
    | "PENDING"
    | "APPROVED"
    | "REJECTED"
    | "PROCESSING"
    | "COMPLETED"
    | "FAILED";
  createdAt: string;
  branchName?: string | null;
  routingNumber?: string | null;
}

interface PayoutReviewModalProps {
  request: WithdrawRequest;
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => void;
  onDecline: (reason: string) => void;
}

interface ApiError {
  data?: {
    message?: string;
  };
  message?: string;
}

const PayoutReviewModal: React.FC<PayoutReviewModalProps> = ({
  request,
  isOpen,
  onClose,
  onApprove,
  onDecline,
}) => {
  const [declineReason, setDeclineReason] = useState<string>("");
  const [approveWithdraw, { isLoading: isApproving }] =
    useApproveWithdrawMutation();
  const [rejectWithdraw, { isLoading: isRejecting }] =
    useRejectWithdrawMutation();

  // console.log("request==============================>",request);

  if (!isOpen) return null;

  const isPending = request.status === "PENDING";

  const handleDecline = async (): Promise<void> => {
    if (!declineReason.trim()) {
      toast.error("Please provide a reason for declining.");
      return;
    }

    try {
      await rejectWithdraw({ id: request.id, note: declineReason }).unwrap();
      toast.success("Withdraw request declined successfully");
      onDecline(declineReason);
      setDeclineReason("");
      onClose();
    } catch (error) {
      const apiError = error as ApiError;
      console.error(apiError);
      toast.error(apiError?.data?.message || "Failed to decline request.");
    }
  };

  const handleApprove = async (): Promise<void> => {
    try {
      await approveWithdraw({
        id: request.id,
        note: "Request approved",
      }).unwrap();
      toast.success("Withdraw request approved successfully");
      onApprove();
      setDeclineReason("");
      onClose();
    } catch (error) {
      const apiError = error as ApiError;
      console.error(apiError);
      toast.error(apiError?.data?.message || "Failed to approve request.");
    }
  };

  const handleClose = (): void => {
    setDeclineReason("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Review Payout Request
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <p className="text-sm text-gray-600">
            Review the account information before approving or declining
          </p>

          {/* Account Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Account Information
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3 text-gray-700">
                <User size={18} />
                <span>
                  Account Name:{" "}
                  <strong className="ml-2">{request.accountName}</strong>
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <CreditCard size={18} />
                <span>
                  Account Number:{" "}
                  <strong className="ml-2">{request.accountNumber}</strong>
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <span>
                  Bank Name:{" "}
                  <strong className="ml-2">{request.bankName}</strong>
                </span>
              </div>
              {request.branchName && (
                <div className="flex items-center gap-3 text-gray-700">
                  <span>
                    Branch:{" "}
                    <strong className="ml-2">{request.branchName}</strong>
                  </span>
                </div>
              )}
              {request.routingNumber && (
                <div className="flex items-center gap-3 text-gray-700">
                  <span>
                    Routing Number:{" "}
                    <strong className="ml-2">{request.routingNumber}</strong>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Amount & Date */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600">Requested Amount</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                €{Number(request.amount).toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Calendar size={20} className="text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Request Date</p>
                <p className="font-medium">
                  {new Date(request.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Decline Reason */}
          <div>
            <p className="text-sm font-medium text-gray-900 mb-2">
              Decline Reason (if declining)
            </p>
            <textarea
              value={declineReason}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setDeclineReason(e.target.value)
              }
              placeholder="Provide a reason for declining this request..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm resize-none"
              rows={3}
              disabled={!isPending || isRejecting || isApproving}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleClose}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              disabled={isRejecting || isApproving}
            >
              Cancel
            </button>
            <button
              onClick={handleDecline}
              disabled={!isPending || isRejecting || isApproving}
              className={`px-5 py-2.5 rounded-lg flex items-center gap-2 text-white transition ${
                isPending
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              <CircleX size={18} />
              {isRejecting ? "Declining..." : "Decline Request"}
            </button>
            <button
              onClick={handleApprove}
              disabled={!isPending || isRejecting || isApproving}
              className={`px-5 py-2.5 rounded-lg flex items-center gap-2 text-white transition ${
                isPending
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              <CircleMinus size={18} />
              {isApproving ? "Approving..." : "Approve Request"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayoutReviewModal;
