"use client";

import { useEffect, useState } from "react";
import { useGetCancellationRequestsQuery } from "@/redux/features/subscription/subscriptionApi";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";
import CancellationResponseModal from "./CancellationResponseModal"; // Import the modal
import { useGetSingleRefundQuery } from "@/redux/features/withdrawalRequest/withdrawalApi";

const CancilationRequest = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data, isLoading, isError } = useGetCancellationRequestsQuery({
    page,
    limit,
  });

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null,
  );
  const [modalAction, setModalAction] = useState<"approve" | "reject" | null>(
    null,
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const { data: singleData } = useGetSingleRefundQuery(selectedId!, {
    skip: !selectedId,
  });
  const handleView = (id: string) => {
    setSelectedId(id);
    setIsViewModalOpen(true);
  };

  useEffect(() => {
    if (singleData) {
      console.log(singleData);
    }
  }, [singleData]);

  // const handleView = (id: string) => {
  //     console.log("View Request ID:", id);
  //     const {data:singleData} = useGetSingleRefundQuery(id)
  //     console.log(singleData)
  // };

  const openModal = (id: string, action: "approve" | "reject") => {
    setSelectedRequestId(id);
    setModalAction(action);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRequestId(null);
    setModalAction(null);
  };

  if (isLoading)
    return <div className="mt-10 text-center py-4">Loading requests...</div>;
  if (isError)
    return (
      <div className="mt-10 text-center py-4 text-red-500">
        Error loading requests
      </div>
    );

  const requests = data?.data || [];
  const meta = data?.meta;
  const totalPages = meta?.totalPage || 1;

  // Status badge colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case "REFUNDED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      case "APPROVED":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="mt-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Cancellation Requests
        </h1>
        <p className="text-gray-600 mt-1">
          Monitor and manage all cancellation requests.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Refund Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No cancellation requests found.
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {req.user?.firstName} {req.user?.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {req.subscription?.plan?.planName || "N/A"}
                    </td>
                    <td
                      className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate"
                      title={req.customerReason}
                    >
                      {req.customerReason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ${req.refundAmount?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(req.status)}`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => handleView(req.id)}
                          className="text-gray-500 hover:text-gray-700 p-1"
                          title="View ID"
                        >
                          <Eye size={18} />
                        </button>

                        {/* Only show Approve/Reject buttons if status is presumably pending  */}
                        {/* Adjust condition as needed based on actual API status values */}
                        {(req.status === "PENDING" ||
                          !["REFUNDED", "REJECTED", "APPROVED"].includes(
                            req.status,
                          )) && (
                          <>
                            <button
                              onClick={() => openModal(req.id, "approve")}
                              className="text-green-600 hover:text-green-800 p-1"
                              title="Approve"
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button
                              onClick={() => openModal(req.id, "reject")}
                              className="text-red-600 hover:text-red-800 p-1"
                              title="Reject"
                            >
                              <XCircle size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta && totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
            <div className="flex justify-between flex-1 sm:hidden">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{page}</span> of{" "}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* ===== View Details Modal ===== */}
      {isViewModalOpen && singleData?.data && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6 relative">
            {/* Close */}
            <button
              onClick={() => setIsViewModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>

            <h2 className="text-lg font-bold mb-4">Refund Details</h2>

            <div className="space-y-2 text-sm">
              <p>
                <b>Name:</b> {singleData.data.user?.firstName}{" "}
                {singleData.data.user?.lastName}
              </p>

              <p>
                <b>Email:</b> {singleData.data.user?.email}
              </p>

              <p>
                <b>Status:</b> {singleData.data.status}
              </p>

              <p>
                <b>Refund Amount:</b> ${singleData.data.refundAmount}
              </p>

              <p>
                <b>Customer Reason:</b> {singleData.data.customerReason}
              </p>

              <p>
                <b>Seller Reason:</b> {singleData.data.sellerReason}
              </p>

              <p>
                <b>Admin Reason:</b> {singleData.data.adminReason}
              </p>

              <p>
                <b>Payment Status:</b>{" "}
                {singleData.data.subscription?.paymentStatus}
              </p>

              <p>
                <b>Created:</b>{" "}
                {new Date(singleData.data.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      <CancellationResponseModal
        isOpen={isModalOpen}
        onClose={closeModal}
        requestId={selectedRequestId}
        action={modalAction}
      />
    </div>
  );
};

export default CancilationRequest;
