"use client";
import PageLoader from "@/app/loading";
import {
  Store,
  StoreCategory,
  useDeleteStoreMutation,
  useGetAllStoresQuery,
} from "@/redux/features/store-content/storeContentApi";
import { Eye, Filter, Trash } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type StoreStatus = "APPROVED" | "PENDING" | "REJECTED";

const statusColors: Record<StoreStatus, string> = {
  APPROVED: "bg-green-100 text-green-700",
  PENDING: "bg-orange-100 text-orange-700",
  REJECTED: "bg-red-100 text-red-700",
};

const Page: React.FC = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Stores");
  const [typeFilter, setTypeFilter] = useState("Store");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedStores, setSelectedStores] = useState<Set<string>>(new Set());

  // Delete modal state
  const [storeToDelete, setStoreToDelete] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Delete mutation
  const [deleteStore, { isLoading: isDeleting }] = useDeleteStoreMutation();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch stores with pagination
  const {
    data: storesResponse,
    isLoading,
    isError,
  } = useGetAllStoresQuery({
    page: currentPage,
    limit: itemsPerPage,
  });
  // console.log(storesResponse);

  // Filter Options - NO LINKS (only filtering)
  const filterOptions = [
    { label: "All Stores" },
    { label: "Stores" },
    { label: "Approved" },
    { label: "Pending" },
    { label: "Rejected" },
  ];

  // Type Options - WITH LINKS
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

  // Get stores from API response
  const stores = storesResponse?.data?.stores || [];
  const pagination = storesResponse?.data?.pagination;

  // Filter stores based on search and status filter
  const filteredStores = stores
    .filter((s: Store) => {
      const searchTerm = search.toLowerCase();
      return (
        s.name.toLowerCase().includes(searchTerm) ||
        s.email.toLowerCase().includes(searchTerm) ||
        s.user.firstName.toLowerCase().includes(searchTerm) ||
        s.user.lastName.toLowerCase().includes(searchTerm)
      );
    })
    .filter((s: Store) => {
      const filterMap: Record<string, (store: Store) => boolean> = {
        "All Stores": () => true,
        Stores: () => true,
        Approved: (store: Store) => store.shopStatus === "APPROVED",
        Pending: (store: Store) => store.shopStatus === "PENDING",
        Rejected: (store: Store) => store.shopStatus === "REJECTED",
      };
      return filterMap[filter]?.(s) ?? true;
    });

  // Handlers
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedStores(new Set());
    } else {
      setSelectedStores(new Set(filteredStores.map((s: Store) => s.id)));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectRow = (id: string) => {
    const newSelected = new Set(selectedStores);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedStores(newSelected);
    setSelectAll(newSelected.size === filteredStores.length);
  };

  const handleView = (storeId: string) => {
    router.push(`/admin-dashboard/store-content/store/${storeId}`);
  };
  const handleDelete = (storeId: string) => {
    setStoreToDelete(storeId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!storeToDelete) return;
    try {
      const result = await deleteStore(storeToDelete).unwrap();
      toast.success(result.message || "Store deleted successfully!");
      setIsDeleteModalOpen(false);
      setStoreToDelete(null);
    } catch (err: unknown) {
      const apiError = err as { data?: { message?: string } };
      toast.error(
        apiError?.data?.message || "Failed to delete store. Please try again.",
      );
      setIsDeleteModalOpen(false);
      setStoreToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setStoreToDelete(null);
  };

  const handleApprove = (storeId: string) => {
    // TODO: Implement API call to approve store
    console.log("Approve store:", storeId);
  };

  const handleReject = (storeId: string) => {
    // TODO: Implement API call to reject store
    console.log("Reject store:", storeId);
  };

  const handleRemove = (storeId: string) => {
    // TODO: Implement API call to remove store
    console.log("Remove store:", storeId);
  };

  // Type filter with navigation
  const handleTypeSelect = (option: { label: string; link: string }) => {
    setTypeFilter(option.label);
    setShowTypeMenu(false);
    router.push(option.link);
  };

  // Filter dropdown - ONLY FILTER, NO NAVIGATION
  const handleFilterSelect = (option: { label: string }) => {
    setFilter(option.label);
    setShowFilterMenu(false);
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectAll(false);
    setSelectedStores(new Set());
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get category names
  const getCategoryNames = (storeCategories: StoreCategory[]): string => {
    if (!storeCategories || storeCategories.length === 0) return "N/A";
    return storeCategories
      .map((sc: StoreCategory) => sc.category.name)
      .join(", ");
  };
  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto min-h-[calc(100vh-150px)] rounded-2xl">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Store &amp; Content Management
          </h1>
          <p className="text-gray-500 text-sm">
            Approve stores, review seller content, and manage promotional
            placements.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          {/* Status Filter - NO NAVIGATION */}
          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm shadow-sm hover:bg-gray-50"
            >
              <Filter size={16} />
              {filter}
            </button>
            {showFilterMenu && (
              <ul className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                {filterOptions.map((option) => (
                  <li key={option.label}>
                    <button
                      onClick={() => handleFilterSelect(option)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                    >
                      {option.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Type Filter - WITH NAVIGATION */}
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

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name or email."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Loading State */}
      {/* {isLoading && (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading stores...</p>
        </div>
      )} */}

      {/* Error State */}
      {isError && (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-red-600">
            Failed to load stores. Please try again.
          </p>
        </div>
      )}

      {/* Table */}
      {!isLoading && !isError && (
        <>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 text-xs py-3">
                      No.
                      {/* <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      /> */}
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-600">
                      Store Name
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-600">
                      Email
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-600">
                      Owner Name
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-600">
                      Categories
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-600">
                      Join Date
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-600">
                      Status
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-600">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredStores.map((store: Store, i) => (
                    <tr key={store.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        {i + 1}
                        {/* <input
                          type="checkbox"
                          checked={selectedStores.has(store.id)}
                          onChange={() => handleSelectRow(store.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        /> */}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 font-medium">
                        {store.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {store.email}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {store.user.firstName} {store.user.lastName}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {getCategoryNames(store.storeCategories)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {formatDate(store.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            statusColors[store.shopStatus as StoreStatus]
                          }`}
                        >
                          {store.shopStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleView(store.id)}
                            className="p-1 text-blue-500 rounded hover:bg-blue-50"
                            title="View Store"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(store.id)}
                            className="p-1 text-red-500 rounded hover:bg-red-50"
                            title="delete Store"
                          >
                            <Trash size={16} />
                          </button>
                          {/* {store.shopStatus === "PENDING" ? (
                            <>
                              <button
                                onClick={() => handleApprove(store.id)}
                                className="p-1 text-green-500 rounded hover:bg-green-50"
                                title="Approve Store"
                              >
                                <Check size={16} />
                              </button>
                              <button
                                onClick={() => handleReject(store.id)}
                                className="p-1 text-red-500 rounded hover:bg-red-50"
                                title="Reject Store"
                              >
                                <X size={16} />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleRemove(store.id)}
                              className="p-1 text-red-500 rounded hover:bg-red-50"
                              title="Remove Store"
                            >
                              <X size={16} />
                            </button>
                          )} */}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredStores.length === 0 && (
              <div className="p-8 text-center text-gray-500 text-sm">
                No stores found matching your criteria.
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} stores
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: pagination.pages },
                    (_, i) => i + 1,
                  ).map((page) => {
                    // Show first page, last page, current page, and pages around current
                    if (
                      page === 1 ||
                      page === pagination.pages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-1 text-sm border rounded-lg ${
                            currentPage === page
                              ? "bg-blue-600 text-white border-blue-600"
                              : "border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return (
                        <span key={page} className="px-2 text-gray-500">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.pages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={cancelDelete}
          />

          {/* Modal card */}
          <div className="relative z-10 bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                <Trash size={28} className="text-red-600" />
              </div>
            </div>

            <h2 className="text-lg font-semibold text-gray-800 text-center mb-1">
              Delete Store
            </h2>
            <p className="text-sm text-gray-500 text-center mb-6">
              Are you sure you want to delete this store? This action cannot be
              undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={cancelDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {isDeleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
