/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import PageLoader from "@/app/loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useGetConsultationDetailsQuery } from "@/redux/features/mainScreen/consultationsApi";
import { Calendar, Clock, MapPin, Star, User, Video } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaRegStar } from "react-icons/fa6";

export default function ConsultationDetailsPage() {
  const { id } = useParams();
  const {
    data: consultationData,
    isLoading,
    isError,
  } = useGetConsultationDetailsQuery(id as string);
  const consultation: any = consultationData?.data;

  if (isLoading) return <PageLoader />;
  if (isError || !consultation) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4 px-4">
          <p className="text-xl font-bold text-red-500">
            Consultation Not Found
          </p>
          <p className="text-gray-500 text-sm max-w-xs mx-auto">
            The consultation you are looking for might have been removed or is
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

  const specialists = consultation.specialists || [];

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <div className="mb-10 lg:mb-12">
        <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
          {consultation.name}
        </h1>
        <div className="flex flex-wrap gap-2 mt-4">
          {consultation.tags?.map((tag: string) => (
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
        {/* Left Section (9/12) */}
        <div className="xl:col-span-9 space-y-10">
          <div className="relative aspect-video rounded-4xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm transition-all">
            <Image
              src={consultation.profilePic || "/placeholder.svg"}
              alt={consultation.name}
              fill
              className="object-cover"
              priority
              unoptimized
            />
            <div className="absolute top-6 left-6 flex gap-2">
              <Badge
                className={cn(
                  "px-4 py-1.5 text-xs font-black uppercase tracking-widest shadow-lg",
                  consultation.status === "AVAILABLE" ||
                    consultation.status === "approved"
                    ? "bg-green-500 text-white"
                    : "bg-yellow-500 text-white",
                )}
              >
                {consultation.status}
              </Badge>
              <Badge className="bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-1.5 text-xs font-black uppercase tracking-widest shadow-lg border-none">
                {consultation.type?.replace("_", " ")}
              </Badge>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 lg:p-12 rounded-4xl border border-gray-100 shadow-sm space-y-10">
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                <span className="w-1.5 h-8 bg-blue-600 rounded-full" />
                About This Consultation
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg italic">
                "{consultation.description}"
              </p>
            </div>

            <hr className="border-gray-50" />

            <div className="space-y-8">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                <span className="w-1.5 h-8 bg-green-500 rounded-full" />
                Assigned Specialists
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {specialists.map((specialist: any) => (
                  <div
                    key={specialist.id}
                    className="flex items-center gap-5 p-5 bg-gray-50 rounded-2xl border border-gray-100 group transition-all hover:bg-white hover:shadow-xl hover:-translate-y-1"
                  >
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500 border-2 border-white shadow-sm shrink-0">
                      <Image
                        src={specialist.user?.profilePic || "/placeholder.svg"}
                        alt={`${specialist.firstName} ${specialist.lastName}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="space-y-1 overflow-hidden">
                      <p className="font-black text-gray-900 text-lg truncate">
                        {specialist.firstName} {specialist.lastName}
                      </p>
                      <p className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg inline-block">
                        {specialist.title}
                      </p>
                      <div className="flex items-center gap-3 pt-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                          <span className="text-xs font-black text-gray-900">
                            {specialist.experience}y Exp.
                          </span>
                        </div>
                        <div className="w-1 h-1 bg-gray-300 rounded-full" />
                        <span className="text-xs font-bold text-gray-400 truncate">
                          {specialist.email}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar (3/12) */}
        <div className="xl:col-span-3 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-4xl border border-gray-100 shadow-sm space-y-10">
            <div className="space-y-6">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                Session Pricing
              </h3>

              <div className="space-y-1">
                <p className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tighter italic">
                  €{consultation.price}
                </p>
                <p className="text-[10px] sm:text-xs font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full inline-block">
                  {consultation.consultationMode}
                </p>
              </div>

              <div className="flex items-center gap-3 py-4 border-y border-gray-50">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <span className="text-lg font-black text-gray-900">
                    {consultation.averageRating?.toFixed(1) || "0.0"}
                  </span>
                  <span className="text-xs font-bold text-gray-400 ml-2">
                    ({consultation.totalReviews} Reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                Schedule Details
              </h3>
              <ul className="space-y-5">
                <li className="flex items-center gap-4 group">
                  <div className="bg-gray-50 p-3 rounded-xl group-hover:bg-blue-50 transition-colors">
                    <Clock className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Duration
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      {consultation.duration}
                    </p>
                  </div>
                </li>
                <li className="flex items-center gap-4 group">
                  <div className="bg-gray-50 p-3 rounded-xl group-hover:bg-green-50 transition-colors">
                    <Calendar className="w-5 h-5 text-gray-400 group-hover:text-green-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Slots Available
                    </p>
                    <p className="text-sm font-bold text-green-600">
                      {consultation.totalSlot} total
                    </p>
                  </div>
                </li>
                <li className="flex items-center gap-4 group">
                  <div className="bg-gray-50 p-3 rounded-xl group-hover:bg-orange-50 transition-colors">
                    <MapPin className="w-5 h-5 text-gray-400 group-hover:text-orange-600" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Location
                    </p>
                    <p
                      className="text-sm font-bold text-gray-900 truncate"
                      title={consultation.location}
                    >
                      {consultation.location}
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* <Button className="w-full bg-gray-900 hover:bg-blue-600 text-white font-black py-6 sm:py-7 rounded-2xl transition-all shadow-xl shadow-gray-200 active:scale-[0.98]">
              Update Status
            </Button> */}
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-4xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              Provider Info
            </h3>
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gray-50 shadow-inner">
                <Image
                  src={consultation.store?.logo || "/placeholder.svg"}
                  alt={consultation.store?.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="overflow-hidden">
                <p className="font-black text-gray-900 text-sm truncate">
                  {consultation.store?.name}
                </p>
                <div className="flex items-center gap-1.5 pt-0.5">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">
                    {consultation.store?.status}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20">
        <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
          <div className="bg-gray-900 px-8 py-6">
            <h2 className="text-lg font-black text-white uppercase tracking-widest">
              Technical Metadata
            </h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableBody>
                <TableRow className="border-b border-gray-50 hover:bg-transparent">
                  <TableCell className="font-extrabold text-gray-400 uppercase text-[9px] tracking-[0.2em] bg-gray-50/50 px-8 py-6 w-1/3 min-w-[150px]">
                    Internal Category
                  </TableCell>
                  <TableCell className="font-bold text-gray-800 px-8">
                    {consultation.category?.name} ({consultation.category?.type}
                    )
                  </TableCell>
                </TableRow>
                <TableRow className="border-b border-gray-50 hover:bg-transparent">
                  <TableCell className="font-extrabold text-gray-400 uppercase text-[9px] tracking-[0.2em] bg-gray-50/50 px-8 py-6">
                    Subcategory
                  </TableCell>
                  <TableCell className="font-bold text-gray-800 px-8">
                    {consultation.subCategory?.name}
                  </TableCell>
                </TableRow>
                <TableRow className="border-b border-gray-50 hover:bg-transparent">
                  <TableCell className="font-extrabold text-gray-400 uppercase text-[9px] tracking-[0.2em] bg-gray-50/50 px-8 py-6">
                    Slot Duration
                  </TableCell>
                  <TableCell className="font-bold text-gray-800 px-8">
                    {consultation.slotDuration} Minutes
                  </TableCell>
                </TableRow>
                <TableRow className="border-b border-gray-50 hover:bg-transparent">
                  <TableCell className="font-extrabold text-gray-400 uppercase text-[9px] tracking-[0.2em] bg-gray-50/50 px-8 py-6">
                    Consultation ID
                  </TableCell>
                  <TableCell className="font-mono font-bold text-blue-600 px-8">
                    {consultation.id}
                  </TableCell>
                </TableRow>
                <TableRow className="hover:bg-transparent">
                  <TableCell className="font-extrabold text-gray-400 uppercase text-[9px] tracking-[0.2em] bg-gray-50/50 px-8 py-6">
                    Last Updated
                  </TableCell>
                  <TableCell className="font-bold text-gray-600 px-8">
                    {new Date(consultation.updatedAt).toLocaleDateString(
                      "en-GB",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      },
                    )}
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
