import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { useRespondToCancellationMutation } from "@/redux/features/subscription/subscriptionApi";

interface CancellationResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: string | null;
  action: "approve" | "reject" | null;
}

const CancellationResponseModal: React.FC<CancellationResponseModalProps> = ({
  isOpen,
  onClose,
  requestId,
  action,
}) => {
  const [reason, setReason] = useState("");
  const [respondToCancellation, { isLoading }] =
    useRespondToCancellationMutation();

  if (!isOpen || !requestId || !action) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    try {
      await respondToCancellation({
        id: requestId,
        body: {
          action: action,
          reason: reason,
        },
      }).unwrap();
      setReason("");
      onClose();
    } catch (error) {
      console.error("Failed to respond to cancellation:", error);
    }
  };

  const isApprove = action === "approve";
  const title = isApprove ? "Approve Cancellation" : "Reject Cancellation";
  const buttonColor = isApprove
    ? "bg-green-600 hover:bg-green-700"
    : "bg-red-600 hover:bg-red-700";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2
            className={`text-xl font-bold ${isApprove ? "text-green-600" : "text-red-600"}`}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Reason for {isApprove ? "approval" : "rejection"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              id="reason"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Enter reason for ${isApprove ? "approving" : "rejecting"} the request...`}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-white rounded-md transition-colors flex items-center gap-2 ${buttonColor} disabled:opacity-50`}
              disabled={isLoading || !reason.trim()}
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isApprove ? "Confirm Approval" : "Confirm Rejection"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CancellationResponseModal;
