/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { IoArrowBack, IoReceipt, IoCart, IoPerson, IoLocation, IoCard } from "react-icons/io5";
import Link from "next/link";
import { useGetSingleOrderByIdQuery } from "@/redux/api/dashboardOverviewApi/dashboardOverviewApi";
import SendMessageButton from "../chat/SendMessageButton";

interface OrderViewDetailsProps {
  orderViewId: string | null;
}

export default function OrderViewDetails({ orderViewId }: OrderViewDetailsProps) {
  const router = useRouter();

  const { data: orderData, isLoading, error } = useGetSingleOrderByIdQuery(
    orderViewId!,
    {
      skip: !orderViewId,
    }
  );

  const order = orderData?.data;

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return { variant: "secondary" as const, text: "Pending", color: "bg-yellow-100 text-yellow-800" };
      case "PROCESSING":
        return { variant: "secondary" as const, text: "Processing", color: "bg-blue-100 text-blue-800" };
      case "SHIPPED":
        return { variant: "default" as const, text: "Shipped", color: "bg-purple-100 text-purple-800" };
      case "DELIVERED":
        return { variant: "default" as const, text: "Delivered", color: "bg-green-100 text-green-800" };
      case "CANCELLED":
        return { variant: "destructive" as const, text: "Cancelled", color: "bg-red-100 text-red-800" };
      default:
        return { variant: "outline" as const, text: status, color: "bg-gray-100 text-gray-800" };
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return { variant: "secondary" as const, text: "Pending", color: "bg-yellow-100 text-yellow-800" };
      case "PAID":
        return { variant: "default" as const, text: "Paid", color: "bg-green-100 text-green-800" };
      case "FAILED":
        return { variant: "destructive" as const, text: "Failed", color: "bg-red-100 text-red-800" };
      case "CANCELED":
        return { variant: "destructive" as const, text: "Canceled", color: "bg-red-100 text-red-800" };
      default:
        return { variant: "outline" as const, text: status, color: "bg-gray-100 text-gray-800" };
    }
  };

  const getPaymentMethodBadge = (method: string) => {
    switch (method?.toLowerCase()) {
      case "stripe":
        return { variant: "default" as const, text: "Stripe", color: "bg-blue-100 text-blue-800" };
      case "cash":
        return { variant: "secondary" as const, text: "Cash on Delivery", color: "bg-gray-100 text-gray-800" };
      case "paypal":
        return { variant: "default" as const, text: "PayPal", color: "bg-yellow-100 text-yellow-800" };
      default:
        return { variant: "outline" as const, text: method || "Unknown", color: "bg-gray-100 text-gray-800" };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (!orderViewId) {
    return (
      <div className="min-h-screen p-8">
        <div className="mx-auto container">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-red-600 text-lg mb-4">No order ID provided</p>
              <Button onClick={() => router.push('/seller-dashboard/orders')} className="mt-4">
                Back to Orders
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen p-8">
        <div className="mx-auto container">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading order details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen p-8">
        <div className="mx-auto container">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-red-600 text-lg mb-4">Error loading order details</p>
              <Button onClick={() => router.push('/seller-dashboard/order-booking/orders')} className="mt-4">
                Back to Orders
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const orderStatus = getOrderStatusBadge(order.orderStatus);
  const paymentStatus = getPaymentStatusBadge(order.paymentStatus);
  const paymentMethod = getPaymentMethodBadge(order.paymentMethod);

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="mx-auto container max-w-7xl">
        {/* Header with Breadcrumb */}
        <div className="mb-6 flex items-center justify-between flex-col lg:flex-row px-2">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push(`/seller-dashboard/order-booking`)}
              className="h-10 w-10"
            >
              <IoArrowBack className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="lg:text-3xl text-xl font-bold text-gray-900 mb-2">Order Details</h1>
              <nav className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                <Link href="/seller-dashboard" className="hover:text-gray-700">
                  Dashboard
                </Link>
                <span>/</span>
                <Link href="/seller-dashboard/orders" className="hover:text-gray-700">
                  Orders
                </Link>
                <span>/</span>
                <span className="text-gray-900">Details</span>
              </nav>
            </div>
          </div>
          
          <div className="flex items-center gap-3 mt-3">
            {/* <span className="text-sm text-gray-500">Order ID: {order.id}</span> */}
              <SendMessageButton
                receiverId={order.userId}
                userType="Client"
                nextUrl={`/seller-dashboard/order-booking`}
              />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Order Summary & Status */}
          <div className="xl:col-span-1 space-y-6">
            {/* Order Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <IoReceipt className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Order Status:</span>
                    <Badge variant={orderStatus.variant} className={orderStatus.color}>
                      {orderStatus.text}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Payment Status:</span>
                    <Badge variant={paymentStatus.variant} className={paymentStatus.color}>
                      {paymentStatus.text}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Payment Method:</span>
                    <Badge variant={paymentMethod.variant} className={paymentMethod.color}>
                      {paymentMethod.text}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-t pt-4">
                    <span className="text-gray-600 font-medium">Items:</span>
                    <span className="font-semibold">{order.orderItems.length}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Shipping Cost:</span>
                    <span className="font-semibold">{formatCurrency(order.shippingCost)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-t pt-4">
                    <span className="text-gray-600 font-medium text-lg">Total Amount:</span>
                    <span className="font-bold text-xl text-green-600">{formatCurrency(order.totalAmount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <IoPerson className="h-5 w-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500 block">Name</span>
                    <p className="font-medium">
                      {order.user?.firstName} {order.user?.lastName}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 block">Email</span>
                    <p className="font-medium break-all">{order.user?.email}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 block">Customer ID</span>
                    <p className="font-mono text-sm break-all">{order.userId}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            {order.shippingAddress && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <IoLocation className="h-5 w-5" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium">{order.shippingAddress.fullName}</p>
                    <p className="text-gray-600">{order.shippingAddress.address}</p>
                    <p className="text-gray-600">
                      {order.shippingAddress.city}, {order.shippingAddress.state || ''} {order.shippingAddress.postalCode}
                    </p>
                    <p className="text-gray-600">{order.shippingAddress.country}</p>
                    <p className="text-gray-600 mt-2">
                      <span className="font-medium">Phone:</span> {order.shippingAddress.phone}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Commission Information */}
            {(order.commissionAmount || order.commissionPercent) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <IoCard className="h-5 w-5" />
                    Commission Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {order.commissionPercent && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Commission Rate:</span>
                        <span className="font-semibold">{order.commissionPercent}%</span>
                      </div>
                    )}
                    {order.commissionAmount && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Commission Amount:</span>
                        <span className="font-semibold">{formatCurrency(order.commissionAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Commission Paid:</span>
                      <Badge variant={order.commissionPaid ? "default" : "destructive"}>
                        {order.commissionPaid ? "Paid" : "Unpaid"}
                      </Badge>
                    </div>
                    {order.commissionPaidAt && (
                      <div className="pt-2 border-t">
                        <span className="text-sm text-gray-500">Paid At:</span>
                        <p className="text-sm">{formatDate(order.commissionPaidAt)}</p>
                      </div>
                    )}
                    {order.vendorAmount && (
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="text-gray-600 font-medium">Vendor Amount:</span>
                        <span className="font-bold text-green-600">{formatCurrency(order.vendorAmount)}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Order Items & Details */}
          <div className="xl:col-span-2 space-y-6">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <IoCart className="h-5 w-5" />
                  Order Items ({order.orderItems.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {order.orderItems.map((item: any) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="relative h-24 w-24 rounded-lg overflow-hidden border flex-shrink-0">
                          {item.product?.images?.[0] ? (
                            <Image
                              src={item.product.images[0]}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                              sizes="96px"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500 text-sm">No Image</span>
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-lg mb-1">{item.product?.name}</h3>
                              <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                                {item.product?.description}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                <span>Product ID: {item.productId}</span>
                                {item.variantId && (
                                  <span>Variant ID: {item.variantId}</span>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg">{formatCurrency(item.totalPrice)}</p>
                              <p className="text-sm text-gray-500">
                                {formatCurrency(item.price)} × {item.quantity}
                              </p>
                            </div>
                          </div>

                          {/* Variant Details */}
                          {(item.size || item.color) && (
                            <div className="mt-3 pt-3 border-t">
                              <div className="flex items-center gap-6">
                                {item.size && (
                                  <div>
                                    <span className="text-sm text-gray-500">Size:</span>
                                    <Badge variant="outline" className="ml-2">
                                      {item.size}
                                    </Badge>
                                  </div>
                                )}
                                {item.color && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500">Color:</span>
                                    <div
                                      className="h-4 w-4 rounded-full border"
                                      style={{ backgroundColor: item.color }}
                                    />
                                    <span className="text-sm">{item.color}</span>
                                  </div>
                                )}
                                {item.variant?.inStock !== undefined && (
                                  <div>
                                    <span className="text-sm text-gray-500">Variant Stock:</span>
                                    <Badge 
                                      variant={item.variant.inStock ? "default" : "destructive"} 
                                      className="ml-2"
                                    >
                                      {item.variant.inStock ? "In Stock" : "Out of Stock"}
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Product Details */}
                          <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            <div>
                              <span className="text-gray-500">Stock:</span>
                              <span className="ml-2 font-medium">{item.product?.stockQuantity || 0}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Discount:</span>
                              <span className="ml-2 font-medium">{item.product?.discount || 0}%</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Final Price:</span>
                              <span className="ml-2 font-medium">{formatCurrency(item.product?.finalPrice || 0)}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Store:</span>
                              <span className="ml-2 font-medium">{item.product?.store?.name || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Timeline */}
            {order.orderStatusLogs && order.orderStatusLogs.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.orderStatusLogs.map((log: any, index: number) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`h-3 w-3 rounded-full ${
                            index === 0 ? 'bg-green-500' : 'bg-gray-300'
                          }`} />
                          {index < order.orderStatusLogs.length - 1 && (
                            <div className="h-8 w-0.5 bg-gray-300 mt-1" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{log.status}</span>
                            <span className="text-sm text-gray-500">{formatDate(log.createdAt)}</span>
                          </div>
                          {log.notes && (
                            <p className="text-sm text-gray-600 mt-1">{log.notes}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payment & Order Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Payment Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Stripe Payment ID:</span>
                      <span className="font-mono text-sm break-all">
                        {order.stripePaymentId || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Coupon Applied:</span>
                      <span>{order.couponId ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Metadata */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Metadata</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Shipping ID:</span>
                      <span className="font-mono text-sm break-all">{order.shippingId}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-mono text-sm break-all">{order.id}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Timestamps */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Timestamps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <span className="font-medium text-gray-500 text-sm">Order Created:</span>
                    <p className="text-gray-900 font-semibold text-lg">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="space-y-2">
                    <span className="font-medium text-gray-500 text-sm">Last Updated:</span>
                    <p className="text-gray-900 font-semibold text-lg">{formatDate(order.updatedAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}