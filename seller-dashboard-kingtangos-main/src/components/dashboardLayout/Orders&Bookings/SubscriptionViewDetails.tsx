"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { IoArrowBack, IoReceipt, IoPerson, IoCalendar, IoTime, IoCheckmarkCircle, IoCloseCircle, IoPricetag, IoGift, IoStar, IoBusiness, IoCash, IoRefresh } from "react-icons/io5";
import Link from "next/link";
import { useGetSingleSubscriptionByIdQuery } from "@/redux/api/subscriptionApi/subscriptionApi";
import SendMessageButton from "../chat/SendMessageButton";


interface SubscriptionViewDetailsProps {
  subscriptionViewId: string | null;
}

export default function SubscriptionViewDetails({ subscriptionViewId }: SubscriptionViewDetailsProps) {
  const router = useRouter();

  const { data: subscriptionData, isLoading, error } = useGetSingleSubscriptionByIdQuery(
    subscriptionViewId!,
    {
      skip: !subscriptionViewId,
    }
  );

  const subscription = subscriptionData?.data;
  const plan = subscription?.plan;
  const user = subscription?.user;

  const getPaymentStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "COMPLETED":
        return { variant: "default" as const, text: "Completed", color: "bg-green-100 text-green-800" };
      case "PENDING":
        return { variant: "secondary" as const, text: "Pending", color: "bg-yellow-100 text-yellow-800" };
      case "FAILED":
        return { variant: "destructive" as const, text: "Failed", color: "bg-red-100 text-red-800" };
      default:
        return { variant: "outline" as const, text: status || "Unknown", color: "bg-gray-100 text-gray-800" };
    }
  };

  const getSubscriptionStatus = (endDate: string) => {
    const today = new Date();
    const expiration = new Date(endDate);
    return today <= expiration ? "ACTIVE" : "EXPIRED";
  };

  const getSubscriptionStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return { variant: "default" as const, text: "Active", color: "bg-green-100 text-green-800" };
      case "EXPIRED":
        return { variant: "destructive" as const, text: "Expired", color: "bg-red-100 text-red-800" };
      default:
        return { variant: "outline" as const, text: status || "Unknown", color: "bg-gray-100 text-gray-800" };
    }
  };

  const getPlanIntervalBadge = (interval: string) => {
    switch (interval?.toLowerCase()) {
      case "month":
        return { variant: "default" as const, text: "Monthly", color: "bg-blue-100 text-blue-800" };
      case "year":
        return { variant: "secondary" as const, text: "Yearly", color: "bg-purple-100 text-purple-800" };
      case "week":
        return { variant: "outline" as const, text: "Weekly", color: "bg-amber-100 text-amber-800" };
      default:
        return { variant: "outline" as const, text: interval || "One-time", color: "bg-gray-100 text-gray-800" };
    }
  };

  const getPlanStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return { variant: "default" as const, text: "Approved", color: "bg-green-100 text-green-800" };
      case "pending":
        return { variant: "secondary" as const, text: "Pending", color: "bg-yellow-100 text-yellow-800" };
      case "rejected":
        return { variant: "destructive" as const, text: "Rejected", color: "bg-red-100 text-red-800" };
      default:
        return { variant: "outline" as const, text: status || "Unknown", color: "bg-gray-100 text-gray-800" };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const calculateRemainingDays = (endDate: string) => {
    const today = new Date();
    const expiration = new Date(endDate);
    const diffTime = expiration.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (!subscriptionViewId) {
    return (
      <div className="min-h-screen p-8">
        <div className="mx-auto container">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-red-600 text-lg mb-4">No subscription ID provided</p>
              <Button onClick={() => router.push('/seller-dashboard/order-booking')} className="mt-4">
                Back to Subscriptions
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
              <p className="mt-4 text-gray-600">Loading subscription details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !subscription) {
    return (
      <div className="min-h-screen p-8">
        <div className="mx-auto container">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-red-600 text-lg mb-4">Error loading subscription details</p>
              <Button onClick={() => router.push('/seller-dashboard/order-booking')} className="mt-4">
                Back to Subscriptions
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const paymentStatus = getPaymentStatusBadge(subscription.paymentStatus);
  const subscriptionStatus = getSubscriptionStatus(subscription.endDate);
  const subscriptionStatusBadge = getSubscriptionStatusBadge(subscriptionStatus);
  const planInterval = getPlanIntervalBadge(plan?.interval);
  const planStatus = getPlanStatusBadge(plan?.status);
  const remainingDays = calculateRemainingDays(subscription.endDate);

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
              <h1 className="lg:text-3xl text-xl font-bold text-gray-900 mb-2">Subscription Details</h1>
              <nav className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                <Link href="/seller-dashboard" className="hover:text-gray-700">
                  Dashboard
                </Link>
                <span>/</span>
                <Link href="/seller-dashboard/order-booking" className="hover:text-gray-700">
                  Subscriptions
                </Link>
                <span>/</span>
                <span className="text-gray-900">Details</span>
              </nav>
            </div>
          </div>
          
          <div className="flex items-center gap-3 mt-3">
            {/* <span className="text-sm text-gray-500">Subscription ID: {subscription.id?.slice(0, 8)}...</span> */}
             <SendMessageButton
                receiverId={subscription.userId}
                userType="Client"
                nextUrl={`/seller-dashboard/order-booking`}
              />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Subscription Summary */}
          <div className="xl:col-span-1 space-y-6">
            {/* Subscription Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <IoReceipt className="h-5 w-5" />
                  Subscription Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Subscription Status:</span>
                    <Badge variant={subscriptionStatusBadge.variant} className={subscriptionStatusBadge.color}>
                      {subscriptionStatusBadge.text}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Payment Status:</span>
                    <Badge variant={paymentStatus.variant} className={paymentStatus.color}>
                      {paymentStatus.text}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Billing Interval:</span>
                    <Badge variant={planInterval.variant} className={planInterval.color}>
                      {planInterval.text}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Commission Paid:</span>
                    <Badge variant={subscription.commissionPaid ? "default" : "secondary"}>
                      {subscription.commissionPaid ? (
                        <span className="flex items-center gap-1">
                          <IoCheckmarkCircle className="h-4 w-4" /> Yes
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <IoCloseCircle className="h-4 w-4" /> No
                        </span>
                      )}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-t pt-4">
                    <span className="text-gray-600 font-medium">Subscription Amount:</span>
                    <span className="font-semibold">{formatCurrency(subscription.amount)}</span>
                  </div>
                  {subscription.commissionAmount && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Commission Amount:</span>
                      <span className="font-semibold">{formatCurrency(parseFloat(subscription.commissionAmount))}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-2 border-t pt-4">
                    <span className="text-gray-600 font-medium text-lg">Total Paid:</span>
                    <span className="font-bold text-xl text-green-600">{formatCurrency(subscription.amount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subscription Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <IoCalendar className="h-5 w-5" />
                  Subscription Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Start Date:</span>
                    <span className="font-medium">{formatDate(subscription.startDate)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">End Date:</span>
                    <span className="font-medium">{formatDate(subscription.endDate)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Remaining Days:</span>
                    <Badge variant={remainingDays > 7 ? "default" : "destructive"}>
                      {remainingDays > 0 ? `${remainingDays} days` : "Expired"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="text-gray-600">Created At:</span>
                    <span className="text-sm text-gray-500">{formatDate(subscription.createdAt)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="text-sm text-gray-500">{formatDate(subscription.updatedAt)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subscriber Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <IoPerson className="h-5 w-5" />
                  Subscriber Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden border">
                      {user?.profilePic ? (
                        <Image
                          src={user.profilePic}
                          alt={`${user.firstName} ${user.lastName}`}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 text-xs">No Image</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{user?.firstName} {user?.lastName}</h3>
                      <p className="text-sm text-gray-500">Subscriber</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 block">Email</span>
                    <p className="font-medium break-all">{user?.email}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 block">User ID</span>
                    <p className="font-mono text-sm break-all">{user?.id}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 block">Role</span>
                    <Badge variant="outline" className="capitalize">
                      {user?.role?.toLowerCase()}
                    </Badge>
                  </div>
                  <div className="pt-2 border-t">
                    <span className="text-sm text-gray-500 block">Subscription Status</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={user?.isSubscribed ? "default" : "secondary"}>
                        {user?.isSubscribed ? "Subscribed" : "Not Subscribed"}
                      </Badge>
                      {user?.planExpiration && (
                        <span className="text-xs text-gray-500">
                          until {formatDate(user.planExpiration)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <IoCash className="h-5 w-5" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500 block">Stripe Payment ID</span>
                    <p className="font-mono text-xs break-all">{subscription.stripePaymentId}</p>
                  </div>
                  <div className="pt-2 border-t">
                    <span className="text-sm text-gray-500 block">Currency</span>
                    <p className="font-medium uppercase">{plan?.currency || "USD"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Plan Details */}
          <div className="xl:col-span-2 space-y-6">
            {/* Plan Details */}
            {plan && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <IoPricetag className="h-5 w-5" />
                      Plan Details
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={planStatus.variant} className={planStatus.color}>
                        {planStatus.text}
                      </Badge>
                      <Badge variant={plan.active ? "default" : "destructive"}>
                        {plan.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Plan Header */}
                    <div className="flex gap-6">
                      <div className="relative h-32 w-32 rounded-lg overflow-hidden border flex-shrink-0">
                        {plan.image ? (
                          <Image
                            src={plan.image}
                            alt={plan.planName}
                            fill
                            className="object-cover"
                            sizes="128px"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500">No Image</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{plan.planName}</h2>
                            <div className="flex items-center gap-3 mb-4">
                              <Badge variant={planInterval.variant} className={planInterval.color}>
                                {planInterval.text}
                              </Badge>
                              <div className="flex items-center gap-1 text-amber-500">
                                <IoStar className="h-4 w-4" />
                                <span className="font-medium">{plan.averageRating || 0}</span>
                                <span className="text-gray-500 text-sm">({plan.totalReviews || 0} reviews)</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-green-600">{formatCurrency(plan.amount)}</p>
                            <p className="text-sm text-gray-500">
                              Every {plan.intervalCount} {plan.interval}{plan.intervalCount > 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-4">{plan.description}</p>
                        
                        {/* Plan Features */}
                        {plan.features && plan.features.length > 0 && (
                          <div className="mb-4">
                            <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                              <IoGift className="h-4 w-4" />
                              Features Included:
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {plan.features.map((feature: string, index: number) => (
                                <div key={index} className="flex items-center gap-2 text-sm">
                                  <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                                  <span>{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Free Trial */}
                        {plan.freeTrialDays && (
                          <div className="flex items-center gap-2 text-blue-600">
                            <IoGift className="h-4 w-4" />
                            <span>{plan.freeTrialDays} days free trial</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Stripe Product Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
                      <div>
                        <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <IoBusiness className="h-5 w-5" />
                          Stripe Integration
                        </h3>
                        <div className="space-y-3 pl-7">
                          <div>
                            <span className="text-sm text-gray-500 block">Stripe Product ID</span>
                            <p className="font-mono text-sm break-all">{plan.productId}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500 block">Stripe Price ID</span>
                            <p className="font-mono text-sm break-all">{plan.priceId}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">Billing Interval:</span>
                            <Badge variant="outline">
                              Every {plan.intervalCount} {plan.interval}{plan.intervalCount > 1 ? 's' : ''}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Plan Statistics */}
                      <div>
                        <h3 className="font-semibold text-gray-700 mb-3">Plan Statistics</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <span className="text-sm text-gray-600 block">Average Rating</span>
                            <p className="text-2xl font-bold text-blue-600">{plan.averageRating || 0}</p>
                          </div>
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <span className="text-sm text-gray-600 block">Total Reviews</span>
                            <p className="text-2xl font-bold text-green-600">{plan.totalReviews || 0}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Plan Timestamps */}
                    <div className="pt-6 border-t">
                      <h3 className="font-semibold text-gray-700 mb-3">Plan Timestamps</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <span className="text-sm text-gray-500 block mb-1">Created At:</span>
                          <p className="font-medium">{formatDate(plan.createdAt)}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500 block mb-1">Last Updated:</span>
                          <p className="font-medium">{formatDate(plan.updatedAt)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Subscription Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <IoRefresh className="h-5 w-5" />
                  Subscription Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Subscription Period */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <IoCalendar className="h-5 w-5" />
                        Subscription Period
                      </h3>
                      <div className="space-y-3 pl-7">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Start Date:</span>
                          <span className="font-medium">{formatDate(subscription.startDate)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">End Date:</span>
                          <span className="font-medium">{formatDate(subscription.endDate)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Duration:</span>
                          <Badge variant="outline">
                            {plan?.intervalCount} {plan?.interval}{plan?.intervalCount > 1 ? 's' : ''}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <IoTime className="h-5 w-5" />
                        Validity Status
                      </h3>
                      <div className="space-y-3 pl-7">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Current Status:</span>
                          <Badge variant={subscriptionStatusBadge.variant} className={subscriptionStatusBadge.color}>
                            {subscriptionStatusBadge.text}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Days Remaining:</span>
                          <span className={`font-semibold ${remainingDays > 7 ? 'text-green-600' : 'text-red-600'}`}>
                            {remainingDays > 0 ? `${remainingDays} days` : 'Expired'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Auto-renew:</span>
                          <Badge variant={plan?.active ? "default" : "secondary"}>
                            {plan?.active ? "Enabled" : "Disabled"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Commission Information */}
                  <div className="pt-6 border-t">
                    <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <IoCash className="h-5 w-5" />
                      Commission Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-7">
                      <div>
                        <span className="text-sm text-gray-600 block mb-1">Commission Amount:</span>
                        <p className="text-xl font-bold text-amber-600">
                          {formatCurrency(parseFloat(subscription.commissionAmount || "0"))}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600 block mb-1">Commission Status:</span>
                        <div className="flex items-center gap-2">
                          <Badge variant={subscription.commissionPaid ? "default" : "secondary"}>
                            {subscription.commissionPaid ? "Paid" : "Unpaid"}
                          </Badge>
                          {subscription.commissionPaid && (
                            <IoCheckmarkCircle className="h-5 w-5 text-green-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  {subscription.description && (
                    <div className="pt-6 border-t">
                      <h3 className="font-semibold text-gray-700 mb-3">Description</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700 whitespace-pre-wrap">{subscription.description}</p>
                      </div>
                    </div>
                  )}

                  {/* Benefits Included */}
                  {subscription.benefitsIncluded && (
                    <div className="pt-6 border-t">
                      <h3 className="font-semibold text-gray-700 mb-3">Benefits Included</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700 whitespace-pre-wrap">{subscription.benefitsIncluded}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}