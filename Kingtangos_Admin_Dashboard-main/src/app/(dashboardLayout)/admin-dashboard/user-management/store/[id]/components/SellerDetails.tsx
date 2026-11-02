"use client";
import React, { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import {
  Mail,
  Calendar,
  Shield,
  User,
  MapPin,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useParams } from "next/navigation";
import {
  useGetSingleUserQuery,
  UserData,
} from "@/redux/features/userManagement/userManagementApi";
import PageLoader from "@/app/loading";
import SendMessageButton from "@/app/(dashboardLayout)/admin-dashboard/chat/(component)/sendMessage";

const SellerDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useGetSingleUserQuery(id);
  console.log(data);

  const [isDisableOpen, setIsDisableOpen] = useState(false);
  const [isBanOpen, setIsBanOpen] = useState(false);

  if (isLoading) return <PageLoader />;
  if (isError || !data?.data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600 text-lg">Failed to load user details.</p>
      </div>
    );
  }

  const user = data.data;
  const fullName = `${user.firstName} ${user.lastName}`.trim();
  const joinedDate = format(new Date(user.createdAt), "MMMM d, yyyy");
  const joinedTimeAgo = format(new Date(user.createdAt), "MMM d, yyyy");

  // Get orders (if available)
  const orders = user.orders || [];
  const hasOrders = orders.length > 0;

  // Helper function to get status badge color
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
      PROCESSING: "bg-blue-100 text-blue-800 border-blue-200",
      SHIPPED: "bg-purple-100 text-purple-800 border-purple-200",
      DELIVERED: "bg-green-100 text-green-800 border-green-200",
      CANCELLED: "bg-red-100 text-red-800 border-red-200",
      PAID: "bg-emerald-100 text-emerald-800 border-emerald-200",
      FAILED: "bg-red-100 text-red-800 border-red-200",
      REFUNDED: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            {user.role.toLowerCase().replace("_", " ")} Details
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Complete profile and account information
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: Customer Profile */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border border-gray-200 shadow-sm h-fit">
              <CardContent className="flex flex-col items-center text-center py-8">
                <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-blue-50 mb-4">
                  {user.profilePic ? (
                    <Image
                      src={user.profilePic}
                      alt={fullName}
                      width={112}
                      height={112}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      <User className="w-16 h-16 text-white" />
                    </div>
                  )}
                </div>

                <h2 className="font-bold text-xl text-gray-900">{fullName}</h2>
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{user.email}</span>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span
                    className={`text-sm font-medium ${user.isVerified ? "text-emerald-600" : "text-orange-600"}`}
                  >
                    {user.isVerified ? "Verified Account" : "Unverified"}
                  </span>
                </div>
                <SendMessageButton
                  userType={user.role.toLowerCase().replace("_", " ")}
                  receiverId={user.id}
                  className="ml-2"
                  nextUrl={`/admin-dashboard/chat`}
                />

                <div className="w-full border-t border-gray-200 my-6" />

                <div className="w-full text-left space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">User Role</span>
                    <span className="font-medium capitalize">
                      {user.role.toLowerCase().replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Member Since</span>
                    <span className="font-medium">{joinedTimeAgo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subscription</span>
                    <span
                      className={`font-medium ${user.isSubscribed ? "text-emerald-600" : "text-gray-500"}`}
                    >
                      {user.isSubscribed ? "Active" : "None"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Account Status</span>
                    <span className="font-medium text-emerald-600">{user?.status}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Store Quick Info (Only for Sellers) */}
            {user.role === "SELLER" && user.stores && (
              <Card className="border border-gray-200 shadow-sm overflow-hidden">
                <div className="relative h-32 w-full">
                  <Image
                    src={user.stores.banner}
                    alt={user.stores.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
                    <div className="w-16 h-16 rounded-full border-4 border-white overflow-hidden bg-white shadow-md">
                      <Image
                        src={user.stores.logo}
                        alt={user.stores.name}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                </div>
                <CardContent className="pt-8 pb-6 flex flex-col items-center text-center px-4">
                  <h3 className="font-bold text-lg text-gray-900 mt-2">
                    {user.stores.name}
                  </h3>
                  <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                    <MapPin className="w-3 h-3" />
                    {user.stores.location}
                  </div>
                  <div
                    className={`mt-3 px-3 py-1 rounded-full text-xs font-semibold border ${
                      user.stores.shopStatus === "APPROVED"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-yellow-50 text-yellow-700 border-yellow-200"
                    }`}
                  >
                    {user.stores.shopStatus}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* RIGHT: Details Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Store Detailed Information */}
            {user.role === "SELLER" && user.stores && (
              <Card className="border border-gray-200 shadow-sm overflow-hidden">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-gray-600" />
                    Store Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-1">
                          About the Store
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {user.stores.description}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {user.stores.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-gray-900">
                        Contact Information
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                            <Mail className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-[11px] text-gray-500">
                              Business Email
                            </p>
                            <p className="text-gray-900 font-medium">
                              {user.stores.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                            <Shield className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-[11px] text-gray-500">
                              Business Phone
                            </p>
                            <p className="text-gray-900 font-medium">
                              {user.stores.phone}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-red-600" />
                          </div>
                          <div>
                            <p className="text-[11px] text-gray-500">
                              Location
                            </p>
                            <p className="text-gray-900 font-medium">
                              {user.stores.location}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Store Services */}
            {user.role === "SELLER" &&
              user.stores &&
              user.stores.services &&
              user.stores.services.length > 0 && (
                <Card className="border border-gray-200 shadow-sm overflow-hidden">
                  <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-gray-600" />
                      Available Services
                      <span className="ml-auto text-sm font-normal text-gray-500">
                        {user.stores.services.length} services
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-100 bg-gray-50/30">
                            <th className="text-left py-4 px-6 font-semibold text-gray-700">
                              Service
                            </th>
                            <th className="text-left py-4 px-6 font-semibold text-gray-700">
                              Price
                            </th>
                            <th className="text-left py-4 px-6 font-semibold text-gray-700">
                              Mode
                            </th>
                            <th className="text-left py-4 px-6 font-semibold text-gray-700">
                              Duration
                            </th>
                            <th className="text-left py-4 px-6 font-semibold text-gray-700">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {user.stores.services.map((service) => (
                            <tr
                              key={service.id}
                              className="hover:bg-gray-50/50 transition-colors"
                            >
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                                    {service.profilePic ? (
                                      <Image
                                        src={service.profilePic}
                                        alt={service.name}
                                        width={40}
                                        height={40}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center">
                                        <ShoppingBag className="w-5 h-5 text-gray-400" />
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900">
                                      {service.name}
                                    </p>
                                    <p className="text-[11px] text-gray-500 truncate max-w-[200px]">
                                      {service.description}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <span className="font-semibold text-gray-900">
                                  ${service.price}
                                </span>
                              </td>
                              <td className="py-4 px-6">
                                <span
                                  className={`px-2 py-1 rounded text-[11px] font-medium ${
                                    service.serviceMode === "ONLINE"
                                      ? "bg-blue-50 text-blue-600"
                                      : "bg-orange-50 text-orange-600"
                                  }`}
                                >
                                  {service.serviceMode}
                                </span>
                              </td>
                              <td className="py-4 px-6 text-gray-600">
                                {service.duration} mins
                              </td>
                              <td className="py-4 px-6">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium border ${
                                    service.status === "approved"
                                      ? "bg-green-50 text-green-700 border-green-200"
                                      : "bg-yellow-50 text-yellow-700 border-yellow-200"
                                  }`}
                                >
                                  {service.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* Notes */}
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <p className="text-gray-500 italic">
                  No admin notes added yet.
                </p>
              </CardContent>
            </Card>

            {/* Recent Orders - Table Format */}
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-gray-600" />
                  Recent Orders
                  {hasOrders && (
                    <span className="ml-auto text-sm font-normal text-gray-500">
                      {orders.length} {orders.length === 1 ? "order" : "orders"}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {hasOrders ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">
                            Order ID
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">
                            Date
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">
                            Items
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">
                            Total
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">
                            Payment
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr
                            key={order.id}
                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                          >
                            <td className="py-3 px-4">
                              <span className="font-medium text-gray-900">
                                #{order.id.slice(0, 8)}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-600">
                              {format(new Date(order.createdAt), "MMM d, yyyy")}
                            </td>
                            <td className="py-3 px-4 text-gray-600">
                              {order.orderItems.length}{" "}
                              {order.orderItems.length === 1 ? "item" : "items"}
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-semibold text-gray-900">
                                ${order.totalAmount.toFixed(2)}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="capitalize text-gray-600">
                                {order.paymentMethod}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex flex-col gap-1">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium border inline-block w-fit ${getStatusColor(order.orderStatus)}`}
                                >
                                  {order.orderStatus}
                                </span>
                                {/* <span className={`px-2 py-1 rounded-full text-xs font-medium border inline-block w-fit ${getStatusColor(order.paymentStatus)}`}>
                                  {order.paymentStatus}
                                </span> */}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-gray-100 border-2 border-dashed rounded-xl w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                      <Calendar className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="text-gray-600 font-medium">
                      No orders placed yet
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      This user hasn&apos;t made any purchases.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Addresses */}
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gray-600" />
                  Addresses
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-sm">
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <p className="font-medium text-gray-900 flex items-center gap-2 mb-2">
                    <User className="w-4 h-4" />
                    {fullName}
                  </p>
                  <p className="text-gray-500 italic">
                    No shipping address provided
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <p className="font-medium text-gray-900 flex items-center gap-2 mb-2">
                    <User className="w-4 h-4" />
                    {fullName}
                  </p>
                  <p className="text-gray-500 italic">
                    No billing address provided
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Dialogs - unchanged */}
      <Dialog open={isDisableOpen} onOpenChange={setIsDisableOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600 font-bold text-lg">
              Disable Account
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to disable this customer?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-3 sm:gap-4">
            <Button variant="outline" onClick={() => setIsDisableOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => setIsDisableOpen(false)}
            >
              Disable
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isBanOpen} onOpenChange={setIsBanOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600 font-bold text-lg">
              Ban User
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently ban this user?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-3 sm:gap-4">
            <Button variant="outline" onClick={() => setIsBanOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => setIsBanOpen(false)}>
              Ban User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SellerDetailsPage;
