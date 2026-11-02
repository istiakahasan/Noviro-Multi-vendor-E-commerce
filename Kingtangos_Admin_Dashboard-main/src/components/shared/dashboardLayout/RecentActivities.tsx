// // components/RecentActivities.tsx
// import React from 'react';
// import { UserPlus, RefreshCw, UserCheck, ShoppingBag } from 'lucide-react';

// interface Activity {
//   id: string;
//   Icon: React.ComponentType<{ className?: string }>;
//   bgColor: string;
//   iconColor: string;
//   type: string;
//   details: string;
//   time: string;
// }

// const RecentActivities: React.FC = () => {
//   const activities: Activity[] = [
//     {
//       id: '1',
//       Icon: UserPlus,
//       bgColor: 'bg-blue-500/10',
//       iconColor: 'text-blue-500',
//       type: 'New seller registration',
//       details: 'TechStore Pro',
//       time: '5 mins ago',
//     },
//     {
//       id: '2',
//       Icon: ShoppingBag,
//       bgColor: 'bg-green-500/10',
//       iconColor: 'text-green-500',
//       type: 'New order placed',
//       details: 'Order #ORD-284',
//       time: '12 mins ago',
//     },
//     {
//       id: '3',
//       Icon: RefreshCw,
//       bgColor: 'bg-purple-500/10',
//       iconColor: 'text-purple-500',
//       type: 'New subscription signup',
//       details: 'Premium Plan',
//       time: '35 mins ago',
//     },
//     {
//       id: '4',
//       Icon: UserCheck,
//       bgColor: 'bg-blue-500/10',
//       iconColor: 'text-blue-500',
//       type: 'Seller verification approved',
//       details: 'FashionHub',
//       time: '1 hour ago',
//     },
//   ];

//   return (
//     <div className="rounded-lg border border-gray-100 shadow-sm p-6 w-full">
//       <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activities</h3>
//       <ul className="space-y-3">
//         {activities.map((activity) => (
//           <li key={activity.id} className="flex items-center space-x-3">
//             <div className={`w-8 h-8 rounded-full ${activity.bgColor} flex items-center justify-center flex-shrink-0 border border-[color]-200`}>
//               <activity.Icon className={`w-4 h-4 ${activity.iconColor}`} />
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="text-sm font-medium text-gray-900 truncate">{activity.type}</p>
//               <p className="text-sm text-gray-500 truncate">{activity.details}</p>
//             </div>
//             <div className="text-sm text-gray-500 flex-shrink-0">{activity.time}</div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default RecentActivities;










"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Filter, Eye } from "lucide-react";
import { useGetAllUsersQuery } from "@/redux/features/userManagement/userManagementApi";
import PageLoader from "@/app/loading";

type Seller = {
  id: string;
  storeName: string;
  owner: string;
  email: string;
  joined: string;
  status: "Active" | "Pending" | "Suspended" ;
};
type User = {
        id: string;
        storeName?: string;
        firstName: string;
        lastName: string;
        email: string;
        createdAt: string;
        isVerified: boolean;
      };

const statusColors: Record<Seller["status"], string> = {
  Active: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Suspended: "bg-red-100 text-red-700",
};

const filterOptions = ["All", "Active", "Pending", "Suspended"];

const RecentActivities = () => {
  const router = useRouter();
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const { data, isLoading, isError } = useGetAllUsersQuery();
// console.log(data);
  useEffect(() => {
    if (data?.data) {
      const sellerUsers = data.data.filter((u: {role: string}) => u.role === "SELLER");

      

      const mapped: Seller[] = sellerUsers.map((u: User) => ({
        id: u.id,
        storeName: u.storeName || "Demo Store",
        owner: `${u.firstName} ${u.lastName}`.trim(),
        email: u.email,
        joined: new Date(u.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        status: u.isVerified ? "Active" : "Pending",
      }));

      setSellers(mapped);
    }
  }, [data]);

  // Filter + Search
  const filteredSellers = sellers
    .filter((s) => {
      const term = search.toLowerCase();
      const matchesSearch =
        s.owner.toLowerCase().includes(term) ||
        s.email.toLowerCase().includes(term) ||
        s.storeName.toLowerCase().includes(term);

      const matchesFilter = filter === "All" || s.status === filter;

      return matchesSearch && matchesFilter;
    })
    .sort(
      (a, b) =>
        new Date(b.joined).getTime() -
        new Date(a.joined).getTime()
    );

  if (isLoading) return <PageLoader />;
  if (isError)
    return (
      <div className="text-center text-red-600 py-10">
        Failed to load sellers
      </div>
    );

  return (
    <div className="container mx-auto">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Seller Management
        </h1>

        <div className="flex gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:flex-initial">
            <input
              type="text"
              placeholder="Search by name, email or store..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-80 pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
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

          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              <Filter size={16} />
              {filter}
            </button>

            {showFilterMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                {filterOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setFilter(option);
                      setShowFilterMenu(false);
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-100 text-sm transition"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">
                  No
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">
                  Store Name
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">
                  Owner
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">
                  Email
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">
                  Joined
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase text-center">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredSellers.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-12 text-gray-500"
                  >
                    No sellers found.
                  </td>
                </tr>
              ) : (
                filteredSellers.map((seller, index) => (
                  <tr
                    key={seller.id}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {seller.storeName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {seller.owner}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {seller.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {seller.joined}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${statusColors[seller.status]}`}
                      >
                        {seller.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() =>
                          router.push(
                            `/admin-dashboard/user-management/store/${seller.id}`
                          )
                        }
                        className="inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition"
                        title="View Profile"
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
      </div>
    </div>
  );
};

export default RecentActivities;
