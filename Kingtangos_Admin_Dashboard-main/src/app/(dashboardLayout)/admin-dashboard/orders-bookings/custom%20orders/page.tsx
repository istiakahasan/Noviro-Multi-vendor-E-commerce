"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Eye, Filter, ArrowDown, Trash2 } from "lucide-react";
import {
  useGetSpecialOffersQuery,
  useDeleteSpecialOfferMutation,
} from "@/redux/api/specialOfferApi";
import PageLoader from "@/app/loading";
import dayjs from "dayjs";
import { CustomOrderDetailsModal } from "@/components/shared/CustomOrderDetailsModal";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const CustomOrdersPage = () => {
  const router = useRouter();
  const [typeFilter, setTypeFilter] = useState("Custom Orders");
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
  const [offerToDelete, setOfferToDelete] = useState<string | null>(null);
  const pageSize = 10;

  const [deleteSpecialOffer, { isLoading: isDeleting }] =
    useDeleteSpecialOfferMutation();

  const typeOptions = ["Bookings", "Products", "Custom Orders"] as const;

  // Fetch special offers with pagination
  const {
    data: offersData,
    isLoading,
    isError,
  } = useGetSpecialOffersQuery({
    page: currentPage,
    limit: pageSize,
  });

  const handleTypeChange = (option: (typeof typeOptions)[number]) => {
    setTypeFilter(option);
    if (option === "Products") {
      router.push(`/admin-dashboard/orders-bookings`);
    } else if (option === "Bookings") {
      router.push(`/admin-dashboard/orders-bookings/bookings`);
    } else {
      router.push(`/admin-dashboard/orders-bookings/custom%20orders`);
    }
    setShowTypeMenu(false);
  };

  const offers = offersData?.data || [];
  const pagination = offersData?.meta;

  // Filter offers based on search term (Client-side search)
  const filteredOffers = useMemo(() => {
    if (!searchTerm) return offers;
    const query = searchTerm.toLowerCase();
    return offers.filter(
      (offer: any) =>
        offer.id.toLowerCase().includes(query) ||
        offer.discountType.toLowerCase().includes(query) ||
        offer.discountValue.toString().includes(query) ||
        offer.minimumOrderAmount.toString().includes(query),
    );
  }, [offers, searchTerm]);

  const handleDelete = async () => {
    if (!offerToDelete) return;
    try {
      await deleteSpecialOffer(offerToDelete).unwrap();
      toast.success("Special offer deleted successfully");
      setOfferToDelete(null);
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || "Failed to delete special offer";
      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="rounded-xl shadow-sm p-6 border border-gray-200 container mx-auto bg-white">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          Custom Order & Special Offers
        </h2>
        <p className="text-gray-600">
          Monitor and manage all custom offers and special discounts sent to
          customers.
        </p>
      </div>

      <div className="flex items-center mb-6 gap-3 flex-wrap">
        <input
          type="text"
          placeholder="Search offers..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-64"
        />

        {/* Type Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowTypeMenu(!showTypeMenu)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Filter size={16} />
            {typeFilter}
            <ArrowDown size={14} />
          </button>
          {showTypeMenu && (
            <ul className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-xl z-20 py-1">
              {typeOptions.map((option) => (
                <li key={option}>
                  <button
                    onClick={() => handleTypeChange(option)}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      typeFilter === option
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    {option}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="overflow-x-auto border rounded-xl">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50/80 border-b">
              <th className="px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Offer ID
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Discount Info
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Min. Amount
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Created Date
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {isError ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-red-500 font-medium"
                >
                  Error loading custom orders. Please try again.
                </td>
              </tr>
            ) : filteredOffers.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-gray-400 font-medium"
                >
                  No custom orders found.
                </td>
              </tr>
            ) : (
              filteredOffers.map((offer: any) => (
                <tr
                  key={offer.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    #{offer.id.slice(0, 8)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900">
                        {offer.discountValue}
                        {offer.discountType === "PERCENTAGE" ? "%" : "€"} Off
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium uppercase">
                        {offer.discountType}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                    € {offer.minimumOrderAmount}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {dayjs(offer.createdAt).format("MMM DD, YYYY")}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2.5 py-1 text-[10px] font-bold rounded-full ${
                        offer.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {offer.isActive ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-1.5">
                    <button
                      onClick={() => setSelectedOfferId(offer.id)}
                      className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </button>
                    <button
                      onClick={() => setOfferToDelete(offer.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                      title="Delete Offer"
                    >
                      <Trash2 className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPage > 1 && (
        <div className="mt-8 flex justify-center items-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Prev
          </button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: pagination.totalPage }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 flex items-center justify-center text-sm font-bold rounded-xl transition-all ${
                    currentPage === page
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                      : "bg-white border border-gray-200 text-gray-500 hover:border-blue-300"
                  }`}
                >
                  {page}
                </button>
              ),
            )}
          </div>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(pagination.totalPage, prev + 1))
            }
            disabled={currentPage === pagination.totalPage}
            className="px-4 py-2 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Next
          </button>
        </div>
      )}

      {/* Details Modal */}
      {selectedOfferId && (
        <CustomOrderDetailsModal
          id={selectedOfferId}
          onClose={() => setSelectedOfferId(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Dialog
        open={!!offerToDelete}
        onOpenChange={(open) => !open && setOfferToDelete(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this special offer? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setOfferToDelete(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomOrdersPage;
