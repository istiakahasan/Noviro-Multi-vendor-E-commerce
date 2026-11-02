// "use client";

// import PageLoader from "@/app/loading";
// import { useGetConsultationsQuery } from "@/redux/features/mainScreen/consultationsApi";
// import {
//   useGetAllProductsByAdminQuery,
//   useUpdateProductStatusMutation,
// } from "@/redux/features/store-content/storeContentApi";
// import { Eye, Filter, ChevronLeft, ChevronRight } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { BsThreeDots } from "react-icons/bs";

// type Status = "approved" | "pending" | "rejected";

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
//   status: Status;
//   selected: boolean;
// };

// const statusColors: Record<Status, string> = {
//   approved: "bg-green-100 text-green-700",
//   pending: "bg-yellow-100 text-yellow-700",
//   rejected: "bg-red-100 text-red-700",
// };

// const typeOptions = [
//   { label: "Store", link: "/admin-dashboard/store-content" },
//   {
//     label: "Product",
//     link: "/admin-dashboard/store-content/item-management",
//   },
//   { label: "Promotions", link: "/admin-dashboard/store-content/promotions" },
//   { label: "Subscriptions", link: "/admin-dashboard/store-content/subscription" },
//   { label: "Consultation", link: "/admin-dashboard/store-content/consultation" },
//   { label: "Services", link: "/admin-dashboard/store-content/service" },
// ];

// export default function ConsultationManagement() {
//   const router = useRouter();

//   const [search, setSearch] = useState("");
//   const [filter, setFilter] = useState("All");
//   const [typeFilter, setTypeFilter] = useState("Consultation");
//   const [showFilterMenu, setShowFilterMenu] = useState(false);
//   const [showTypeMenu, setShowTypeMenu] = useState(false);
//   const [page, setPage] = useState(1);

//   const [updateProductStatus, { isLoading: isUpdating }] =
//     useUpdateProductStatusMutation();

//   const filterOptions = ["All", "approved", "pending", "rejected"];

//   const {
//     data: productsResponse,
//     isLoading,
//     isError,
//   } = useGetAllProductsByAdminQuery({
//     page,
//     limit: 10,
//     // You can later add: search, status: filter !== "All" ? filter : undefined
//   });

//   const products = productsResponse?.data || [];
//   const pagination = productsResponse?.pagination;

//   const totalPages = pagination?.totalPage || 1;
//   const currentPage = pagination?.page || page;
//   const hasPrev = currentPage > 1;
//   const hasNext = currentPage < totalPages;

//   const transformedProducts: Product[] = products.map((p) => ({
//     id: p.id,
//     itemName: p.name,
//     type: p.type,
//     storeName: p.store.name,
//     email: "",
//     price: p.price,
//     finalPrice: p.finalPrice,
//     stockQuantity: p.stockQuantity,
//     ownerName: p.store.name,
//     submissionDate: new Date(p.createdAt).toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//     }),
//     status: p.status as Status,
//     selected: false,
//   }));

//   // Client-side filtering (search + status)
//   const filteredData = transformedProducts
//     .filter((item) => (filter === "All" ? true : item.status === filter))
//     .filter((item) => {
//       if (!search) return true;
//       const query = search.toLowerCase();
//       return (
//         item.itemName.toLowerCase().includes(query) ||
//         item.storeName.toLowerCase().includes(query) ||
//         item.type.toLowerCase().includes(query)
//       );
//     });

//     const {data} = useGetConsultationsQuery()

//     console.log("object",data);
//   const handleStatusChange = async (productId: string, newStatus: Status) => {
//     try {
//       await updateProductStatus({ id: productId, status: newStatus }).unwrap();
//       // toast.success(`Product ${newStatus}`);  ← add toast library if you want
//     } catch (err: any) {
//       console.error("Status update failed:", err);
//       alert("Failed to update status: " + (err?.data?.message || "Unknown error"));
//     }
//   };

//   const goToPage = (newPage: number) => {
//     if (newPage >= 1 && newPage <= totalPages) {
//       setPage(newPage);
//     }
//   };

//   if (isLoading || isUpdating) return <PageLoader />;
//   if (isError) {
//     return (
//       <div className="text-center text-red-600 py-10">
//         Failed to load products. Please try again later.
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 sm:p-6 max-w-7xl mx-auto min-h-[calc(100vh-150px)] rounded-2xl">
//       {/* Header + filters + search – same as before */}
//       <div className="flex justify-between items-start mb-6">
//         <div>
//           <h1 className="text-4xl font-bold text-red-800">Consultation Management get all but there is no update api</h1>
//           <p className="text-gray-500 text-sm">
//             Approve, reject, or review submitted products from sellers.
//           </p>
//         </div>

//         <div className="flex items-center gap-2">
//           {/* Filter button + dropdown – unchanged */}
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
//                         setPage(1);
//                       }}
//                       className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
//                     >
//                       {status.charAt(0).toUpperCase() + status.slice(1)}
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {/* Type switcher – unchanged */}
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

//       {/* Search input */}
//       <div className="mb-6">
//         <input
//           type="text"
//           placeholder="Search by name, store, or type..."
//           value={search}
//           onChange={(e) => {
//             setSearch(e.target.value);
//             setPage(1);
//           }}
//           className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//       </div>

//       <div className="bg-white rounded-lg overflow-x-auto overflow-y-hidden shadow-sm ">
//         <table className="w-full  min-w-[1000px]">
//           <thead className="bg-gray-50 border-b">
//             <tr>
//               <th className="px-4 py-3 text-xs font-medium text-gray-700">No.</th>
//               <th className="px-4 py-3 text-xs font-medium text-gray-700">Product Name</th>
//               <th className="px-4 py-3 text-xs font-medium text-gray-700">Type</th>
//               <th className="px-4 py-3 text-xs font-medium text-gray-700">Price</th>
//               <th className="px-4 py-3 text-xs font-medium text-gray-700">Store</th>
//               <th className="px-4 py-3 text-xs font-medium text-gray-700">Stock</th>
//               <th className="px-4 py-3 text-xs font-medium text-gray-700">Date</th>
//               <th className="px-4 py-3 text-xs font-medium text-gray-700">Status</th>
//               <th className="px-4 py-3 text-xs font-medium text-gray-700">Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {filteredData.length === 0 ? (
//               <tr>
//                 <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
//                   No products found.
//                 </td>
//               </tr>
//             ) : (
//               filteredData.map((item, i) => (
//                 <tr key={item.id} className="border-t hover:bg-gray-50">
//                   <td className="px-4 py-3 text-sm">{(page - 1) * 10 + i + 1}</td>
//                   <td className="px-4 py-3 text-sm font-medium">{item.itemName}</td>
//                   <td className="px-4 py-3 text-sm">{item.type}</td>
//                   <td className="px-4 py-3 text-sm">
//                     ${item.finalPrice?.toFixed(2) || item.price.toFixed(2)}
//                   </td>
//                   <td className="px-4 py-3 text-sm">{item.storeName}</td>
//                   <td className="px-4 py-3 text-sm">{item.stockQuantity}</td>
//                   <td className="px-4 py-3 text-sm">{item.submissionDate}</td>
//                   <td className="px-4 py-3">
//                     <span
//                       className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusColors[item.status]}`}
//                     >
//                       {item.status}
//                     </span>
//                   </td>
//                   <td className="px-4 py-3 flex items-center gap-3">
//                     <button
//                       onClick={() =>
//                         router.push(
//                           `/admin-dashboard/store-content/item-management/${item.id}`
//                         )
//                       }
//                       className="text-blue-600 hover:text-blue-800"
//                       title="View details"
//                     >
//                       <Eye size={18} />
//                     </button>

//                     <div className="relative group">
//                       <button className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-100">
//                         <BsThreeDots size={20} />
//                       </button>

//                       <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-200 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-20">
//                         <div className="py-1 text-sm">
//                           {item.status !== "approved" && (
//                             <button
//                               onClick={() => handleStatusChange(item.id, "approved")}
//                               className="w-full text-left px-4 py-2 text-green-700 hover:bg-green-50"
//                             >
//                               Approve
//                             </button>
//                           )}
//                           {item.status !== "pending" && (
//                             <button
//                               onClick={() => handleStatusChange(item.id, "pending")}
//                               className="w-full text-left px-4 py-2 text-yellow-700 hover:bg-yellow-50"
//                             >
//                               Set Pending
//                             </button>
//                           )}
//                           {item.status !== "rejected" && (
//                             <button
//                               onClick={() => handleStatusChange(item.id, "rejected")}
//                               className="w-full text-left px-4 py-2 text-red-700 hover:bg-red-50"
//                             >
//                               Reject
//                             </button>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>

//       </div>
//         {/* ── Pagination Controls ──────────────────────────────── */}
//         {totalPages > 1 && (
//           <div className="flex items-center justify-end gap-2 px-6 py-4 border-t">
//             <button
//               onClick={() => goToPage(currentPage - 1)}
//               disabled={!hasPrev}
//               className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//             >
//               <ChevronLeft size={16} />

//             </button>

//             <div className="text-sm text-gray-600">
//               Page {currentPage} of {totalPages}
//             </div>

//             <button
//               onClick={() => goToPage(currentPage + 1)}
//               disabled={!hasNext}
//               className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//             >

//               <ChevronRight size={16} />
//             </button>
//           </div>
//         )}
//     </div>
//   );
// }

"use client";
import PageLoader from "@/app/loading";
import { useGetConsultationsByAdminQuery } from "@/redux/features/mainScreen/consultationsApi";
import { useUpdateConsultaionStatusMutation } from "@/redux/features/store-content/storeContentApi";

import { Eye, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { toast } from "sonner";

/* ================= TYPES ================= */

type ConsultationStatus = "approved" | "rejected" | "pending";

interface Consultation {
  id: string;
  name: string;
  price: number;
  duration: string;
  location: string;
  type: string;
  currentStatus: ConsultationStatus;
  createdAt: string;
  store?: { name: string };
  specialists?: Array<{ firstName: string; lastName: string }>;
}

/* ================= HELPERS ================= */

const statusColors: Record<string, string> = {
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  pending: "bg-yellow-100 text-yellow-700",
};

/* ================= COMPONENT ================= */

export default function ConsultationManagement() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ConsultationStatus | "All">("All");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [typeFilter, setTypeFilter] = useState("Consultation");

  // dropdown position state
  const [menuPos, setMenuPos] = useState<{
    top: number;
    left: number;
    consultationId: string;
  } | null>(null);

  // ── Pagination states ────────────────────────────────
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError } = useGetConsultationsByAdminQuery({
    page,
    limit,
  });
  //@ts-ignore

  const consultations: Consultation[] = data?.data || [];
  //@ts-ignore
  const total = data?.meta?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const [updateProductStatus, { isLoading: isUpdating }] =
    useUpdateConsultaionStatusMutation();

  const filteredConsultations = consultations.filter((consultation) => {
    const matchesStatus =
      filter === "All" || consultation.currentStatus === filter;
    if (!matchesStatus) return false;

    if (!search) return true;
    const q = search.toLowerCase();

    return (
      consultation.name?.toLowerCase().includes(q) ||
      consultation.store?.name?.toLowerCase().includes(q) ||
      consultation.location?.toLowerCase().includes(q) ||
      consultation.currentStatus?.toLowerCase().includes(q)
    );
  });

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

  const openMenu = (
    e: React.MouseEvent<HTMLButtonElement>,
    consultationId: string,
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();

    setMenuPos({
      top: rect.bottom + 6,
      left: rect.right - 160,
      consultationId,
    });
  };

  const getAvailableActions = (currentStatus?: ConsultationStatus) => {
    const actions: Array<{
      label: string;
      status: ConsultationStatus;
      color: string;
    }> = [];

    if (currentStatus !== "approved") {
      actions.push({
        label: "Approve",
        status: "approved",
        color: "text-green-700 hover:bg-green-50",
      });
    }

    if (currentStatus !== "rejected") {
      actions.push({
        label: "Reject",
        status: "rejected",
        color: "text-red-700 hover:bg-red-50",
      });
    }

    return actions;
  };

  const handleStatusChange = async (
    consultationId: string,
    newStatus: ConsultationStatus,
  ) => {
    try {
      //@ts-ignore
      await updateProductStatus({
        id: consultationId,
        status: newStatus as "approved" | "rejected",
      }).unwrap();
      setMenuPos(null);
      toast.success(`Consultation ${newStatus}`);
    } catch (err: any) {
      console.error("Status update failed:", err);
      toast.error(
        "Failed to update status: " + (err?.data?.message || "Unknown error"),
      );
    }
  };

  const currentConsultation = menuPos
    ? consultations.find((c) => c.id === menuPos.consultationId)
    : null;

  const availableActions = currentConsultation
    ? getAvailableActions(currentConsultation.currentStatus)
    : [];

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  if (isLoading) return <PageLoader />;

  if (isError) {
    return (
      <div className="text-center text-red-600 py-10">
        Failed to load consultations.
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Consultation Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Review and manage consultations from stores.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg text-sm"
            >
              <Filter size={16} />
              {filter === "All" ? "All Status" : filter}
            </button>

            {showFilterMenu && (
              <ul className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg z-20">
                {["All", "approved", "rejected", "pending"].map((opt) => (
                  <li key={opt}>
                    <button
                      onClick={() => {
                        setFilter(opt as any);
                        setShowFilterMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                    >
                      {opt}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Type switcher */}
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

      {/* ================= SEARCH ================= */}
      <div className="mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by consultation name, store, location..."
          className="w-full px-4 py-2 border rounded-lg text-sm"
        />
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs">No.</th>
              <th className="px-4 py-3 text-left text-xs">Consultation Name</th>
              <th className="px-4 py-3 text-left text-xs">Price</th>
              <th className="px-4 py-3 text-left text-xs">Duration</th>
              <th className="px-4 py-3 text-left text-xs">Location</th>
              <th className="px-4 py-3 text-left text-xs">Store</th>
              <th className="px-4 py-3 text-left text-xs">Created</th>
              <th className="px-4 py-3 text-left text-xs">Status</th>
              <th className="px-4 py-3 text-left text-xs">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredConsultations.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-12 text-center text-gray-500"
                >
                  No consultations found.
                </td>
              </tr>
            ) : (
              filteredConsultations.map((consultation, i) => (
                <tr key={consultation.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">
                    {(page - 1) * limit + i + 1}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">
                    {consultation.name}
                  </td>
                  <td className="px-4 py-3 text-sm">€ {consultation.price}</td>
                  <td className="px-4 py-3 text-sm">{consultation.duration}</td>
                  <td className="px-4 py-3 text-sm">{consultation.location}</td>
                  <td className="px-4 py-3 text-sm">
                    {consultation.store?.name || "—"}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {new Date(consultation.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        statusColors[consultation.currentStatus || ""] ||
                        "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {consultation.currentStatus}
                    </span>
                  </td>

                  <td className="px-4 py-3 flex items-center gap-3">
                    <button
                      onClick={() =>
                        router.push(
                          `/admin-dashboard/store-content/consultation/${consultation.id}`,
                        )
                      }
                      className="text-blue-600 hover:text-blue-800"
                      title="View details"
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      onClick={(e) => openMenu(e, consultation.id)}
                      className="p-1 rounded hover:bg-gray-100"
                      disabled={isUpdating}
                    >
                      <BsThreeDots size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
            className="flex items-center gap-1 px-4 py-2 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages}
            className="flex items-center gap-1 px-4 py-2 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* ================= DROPDOWN ================= */}
      {menuPos && (
        <div
          className="fixed inset-0 z-[9999]"
          onClick={() => setMenuPos(null)}
        >
          <div
            className="absolute w-40 bg-white border rounded-lg shadow-lg"
            style={{ top: menuPos.top, left: menuPos.left }}
            onClick={(e) => e.stopPropagation()}
          >
            {availableActions.map((action) => (
              <button
                key={action.status}
                onClick={() =>
                  handleStatusChange(
                    menuPos.consultationId,
                    action.status as ConsultationStatus,
                  )
                }
                className={`w-full px-4 py-2 text-left ${action.color} disabled:opacity-50 disabled:cursor-not-allowed`}
                disabled={isUpdating}
              >
                {isUpdating ? "Updating..." : action.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
