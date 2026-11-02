// "use client";
// import { Eye, Filter, Search } from "lucide-react";
// import React, { useState } from "react";
// import PayoutReviewModal from './PayoutReviewModal';
// import { useGetPayoutRequestsQuery } from "@/redux/features/withdrawalRequest/withdrawalApi";

// // Types
// type WithdrawStatus = "Approved" | "Pending" | "Rejected";

// interface WithdrawRequest {
//   id: string;
//   sellerName: string;
//   sellerEmail: string;
//   amount: number;
//   accountDetails: string;
//   requestedDate: string;
//   linkedOrders: string[];
//   status: WithdrawStatus;
// }

// const statusColors: Record<WithdrawStatus, string> = {
//   Approved: "bg-green-100 text-green-700",
//   Pending: "bg-yellow-100 text-yellow-700",
//   Rejected: "bg-red-100 text-red-700",
// };

// const filterOptions = ["All", "Approved", "Pending", "Rejected"];

// // Mock Data — Updated
// const mockWithdraws: WithdrawRequest[] = [
//   {
//     id: "WD001",
//     sellerName: "David Martinez",
//     sellerEmail: "david.m@example.com",
//     amount: 2800.0,
//     accountDetails: "Account: ****9012 (CitiBank)",
//     requestedDate: "November 24, 2025",
//     linkedOrders: ["ORD-2025-1238", "ORD-2025-1239"],
//     status: "Pending",
//   },
//   {
//     id: "WD002",
//     sellerName: "Sarah Smith",
//     sellerEmail: "sarah@store.com",
//     amount: 1890.5,
//     accountDetails: "PayPal: sarah@store.com",
//     requestedDate: "November 27, 2025",
//     linkedOrders: ["ORD-2025-1240", "ORD-2025-1241"],
//     status: "Rejected",
//   },
//   {
//     id: "WD003",
//     sellerName: "Mike Johnson",
//     sellerEmail: "mike@gadgetworld.com",
//     amount: 3200.0,
//     accountDetails: "Bank: ****5678 (Chase)",
//     requestedDate: "November 25, 2025",
//     linkedOrders: ["ORD-2025-1242"],
//     status: "Pending",
//   },
//   {
//     id: "WD004",
//     sellerName: "Emma Wilson",
//     sellerEmail: "emma@fashionhub.com",
//     amount: 950.0,
//     accountDetails: "PayPal: emma@fashionhub.com",
//     requestedDate: "November 20, 2025",
//     linkedOrders: [],
//     status: "Approved",
//   },
// ];

// const WithdrawHistoryTable: React.FC = () => {
//   const [search, setSearch] = useState("");
//   const [filter, setFilter] = useState("All");
//   const [showFilterMenu, setShowFilterMenu] = useState(false);
//   const [selectedRequest, setSelectedRequest] = useState<WithdrawRequest | null>(null);

//   const {data,isLoading,isError}= useGetPayoutRequestsQuery();
//   console.log(data);


//   // Filtering Logic
//   const filteredData = mockWithdraws
//     .filter((item) => {
//       const matchesSearch =
//         item.sellerName.toLowerCase().includes(search.toLowerCase()) ||
//         item.id.toLowerCase().includes(search.toLowerCase()) ||
//         item.accountDetails.toLowerCase().includes(search.toLowerCase());

//       const matchesFilter = filter === "All" || item.status === filter;

//       return matchesSearch && matchesFilter;
//     })
//     .sort((a, b) => new Date(b.requestedDate).getTime() - new Date(a.requestedDate).getTime());

//   return (
//     <>
//       <div className="container mx-auto">

//         {/* Header */}
//         <div className="mb-6">
//           <h1 className="text-2xl font-bold text-gray-800">Payout Requests</h1>
//           <p className="text-gray-500 text-sm">
//             Review and approve or decline withdrawal requests
//           </p>
//         </div>

//         {/* Search + Filter */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//           <div className="w-full sm:w-96">
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search by seller, request ID, or account..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//               />
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//             </div>
//           </div>

//           {/* Filter Dropdown */}
//           <div className="relative">
//             <button
//               onClick={() => setShowFilterMenu(!showFilterMenu)}
//               className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm shadow-sm hover:bg-gray-50 transition"
//             >
//               <Filter size={16} />
//               {filter}
//             </button>

//             {showFilterMenu && (
//               <ul className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
//                 {filterOptions.map((option) => (
//                   <li key={option}>
//                     <button
//                       onClick={() => {
//                         setFilter(option);
//                         setShowFilterMenu(false);
//                       }}
//                       className="w-full text-left px-4 py-2.5 hover:bg-gray-100 text-sm transition"
//                     >
//                       {option}
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </div>

//         {/* Table */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse min-w-[900px]">
//               <thead className="bg-gray-50 border-b border-gray-200">
//                 <tr>
//                   <th className="px-6 py-4 text-xs font-medium text-gray-600 uppercase tracking-wider">Request ID</th>
//                   <th className="px-6 py-4 text-xs font-medium text-gray-600 uppercase tracking-wider">Seller</th>
//                   <th className="px-6 py-4 text-xs font-medium text-gray-600 uppercase tracking-wider">Amount</th>
//                   <th className="px-6 py-4 text-xs font-medium text-gray-600 uppercase tracking-wider">Account</th>
//                   <th className="px-6 py-4 text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
//                   <th className="px-6 py-4 text-xs font-medium text-gray-600 uppercase tracking-wider">Date</th>
//                   <th className="px-6 py-4 text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-gray-200">
//                 {filteredData.length === 0 ? (
//                   <tr>
//                     <td colSpan={7} className="px-6 py-16 text-center text-gray-500">
//                       No withdrawal requests found.
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredData.map((req) => (
//                     <tr key={req.id} className="hover:bg-gray-50 transition">
//                       <td className="px-6 py-4 text-sm font-medium text-gray-900">{req.id}</td>
//                       <td className="px-6 py-4 text-sm text-gray-700 font-medium">{req.sellerName}</td>
//                       <td className="px-6 py-4 text-sm font-bold text-gray-900">${req.amount.toLocaleString()}</td>
//                       <td className="px-6 py-4 text-sm text-gray-600">{req.accountDetails}</td>

//                       <td className="px-6 py-4">
//                         <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${statusColors[req.status]}`}>
//                           {req.status}
//                         </span>
//                       </td>

//                       <td className="px-6 py-4 text-sm text-gray-600">{req.requestedDate}</td>

//                       <td className="px-6 py-4 text-center">
//                         <button
//                           onClick={() => setSelectedRequest(req)}
//                           className="inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-blue-50 transition text-gray-600 hover:text-blue-600"
//                         >
//                           <Eye size={18} />
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* Modal */}
//       {selectedRequest && (
//         <PayoutReviewModal
//           request={selectedRequest}
//           isOpen={true}
//           onClose={() => setSelectedRequest(null)}
//           onApprove={() => {
//             alert(`Approved payout request: ${selectedRequest.id}`);
//             setSelectedRequest(null);
//           }}
//           onDecline={(reason) => {
//             alert(`Declined ${selectedRequest.id}\nReason: ${reason}`);
//             setSelectedRequest(null);
//           }}
//         />
//       )}
//     </>
//   );
// };

// export default WithdrawHistoryTable;

//? without details modal 
// "use client";
// import { Eye, Filter, Search } from "lucide-react";
// import React, { useState } from "react";
// import PayoutReviewModal from "./PayoutReviewModal";
// import { useGetPayoutRequestsQuery } from "@/redux/features/withdrawalRequest/withdrawalApi";

// // Types
// interface PayoutRequest {
//   id: string;
//   amount: number;
//   accountName: string;
//   accountNumber: string;
//   bankName: string;
//   status: "PENDING" | "APPROVED" | "REJECTED" | "PROCESSING" | "COMPLETED" | "FAILED";
//   createdAt: string;
// }

// interface Meta {
//   totalPage: number;
//   currentPage: number;
//   total: number;
// }

// interface PayoutResponse {
//   data: PayoutRequest[];
//   meta: Meta;
// }

// // Map backend statuses to UI styles
// const statusColors: Record<string, string> = {
//   PENDING: "bg-yellow-100 text-yellow-700",
//   APPROVED: "bg-green-100 text-green-700",
//   REJECTED: "bg-red-100 text-red-700",
//   PROCESSING: "bg-blue-100 text-blue-700",
//   COMPLETED: "bg-emerald-100 text-emerald-700",
//   FAILED: "bg-gray-200 text-gray-700",
// };

// const filterOptions = ["All", "PENDING", "APPROVED", "REJECTED", "PROCESSING", "COMPLETED", "FAILED"] as const;

// // Skeleton Loader Component
// const TableSkeleton: React.FC = () => (
//   <>
//     {[...Array(5)].map((_, i) => (
//       <tr key={i} className="animate-pulse">
//         <td className="px-6 py-4">
//           <div className="h-4 bg-gray-200 rounded w-24"></div>
//         </td>
//         <td className="px-6 py-4">
//           <div className="h-4 bg-gray-200 rounded w-20"></div>
//         </td>
//         <td className="px-6 py-4">
//           <div className="h-4 bg-gray-200 rounded w-40"></div>
//         </td>
//         <td className="px-6 py-4">
//           <div className="h-6 bg-gray-200 rounded-full w-24"></div>
//         </td>
//         <td className="px-6 py-4">
//           <div className="h-4 bg-gray-200 rounded w-24"></div>
//         </td>
//         <td className="px-6 py-4 text-center">
//           <div className="inline-block h-9 w-9 bg-gray-200 rounded-full"></div>
//         </td>
//       </tr>
//     ))}
//   </>
// );

// const WithdrawHistoryTable: React.FC = () => {
//   const [page, setPage] = useState<number>(1);
//   const limit = 10;

//   const [search, setSearch] = useState<string>("");
//   const [filter, setFilter] = useState<string>("All");
//   const [showFilterMenu, setShowFilterMenu] = useState<boolean>(false);
//   const [selectedRequest, setSelectedRequest] = useState<PayoutRequest | null>(null);

//   const { data, isLoading, isError } = useGetPayoutRequestsQuery({
//     page,
//     limit,
//   }) as { data: PayoutResponse | undefined; isLoading: boolean; isError: boolean };

//   const payoutRequests = data?.data || [];
//   const meta = data?.meta;

//   // Search + Filter (client-side only)
//   const filteredData = payoutRequests.filter((item: PayoutRequest) => {
//     const matchesSearch =
//       item.id.toLowerCase().includes(search.toLowerCase()) ||
//       item.accountName?.toLowerCase().includes(search.toLowerCase()) ||
//       item.accountNumber?.toLowerCase().includes(search.toLowerCase());

//     const matchesFilter = filter === "All" || item.status === filter.toUpperCase();

//     return matchesSearch && matchesFilter;
//   });

//   const handleApprove = () => {
//     if (selectedRequest) {
//       alert(`Approved payout request: ${selectedRequest.id}`);
//       setSelectedRequest(null);
//     }
//   };

//   const handleDecline = (reason: string) => {
//     if (selectedRequest) {
//       alert(`Declined ${selectedRequest.id}\nReason: ${reason}`);
//       setSelectedRequest(null);
//     }
//   };

//   return (
//     <>
//       <div className="container mx-auto">
//         {/* Header */}
//         <div className="mb-6">
//           <h1 className="text-2xl font-bold text-gray-800">Payout Requests</h1>
//           <p className="text-gray-500 text-sm">
//             Review and approve or decline withdrawal requests
//           </p>
//         </div>

//         {/* Search + Filter */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//           <div className="w-full sm:w-96">
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search by seller, request ID, or account..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//               />
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//             </div>
//           </div>

//           {/* Filter Dropdown */}
//           <div className="relative">
//             <button
//               onClick={() => setShowFilterMenu(!showFilterMenu)}
//               className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm shadow-sm hover:bg-gray-50 transition"
//             >
//               <Filter size={16} />
//               {filter}
//             </button>

//             {showFilterMenu && (
//               <ul className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
//                 {filterOptions.map((option) => (
//                   <li key={option}>
//                     <button
//                       onClick={() => {
//                         setFilter(option);
//                         setShowFilterMenu(false);
//                       }}
//                       className="w-full text-left px-4 py-2.5 hover:bg-gray-100 text-sm transition"
//                     >
//                       {option}
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </div>

//         {/* Table */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse min-w-[900px]">
//               <thead className="bg-gray-50 border-b border-gray-200">
//                 <tr>
//                   <th className="px-6 py-4 text-xs font-medium text-gray-600 uppercase">Request ID</th>
//                   <th className="px-6 py-4 text-xs font-medium text-gray-600 uppercase">Amount</th>
//                   <th className="px-6 py-4 text-xs font-medium text-gray-600 uppercase">Account</th>
//                   <th className="px-6 py-4 text-xs font-medium text-gray-600 uppercase">Status</th>
//                   <th className="px-6 py-4 text-xs font-medium text-gray-600 uppercase">Date</th>
//                   <th className="px-6 py-4 text-xs font-medium text-gray-600 uppercase">Actions</th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-gray-200">
//                 {isLoading ? (
//                   <TableSkeleton />
//                 ) : filteredData.length === 0 ? (
//                   <tr>
//                     <td colSpan={6} className="px-6 py-16 text-center text-gray-500">
//                       {isError ? "Error loading requests" : "No withdrawal requests found."}
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredData.map((req: PayoutRequest) => (
//                     <tr key={req.id} className="hover:bg-gray-50 transition">
//                       <td className="px-6 py-4 text-sm font-medium text-gray-900">
//                         {req.id}
//                       </td>

//                       <td className="px-6 py-4 text-sm font-bold text-gray-900">
//                         ${Number(req.amount).toLocaleString()}
//                       </td>

//                       <td className="px-6 py-4 text-sm text-gray-600">
//                         {req.accountName} — {req.bankName}
//                       </td>

//                       <td className="px-6 py-4">
//                         <span
//                           className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
//                             statusColors[req.status] || "bg-gray-200 text-gray-700"
//                           }`}
//                         >
//                           {req.status}
//                         </span>
//                       </td>

//                       <td className="px-6 py-4 text-sm text-gray-600">
//                         {new Date(req.createdAt).toLocaleDateString()}
//                       </td>

//                       <td className="px-6 py-4 text-center">
//                         <button
//                           onClick={() => setSelectedRequest(req)}
//                           className="inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-blue-50 transition text-gray-600 hover:text-blue-600"
//                         >
//                           <Eye size={18} />
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Pagination */}
//         <div className="flex items-center justify-between mt-6">
//           <button
//             disabled={page === 1}
//             onClick={() => setPage(page - 1)}
//             className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition"
//           >
//             Previous
//           </button>

//           <p className="text-sm text-gray-600">
//             Page {page} of {meta?.totalPage || 1}
//           </p>

//           <button
//             disabled={page >= (meta?.totalPage || 1)}
//             onClick={() => setPage(page + 1)}
//             className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition"
//           >
//             Next
//           </button>
//         </div>
//       </div>

//       {/* Modal */}
//       {selectedRequest && (
//         <PayoutReviewModal
//           request={selectedRequest}
//           isOpen={true}
//           onClose={() => setSelectedRequest(null)}
//           onApprove={handleApprove}
//           onDecline={handleDecline}
//         />
//       )}
//     </>
//   );
// };

// export default WithdrawHistoryTable;


"use client";
import { Eye, Filter, Search } from "lucide-react";
import React, { useState } from "react";
import PayoutReviewModal from "./PayoutReviewModal";
import { useGetPayoutRequestsQuery, WithdrawRequest } from "@/redux/features/withdrawalRequest/withdrawalApi";

// Types
interface PayoutRequest {
  id: string;
  amount: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "PROCESSING" | "COMPLETED" | "FAILED";
  createdAt: string;
  branchName?: string | null;
  routingNumber?: string | null;
}

interface Meta {
  totalPage: number;
  currentPage?: number;
  total: number;
}

interface PayoutResponse {
  data: PayoutRequest[];
  meta: Meta;
}

// Status Colors
const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
  FAILED: "bg-gray-200 text-gray-700",
};

const filterOptions = ["All", "PENDING", "APPROVED", "REJECTED", "PROCESSING", "COMPLETED", "FAILED"] as const;

// Skeleton Loader
const TableSkeleton: React.FC = () => (
  <>
    {[...Array(5)].map((_, i) => (
      <tr key={i} className="animate-pulse">
        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-40"></div></td>
        <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded-full w-24"></div></td>
        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
        <td className="px-6 py-4 text-center"><div className="inline-block h-9 w-9 bg-gray-200 rounded-full"></div></td>
      </tr>
    ))}
  </>
);

const WithdrawHistoryTable: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const limit = 10;

  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<string>("All");
  const [showFilterMenu, setShowFilterMenu] = useState<boolean>(false);
  const [selectedRequest, setSelectedRequest] = useState<PayoutRequest | null>(null);

  const { data, isLoading, isError } = useGetPayoutRequestsQuery({ page, limit }) as { data: PayoutResponse | undefined; isLoading: boolean; isError: boolean };

  const payoutRequests = data?.data || [];
  const meta = data?.meta;

  // Search + Filter (client-side)
  const filteredData = payoutRequests.filter((item: PayoutRequest) => {
    const matchesSearch =
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.accountName?.toLowerCase().includes(search.toLowerCase()) ||
      item.accountNumber?.toLowerCase().includes(search.toLowerCase());

    const matchesFilter = filter === "All" || item.status === filter.toUpperCase();

    return matchesSearch && matchesFilter;
  });

  const handleApprove = () => {
    if (selectedRequest) {
      alert(`Approved payout request: ${selectedRequest.id}`);
      setSelectedRequest(null);
    }
  };

  const handleDecline = (reason: string) => {
    if (selectedRequest) {
      alert(`Declined ${selectedRequest.id}\nReason: ${reason}`);
      setSelectedRequest(null);
    }
  };

  return (
    <>
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Payout Requests</h1>
          <p className="text-gray-500 text-sm">Review and approve or decline withdrawal requests</p>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="w-full sm:w-96 relative">
            <input
              type="text"
              placeholder="Search by request ID, account name or number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>

          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm shadow-sm hover:bg-gray-50 transition"
            >
              <Filter size={16} />
              {filter}
            </button>

            {showFilterMenu && (
              <ul className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                {filterOptions.map((option) => (
                  <li key={option}>
                    <button
                      onClick={() => {
                        setFilter(option);
                        setShowFilterMenu(false);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-gray-100 text-sm transition"
                    >
                      {option}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-medium text-gray-600 uppercase">Request ID</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-600 uppercase">Amount</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-600 uppercase">Account</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-600 uppercase">Status</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-600 uppercase">Date</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  <TableSkeleton />
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-gray-500">
                      {isError ? "Error loading requests" : "No withdrawal requests found."}
                    </td>
                  </tr>
                ) : (
                  filteredData.map((req: PayoutRequest) => (
                    <tr key={req.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{req.id}</td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">€{Number(req.amount).toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{req.accountName} — {req.bankName}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${statusColors[req.status] || "bg-gray-200 text-gray-700"}`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{new Date(req.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => setSelectedRequest(req)}
                          className="inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-blue-50 transition text-gray-600 hover:text-blue-600"
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

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition"
          >
            Previous
          </button>

          <p className="text-sm text-gray-600">Page {page} of {meta?.totalPage || 1}</p>

          <button
            disabled={page >= (meta?.totalPage || 1)}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal */}
      {selectedRequest && (
        <PayoutReviewModal
          request={selectedRequest}
          isOpen={true}
          onClose={() => setSelectedRequest(null)}
          onApprove={handleApprove}
          onDecline={handleDecline}
        />
      )}
    </>
  );
};

export default WithdrawHistoryTable;
