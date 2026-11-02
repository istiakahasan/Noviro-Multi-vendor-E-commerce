





'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Check, X } from 'lucide-react';
import Link from 'next/link';
import { useGetAllOrdersQuery } from '@/redux/features/order-bookings/orderBookingsApi';
import PageLoader from '@/app/loading';

const ProductsPage = () => {
  const router = useRouter();
  const [typeFilter, setTypeFilter] = useState('Products');
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const typeOptions = ["Bookings", "Products","Custom Orders"];
  // const typeOptions = ["All", "Bookings", "Products"];
  const statusOptions = ['All', 'PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  // Fetch orders with pagination and filters
  type OrderStatusType = 'PENDING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  const { data: ordersData, isLoading, isError } = useGetAllOrdersQuery({
    page: currentPage,
    limit: pageSize,
    orderStatus: statusFilter !== 'All' ? (statusFilter as OrderStatusType) : undefined,
  });

  const handleTypeChange = (option: string) => {
    setTypeFilter(option);
    if (option === 'Products') {
      router.push(`/admin-dashboard/orders-bookings`);
    } else {
      router.push(`/admin-dashboard/orders-bookings/${option.toLowerCase()}`);
    }
    setShowTypeMenu(false);
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    setShowStatusMenu(false);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Transform orders data
  const transformedOrders = useMemo(() => {
    if (!ordersData?.data?.orders) return [];

    return ordersData.data.orders.map((order) => {
      const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      // Get first store from order items
      const firstStore = order.orderItems[0]?.product?.store?.name || 'N/A';
      
      // Get items summary
      const itemsCount = order.orderItems.length;
      const itemsSummary = itemsCount === 1 
        ? order.orderItems[0].product.name 
        : `${itemsCount} items`;

      // Map payment status colors
      const paymentColors = {
        PAID: 'text-green-600',
        PENDING: 'text-orange-600',
        FAILED: 'text-red-600',
        REFUNDED: 'text-blue-600',
      };

      // Map order status colors
      const statusColors = {
        PENDING: 'bg-orange-100 text-orange-800',
        SHIPPED: 'bg-blue-100 text-blue-800',
        DELIVERED: 'bg-green-100 text-green-800',
        CANCELLED: 'bg-red-100 text-red-800',
        Cancellable: 'bg-pink-100 text-pink-800',
      };

      return {
        id: order.id,
        orderId: `#${order.id}`,
        seller: firstStore,
        customer: `${order.user.firstName} ${order.user.lastName}`,
        items: itemsSummary,
        date: orderDate,
        amount: `$${order.totalAmount.toFixed(2)}`,
        status: order.orderStatus,
        statusColor: statusColors[order.orderStatus] || 'bg-gray-100 text-gray-800',
        payment: order.paymentStatus,
        paymentColor: paymentColors[order.paymentStatus] || 'text-gray-600',
      };
    });
  }, [ordersData]);

  // Apply search filter
  const filteredOrders = useMemo(() => {
    return transformedOrders.filter((order) => {
      const query = searchTerm.toLowerCase();
      return (
        order.customer.toLowerCase().includes(query) ||
        order.seller.toLowerCase().includes(query) ||
        order.orderId.toLowerCase().includes(query) ||
        order.items.toLowerCase().includes(query)
      );
    });
  }, [transformedOrders, searchTerm]);

  const handleApprove = (orderId: string) => {
    console.log("Approve order:", orderId);
    // Implement approve API call here
  };

  const handleReject = (orderId: string) => {
    console.log("Reject order:", orderId);
    // Implement reject API call here
  };
  if(isLoading){
    return (
      <PageLoader/>
    )
  }

  return (
    <div className="rounded-xl shadow-sm p-6 border border-gray-200 container mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Order & Booking Management</h2>
        <p className="text-gray-600">Monitor and manage all product orders, service bookings and subscription activities.</p>
      </div>

      <div className="flex items-center mb-6 gap-3 flex-wrap">
        <input
          type="text"
          placeholder="Search by customer, seller, order ID or items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-64"
        />
        
        {/* Status Filters Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 flex items-center gap-1 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statusFilter}
            <span className="text-xs">▼</span>
          </button>
          {showStatusMenu && (
            <ul className="absolute left-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
              {statusOptions.map((status) => (
                <li key={status}>
                  <button
                    onClick={() => handleStatusChange(status)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    {status}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Type Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowTypeMenu(!showTypeMenu)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 flex items-center gap-1 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {typeFilter}
            <span className="text-xs">▼</span>
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

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                  Loading orders...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-red-500">
                  Error loading orders. Please try again.
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.orderId}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{order.seller}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
                  <td className="px-4 py-4 text-sm text-gray-500 max-w-xs truncate">{order.items}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">€ {order.amount}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${order.statusColor}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-2">
                    <Link href={`/admin-dashboard/orders-bookings/${order.id}`}>
                      <Eye className="w-4 h-4 text-blue-500 cursor-pointer" />
                    </Link>
                    {/* <Check 
                      className="w-4 h-4 text-green-500 cursor-pointer" 
                      onClick={() => handleApprove(order.id)}
                    />
                    <X 
                      className="w-4 h-4 text-red-500 cursor-pointer" 
                      onClick={() => handleReject(order.id)}
                    /> */}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {ordersData?.data?.pagination && ordersData.data.pagination.pages > 1 && (
        <div className="mt-6 flex justify-center items-center space-x-1">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {Array.from({ length: ordersData.data.pagination.pages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                currentPage === page
                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(ordersData.data.pagination.pages, prev + 1))}
            disabled={currentPage === ordersData.data.pagination.pages}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;