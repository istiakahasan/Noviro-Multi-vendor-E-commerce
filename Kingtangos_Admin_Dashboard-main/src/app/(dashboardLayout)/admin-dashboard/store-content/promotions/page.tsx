"use client";
import AdImage from "@/assets/images/ad image.png";
import { Search, Trash2, Verified, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";

type Status = "Approved" | "Pending" | "Rejected";

import PageLoader from "@/app/loading";
import type { StaticImageData } from "next/image";
import {
  Advertisement,
  useGetAllAdvertisementsQuery,
  useGetAllCouponsQuery,
  useApproveAdvertisementMutation,
  useRejectAdvertisementMutation,
  useDeleteAdvertisementMutation,
} from "./../../../../../redux/features/store-content/storeContentApi";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  APPROVED: "bg-green-100 text-green-700",
  PAID: "bg-blue-100 text-blue-700",
  PAYMENT_PENDING: "bg-orange-100 text-orange-700",
  REJECTED: "bg-red-100 text-red-700",
};

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        );
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center space-x-1">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      {getPageNumbers().map((page, index) => (
        <React.Fragment key={index}>
          {page === "..." ? (
            <span className="px-3 py-2 text-sm font-medium text-gray-500">
              ...
            </span>
          ) : (
            <button
              onClick={() => onPageChange(Number(page))}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                currentPage === page
                  ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                  : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};

export default function Promotions() {
  const router = useRouter();
  const [adSearch, setAdSearch] = useState("");
  const [couponSearch, setCouponSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("Promotions");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showAdModal, setShowAdModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [adToDelete, setAdToDelete] = useState<string | null>(null);

  // Transformed ad shape used in the UI (wraps the original Advertisement as originalData)
  type TransformedAd = {
    id: string;
    title: string;
    campaign: string;
    timeline: string;
    deadline: string;
    image: string | StaticImageData;
    status: string;
    originalData: Advertisement;
  };

  const [selectedAd, setSelectedAd] = useState<TransformedAd | null>(null);
  const [adPage, setAdPage] = useState(1);
  const [couponPage, setCouponPage] = useState(1);
  const adPageSize = 6;
  const couponPageSize = 5;

  // Fetch coupons with pagination
  const {
    data: couponsData,
    isLoading: isCpnLoading,
    isError: isCpnError,
  } = useGetAllCouponsQuery({
    page: couponPage,
    limit: couponPageSize,
  });

  // Fetch advertisements with pagination
  const {
    data: advertisementData,
    isLoading: isADLoading,
    isError: isADError,
  } = useGetAllAdvertisementsQuery({
    page: adPage,
    limit: adPageSize,
  });

  // NEW: Advertisement Approve & Reject Mutations
  const [approveAd] = useApproveAdvertisementMutation();
  const [rejectAd] = useRejectAdvertisementMutation();
  const [deleteAd] = useDeleteAdvertisementMutation();

  const typeOptions = [
    { label: "Store", link: "/admin-dashboard/store-content" },
    {
      label: "Product",
      link: "/admin-dashboard/store-content/item-management",
    },
    { label: "Promotions", link: "/admin-dashboard/store-content/promotions" },
    {
      label: "Subscriptions",
      link: "/admin-dashboard/store-content/subscription",
    },
    {
      label: "Consultation",
      link: "/admin-dashboard/store-content/consultation",
    },
    { label: "Services", link: "/admin-dashboard/store-content/service" },
  ];

  // Transform advertisements API data
  const transformedAds = useMemo(() => {
    if (!advertisementData?.data) return [];

    return (advertisementData.data as Advertisement[]).map((ad) => {
      // Calculate remaining time
      const calculateDeadline = () => {
        if (!ad.endDate) return "Not started";
        const end = new Date(ad.endDate);
        const now = new Date();
        const diff = end.getTime() - now.getTime();

        if (diff <= 0) return "Expired";

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
      };

      return {
        id: ad.id,
        title: ad.product.name,
        campaign: ad.store.name,
        timeline: `${ad.totalDays} days`,
        deadline: calculateDeadline(),
        image: ad.image || AdImage,
        status: ad.status,
        originalData: ad,
      };
    });
  }, [advertisementData]);

  // Apply search filter to ads
  const filteredAds = useMemo(() => {
    return transformedAds.filter(
      (item: TransformedAd) =>
        item.title.toLowerCase().includes(adSearch.toLowerCase()) ||
        item.campaign.toLowerCase().includes(adSearch.toLowerCase()),
    );
  }, [transformedAds, adSearch]);

  console.log(filteredAds);

  // Transform API data to match component structure and apply filters
  const transformedCoupons = useMemo(() => {
    if (!couponsData?.data?.data) return [];

    return couponsData.data.data.map((coupon) => {
      // Format dates
      const startDate = new Date(coupon.startDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const endDate = new Date(coupon.expireDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      // Determine status based on dates (you can adjust this logic)
      const now = new Date();
      const start = new Date(coupon.startDate);
      const expire = new Date(coupon.expireDate);
      let status: Status = "Pending";

      if (now >= start && now <= expire) {
        status = "Approved";
      } else if (now > expire) {
        status = "Rejected";
      }

      return {
        id: coupon.id,
        code: coupon.couponCode,
        storeName: "Store Name",
        value: coupon.discountType,
        type:
          coupon.discountType === "PERCENTAGE"
            ? `${coupon.discount}%`
            : `$${coupon.discount}`,
        validity: `${startDate}-${endDate}`,
        status: status,
        usageLimit:
          coupon.limitForSingleUser === -1
            ? "Unlimited"
            : `0/${coupon.limitForSingleUser}`,
        originalData: coupon,
      };
    });
  }, [couponsData]);

  // Apply search and filter
  const filteredCoupons = useMemo(() => {
    return transformedCoupons.filter((item) => {
      const matchesFilter = filter === "All" || item.status === filter;
      const query = couponSearch.toLowerCase();
      const matchesSearch =
        item.code.toLowerCase().includes(query) ||
        item.storeName.toLowerCase().includes(query);
      return matchesFilter && matchesSearch;
    });
  }, [transformedCoupons, filter, couponSearch]);

  const totalAdPages = advertisementData?.meta?.totalPage || 1;
  const totalCouponPages = couponsData?.data?.meta?.totalPage || 1;

  const handleTypeSelect = (option: { label: string; link: string }) => {
    setTypeFilter(option.label);
    setShowTypeMenu(false);
    router.push(option.link);
  };

  const handleApproveAllAds = () => {
    console.log("Approve all ads");
    // Implement approve all API call here
  };

  const handleRejectAllAds = () => {
    console.log("Reject all ads");
    // Implement reject all API call here
  };

  const handleApproveCoupon = (id: string) => {
    console.log("Approve coupon", id);
    // Implement approve API call here
  };

  const handleRejectCoupon = (id: string) => {
    console.log("Reject coupon", id);
    // Implement reject API call here
  };

  // REAL API CALLS FOR ADVERTISEMENTS
  const handleApproveAd = async (adId: string) => {
    try {
      await approveAd(adId).unwrap();
      toast.success("Advertisement approved successfully!");
      setShowAdModal(false);
    } catch (error) {
      toast.error("Failed to approve advertisement");
    }
  };

  const handleRejectAd = async (adId: string) => {
    try {
      await rejectAd(adId).unwrap();
      toast.success("Advertisement rejected successfully!");
      setShowAdModal(false);
    } catch (error) {
      toast.error("Failed to reject advertisement");
    }
  };

  const handleDeleteAd = async () => {
    if (!adToDelete) return;
    try {
      await deleteAd(adToDelete).unwrap();
      toast.success("Advertisement deleted successfully!");
      setShowDeleteModal(false);
      setAdToDelete(null);
      setShowAdModal(false);
    } catch (error) {
      toast.error("Failed to delete advertisement");
    }
  };

  const handleOpenDeleteConfirm = (id: string) => {
    setAdToDelete(id);
    setShowDeleteModal(true);
  };

  const handleViewAd = (id: string) => {
    const ad = filteredAds.find((a: TransformedAd) => a.id === id);
    if (ad) {
      setSelectedAd(ad);
      setShowAdModal(true);
    }
  };
  const isApproved = selectedAd?.status === "APPROVED";
  const isRejected = selectedAd?.status === "REJECTED";
  if (isADLoading || isCpnLoading) {
    return <PageLoader />;
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto min-h-[calc(100vh-150px)] rounded-2xl">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Promotions</h1>
          <p className="text-gray-500 text-sm">
            Manage advertising campaigns and coupons for promotions.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          {/* Status Filter */}
          {/* <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm shadow-sm hover:bg-gray-50"
            >
              <Filter size={16} />
              {filter}
            </button>
            {showFilterMenu && (
              <ul className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-10">
                {filterOptions.map((status) => (
                  <li key={status}>
                    <button
                      onClick={() => {
                        setFilter(status);
                        setShowFilterMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                    >
                      {status}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div> */}

          {/* Type Dropdown (Navigation) */}
          <div className="relative">
            <button
              onClick={() => setShowTypeMenu(!showTypeMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm shadow-sm hover:bg-gray-50"
            >
              {typeFilter} ▼
            </button>
            {showTypeMenu && (
              <ul className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg z-10">
                {typeOptions.map((option) => (
                  <li key={option.label}>
                    <button
                      onClick={() => handleTypeSelect(option)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                    >
                      {option.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Advertising List Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Advertising List </h2>

        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search ad and promotion by name or type"
              value={adSearch}
              onChange={(e) => setAdSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Ad cards */}
        {isADLoading ? (
          <div className="text-center py-8 text-gray-500">
            Loading advertisements...
          </div>
        ) : isADError ? (
          <div className="text-center py-8 text-red-500">
            Error loading advertisements. Please try again.
          </div>
        ) : filteredAds.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No advertisements found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {filteredAds.map((ad: TransformedAd) => (
              <div
                key={ad.id}
                className="border rounded-lg overflow-hidden bg-white cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleViewAd(ad.id)}
              >
                <div className="relative aspect-2/3 m-2 rounded-xl overflow-hidden">
                  <Image
                    src={ad.image}
                    alt={ad.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex flex-col">
                      <p className="text-xl text-gray-500">{ad?.title}</p>
                      <p className="text-[8px] text-gray-500">{ad.campaign}</p>
                    </div>
                    <span
                      className={`px-2 py-1 text-[10px] inline font-semibold rounded-full ${
                        statusColors[ad.status] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {ad.status.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-lg">Timeline: </p>
                    <span className="text-lg">{ad.timeline}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-lg">Deadline: </p>
                    <span className="text-lg text-red-500">{ad.deadline}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination and Buttons */}
        {!isADLoading && !isADError && filteredAds.length > 0 && (
          <div className="flex justify-between items-center">
            <Pagination
              currentPage={adPage}
              totalPages={totalAdPages}
              onPageChange={setAdPage}
            />
          </div>
        )}
      </div>

      {/* Advertisement Details Modal */}
      {showAdModal && selectedAd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  Advertisement Details - {selectedAd.title}
                </h2>
                <button
                  onClick={() => setShowAdModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="relative aspect-video mb-4 rounded-lg overflow-hidden">
                <Image
                  src={selectedAd.image}
                  alt={selectedAd.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Product Name</p>
                  <p className="font-medium">{selectedAd.title}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Store Name</p>
                  <p className="font-medium">{selectedAd.campaign}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Timeline</p>
                  <p className="font-medium">{selectedAd.timeline}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Deadline</p>
                  <p className="font-medium text-red-500">
                    {selectedAd.deadline}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      statusColors[selectedAd.status] ||
                      "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {selectedAd.status.replace("_", " ")}
                  </span>
                </div>
                {selectedAd.originalData && (
                  <>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Price Per Hour
                      </p>
                      <p className="font-medium">
                        ${selectedAd.originalData.pricePerHour}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Price</p>
                      <p className="font-medium">
                        ${selectedAd.originalData.totalPrice}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Active</p>
                      <p className="font-medium">
                        {selectedAd.originalData.isActive ? "Yes" : "No"}
                      </p>
                    </div>
                  </>
                )}
              </div>
              <div className="flex gap-2 justify-end mt-6">
                <button
                  onClick={() => handleOpenDeleteConfirm(selectedAd.id)}
                  className="px-4 py-2 border border-red-500 hover:text-white bg-white flex items-center rounded-lg text-red-500 hover:bg-red-600 text-sm mr-auto"
                >
                  <Trash2 className="mr-2 w-4 h-4" />
                  Delete
                </button>
                {selectedAd.status !== "REJECTED" && (
                  <button
                    onClick={() => handleApproveAd(selectedAd.id)}
                    disabled={
                      selectedAd.status === "APPROVED" ||
                      selectedAd.status === "PAYMENT_PENDING"
                    }
                    className="px-4 py-2 flex items-center border hover:text-white border-green-500 bg-green-100 text-green-500 rounded-lg hover:bg-green-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Verified className="mr-2 w-4 h-4" />
                    {selectedAd.status === "APPROVED" ? "Approved" : "Approve"}
                  </button>
                )}
                {selectedAd.status !== "APPROVED" && (
                  <button
                    onClick={() => handleRejectAd(selectedAd.id)}
                    disabled={selectedAd.status === "REJECTED"}
                    className="px-4 py-2 border border-red-500 hover:text-white bg-red-100 flex items-center rounded-lg text-red-500 hover:bg-red-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="mr-2 w-4 h-4" />
                    {selectedAd.status === "REJECTED" ? "Rejected" : "Reject"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4 text-center">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl transform transition-all">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash2 className="text-red-600 w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Delete Advertisement?
            </h3>
            <p className="text-gray-500 mb-8 px-4">
              This action cannot be undone. This advertisement will be
              permanently removed from the system.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setAdToDelete(null);
                }}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAd}
                className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 shadow-lg shadow-red-200 transition-all hover:-translate-y-0.5"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
