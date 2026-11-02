/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import PageLoader from "@/app/loading";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useGetSingleServiceByIdQuery } from "@/redux/features/mainScreen/consultationsApi";
import {
  CircleCheckBig,
  Clock,
  MapPin,
  Star,
  Info,
  LayoutGrid,
  CalendarRange,
  MonitorPlay,
  User,
  MessageSquareQuote,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Service,
  ServiceFeaturesObject,
  ServiceFeatureItem,
  ServiceReview,
} from "@/types/global";

interface ServicesDetailsPageProps {
  serviceId: string;
}

export default function ServicesDetailsPage({
  serviceId,
}: ServicesDetailsPageProps) {
  const {
    data: serviceResponse,
    isLoading,
    isError,
  } = useGetSingleServiceByIdQuery(serviceId);

  const service = serviceResponse?.data as Service;

  if (isLoading) return <PageLoader />;
  if (isError || !service) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4 px-4">
          <p className="text-xl font-bold text-red-500">Service Not Found</p>
          <p className="text-gray-500 text-sm max-w-xs mx-auto">
            The service you are looking for might have been removed or is
            currently unavailable.
          </p>
          <Link
            href="/admin-dashboard/store-content"
            className="inline-block text-blue-600 hover:underline font-medium"
          >
            Back to Item Management
          </Link>
        </div>
      </div>
    );
  }

  const specialists = service.specialists || [];
  const features = service.features;
  const isFeatureArray = Array.isArray(features);

  // Aggregate reviews from all available providers
  const allReviews: ServiceReview[] = (service.availableProviders || []).reduce(
    (acc, provider) => [...acc, ...(provider.reviews || [])],
    [] as ServiceReview[],
  );

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      {/* Page Title & Status */}
      <div className="mb-10 lg:mb-12">
        <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
          {service.name}
        </h1>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge
            className={cn(
              "px-3 py-1 text-[10px] font-black uppercase tracking-wider",
              service.status === "approved"
                ? "bg-green-500 text-white"
                : "bg-yellow-500 text-white",
            )}
          >
            {service.status}
          </Badge>
          {service.tags?.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="px-3 py-1 bg-blue-50/50 text-blue-600 border-blue-100 font-bold uppercase text-[10px] tracking-wider"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 xl:gap-12">
        {/* Left Content (9/12) */}
        <div className="xl:col-span-9 space-y-10">
          {/* Redesigned Header: Large Profile Pic & Quick Stats */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Primary Visual - Large Profile Pic */}
            <div className="relative w-full lg:w-[320px] aspect-square rounded-4xl overflow-hidden border border-gray-100 shadow-xl bg-gray-50 shrink-0">
              <Image
                src={service.profilePic || "/placeholder.svg"}
                alt={service.name}
                fill
                className="object-cover"
                priority
                unoptimized
              />
            </div>

            {/* Quick Stats Grid */}
            <div className="w-full grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center space-y-3 hover:shadow-md transition-all">
                <div className="p-3 bg-blue-50 rounded-2xl">
                  <MonitorPlay className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Mode
                  </p>
                  <p className="text-sm font-bold text-gray-900 capitalize">
                    {service.serviceMode?.toLowerCase()}
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center space-y-3 hover:shadow-md transition-all">
                <div className="p-3 bg-green-50 rounded-2xl">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Duration
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    {service.duration} Min
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center space-y-3 hover:shadow-md transition-all">
                <div className="p-3 bg-orange-50 rounded-2xl">
                  <Info className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Slots
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    {service.totalSlot}
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center space-y-3 hover:shadow-md transition-all">
                <div className="p-3 bg-purple-50 rounded-2xl">
                  <LayoutGrid className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Type
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    {service.serviceType?.name}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Info Card */}
          <div className="bg-white p-6 sm:p-8 lg:p-12 rounded-4xl border border-gray-100 shadow-sm space-y-12">
            {/* About Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                <span className="w-1.5 h-8 bg-blue-600 rounded-full" />
                Description
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg italic bg-gray-50/50 p-6 rounded-2xl border-l-4 border-blue-500">
                "{service.description}"
              </p>
            </div>

            {/* Inclusions (Object Mode) */}
            {!isFeatureArray &&
              (features as ServiceFeaturesObject)?.includes && (
                <div className="space-y-6 pt-6 border-t border-gray-50">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    What's Included
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(features as ServiceFeaturesObject).includes?.map(
                      (item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100"
                        >
                          <CircleCheckBig className="w-4 h-4 text-green-500 shrink-0" />
                          <span className="text-sm font-bold text-gray-700">
                            {item}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

            {/* Add-ons (Array Mode) */}
            {isFeatureArray &&
              (features as ServiceFeatureItem[]).length > 0 && (
                <div className="space-y-6 pt-6 border-t border-gray-50">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    Service Add-ons
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(features as ServiceFeatureItem[]).map((feature, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl border border-gray-100 bg-gray-50 space-y-3 hover:bg-white hover:shadow-lg transition-all group"
                      >
                        <div className="flex justify-between items-start">
                          <p className="font-black text-gray-900 group-hover:text-blue-600 transition-colors">
                            {feature.serviceName}
                          </p>
                          <span className="text-sm font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                            €{feature.price}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400 font-black uppercase tracking-widest">
                          <Clock className="w-3.5 h-3.5" />
                          {feature.duration}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Specialists */}
            {specialists.length > 0 && (
              <div className="space-y-8 pt-6 border-t border-gray-50">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                  <span className="w-1.5 h-8 bg-green-500 rounded-full" />
                  Assigned Specialists
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {specialists.map((specialist) => (
                    <div
                      key={specialist.id}
                      className="flex items-center gap-5 p-5 bg-gray-50 rounded-2xl border border-gray-100 group transition-all hover:bg-white hover:shadow-xl hover:-translate-y-1"
                    >
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden filter grayscale group-hover:grayscale-0 transition-all duration-500 border-2 border-white shadow-sm shrink-0">
                        <Image
                          src={
                            specialist.user?.profilePic || "/placeholder.svg"
                          }
                          alt={`${specialist.firstName} ${specialist.lastName}`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="space-y-1 overflow-hidden">
                        <p className="font-black text-gray-900 text-lg truncate uppercase tracking-tight">
                          {specialist.firstName} {specialist.lastName}
                        </p>
                        <p className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg inline-block uppercase tracking-wider">
                          {specialist.title}
                        </p>
                        <div className="flex items-center gap-3 pt-2">
                          <div className="flex items-center gap-1.5">
                            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                            <span className="text-xs font-black text-gray-900">
                              {specialist.averageRating} Rating
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            {allReviews.length > 0 && (
              <div className="space-y-10 pt-10 border-t border-gray-50">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                  <span className="w-1.5 h-8 bg-yellow-500 rounded-full" />
                  Customer Feedback
                </h2>
                <div className="grid grid-cols-1 gap-6">
                  {allReviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-gray-50/50 p-6 md:p-8 rounded-3xl border border-gray-100 space-y-4"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                            <Image
                              src={
                                review.user?.profilePic || "/placeholder.svg"
                              }
                              alt={review.user?.firstName}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div>
                            <p className="font-black text-gray-900">
                              {review.user?.firstName} {review.user?.lastName}
                            </p>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={cn(
                                    "w-3 h-3",
                                    i < review.rating
                                      ? "fill-yellow-500 text-yellow-500"
                                      : "text-gray-200",
                                  )}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="relative bg-white p-5 rounded-2xl border border-gray-50">
                        <MessageSquareQuote className="absolute -top-3 -left-3 w-8 h-8 text-blue-100 rotate-12" />
                        <p className="text-gray-600 leading-relaxed italic text-sm">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar (3/12) */}
        <div className="xl:col-span-3 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-4xl border border-gray-100 shadow-sm space-y-10">
            <div className="space-y-6">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                Service Pricing
              </h3>
              <div className="space-y-1">
                <p className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tighter italic">
                  €{service.price}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge
                    variant="outline"
                    className="text-blue-600 bg-blue-50 border-blue-100 font-black uppercase text-[9px]"
                  >
                    {service.providerType?.replace("_", " ")}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-3 py-4 border-y border-gray-50">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <span className="text-lg font-black text-gray-900">
                    {service.averageRating?.toFixed(1) || "0.0"}
                  </span>
                  <span className="text-xs font-bold text-gray-400 ml-2">
                    ({service.totalReviews} Reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                Service Location
              </h3>
              <div className="flex items-center gap-4 group">
                <div className="bg-gray-50 p-3 rounded-xl group-hover:bg-orange-50 transition-colors">
                  <MapPin className="w-5 h-5 text-gray-400 group-hover:text-orange-600" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Office
                  </p>
                  <p
                    className="text-sm font-bold text-gray-900 truncate"
                    title={service.location}
                  >
                    {service.location}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-4xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              Provider Profile
            </h3>
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gray-50 shadow-inner">
                <Image
                  src={service.store?.logo || "/placeholder.svg"}
                  alt={service.store?.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="overflow-hidden">
                <p className="font-black text-gray-900 text-sm truncate">
                  {service.store?.name}
                </p>
                <div className="flex items-center gap-1.5 pt-0.5">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">
                    {service.store?.status}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Metadata */}
      <div className="mt-20">
        <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
          <div className="bg-gray-900 px-8 py-6">
            <h2 className="text-lg font-black text-white uppercase tracking-widest">
              Administrative Record
            </h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableBody>
                <TableRow className="border-b border-gray-50 hover:bg-transparent">
                  <TableCell className="font-extrabold text-gray-400 uppercase text-[9px] tracking-[0.2em] bg-gray-50/50 px-8 py-6 w-1/3 min-w-[150px]">
                    Classification
                  </TableCell>
                  <TableCell className="font-bold text-gray-800 px-8">
                    {service.category?.name} &gt; {service.subCategory?.name}
                  </TableCell>
                </TableRow>
                <TableRow className="border-b border-gray-50 hover:bg-transparent">
                  <TableCell className="font-extrabold text-gray-400 uppercase text-[9px] tracking-[0.2em] bg-gray-50/50 px-8 py-6">
                    Reference ID
                  </TableCell>
                  <TableCell className="font-mono font-bold text-blue-600 px-8">
                    {service.id}
                  </TableCell>
                </TableRow>
                <TableRow className="hover:bg-transparent">
                  <TableCell className="font-extrabold text-gray-400 uppercase text-[9px] tracking-[0.2em] bg-gray-50/50 px-8 py-6">
                    Audit Date
                  </TableCell>
                  <TableCell className="font-bold text-gray-600 px-8">
                    {new Date(service.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
