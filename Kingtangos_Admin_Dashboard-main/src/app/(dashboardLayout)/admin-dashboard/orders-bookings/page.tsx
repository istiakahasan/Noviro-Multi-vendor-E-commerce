// "use client";

// import PageLoader from "@/app/loading";
// import {
//   Booking,
//   Order,
//   OrderItem,
//   useGetAllBookingsQuery,
//   useGetAllOrdersQuery,
// } from "@/redux/features/order-bookings/orderBookingsApi";
// import { Filter } from "lucide-react";
// import { useRouter, usePathname } from "next/navigation";
// import React, { useMemo, useState } from "react";

// type ItemType = "order" | "booking";

// interface CombinedItem {
//   id: string;
//   type: ItemType;
//   displayId: string;
//   seller: string;
//   customer: string;
//   items: string;
//   date: string;
//   amount: string;
//   status: string;
//   statusColor: string;
//   payment: string;
//   paymentColor: string;
//   link: string;
// }

// const OrderManagement = () => {
//   const router = useRouter();
//   const pathname = usePathname();

//   const [searchTerm, setSearchTerm] = useState("");
//   const [showTypeMenu, setShowTypeMenu] = useState(false);

//   // 🔵 NEW — PAGINATION STATES
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   const getCurrentFilter = (): "All" | "Products" | "Bookings" => {
//     if (pathname.includes("/products")) return "Products";
//     if (pathname.includes("/bookings")) return "Bookings";
//     return "All";
//   };

//   const typeFilter = getCurrentFilter();

//   const { data: ordersData, isLoading: ordersLoading } = useGetAllOrdersQuery(
//     {},
//   );
//   const { data: bookingsData, isLoading: bookingsLoading } =
//     useGetAllBookingsQuery({});
//   const isLoading = ordersLoading || bookingsLoading;

//   const handleTypeChange = (option: "All" | "Products" | "Bookings") => {
//     setShowTypeMenu(false);
//     setCurrentPage(1);

//     if (option === "All") router.push("/admin-dashboard/orders-bookings");
//     if (option === "Products")
//       router.push("/admin-dashboard/orders-bookings/products");
//     if (option === "Bookings")
//       router.push("/admin-dashboard/orders-bookings/bookings");
//   };

//   // =======================================
//   // 🔵 MERGE ORDERS + BOOKINGS
//   // =======================================
//   const combinedData = useMemo((): CombinedItem[] => {
//     const orders: CombinedItem[] = (ordersData?.data?.orders || []).map(
//       (order: Order) => {
//         const items =
//           order?.orderItems
//             ?.map((i: OrderItem) => i?.product?.name || "Unknown Product")
//             ?.join(", ") || "No items";

//         const customer =
//           `${order?.user?.firstName || ""} ${order?.user?.lastName || ""}`.trim() ||
//           "Unknown";

//         const statusMap: Record<string, { label: string; color: string }> = {
//           PENDING: { label: "Pending", color: "bg-orange-100 text-orange-800" },
//           SHIPPED: { label: "Processing", color: "bg-blue-100 text-blue-800" },
//           DELIVERED: {
//             label: "Complete",
//             color: "bg-green-100 text-green-800",
//           },
//           CANCELLED: { label: "Cancelled", color: "bg-pink-100 text-pink-800" },
//         };

//         const paymentMap: Record<string, { label: string; color: string }> = {
//           PENDING: { label: "Pending", color: "text-orange-600" },
//           PAID: { label: "Paid", color: "text-green-600" },
//           FAILED: { label: "Failed", color: "text-red-600" },
//           REFUNDED: { label: "Refunded", color: "text-cyan-800" },
//         };

//         return {
//           id: order?.id,
//           type: "order",
//           displayId: `#${order?.id?.slice(0, 8)?.toUpperCase()}`,
//           seller: order?.shippingAddress?.fullName || "N/A",
//           customer,
//           items,
//           date: order?.createdAt
//             ? new Date(order.createdAt).toLocaleDateString("en-US", {
//                 month: "short",
//                 day: "numeric",
//                 year: "numeric",
//               })
//             : "N/A",
//           amount: `$${order?.totalAmount?.toFixed(2) || "0.00"}`,
//           status:
//             statusMap[order?.orderStatus]?.label ||
//             order?.orderStatus ||
//             "Unknown",
//           statusColor:
//             statusMap[order?.orderStatus]?.color || "bg-gray-100 text-gray-800",
//           payment:
//             paymentMap[order?.paymentStatus]?.label ||
//             order?.paymentStatus ||
//             "Unknown",
//           paymentColor:
//             paymentMap[order?.paymentStatus]?.color || "text-gray-600",
//           link: `/admin-dashboard/orders-bookings/orders/${order?.id}`,
//         };
//       },
//     );

//     const bookings: CombinedItem[] = (bookingsData?.data || []).map(
//       (booking: Booking) => {
//         const customer =
//           `${booking?.user?.firstName || ""} ${booking?.user?.lastName || ""}`.trim() ||
//           "Unknown";
//         const specialist =
//           `${booking?.specialist?.firstName || ""} ${booking?.specialist?.lastName || ""}`.trim() ||
//           "Unknown";

//         const time = booking?.startTime
//           ? new Date(booking.startTime).toLocaleTimeString("en-US", {
//               hour: "numeric",
//               minute: "2-digit",
//             })
//           : "N/A";

//         const statusMap: Record<string, { label: string; color: string }> = {
//           PENDING: { label: "Pending", color: "bg-orange-100 text-orange-800" },
//           CONFIRMED: { label: "Confirmed", color: "bg-blue-100 text-blue-800" },
//           COMPLETED: {
//             label: "Complete",
//             color: "bg-green-100 text-green-800",
//           },
//           CANCELLED: { label: "Cancelled", color: "bg-pink-100 text-pink-800" },
//         };

//         return {
//           id: booking?.id,
//           type: "booking",
//           displayId: `#B${booking?.id?.slice(0, 6)?.toUpperCase()}`,
//           seller: specialist,
//           customer,
//           items: `${booking?.service?.name || "N/A"} (${time})`,
//           date: booking?.createdAt
//             ? new Date(booking.createdAt).toLocaleDateString("en-US", {
//                 month: "short",
//                 day: "numeric",
//                 year: "numeric",
//               })
//             : "N/A",
//           amount: `$${booking?.service?.price || 0}`,
//           status:
//             statusMap[booking?.status]?.label || booking?.status || "Unknown",
//           statusColor:
//             statusMap[booking?.status]?.color || "bg-gray-100 text-gray-800",
//           payment: "Paid",
//           paymentColor: "text-green-600",
//           link: `/admin-dashboard/orders-bookings/bookings/${booking?.id}`,
//         };
//       },
//     );

//     return [...orders, ...bookings].sort(
//       (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
//     );
//   }, [ordersData, bookingsData]);

//   // =======================================
//   // 🔵 SEARCH + TYPE FILTER
//   // =======================================
//   const filteredData = useMemo(() => {
//     setCurrentPage(1);
//     return combinedData.filter((item) => {
//       const matchesType =
//         typeFilter === "All" ||
//         (typeFilter === "Products" && item.type === "order") ||
//         (typeFilter === "Bookings" && item.type === "booking");

//       const matchesSearch =
//         searchTerm === "" ||
//         item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         item.seller.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         item.displayId.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         item.items.toLowerCase().includes(searchTerm.toLowerCase());

//       return matchesType && matchesSearch;
//     });
//   }, [combinedData, typeFilter, searchTerm]);

//   // =======================================
//   // 🔵 PAGINATION LOGIC
//   // =======================================
//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);

//   const paginatedData = filteredData.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage,
//   );

//   if (isLoading) return <PageLoader />;

//   return (
//     <div className="rounded-xl shadow-sm p-6 border container mx-auto border-gray-200">
//       {/* Header */}
//       <div className="mb-6">
//         <h2 className="text-2xl font-bold text-gray-900 mb-1">
//           Order & Booking Management
//         </h2>
//         <p className="text-gray-600">
//           Monitor and manage all product orders, service bookings and
//           subscription activities.
//         </p>
//       </div>

//       {/* Search + Filter */}
//       <div className="flex items-center mb-6 gap-3">
//         <input
//           type="text"
//           placeholder="Search by name or email..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
//         />

//         <div className="relative">
//           <button
//             onClick={() => setShowTypeMenu(!showTypeMenu)}
//             className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border rounded-lg"
//           >
//             <Filter size={16} />
//             {typeFilter}
//           </button>

//           {showTypeMenu && (
//             <ul className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
//               {(["All", "Products", "Bookings"] as const).map((option) => (
//                 <li key={option}>
//                   <button
//                     onClick={() => handleTypeChange(option)}
//                     className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
//                   >
//                     {option}
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="w-full border-collapse">
//           <thead>
//             <tr className="bg-gray-50">
//               <th className="px-4 py-3">Order ID</th>
//               <th className="px-4 py-3">Seller</th>
//               <th className="px-4 py-3">Customer</th>
//               <th className="px-4 py-3">Items</th>
//               <th className="px-4 py-3">Order Date</th>
//               <th className="px-4 py-3">Total Amount</th>
//               <th className="px-4 py-3">Status</th>
//               <th className="px-4 py-3">Payment</th>
//             </tr>
//           </thead>

//           <tbody className="bg-white divide-y">
//             {paginatedData.length === 0 ? (
//               <tr>
//                 <td
//                   colSpan={9}
//                   className="px-4 py-10 text-center text-gray-500"
//                 >
//                   No data found.
//                 </td>
//               </tr>
//             ) : (
//               paginatedData.map((item) => (
//                 <tr key={item.id} className="hover:bg-gray-50">
//                   <td className="px-4 py-4">{item.displayId}</td>
//                   <td className="px-4 py-4">{item.seller}</td>
//                   <td className="px-4 py-4">{item.customer}</td>
//                   <td className="px-4 py-4 max-w-xs truncate">{item.items}</td>
//                   <td className="px-4 py-4">{item.date}</td>
//                   <td className="px-4 py-4 font-medium">{item.amount}</td>
//                   <td className="px-4 py-4">
//                     <span
//                       className={`px-2 py-1 text-xs rounded-full ${item.statusColor}`}
//                     >
//                       {item.status}
//                     </span>
//                   </td>
//                   <td className="px-4 py-4">
//                     <span className={`font-medium ${item.paymentColor}`}>
//                       {item.payment}
//                     </span>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* ======================================= */}
//       {/* 🔵 PAGINATION BUTTONS */}
//       {/* ======================================= */}
//       {totalPages > 1 && (
//         <div className="flex justify-center mt-6 gap-2">
//           <button
//             disabled={currentPage === 1}
//             onClick={() => setCurrentPage((p) => p - 1)}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Prev
//           </button>

//           {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//             <button
//               key={page}
//               onClick={() => setCurrentPage(page)}
//               className={`px-3 py-1 border rounded ${
//                 currentPage === page ? "bg-blue-600 text-white" : ""
//               }`}
//             >
//               {page}
//             </button>
//           ))}

//           <button
//             disabled={currentPage === totalPages}
//             onClick={() => setCurrentPage((p) => p + 1)}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OrderManagement;


import React from 'react';
import ProductsPage from './products/page';

const page = () => {
  return (
    <>
     <ProductsPage/> 
    </>
  );
};

export default page;