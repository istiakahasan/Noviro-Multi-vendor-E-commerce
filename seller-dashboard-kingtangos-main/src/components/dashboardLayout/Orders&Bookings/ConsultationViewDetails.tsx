"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { IoArrowBack, IoReceipt, IoPerson, IoCalendar, IoTime, IoLocation, IoChatbubble, IoDocumentText, IoVideocam, IoCall, IoPersonCircle, IoStorefront, IoCash } from "react-icons/io5";
import Link from "next/link";

import { useGetSingleBookingByIdQuery } from "@/redux/api/bookingApi/bookingApi";
import SendMessageButton from "../chat/SendMessageButton";

interface ConsultationViewDetailsProps {
  consultationViewId: string | null;
}

export default function ConsultationViewDetails({ consultationViewId }: ConsultationViewDetailsProps) {
  const router = useRouter();

  const { data: bookingData, isLoading, error } = useGetSingleBookingByIdQuery(
    consultationViewId!,
    {
      skip: !consultationViewId,
    }
  );

  const booking = bookingData?.data;
  const consultation = booking?.consultation;

  const getBookingStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return { variant: "secondary" as const, text: "Pending", color: "bg-yellow-100 text-yellow-800" };
      case "CONFIRMED":
        return { variant: "default" as const, text: "Confirmed", color: "bg-blue-100 text-blue-800" };
      case "COMPLETED":
        return { variant: "default" as const, text: "Completed", color: "bg-green-100 text-green-800" };
      case "CANCELLED":
        return { variant: "destructive" as const, text: "Cancelled", color: "bg-red-100 text-red-800" };
      case "RESCHEDULED":
        return { variant: "outline" as const, text: "Rescheduled", color: "bg-purple-100 text-purple-800" };
      default:
        return { variant: "outline" as const, text: status || "Unknown", color: "bg-gray-100 text-gray-800" };
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return { variant: "secondary" as const, text: "Pending", color: "bg-yellow-100 text-yellow-800" };
      case "PAID":
        return { variant: "default" as const, text: "Paid", color: "bg-green-100 text-green-800" };
      case "FAILED":
        return { variant: "destructive" as const, text: "Failed", color: "bg-red-100 text-red-800" };
      default:
        return { variant: "outline" as const, text: status || "Unknown", color: "bg-gray-100 text-gray-800" };
    }
  };

  const getConsultationStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "AVAILABLE":
        return { variant: "default" as const, text: "Available", color: "bg-green-100 text-green-800" };
      case "UNAVAILABLE":
        return { variant: "destructive" as const, text: "Unavailable", color: "bg-red-100 text-red-800" };
      case "BOOKED":
        return { variant: "secondary" as const, text: "Booked", color: "bg-blue-100 text-blue-800" };
      default:
        return { variant: "outline" as const, text: status || "Unknown", color: "bg-gray-100 text-gray-800" };
    }
  };

  const getConsultationTypeBadge = (type: string) => {
    switch (type?.toUpperCase()) {
      case "VIDEO":
        return { variant: "default" as const, text: "Video Call", color: "bg-blue-100 text-blue-800" };
      case "PHONE":
        return { variant: "secondary" as const, text: "Phone Call", color: "bg-green-100 text-green-800" };
      case "IN_PERSON":
        return { variant: "outline" as const, text: "In Person", color: "bg-purple-100 text-purple-800" };
      default:
        return { variant: "outline" as const, text: type || "Unknown", color: "bg-gray-100 text-gray-800" };
    }
  };

  const getProviderTypeBadge = (type: string) => {
    switch (type?.toUpperCase()) {
      case "SPECIALIST_ONLY":
        return { variant: "default" as const, text: "Specialist Only", color: "bg-indigo-100 text-indigo-800" };
      case "OWNER_ONLY":
        return { variant: "secondary" as const, text: "Owner Only", color: "bg-amber-100 text-amber-800" };
      case "BOTH":
        return { variant: "outline" as const, text: "Both", color: "bg-teal-100 text-teal-800" };
      default:
        return { variant: "outline" as const, text: type || "Unknown", color: "bg-gray-100 text-gray-800" };
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

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (!consultationViewId) {
    return (
      <div className="min-h-screen p-8">
        <div className="mx-auto container">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-red-600 text-lg mb-4">No booking ID provided</p>
              <Button onClick={() => router.push('/seller-dashboard/order-booking')} className="mt-4">
                Back to Bookings
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
              <p className="mt-4 text-gray-600">Loading booking details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen p-8">
        <div className="mx-auto container">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-red-600 text-lg mb-4">Error loading booking details</p>
              <Button onClick={() => router.push('/seller-dashboard/order-booking')} className="mt-4">
                Back to Bookings
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const bookingStatus = getBookingStatusBadge(booking.status);
  const paymentStatus = getPaymentStatusBadge(booking.paymentStatus);
  const consultationStatus = getConsultationStatusBadge(consultation?.status);
  const consultationType = getConsultationTypeBadge(consultation?.type);
  const providerType = getProviderTypeBadge(consultation?.providerType);

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
              <h1 className="lg:text-3xl text-xl font-bold text-gray-900 mb-2">Booking Details</h1>
              <nav className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                <Link href="/seller-dashboard" className="hover:text-gray-700">
                  Dashboard
                </Link>
                <span>/</span>
                <Link href="/seller-dashboard/order-booking" className="hover:text-gray-700">
                  Bookings
                </Link>
                <span>/</span>
                <span className="text-gray-900">Details</span>
              </nav>
            </div>
          </div>
          
          <div className="flex items-center gap-3 mt-3">
            {/* <span className="text-sm text-gray-500">Booking ID: {booking.id?.slice(0, 8)}...</span> */}
             <SendMessageButton
                receiverId={booking.userId}
                userType="Client"
                nextUrl={`/seller-dashboard/order-booking`}
              />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Booking Summary */}
          <div className="xl:col-span-1 space-y-6">
            {/* Booking Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <IoReceipt className="h-5 w-5" />
                  Booking Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Booking Status:</span>
                    <Badge variant={bookingStatus.variant} className={bookingStatus.color}>
                      {bookingStatus.text}
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
                    <Badge variant="outline">
                      {booking.paymentMethod?.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Provided By:</span>
                    <Badge variant={booking.isProvidedByOwner ? "default" : "secondary"}>
                      {booking.isProvidedByOwner ? "Store Owner" : "Specialist"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-t pt-4">
                    <span className="text-gray-600 font-medium">Amount:</span>
                    <span className="font-semibold">{formatCurrency(booking.amount)}</span>
                  </div>
                  {booking.commissionAmount && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Commission:</span>
                      <span className="font-semibold">{formatCurrency(booking.commissionAmount)}</span>
                    </div>
                  )}
                  {booking.vendorAmount && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Vendor Amount:</span>
                      <span className="font-semibold">{formatCurrency(booking.vendorAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-2 border-t pt-4">
                    <span className="text-gray-600 font-medium text-lg">Total:</span>
                    <span className="font-bold text-xl text-green-600">{formatCurrency(booking.amount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Client Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <IoPerson className="h-5 w-5" />
                  Client Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden border">
                      {booking.user?.profilePic ? (
                        <Image
                          src={booking.user.profilePic}
                          alt={`${booking.user.firstName} ${booking.user.lastName}`}
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
                      <h3 className="font-semibold">{booking.user?.firstName} {booking.user?.lastName}</h3>
                      <p className="text-sm text-gray-500">Client</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 block">Email</span>
                    <p className="font-medium break-all">{booking.user?.email}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 block">Client ID</span>
                    <p className="font-mono text-sm break-all">{booking.userId}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Specialist Information */}
            {booking.specialist && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <IoPersonCircle className="h-5 w-5" />
                    Specialist Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{booking.specialist.firstName} {booking.specialist.lastName}</h3>
                      <p className="text-sm text-gray-500 mb-3">{booking.specialist.title}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 block">Email</span>
                      <p className="font-medium break-all">{booking.specialist.email}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 block">Phone</span>
                      <p className="font-medium">{booking.specialist.phoneNum}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 block">Experience</span>
                      <p className="font-medium">{booking.specialist.experience}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 block">Bio</span>
                      <p className="text-sm text-gray-700 mt-1">{booking.specialist.bio}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 block">Specialist ID</span>
                      <p className="font-mono text-sm break-all">{booking.specialist.id}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

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
                    <p className="font-mono text-xs break-all">{booking.stripePaymentId}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 block">Commission Paid</span>
                    <Badge variant={booking.commissionPaid ? "default" : "secondary"}>
                      {booking.commissionPaid ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="pt-2 border-t">
                    <span className="text-sm text-gray-500 block">Payment Method</span>
                    <p className="font-medium capitalize">{booking.paymentMethod}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Consultation & Booking Details */}
          <div className="xl:col-span-2 space-y-6">
            {/* Consultation Details */}
            {consultation && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <IoChatbubble className="h-5 w-5" />
                    Consultation Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Consultation Header */}
                    <div className="flex gap-6">
                      <div className="relative h-32 w-32 rounded-lg overflow-hidden border flex-shrink-0">
                        {consultation.profilePic ? (
                          <Image
                            src={consultation.profilePic}
                            alt={consultation.name}
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
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{consultation.name}</h2>
                            <div className="flex items-center gap-3 mb-4">
                              <Badge variant={consultationStatus.variant} className={consultationStatus.color}>
                                {consultationStatus.text}
                              </Badge>
                              <Badge variant={consultationType.variant} className={consultationType.color}>
                                {consultationType.text}
                              </Badge>
                              <Badge variant={providerType.variant} className={providerType.color}>
                                {providerType.text}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-green-600">{formatCurrency(consultation.price)}</p>
                            <p className="text-sm text-gray-500">{consultation.duration} minutes</p>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-4">{consultation.description}</p>
                        
                        {/* Tags */}
                        {consultation.tags && consultation.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {consultation.tags.map((tag: string, index: number) => (
                              <Badge key={index} variant="outline" className="bg-gray-100">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        {/* Consultation Mode */}
                        <div className="flex items-center gap-2">
                          <IoLocation className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700">
                            Mode: <span className="font-medium capitalize">{consultation.consultationMode?.toLowerCase()}</span>
                            {consultation.consultationMode === "OFFLINE" && (
                              <span className="ml-2">• {consultation.location}</span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Store Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
                      <div>
                        <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <IoStorefront className="h-5 w-5" />
                          Store Information
                        </h3>
                        <div className="space-y-3 pl-7">
                          <div className="flex items-center gap-3">
                            {consultation.store?.logo ? (
                              <div className="relative h-10 w-10 rounded overflow-hidden">
                                <Image
                                  src={consultation.store.logo}
                                  alt={consultation.store.name}
                                  fill
                                  className="object-cover"
                                  sizes="40px"
                                />
                              </div>
                            ) : null}
                            <div>
                              <p className="font-semibold">{consultation.store?.name}</p>
                              <p className="text-sm text-gray-500">{consultation.store?.location}</p>
                            </div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500 block">Email</span>
                            <p className="font-medium">{consultation.store?.email}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500 block">Phone</span>
                            <p className="font-medium">{consultation.store?.phone}</p>
                          </div>
                        </div>
                      </div>

                      {/* Category Information */}
                      <div>
                        <h3 className="font-semibold text-gray-700 mb-3">Category Details</h3>
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm text-gray-500 block">Category</span>
                            <p className="font-medium">{consultation.category?.name}</p>
                            <p className="text-sm text-gray-600 mt-1">{consultation.category?.description}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500 block">Sub Category</span>
                            <p className="font-medium">{consultation.subCategory?.name}</p>
                            <p className="text-sm text-gray-600 mt-1">{consultation.subCategory?.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Schedule Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <IoCalendar className="h-5 w-5" />
                            Consultation Period
                          </h3>
                          <div className="space-y-2 pl-7">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Start Date:</span>
                              <span className="font-medium">{formatDate(consultation.startDate)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">End Date:</span>
                              <span className="font-medium">{formatDate(consultation.endDate)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <IoTime className="h-5 w-5" />
                            Daily Schedule
                          </h3>
                          <div className="space-y-2 pl-7">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Start Time:</span>
                              <span className="font-medium">{formatTime(consultation.startTime)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">End Time:</span>
                              <span className="font-medium">{formatTime(consultation.endTime)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Consultation Statistics */}
                    <div className="pt-6 border-t">
                      <h3 className="font-semibold text-gray-700 mb-3">Consultation Statistics</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <span className="text-sm text-gray-600 block">Average Rating</span>
                          <p className="text-2xl font-bold text-blue-600">{consultation.averageRating || 0}</p>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <span className="text-sm text-gray-600 block">Total Reviews</span>
                          <p className="text-2xl font-bold text-green-600">{consultation.totalReviews || 0}</p>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <span className="text-sm text-gray-600 block">Total Slots</span>
                          <p className="text-2xl font-bold text-purple-600">{consultation.totalSlot || 0}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Booking Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <IoDocumentText className="h-5 w-5" />
                  Booking Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Booking Time Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <IoCalendar className="h-5 w-5" />
                        Booking Date & Time
                      </h3>
                      <div className="space-y-3 pl-7">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Booking Date:</span>
                          <span className="font-medium">{formatDate(booking.bookingDate)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Start Time:</span>
                          <span className="font-medium">{formatTime(booking.startTime)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">End Time:</span>
                          <span className="font-medium">{formatTime(booking.endTime)}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <IoTime className="h-5 w-5" />
                        Duration & Timing
                      </h3>
                      <div className="space-y-3 pl-7">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-medium">{consultation?.duration} minutes</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Slot Duration:</span>
                          <span className="font-medium">{consultation?.slotDuration} minutes</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Current Status:</span>
                          <Badge variant="outline" className="capitalize">
                            {consultation?.currentStatus}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Meeting Information */}
                  {booking.meetingLink && (
                    <div className="pt-6 border-t">
                      <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <IoVideocam className="h-5 w-5" />
                        Meeting Information
                      </h3>
                      <div className="pl-7">
                        <div className="mb-3">
                          <span className="text-sm text-gray-600 block mb-1">Meeting Link:</span>
                          <a
                            href={booking.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline break-all"
                          >
                            {booking.meetingLink}
                          </a>
                        </div>
                        {consultation?.type === "VIDEO" && (
                          <Badge variant="default" className="bg-blue-100 text-blue-800">
                            <IoVideocam className="h-4 w-4 mr-1" />
                            Video Consultation
                          </Badge>
                        )}
                        {consultation?.type === "PHONE" && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <IoCall className="h-4 w-4 mr-1" />
                            Phone Consultation
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {booking.notes && (
                    <div className="pt-6 border-t">
                      <h3 className="font-semibold text-gray-700 mb-3">Client Notes</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700 whitespace-pre-wrap">{booking.notes}</p>
                      </div>
                    </div>
                  )}

                  {/* Timestamps */}
                  <div className="pt-6 border-t">
                    <h3 className="font-semibold text-gray-700 mb-3">Timestamps</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <span className="text-sm text-gray-500 block mb-1">Created At:</span>
                        <p className="font-medium">{formatDate(booking.createdAt)}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 block mb-1">Last Updated:</span>
                        <p className="font-medium">{formatDate(booking.updatedAt)}</p>
                      </div>
                    </div>
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