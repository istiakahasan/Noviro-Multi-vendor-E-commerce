"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { Filter, Eye } from "lucide-react";
import { useGetAllSubscriptionsQuery } from "@/redux/features/subscription/subscriptionApi";
import PageLoader from "@/app/loading";
import CancilationRequest from "./CancilationRequest";

// Define proper types for your data
interface SubscriptionPlan {
  planName: string;
  interval: string;
  intervalCount: number;
  features?: string[];
  storeId?: string | null;
}

interface SubscriptionUser {
  firstName: string;
  lastName: string;
}

interface SubscriptionItem {
  id: string;
  user: SubscriptionUser;
  plan: SubscriptionPlan;
  amount: number;
  paymentStatus: string;
  startDate: string;
  endDate: string;
}

interface ApiResponse {
  data: SubscriptionItem[];
}

// Table row type
interface TableSubscription {
  id: string;
  customer: string;
  seller: string;
  plan: string;
  type: string;
  benefits: string[];
  amount: string;
  status: "Active" | "Inactive";
  startDate: string;
  endDate: string;
}

const SubscriptionsPageContent = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"All" | "Active" | "Inactive">("All");
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [typeFilter, setTypeFilter] = useState<"Subscriptions" | "Track">(
    "Subscriptions",
  );

  const { data, isLoading, isError } = useGetAllSubscriptionsQuery(undefined);

  // Transform API data
  const subscriptions = useMemo<TableSubscription[]>(() => {
    if (!data?.data) return [];

    return data.data.map((sub: SubscriptionItem): TableSubscription => {
      const customerName = `${sub.user.firstName} ${sub.user.lastName}`.trim();
      const planName = sub.plan.planName;

      const interval =
        sub.plan.interval === "month"
          ? "Monthly"
          : sub.plan.interval === "year"
            ? "Yearly"
            : sub.plan.interval.charAt(0).toUpperCase() +
              sub.plan.interval.slice(1);

      const isActive =
        new Date(sub.endDate) > new Date() && sub.paymentStatus === "PAID";
      const status: "Active" | "Inactive" = isActive ? "Active" : "Inactive";

      return {
        id: sub.id,
        customer: customerName,
        seller: sub.plan.storeId ? "Store Owner" : "Platform",
        plan: planName,
        type: `${interval} (${sub.plan.intervalCount > 1 ? `${sub.plan.intervalCount} ` : ""}${sub.plan.interval})`,
        benefits: sub.plan.features || ["Standard benefits"],
        amount: `€ ${sub.amount.toFixed(2)}/${sub.plan.interval === "month" ? "m" : "y"}`,
        status,
        startDate: sub.startDate,
        endDate: sub.endDate,
      };
    });
  }, [data?.data]);

  // Filtered results
  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((sub) => {
      const matchesSearch =
        sub.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.plan.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter = filter === "All" || sub.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [subscriptions, searchQuery, filter]);

  console.log(filteredSubscriptions);
  const handleTypeChange = (option: "Subscriptions" | "Track") => {
    setTypeFilter(option);
    if (option === "Track") {
      router.push("/admin-dashboard/subscriptions/track");
    }
    setShowTypeMenu(false);
  };

  const statusColors: Record<"Active" | "Inactive", string> = {
    Active: "bg-green-100 text-green-800",
    Inactive: "bg-gray-100 text-gray-700",
  };

  // Proper change handler with correct type
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "All" || value === "Active" || value === "Inactive") {
      setFilter(value);
    }
  };

  if (isLoading) return <PageLoader />;
  if (isError || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-red-600">
          Failed to load subscriptions.
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Subscriptions Management
          </h1>
          <p className="text-gray-600 mt-1">
            Monitor and manage all active and expired subscription plans.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by customer name or plan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
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

          <div className="flex gap-3">
            {/* Fixed: Proper typing, no 'any' */}
            <select
              value={filter}
              onChange={handleFilterChange}
              className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <div className="relative">
              <button
                onClick={() => setShowTypeMenu(!showTypeMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm shadow-sm hover:bg-gray-50"
              >
                <Filter size={16} />
                {typeFilter}
              </button>

              {showTypeMenu && (
                <ul className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                  {(["Subscriptions", "Track"] as const).map((option) => (
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
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Benefits
                  </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    End date 
                  </th>
                  
                
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSubscriptions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      No subscriptions found.
                    </td>
                  </tr>
                ) : (
                  filteredSubscriptions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {sub.customer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {sub.plan}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {sub.type}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                        <ul className="list-disc list-inside space-y-1">
                          {sub.benefits.slice(0, 3).map((benefit, idx) => (
                            <li key={idx} className="truncate">
                              {benefit}
                            </li>
                          ))}
                          {sub.benefits.length > 3 && (
                            <li className="text-gray-500 text-xs">
                              +{sub.benefits.length - 3} more
                            </li>
                          )}
                        </ul>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {sub.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {sub.startDate}
                        
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {sub.endDate}

                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${statusColors[sub.status]}`}
                        >
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <Link
                          href={`/admin-dashboard/subscriptions/plan/${sub.id}`}
                        >
                          <Eye className="w-5 h-5 text-blue-600 hover:text-blue-800 cursor-pointer inline-block" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

                {/* canclation requests  */}
       {/* <CancilationRequest/> */}
      </div>
    </div>
  );
};

export default SubscriptionsPageContent;
