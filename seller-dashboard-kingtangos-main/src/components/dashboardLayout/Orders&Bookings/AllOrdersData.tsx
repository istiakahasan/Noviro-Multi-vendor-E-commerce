"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Loader2 } from "lucide-react";
import Image from "next/image";
import { CustomPagination } from "@/components/shared/CustomPagination";
import { useGetAllDashboardOverviewQuery, useUpdateOrderStatusMutation } from "@/redux/api/dashboardOverviewApi/dashboardOverviewApi";

// Types based on your API response
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

interface Subscription {
  id: string;
  userId: string;
  planId: string;
  startDate: string;
  endDate: string | null;
  amount: number;
  paymentStatus: string;
  stripePaymentId: string;
  commissionAmount: string | null;
  commissionPaid: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ServiceBooking {
  id: string;
  serviceId: string;
  specialistId: string;
  userId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  status: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  stripePaymentId: string;
  commissionAmount: string | null;
  commissionPaid: boolean;
  createdAt: string;
  updatedAt: string;
}

// New Consultation Booking interface based on your data
interface ConsultationBooking {
  id: string;
  serviceId: string | null;
  consultationId: string;
  providerId: string;
  specialistId: string;
  userId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  status: string;
  meetingLink: string;
  notes: string;
  isProvidedByOwner: boolean;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  commissionAmount: string | null;
  commissionPaid: boolean;
  stripePaymentId: string;
  vendorAmount: string | null;
  createdAt: string;
  updatedAt: string;
}

// Combined type for all order types - updated to include consultation
type OrderType = 'product' | 'subscription' | 'service' | 'consultation';

interface CombinedOrder {
  id: string;
  type: OrderType;
  order?: Order;
  subscription?: Subscription;
  service?: ServiceBooking;
  consultation?: ConsultationBooking;
  amount: number;
  date: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  status: string;
  paymentStatus?: string;
}

export default function AllOrdersData() {
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

  // Combine all data into a single array with type identification
  const combinedOrders: CombinedOrder[] = [];

  // Add product orders
  dashboardData?.data?.product?.forEach((order: Order) => {
    combinedOrders.push({
      id: order.id,
      type: 'product',
      order,
      amount: order.totalAmount,
      date: order.createdAt,
      user: order.user,
      status: order.orderStatus,
      paymentStatus: order.paymentStatus,
    });
  });

  // Add subscriptions
  dashboardData?.data?.subscription?.forEach((subscription: Subscription) => {
    combinedOrders.push({
      id: subscription.id,
      type: 'subscription',
      subscription,
      amount: subscription.amount,
      date: subscription.createdAt,
      status: subscription.paymentStatus,
    });
  });

  // Add service bookings
  dashboardData?.data?.serviceBooking?.forEach((service: ServiceBooking) => {
    combinedOrders.push({
      id: service.id,
      type: 'service',
      service,
      amount: service.amount,
      date: service.createdAt,
      status: service.status,
      paymentStatus: service.paymentStatus,
    });
  });

  // Add consultation bookings
  dashboardData?.data?.consultationBooking?.forEach((consultation: ConsultationBooking) => {
    combinedOrders.push({
      id: consultation.id,
      type: 'consultation',
      consultation,
      amount: consultation.amount,
      date: consultation.createdAt,
      status: consultation.status,
      paymentStatus: consultation.paymentStatus,
    });
  });

  // Sort by date (newest first)
  combinedOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Paginate combined orders
  const totalItems = combinedOrders.length;
  const paginatedOrders = combinedOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  const getTypeColor = (type: OrderType): string => {
    switch (type) {
      case 'product':
        return "bg-blue-50 text-blue-600 border-blue-200";
      case 'subscription':
        return "bg-green-50 text-green-600 border-green-200";
      case 'service':
        return "bg-purple-50 text-purple-600 border-purple-200";
      case 'consultation':
        return "bg-orange-50 text-orange-600 border-orange-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const getTypeDisplayName = (type: OrderType): string => {
    switch (type) {
      case 'product':
        return "Product";
      case 'subscription':
        return "Subscription";
      case 'service':
        return "Service";
      case 'consultation':
        return "Consultation";
      default:
        return type;
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

  const getOrderDetails = (order: CombinedOrder) => {
    switch (order.type) {
      case 'product':
        return {
          name: order.order?.orderItems?.[0]?.product?.name || "Product Order",
          image: order.order?.orderItems?.[0]?.product?.images?.[0],
          customer: order.user 
            ? `${order.user.firstName} ${order.user.lastName}`
            : "Unknown Customer",
          email: order.user?.email,
        };
      case 'subscription':
        return {
          name: `Subscription Plan`,
          image: null,
          customer: `Subscription #${order.id.slice(0, 8).toUpperCase()}`,
          email: "",
        };
      case 'service':
        return {
          name: `Service Booking`,
          image: null,
          customer: `Booking #${order.id.slice(0, 8).toUpperCase()}`,
          email: "",
        };
      case 'consultation':
        return {
          name: `Consultation Booking`,
          image: null,
          customer: `Consultation #${order.id.slice(0, 8).toUpperCase()}`,
          email: "",
        };
      default:
        return {
          name: "Unknown",
          image: null,
          customer: "Unknown",
          email: "",
        };
    }
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

  const StatusDropdown = ({ orderId, currentStatus }: { orderId: string; currentStatus: string; type: OrderType }) => {
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
                disabled={localIsUpdating && status === currentStatus}
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
          <p className="text-red-600">Error loading orders history</p>
          <Button onClick={refetch} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen md:p-8">
      <div className="mx-auto container">
        {/* Header */}
        <div className="mb-6 flex items-center lg:justify-between justify-center flex-col gap-4 md:flex-row">
          <div>
            <h1 className="lg:text-2xl text-xl font-semibold text-gray-900">
              All Orders Data
            </h1>
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
                    Order Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Order Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Customer
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
                    Date
                  </th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Action
                  </th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {paginatedOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No orders found
                    </td>
                  </tr>
                ) : (
                  paginatedOrders.map((order, index: number) => {
                    const serialNumber = (currentPage - 1) * itemsPerPage + index + 1;
                    const details = getOrderDetails(order);
                    const orderStatus = order.status;
                    const paymentStatus = order.paymentStatus || order.status;

                    return (
                      <tr
                        key={`${order.type}-${order.id}`}
                        className="hover:bg-gray-50 transition-colors relative"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {serialNumber}
                        </td>

                        {/* Order Type */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex rounded-md px-3 py-1 text-xs font-medium border ${getTypeColor(order.type)}`}
                          >
                            {getTypeDisplayName(order.type)}
                          </span>
                        </td>

                        {/* Order Details */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {details.image && (
                              <div className="h-10 w-10 flex-shrink-0 relative rounded overflow-hidden">
                                <Image
                                  src={details.image}
                                  alt={details.name}
                                  fill
                                  className="object-cover"
                                  sizes="40px"
                                />
                              </div>
                            )}
                            <div>
                              <span className="text-sm font-medium text-gray-900">
                                {details.name}
                              </span>
                              <p className="text-xs text-gray-500">
                                ID: {order.id.slice(0, 8).toUpperCase()}...
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Customer */}
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {details.customer}
                            </p>
                            {details.email && (
                              <p className="text-xs text-gray-500">{details.email}</p>
                            )}
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          €{order.amount?.toFixed(2) || "0.00"}
                        </td>

                        {/* Order Status - With inline dropdown for product orders */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {order.type === 'product' ? (
                            <StatusDropdown 
                              orderId={order.id}
                              currentStatus={orderStatus}
                              type={order.type}
                            />
                          ) : (
                            <span
                              className={`inline-flex rounded-md px-3 py-1 text-xs font-medium border ${getStatusColor(orderStatus)}`}
                            >
                              {orderStatus}
                            </span>
                          )}
                        </td>

                        {/* Payment Status */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex rounded-md px-3 py-1 text-xs font-medium border ${getStatusColor(paymentStatus)}`}
                          >
                            {paymentStatus}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDateTime(order.date)}
                        </td>

                        {/* Action */}
                        {/* <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <Link
                              href={`/seller-dashboard/order-booking/view-order/${order.id}`}
                            >
                              <Button className="rounded p-1.5 text-white hover:bg-blue-50 bg-blue-600 hover:text-blue-600 border hover:border-blue-600 transition-colors">
                                <IoEye className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </td> */}
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