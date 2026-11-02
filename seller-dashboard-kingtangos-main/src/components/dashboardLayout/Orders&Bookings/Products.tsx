"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Loader2 } from "lucide-react";
import Link from "next/link";
import { IoEye } from "react-icons/io5";
import Image from "next/image";
import { CustomPagination } from "@/components/shared/CustomPagination";
import { useGetAllDashboardOverviewQuery, useUpdateOrderStatusMutation } from "@/redux/api/dashboardOverviewApi/dashboardOverviewApi";

// Types for product orders
interface OrderItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    images: string[];
    store: {
      name: string;
      logo: string;
    };
  };
  quantity: number;
  price: number;
  totalPrice: number;
}

interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  shippingCost: number;
  paymentMethod: string;
  orderStatus: string;
  paymentStatus: string;
  commissionAmount: string | null;
  commissionPaid: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePic: string;
  };
  orderItems: OrderItem[];
}

interface ProductOrder extends Order {
  shippingAddress: {
    id: string;
    userId: string;
    fullName: string;
    country: string;
    phone: string;
    city: string;
    state: string;
    postalCode: string;
    address: string;
    createdAt: string;
    updatedAt: string;
  };
}

export default function Products() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Use RTK Query hooks
  const {
    data: dashboardData,
    isLoading,
    error,
    refetch,
  } = useGetAllDashboardOverviewQuery({
    page: currentPage,
    limit: itemsPerPage,
  });

  // Add the update order status mutation
  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setEditingOrderId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get only product orders from the API response
  const productOrders: ProductOrder[] = dashboardData?.data?.product || [];

  // Calculate pagination
  const totalItems = productOrders.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = productOrders.slice(startIndex, endIndex);

  const getStatusColor = (status: string): string => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes("pending")) {
      return "bg-yellow-50 text-yellow-600 border-yellow-200";
    } else if (lowerStatus.includes("completed") || lowerStatus.includes("approved") || lowerStatus.includes("delivered")) {
      return "bg-green-50 text-green-600 border-green-200";
    } else if (lowerStatus.includes("cancelled") || lowerStatus.includes("canceled") || lowerStatus.includes("refunded")) {
      return "bg-red-50 text-red-600 border-red-200";
    } else if (lowerStatus.includes("processing") || lowerStatus.includes("confirmed") || lowerStatus.includes("shipped")) {
      return "bg-blue-50 text-blue-600 border-blue-200";
    } else if (lowerStatus.includes("out_for_delivery")) {
      return "bg-purple-50 text-purple-600 border-purple-200";
    } else {
      return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus({
        id: orderId,
        data: { orderStatus: newStatus }
      }).unwrap();
      
      // Refetch the data to get updated status
      refetch();
      setEditingOrderId(null);
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const StatusDropdown = ({ orderId, currentStatus }: { orderId: string; currentStatus: string }) => {
    const [localIsUpdating, setLocalIsUpdating] = useState(false);
    
    const handleStatusSelect = async (status: string) => {
      if (status === currentStatus) {
        setEditingOrderId(null);
        return;
      }
      
      setLocalIsUpdating(true);
      await handleStatusUpdate(orderId, status);
      setLocalIsUpdating(false);
    };

    const statusOptions = [
      "PENDING",
      "CONFIRMED",
      "PROCESSING",
      "SHIPPED",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
      "CANCELLED",
      "REFUNDED"
    ];

    if (editingOrderId !== orderId) {
      return (
        <button
          onClick={() => setEditingOrderId(orderId)}
          className={`inline-flex items-center gap-1 rounded-md px-3 py-1 text-xs font-medium border ${getStatusColor(currentStatus)} hover:opacity-80 transition-opacity`}
        >
          {currentStatus}
          <ChevronDown className="h-3 w-3" />
        </button>
      );
    }

    return (
      <div ref={dropdownRef} className="relative">
        <div className="absolute left-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded-md shadow-lg min-w-[180px]">
          <div className="p-2 space-y-1">
            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={() => handleStatusSelect(status)}
                disabled={localIsUpdating}
                className={`w-full text-left px-3 py-2 text-xs rounded transition-all flex items-center justify-between ${
                  currentStatus === status 
                    ? 'bg-blue-50 text-blue-700 font-medium' 
                    : 'text-gray-700 hover:bg-gray-50'
                } ${localIsUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span>{status}</span>
                {localIsUpdating && currentStatus === status && (
                  <Loader2 className="h-3 w-3 animate-spin" />
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* Keep the button visible while dropdown is open */}
        <button
          onClick={() => setEditingOrderId(null)}
          className={`inline-flex items-center gap-1 rounded-md px-3 py-1 text-xs font-medium border ${getStatusColor(currentStatus)}`}
        >
          {currentStatus}
          <ChevronDown className="h-3 w-3" />
        </button>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-8">
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-8 h-8 rounded-full animate-pulse bg-primary dark:bg-primary"></div>
            <div className="w-8 h-8 rounded-full animate-pulse bg-primary dark:bg-primary"></div>
            <div className="w-8 h-8 rounded-full animate-pulse bg-primary dark:bg-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error loading product orders</p>
          <Button onClick={refetch} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen md:p-8 mt-12 md:mt-0">
      <div className="mx-auto container">
        {/* Header */}
        <div className="mb-6 flex items-center lg:justify-between justify-center flex-col gap-4 md:flex-row">
          <div>
            <h1 className="lg:text-2xl text-xl font-semibold text-gray-900">
              Product Orders
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              View and manage all product orders from your store
            </p>
          </div>
          <div className="text-sm text-gray-600">
            Total Orders: <span className="font-semibold">{totalItems}</span>
          </div>
        </div>

        {/* Table Container with Horizontal Scroll */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Product Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Store
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Order Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Payment Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Order Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {paginatedOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No product orders found
                    </td>
                  </tr>
                ) : (
                  paginatedOrders.map((order, index: number) => {
                    const serialNumber = startIndex + index + 1;
                    const firstItem = order.orderItems[0];
                    const product = firstItem?.product;
                    const store = product?.store;
                    const customerName = order.user 
                      ? `${order.user.firstName} ${order.user.lastName}`
                      : "Unknown Customer";

                    return (
                      <tr
                        key={order.id}
                        className="hover:bg-gray-50 transition-colors relative"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {serialNumber}
                        </td>

                        {/* Product Details */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {product?.images?.[0] && (
                              <div className="h-12 w-12 flex-shrink-0 relative rounded-md overflow-hidden border border-gray-200">
                                <Image
                                  src={product.images[0]}
                                  alt={product.name || "Product"}
                                  fill
                                  className="object-cover"
                                  sizes="48px"
                                />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {product?.name || "Product Order"}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-xs text-gray-500">
                                  Qty: {firstItem?.quantity || 1}
                                </p>
                                <span className="text-gray-300">•</span>
                                <p className="text-xs text-gray-500">
                                  Price: {formatCurrency(firstItem?.price || 0)}
                                </p>
                              </div>
                              <p className="text-xs text-gray-500 mt-1 truncate">
                                Order ID: {order.id.slice(0, 8).toUpperCase()}...
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Customer */}
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {customerName}
                            </p>
                            <p className="text-xs text-gray-500">{order.user?.email}</p>
                            {order.shippingAddress?.phone && (
                              <p className="text-xs text-gray-500 mt-1">
                                📞 {order.shippingAddress.phone}
                              </p>
                            )}
                          </div>
                        </td>

                        {/* Store */}
                        <td className="px-6 py-4">
                          {store ? (
                            <div className="flex items-center gap-2">
                              {store.logo && (
                                <div className="h-6 w-6 flex-shrink-0 relative rounded-full overflow-hidden">
                                  <Image
                                    src={store.logo}
                                    alt={store.name}
                                    fill
                                    className="object-cover"
                                    sizes="24px"
                                  />
                                </div>
                              )}
                              <span className="text-sm font-medium text-gray-900">
                                {store.name}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">No store info</span>
                          )}
                        </td>

                        {/* Amount */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {formatCurrency(order.totalAmount)}
                            </p>
                            {order.shippingCost > 0 && (
                              <p className="text-xs text-gray-500">
                                Shipping: {formatCurrency(order.shippingCost)}
                              </p>
                            )}
                          </div>
                        </td>

                        {/* Order Status */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusDropdown 
                            orderId={order.id}
                            currentStatus={order.orderStatus}
                          />
                        </td>

                        {/* Payment Status */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex rounded-md px-3 py-1 text-xs font-medium border ${getStatusColor(order.paymentStatus)}`}
                          >
                            {order.paymentStatus}
                          </span>
                        </td>

                        {/* Order Date */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm text-gray-900">
                              {formatDateTime(order.createdAt).split(",")[0]}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDateTime(order.createdAt).split(",")[1].trim()}
                            </p>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/seller-dashboard/order-booking/view-order/${order.id}`}
                              className="inline-flex items-center"
                            >
                              <Button className="rounded-md p-2 text-white hover:bg-blue-50 bg-blue-600 hover:text-blue-600 border hover:border-blue-600 transition-colors">
                                <IoEye className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {paginatedOrders.length > 0 && (
          <CustomPagination
            totalItems={totalItems}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        )}
      </div>
    </div>
  );
}