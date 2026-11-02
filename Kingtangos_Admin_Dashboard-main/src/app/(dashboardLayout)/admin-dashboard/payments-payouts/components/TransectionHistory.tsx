"use client";

import React, { useState } from "react";
import { Search, Eye, X, DownloadIcon } from "lucide-react";
import {
  useGetTransactionHistoryQuery,
  useGetSingleTransactionQuery,
  useGenerateTransactionPDFMutation,
  Transaction,
} from "@/redux/features/withdrawalRequest/withdrawalApi";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const TransectionHistory = () => {
  const [txSearchTerm, setTxSearchTerm] = useState("");
  const [txStatusFilter, setTxStatusFilter] = useState("All");
  const [selectedTxId, setSelectedTxId] = useState<string | null>(null);

  const { data: txData, isLoading: txLoading } =
    useGetTransactionHistoryQuery();

  const { data: singleTxData, isLoading: singleTxLoading } =
    useGetSingleTransactionQuery(selectedTxId!, {
      skip: !selectedTxId,
    });
  const [generatePDF, { isLoading: isDownloading }] =
    useGenerateTransactionPDFMutation();

  const handleDownloadPDF = async () => {
    if (!selectedTxId) return;

    try {
      const result = await generatePDF(selectedTxId).unwrap();
      const url = window.URL.createObjectURL(result);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `transaction-${selectedTxId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download PDF:", error);
    }
  };

  const transaction = singleTxData?.data;

  const getStatusColor = (status: string) => {
    const upper = status?.toUpperCase() || "";
    if (upper === "PENDING") return "bg-yellow-100 text-yellow-800";
    if (upper === "COMPLETED" || upper === "SUCCESS" || upper === "PAID")
      return "bg-green-100 text-green-800";
    if (upper === "FAILED") return "bg-red-100 text-red-800";
    if (upper === "REFUNDED") return "bg-orange-100 text-orange-800";
    return "bg-gray-100 text-gray-800";
  };

  const filteredTransactions = (txData?.data ?? []).filter(
    (tx: Transaction) =>
      tx.sellerStripeId.toLowerCase().includes(txSearchTerm.toLowerCase()) &&
      (txStatusFilter === "All" || tx.paymentStatus === txStatusFilter),
  );

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Transaction History
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
          <div className="relative flex-1 w-full max-w-md">
            <input
              type="text"
              placeholder="Search by Stripe ID"
              value={txSearchTerm}
              onChange={(e) => setTxSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">
              <Search size={16} />
            </span>
          </div>
          <select
            value={txStatusFilter}
            onChange={(e) => setTxStatusFilter(e.target.value)}
            className="w-full sm:w-auto border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Statuses</option>
            <option value="COMPLETED">Success</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-xs font-medium text-gray-600">
                Transaction ID
              </th>
              <th className="px-4 py-3 text-xs font-medium text-gray-600">
                Stripe ID
              </th>
              <th className="px-4 py-3 text-xs font-medium text-gray-600">
                Description
              </th>
              <th className="px-4 py-3 text-xs font-medium text-gray-600">
                Amount
              </th>
              <th className="px-4 py-3 text-xs font-medium text-gray-600">
                Currency
              </th>
              <th className="px-4 py-3 text-xs font-medium text-gray-600">
                Payment Status
              </th>
              <th className="px-4 py-3 text-xs font-medium text-gray-600">
                Transfer Status
              </th>
              <th className="px-4 py-3 text-xs font-medium text-gray-600">
                Date
              </th>
              <th className="px-4 py-3 text-xs font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {txLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 9 }).map((_, j) => (
                    <td key={j} className="px-4 py-3 text-sm">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  ))}
                </tr>
              ))
            ) : filteredTransactions.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="p-8 text-center text-gray-500 text-sm"
                >
                  No transactions found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((tx: Transaction) => (
                <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {tx.stripeTransferId}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 font-medium">
                    {tx.sellerStripeId}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 font-medium">
                    {tx.description}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 font-medium">
                    {tx.amount}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 font-medium">
                    {/* {tx.currency.toUpperCase()} */}
                    EUR
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        tx.paymentStatus,
                      )}`}
                    >
                      {tx.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-700 text-nowrap">
                      {tx.transferStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-nowrap">
                    {new Date(tx.transferDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedTxId(tx.id)}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors text-blue-600"
                      title="View ID"
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

      <Dialog open={!!selectedTxId} onOpenChange={() => setSelectedTxId(null)}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              Detailed information for transaction #{selectedTxId?.slice(-8)}
            </DialogDescription>
          </DialogHeader>

          {singleTxLoading ? (
            <div className="space-y-4 p-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ) : !transaction ? (
            <div className="p-4 text-center text-gray-500">
              No detailed information found for this transaction.
            </div>
          ) : (
            <div className="space-y-6 py-4">
              {/* Transaction Info Section */}
              <section className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Transaction Information
                </h3>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border">
                  <div>
                    <p className="text-xs text-gray-500">Amount</p>
                    <p className="text-sm font-bold">
                      {/* {transaction.amount} {transaction.currency?.toUpperCase()} */}
                      {transaction.amount} EUR
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <span
                      className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full ${getStatusColor(
                        transaction.paymentStatus,
                      )}`}
                    >
                      {transaction.paymentStatus}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500">Description</p>
                    <p className="text-sm">{transaction.description}</p>
                  </div>
                  <div className="col-span-2 border-t pt-2">
                    <p className="text-xs text-gray-500">Stripe Transfer ID</p>
                    <p className="text-xs font-mono break-all">
                      {transaction.stripeTransferId}
                    </p>
                  </div>
                </div>
              </section>

              {/* Seller & Store Section */}
              {transaction.sellerStripe?.store && (
                <section className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Store Information
                  </h3>
                  <div className="flex items-start gap-4 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-white border shrink-0">
                      {transaction.sellerStripe.store.logo && (
                        <img
                          src={transaction.sellerStripe.store.logo}
                          alt={transaction.sellerStripe.store.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-blue-900">
                        {transaction.sellerStripe.store.name}
                      </p>
                      <p className="text-xs text-blue-700 flex items-center gap-1">
                        <span className="shrink-0 font-medium">Email:</span>
                        {transaction.sellerStripe.store.email}
                      </p>
                      <p className="text-xs text-blue-700 flex items-center gap-1">
                        <span className="shrink-0 font-medium">Location:</span>
                        {transaction.sellerStripe.store.location}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 px-1">
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase">
                        Stripe Account
                      </p>
                      <p className="text-xs font-mono">
                        {transaction.sellerStripe.stripeAccountId}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase">
                        Store Status
                      </p>
                      <span className="text-xs font-medium text-green-700">
                        {transaction.sellerStripe.store.shopStatus}
                      </span>
                    </div>
                  </div>
                </section>
              )}

              {/* Technical Details */}
              <section className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  System Tracking
                </h3>
                <div className="text-[10px] space-y-1 text-gray-400 font-mono">
                  <p>Transaction ID: {transaction.id}</p>
                  <p>
                    Created At:{" "}
                    {new Date(transaction.createdAt).toLocaleString()}
                  </p>
                  <p>
                    Transfer Date:{" "}
                    {new Date(transaction.transferDate).toLocaleString()}
                  </p>
                </div>
              </section>
            </div>
          )}

          <div className="flex justify-between mt-2">
            <Button onClick={handleDownloadPDF} disabled={isDownloading}>
              <DownloadIcon className="w-4 h-4 mr-2" />
              {isDownloading ? "Downloading..." : "Download pdf invoice"}
            </Button>
            <button
              onClick={() => setSelectedTxId(null)}
              className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors text-sm font-medium"
            >
              Close
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransectionHistory;
