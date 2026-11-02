




"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Filter, MoreVertical } from "lucide-react";
import { useDeleteUserMutation, useGetAllUsersQuery } from "@/redux/features/userManagement/userManagementApi";
import PageLoader from "@/app/loading";
import { toast } from "sonner";

type Customer = {
  id: string;
  selected: boolean;
  name: string;
  email: string;
  phone?: string;
  joined: string;
  totalOrders?: number;
  status:"True" | "False";
};

const statusColors: Record<Customer["status"], string> = {
  True: "bg-green-100 text-green-700",
  False: "bg-yellow-100 text-yellow-700",
  
};

const filterOptions = ["All", "True", "False" ];
const typeOptions = [
  { label: "Customer", path: "/admin-dashboard/user-management/seller/customer" },
  { label: "Seller", path: "/admin-dashboard/user-management/seller" },
  { label: "Specialist", path: "/admin-dashboard/user-management/seller/specialist" },
];

export default function CustomerPage() {
  const router = useRouter();
  
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("Customer");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [selectAll, setSelectAll] = useState(false);
  
  // API
  const { data, isLoading: isDataLoading, isError } = useGetAllUsersQuery();
  // console.log(data);
  const [deleteUser, { isLoading: isDeleteLoading }] = useDeleteUserMutation();

  const isLoading = isDataLoading || isDeleteLoading;
  // const handleDelete = async (userId: string) => {
    //   try {
      //     await deleteUser(userId).unwrap();
      //     // Success handling
      //   } catch (error) {
        //     // Error handling
        //   }
        // };
        
     

 const handleDeleteCustomer = async (customer: Customer) => {
     try {
    // await deleteUser(customer.id).unwrap();
    await deleteUser(customer.id).unwrap();
    toast.success("Customer deleted successfully");
    // Success handling
  } catch (error : unknown) {
    toast.error((error as Error)?.message);
    // Error handling
  }
  //  console.log("delete customer ",customer.id);
    setShowActionMenu(null);
  };
  // Build customers dynamically
  useEffect(() => {
    if (data?.data) {
      const customerUsers = data.data.filter((u) => u.role === "USER");
      console.log(customerUsers);

      const mapped: Customer[] = customerUsers.map((u) => ({
        id: u.id,
        selected: false,
        name: `${u.firstName} ${u.lastName}`,
        email: u.email,
        // phone: u.phone || "N/A",
        joined: new Date(u.createdAt).toLocaleDateString(),
        // totalOrders: 0, // dynamic later
        status: u.isVerified ? "True" : "False",
      }));

      setCustomers(mapped);
    }
  }, [data]);

  console.log("customers", customers);

  // Loading state
  if (isLoading) return <PageLoader />;
  if (isError) return <div>Something went wrong</div>;

  // Search & filters
  const filteredCustomers = customers
    .filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
    )
    .filter((c) => {
      if (filter === "All") return true;
      return c.status === filter;
    });

  // Select all
  const handleSelectAll = () => {
    const val = !selectAll;
    setCustomers((prev) => prev.map((c) => ({ ...c, selected: val })));
    setSelectAll(val);
  };

  const handleSelectRow = (id: string) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, selected: !c.selected } : c))
    );
  };

  // Actions
  const handleViewProfile = (customer: Customer) => {
    router.push(`/admin-dashboard/user-management/seller/customer/${customer.id}`);
    setShowActionMenu(null);
  };

  // const handleBanCustomer = (customer: Customer) => {
  //   setCustomers((prev) =>
  //     prev.map((c) =>
  //       c.id === customer.id ? { ...c, status: "Suspended" } : c
  //     )
  //   );
  //   setShowActionMenu(null);
  // };

 

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto min-h-screen rounded-2xl">
      {/* Header */}
      <div className="flex justify-between items-start mb-6 flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            User Management
          </h1>
          <p className="text-gray-500 text-sm">
            Manage all platform users including sellers and customers.
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 relative">
          {/* Status Filter */}
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
                  <li key={option}>
                    <button
                      onClick={() => {
                        setFilter(option);
                        setShowFilterMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                    >
                      {option}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Type filter */}
          <div className="relative">
            <button
              onClick={() => setShowTypeMenu(!showTypeMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm shadow-sm hover:bg-gray-50"
            >
              {typeFilter} ▼
            </button>
            {showTypeMenu && (
              <ul className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                {typeOptions.map((option) => (
                  <li key={option.label}>
                    <button
                      onClick={() => {
                        setTypeFilter(option.label);
                        router.push(option.path);
                        setShowTypeMenu(false);
                      }}
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
            placeholder="Search by name or email..."
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

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3">
 no
                  {/* <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  /> */}
                </th>
                <th className="px-4 py-3 text-xs font-medium text-gray-600">
                  Customer Name
                </th>
                <th className="px-4 py-3 text-xs font-medium text-gray-600">
                  Email
                </th>
                {/* <th className="px-4 py-3 text-xs font-medium text-gray-600">
                  Phone
                </th> */}
                <th className="px-4 py-3 text-xs font-medium text-gray-600">
                  Joined
                </th>
                {/* <th className="px-4 py-3 text-xs font-medium text-gray-600">
                  Total Order
                </th> */}
                <th className="px-4 py-3 text-xs font-medium text-gray-600">
                  Verifyed
                </th>
                <th className="px-4 py-3 text-xs font-medium text-gray-600 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.map((customer,i) => (
                <tr
                  key={customer.id}
                  className={`border-b border-gray-200 ${
                    customer.selected ? "bg-blue-50" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    {/* <input
                      type="checkbox"
                      checked={customer.selected}
                      onChange={() => handleSelectRow(customer.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    /> */}
                    {i + 1}
                  </td>

                  <td className="px-4 py-3 text-gray-800">
                    {customer.name}
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    {customer.email}
                  </td>

                  {/* <td className="px-4 py-3 text-gray-600">
                    {customer.phone}
                  </td> */}

                  <td className="px-4 py-3 text-gray-600">
                    {customer.joined}
                  </td>

                  {/* <td className="px-4 py-3 text-gray-600">
                    {customer.totalOrders}
                  </td> */}

                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColors[customer.status]}`}
                    >
                      {customer.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right relative">
                    <button
                      onClick={() =>
                        setShowActionMenu(
                          showActionMenu === customer.id ? null : customer.id
                        )
                      }
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <MoreVertical size={18} />
                    </button>

                    {showActionMenu === customer.id && (
                      <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-20">
                        <button
                          onClick={() => handleViewProfile(customer)}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          View Profile
                        </button>
                        {/* <button
                          onClick={() => handleBanCustomer(customer)}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          Ban Customer
                        </button> */}
                        <button
                          onClick={() => handleDeleteCustomer(customer)}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          Delete Account
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}

              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-gray-500">
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}
