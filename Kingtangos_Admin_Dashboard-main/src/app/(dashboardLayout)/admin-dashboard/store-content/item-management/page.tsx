// "use client";
// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Eye, Filter } from "lucide-react";
// import { useGetAllProductsQuery } from "@/redux/features/store-content/storeContentApi";
// import PageLoader from "@/app/loading";

// type Status = "Online" | "Offline";

// type Product = {
//   id: string;
//   itemName: string;
//   type: string;
//   storeName: string;
//   email: string;
//   price: number;
//   finalPrice: number;
//   stockQuantity: number;
//   ownerName: string;
//   submissionDate: string;
//   status: "ONLINE" | "OFFLINE";
//   selected: boolean;
// };

// const statusColors: Record<Status, string> = {
//   Online: "bg-green-100 text-green-700",
//   Offline: "bg-red-100 text-red-700",
// };

// export default function ItemManagement() {
//   const router = useRouter();
//   const [search, setSearch] = useState("");
//   const [filter, setFilter] = useState("All");
//   const [typeFilter, setTypeFilter] = useState("Product");
//   const [showFilterMenu, setShowFilterMenu] = useState(false);
//   const [showTypeMenu, setShowTypeMenu] = useState(false);
//   const [selectAll, setSelectAll] = useState(false);
//   const [page, setPage] = useState(1);
//   const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

//   const filterOptions = ["All", "Online", "Offline"];
//   const typeOptions = [
//     { label: "Store", link: "/admin-dashboard/store-content" },
//     { label: "Product", link: "/admin-dashboard/store-content/item-management" },
//     { label: "Promotions", link: "/admin-dashboard/store-content/promotions" },
//   ];

//   const { data: productsResponse, isLoading, isError } =
//     useGetAllProductsQuery({
//       page,
//       limit: 10,
//       type: typeFilter,
//     });

//   const products = productsResponse?.data.products || [];
//   const pagination = productsResponse?.data.pagination;

//   const transformedProducts: Product[] = products.map((product) => ({
//     id: product.id,
//     itemName: product.name,
//     type: product.type,
//     storeName: product.store.name,
//     stockQuantity: product.stockQuantity,
//     email: "",
//     ownerName: product.store.name,
//     submissionDate: new Date(product.createdAt).toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//     }),
//     price: product.price,
//     finalPrice: product.finalPrice,
//     status: product.store.status,
//     selected: selectedProducts.includes(product.id),
//   }));

//   // ✅ FIXED FILTER (ONLY CHANGE)
//   const filteredData = transformedProducts
//     .filter((item) =>
//       filter === "All"
//         ? true
//         : item.status === filter.toUpperCase()
//     )
//     .filter((item) => {
//       const query = search.toLowerCase();
//       return (
//         item.itemName.toLowerCase().includes(query) ||
//         item.storeName.toLowerCase().includes(query) ||
//         item.type.toLowerCase().includes(query)
//       );
//     });

//   const handlePageChange = (newPage: number) => {
//     setPage(newPage);
//     setSelectAll(false);
//     setSelectedProducts([]);
//   };

//   if (isLoading) {
//     return <PageLoader />;
//   }

//   return (
//     <div className="p-4 sm:p-6 max-w-7xl mx-auto min-h-[calc(100vh-150px)] rounded-2xl">
//       <div className="flex justify-between items-start mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">
//             Product Management
//           </h1>
//           <p className="text-gray-500 text-sm">
//             Approve, reject, or review submitted products from sellers.
//           </p>
//         </div>

//         <div className="flex items-center gap-2">
//           <div className="relative">
//             <button
//               onClick={() => setShowFilterMenu(!showFilterMenu)}
//               className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm shadow-sm hover:bg-gray-50"
//             >
//               <Filter size={16} />
//               {filter}
//             </button>

//             {showFilterMenu && (
//               <ul className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-10">
//                 {filterOptions.map((status) => (
//                   <li key={status}>
//                     <button
//                       onClick={() => {
//                         setFilter(status);
//                         setShowFilterMenu(false);
//                       }}
//                       className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
//                     >
//                       {status}
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           <div className="relative">
//             <button
//               onClick={() => setShowTypeMenu(!showTypeMenu)}
//               className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm shadow-sm hover:bg-gray-50"
//             >
//               {typeFilter} ▼
//             </button>

//             {showTypeMenu && (
//               <ul className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg z-10">
//                 {typeOptions.map((option) => (
//                   <li key={option.label}>
//                     <button
//                       onClick={() => {
//                         setTypeFilter(option.label);
//                         setShowTypeMenu(false);
//                         router.push(option.link);
//                       }}
//                       className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
//                     >
//                       {option.label}
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="mb-6">
//         <input
//           type="text"
//           placeholder="Search by name, email, or store..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
//         />
//       </div>

//       {!isError && (
//         <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//           <table className="w-full min-w-[1000px]">
//             <thead className="bg-gray-50 border-b">
//               <tr>
//                 <th className="px-4 py-3 text-xs">No.</th>
//                 <th className="px-4 py-3 text-xs">Product Name</th>
//                 <th className="px-4 py-3 text-xs">Type</th>
//                 <th className="px-4 py-3 text-xs">Price</th>
//                 <th className="px-4 py-3 text-xs">Store</th>
//                 <th className="px-4 py-3 text-xs">Stock</th>
//                 <th className="px-4 py-3 text-xs">Date</th>
//                 <th className="px-4 py-3 text-xs">Status</th>
//                 <th className="px-4 py-3 text-xs">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredData.map((item, i) => (
//                 <tr key={item.id} className="border-t hover:bg-gray-50">
//                   <td className="px-4 py-3">{i + 1}</td>
//                   <td className="px-4 py-3">{item.itemName}</td>
//                   <td className="px-4 py-3">{item.type}</td>
//                   <td className="px-4 py-3">
//                     {item.price || item.finalPrice}
//                   </td>
//                   <td className="px-4 py-3">{item.storeName}</td>
//                   <td className="px-4 py-3">{item.stockQuantity}</td>
//                   <td className="px-4 py-3">{item.submissionDate}</td>
//                   <td className="px-4 py-3">
//                     <span
//                       className={`px-2 py-1 text-xs rounded-full ${
//                         statusColors[
//                           item.status === "ONLINE" ? "Online" : "Offline"
//                         ]
//                       }`}
//                     >
//                       {item.status === "ONLINE" ? "Online" : "Offline"}
//                     </span>
//                   </td>
//                   <td className="px-4 py-3">
//                     <button
//                       onClick={() =>
//                         router.push(
//                           `/admin-dashboard/store-content/item-management/${item.id}`
//                         )
//                       }
//                       className="text-blue-500 hover:text-blue-700"
//                     >
//                       <Eye size={16} />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {filteredData.length === 0 && (
//             <div className="p-8 text-center text-gray-500 text-sm">
//               No products found.
//             </div>
//           )}
//         </div>
//       )}

//       {/* Pagination */}         {pagination && pagination.totalPage > 1 && (
//             <div className="mt-6 flex items-center justify-between">
//               <div className="text-sm text-gray-600">
//                 Showing page {pagination.page} of {pagination.totalPage} ({pagination.total} total products)
//               </div>
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => handlePageChange(page - 1)}
//                   disabled={page === 1}
//                   className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Previous
//                 </button>
//                 {Array.from({ length: pagination.totalPage }, (_, i) => i + 1).map((pageNum) => (
//                   <button
//                     key={pageNum}
//                     onClick={() => handlePageChange(pageNum)}
//                     className={`px-3 py-1 text-sm border rounded-lg ${
//                       pageNum === page
//                         ? "bg-blue-500 text-white border-blue-500"
//                         : "border-gray-300 hover:bg-gray-50"
//                     }`}
//                   >
//                     {pageNum}
//                   </button>
//                 ))}
//                 <button
//                   onClick={() => handlePageChange(page + 1)}
//                   disabled={page === pagination.totalPage}
//                   className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           )}
//     </div>
//   );
// }

"use client";

import PageLoader from "@/app/loading";
import {
  useGetAllProductsByAdminQuery,
  useUpdateProductStatusMutation,
} from "@/redux/features/store-content/storeContentApi";
import { Eye, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Status = "approved" | "pending" | "rejected";

type Product = {
  id: string;
  itemName: string;
  type: string;
  storeName: string;
  email: string;
  price: number;
  finalPrice: number;
  stockQuantity: number;
  ownerName: string;
  submissionDate: string;
  status: Status;
  selected: boolean;
};

const statusColors: Record<Status, string> = {
  approved: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-700",
};

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

export default function ItemManagement() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("Product");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [page, setPage] = useState(1);

  const [updateProductStatus, { isLoading: isUpdating }] =
    useUpdateProductStatusMutation();

  const filterOptions = ["All", "approved", "pending", "rejected"];

  const {
    data: productsResponse,
    isLoading,
    isError,
  } = useGetAllProductsByAdminQuery({
    page,
    limit: 10,
    // You can later add: search, status: filter !== "All" ? filter : undefined
  });

  const products = productsResponse?.data || [];
  const pagination = productsResponse?.pagination;

  const totalPages = pagination?.totalPage || 1;
  const currentPage = pagination?.page || page;
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const transformedProducts: Product[] = products.map((p) => ({
    id: p.id,
    itemName: p.name,
    type: p.type,
    storeName: p.store.name,
    email: "",
    price: p.price,
    finalPrice: p.finalPrice,
    stockQuantity: p.stockQuantity,
    ownerName: p.store.name,
    submissionDate: new Date(p.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    status: p.status as Status,
    selected: false,
  }));

  // Client-side filtering (search + status)
  const filteredData = transformedProducts
    .filter((item) => (filter === "All" ? true : item.status === filter))
    .filter((item) => {
      if (!search) return true;
      const query = search.toLowerCase();
      return (
        item.itemName.toLowerCase().includes(query) ||
        item.storeName.toLowerCase().includes(query) ||
        item.type.toLowerCase().includes(query)
      );
    });

  const handleStatusChange = async (productId: string, newStatus: Status) => {
    try {
      await updateProductStatus({ id: productId, status: newStatus }).unwrap();
      toast.success(`Product ${newStatus}`);
    } catch (err: any) {
      console.error("Status update failed:", err);
      toast.error(
        "Failed to update status: " + (err?.data?.message || "Unknown error"),
      );
    }
  };

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  if (isLoading || isUpdating) return <PageLoader />;
  if (isError) {
    return (
      <div className="text-center text-red-600 py-10">
        Failed to load products. Please try again later.
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto min-h-[calc(100vh-150px)] rounded-2xl">
      {/* Header + filters + search – same as before */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Product Management
          </h1>
          <p className="text-gray-500 text-sm">
            Approve, reject, or review submitted products from sellers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter button + dropdown – unchanged */}
          <div className="relative">
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
                        setPage(1);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Type switcher – unchanged */}
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
                      onClick={() => {
                        setTypeFilter(option.label);
                        setShowTypeMenu(false);
                        router.push(option.link);
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

      {/* Search input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name, store, or type..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white rounded-lg overflow-x-auto overflow-y-hidden shadow-sm ">
        <table className="w-full  min-w-[1000px]">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-xs font-medium text-gray-700">
                No.
              </th>
              <th className="px-4 py-3 text-xs font-medium text-gray-700">
                Product Name
              </th>
              <th className="px-4 py-3 text-xs font-medium text-gray-700">
                Type
              </th>
              <th className="px-4 py-3 text-xs font-medium text-gray-700">
                Price
              </th>
              <th className="px-4 py-3 text-xs font-medium text-gray-700">
                Store
              </th>
              <th className="px-4 py-3 text-xs font-medium text-gray-700">
                Stock
              </th>
              <th className="px-4 py-3 text-xs font-medium text-gray-700">
                Date
              </th>
              <th className="px-4 py-3 text-xs font-medium text-gray-700">
                Status
              </th>
              <th className="px-4 py-3 text-xs font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No products found.
                </td>
              </tr>
            ) : (
              filteredData.map((item, i) => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">
                    {(page - 1) * 10 + i + 1}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">
                    {item.itemName}
                  </td>
                  <td className="px-4 py-3 text-sm">{item.type}</td>
                  <td className="px-4 py-3 text-sm">
                    €{item.finalPrice?.toFixed(2) || item.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm">{item.storeName}</td>
                  <td className="px-4 py-3 text-sm">{item.stockQuantity}</td>
                  <td className="px-4 py-3 text-sm">{item.submissionDate}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusColors[item.status]}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex items-center gap-3">
                    <button
                      onClick={() =>
                        router.push(
                          `/admin-dashboard/store-content/item-management/${item.id}`,
                        )
                      }
                      className="text-blue-600 hover:text-blue-800"
                      title="View details"
                    >
                      <Eye size={18} />
                    </button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-100 outline-none">
                          <BsThreeDots size={20} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-44 bg-white border border-gray-200 rounded-lg shadow-xl"
                      >
                        {item.status !== "approved" && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(item.id, "approved")
                            }
                            className="w-full text-left px-4 py-2 text-green-700 hover:bg-green-50 focus:bg-green-50 focus:text-green-700 cursor-pointer"
                          >
                            Approve
                          </DropdownMenuItem>
                        )}
                        {item.status !== "pending" && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(item.id, "pending")
                            }
                            className="w-full text-left px-4 py-2 text-yellow-700 hover:bg-yellow-50 focus:bg-yellow-50 focus:text-yellow-700 cursor-pointer"
                          >
                            Set Pending
                          </DropdownMenuItem>
                        )}
                        {item.status !== "rejected" && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(item.id, "rejected")
                            }
                            className="w-full text-left px-4 py-2 text-red-700 hover:bg-red-50 focus:bg-red-50 focus:text-red-700 cursor-pointer"
                          >
                            Reject
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* ── Pagination Controls ──────────────────────────────── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={!hasPrev}
            className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={!hasNext}
            className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
