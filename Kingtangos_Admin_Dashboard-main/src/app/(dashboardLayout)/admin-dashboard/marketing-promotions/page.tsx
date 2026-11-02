

"use client";
import React, { useState } from "react";
import { Check, X, Search, Filter } from "lucide-react";
import { useRouter } from "next/navigation";

const MarketingPromotions: React.FC = () => {
  const router = useRouter();
  const [coupons, setCoupons] = useState([
    { id: 1, code: "SUMMER25", seller: "Nami", validity: "Sep 1-30, 2025", discount: "$498.05", usageLimit: "$400", status: "Paid" },
    { id: 2, code: "SUMMER25", seller: "Nami", validity: "Sep 1-30, 2025", discount: "$498.05", usageLimit: "$400", status: "Paid" },
    { id: 3, code: "NEWCUSTOMER", seller: "Robin", validity: "Sep 1-30, 2025", discount: "$498.05", usageLimit: "$400", status: "Pending" },
    { id: 4, code: "FLASH50", seller: "Robin", validity: "Sep 1-30, 2025", discount: "$498.05", usageLimit: "$400", status: "Processing" },
    { id: 5, code: "WELCOME15", seller: "Robin", validity: "Sep 1-30, 2025", discount: "$498.05", usageLimit: "$400", status: "Paid" },
    { id: 6, code: "NEWCUSTOMER", seller: "Robin", validity: "Sep 1-30, 2025", discount: "$498.05", usageLimit: "$400", status: "Pending" },
    { id: 7, code: "FLASH50", seller: "Robin", validity: "Sep 1-30, 2025", discount: "$498.05", usageLimit: "$400", status: "Processing" },
    { id: 8, code: "SUMMER25", seller: "Robin", validity: "Sep 1-30, 2025", discount: "$498.05", usageLimit: "$400", status: "Pending" },
    { id: 9, code: "FLASH50", seller: "Robin", validity: "Sep 1-30, 2025", discount: "$498.05", usageLimit: "$400", status: "Paid" },
    { id: 10, code: "NEWCUSTOMER", seller: "Robin", validity: "Sep 1-30, 2025", discount: "$498.05", usageLimit: "$400", status: "Processing" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("Coupons");
  const [selectedCoupons, setSelectedCoupons] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showTypeMenu, setShowTypeMenu] = useState(false);

  const statusOptions = ["All Statuses", "Paid", "Pending", "Processing"];
  // const typeOptions = [];

  // Filter coupons based on search and status
  const filteredCoupons = coupons.filter(
    (coupon) =>
      (coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coupon.seller.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "All" || coupon.status === statusFilter)
  );

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedCoupons(new Set());
    } else {
      setSelectedCoupons(new Set(filteredCoupons.map((c) => c.id)));
    }
    setSelectAll(!selectAll);
  };

  const toggleSelectCoupon = (id: number) => {
    const newSelected = new Set(selectedCoupons);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedCoupons(newSelected);
    setSelectAll(newSelected.size === filteredCoupons.length && filteredCoupons.length > 0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-orange-100 text-orange-800";
      case "Processing":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // ✅ Mark coupon as Paid
  const handleApprove = (couponId: number) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === couponId ? { ...c, status: "Paid" } : c))
    );
  };

  // ❌ Remove coupon
  const handleDelete = (couponId: number) => {
    setCoupons((prev) => prev.filter((c) => c.id !== couponId));
    setSelectedCoupons((prev) => {
      const updated = new Set(prev);
      updated.delete(couponId);
      return updated;
    });
  };

  const handleStatusChange = (option: string) => {
    setStatusFilter(option === "All Statuses" ? "All" : option);
    setShowStatusMenu(false);
  };

const typeOptions = ["Coupons", "Advertisement"];

const handleTypeChange = (option: string) => {
  setTypeFilter(option);

  if (option === "Coupons") {
    router.push("/admin-dashboard/marketing-promotions");
  } else if (option === "Advertisement") {
    router.push("/admin-dashboard/marketing-promotions/advertisement");
  }

  setShowTypeMenu(false);
};


  const getStatusDisplay = () => {
    return statusFilter === "All" ? "All Statuses" : statusFilter;
  };

  return (
    <div className="p-6 space-y-6 container mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Marketing & Promotions</h1>
        <p className="text-gray-600 mt-1">
          Manage platform-wide promotional campaigns, discount codes and featured listings.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center justify-between mb-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
        </div>
        <div className="flex items-center">
          {/* Status Filter Dropdown */}
          <div className="ml-4 relative">
            <button
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Filter size={16} />
              {getStatusDisplay()}
            </button>
            {showStatusMenu && (
              <ul className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                {statusOptions.map((option) => (
                  <li key={option}>
                    <button
                      onClick={() => handleStatusChange(option)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                    >
                      {option}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Type Filter Dropdown */}
          <div className="ml-4 relative">
            <button
              onClick={() => setShowTypeMenu(!showTypeMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Filter size={16} />
              {typeFilter}
            </button>
            {showTypeMenu && (
              <ul className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                {typeOptions.map((option) => (
                  <li key={option}>
                    <button
                      onClick={() => handleTypeChange(option)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                    >
                      {option}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-4 py-3 text-xs font-medium text-gray-600">Coupon Code</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-600">Seller Name</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-600">Validity</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-600">Discount Value</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-600">Usage Limit</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCoupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedCoupons.has(coupon.id)}
                      onChange={() => toggleSelectCoupon(coupon.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 font-medium">{coupon.code}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{coupon.seller}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{coupon.validity}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 font-medium">{coupon.discount}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{coupon.usageLimit}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        coupon.status
                      )}`}
                    >
                      {coupon.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApprove(coupon.id)}
                        className="p-1 text-green-500 rounded hover:bg-green-50"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(coupon.id)}
                        className="p-1 text-red-500 rounded hover:bg-red-50"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredCoupons.length === 0 && (
          <div className="p-8 text-center text-gray-500 text-sm">
            No coupons found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketingPromotions;
