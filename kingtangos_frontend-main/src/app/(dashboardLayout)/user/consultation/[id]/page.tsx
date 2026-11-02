"use client";
import React from "react";
import { useParams } from "next/navigation";
import upcoming from "@/assets/user-dashboard/upcoming-service.png";
import importantInfo from "@/assets/user-dashboard/important-info.png";
import UpComingCard from "@/components/userDashboard/UpComingCard";
import AppointmentDetailsCard from "@/components/userDashboard/AppointmentDetailsCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetSingleBookingQuery } from "@/redux/api/userDashbord/userDashbordApi";
export default function ServiceDetailsPage() {
  const params = useParams();
  const id = params.id as string;
 
  const { data: response, isLoading, error } = useGetSingleBookingQuery(id);
  console.log("ServiceDetailsPage response:", response);
  if (isLoading) {
    return <BookingDetailsSkeleton />;
  }
  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        Error loading booking details. Please try again.
      </div>
    );
  }
  const bookingData = response?.data;
  if (!bookingData) {
    return <div className="text-center py-10">No booking data found.</div>;
  }
  // Determine if it's a service or consultation booking
  const isService = !!bookingData.service;
 
  // Get the main entity (service or consultation)
  const mainEntity = isService ? bookingData.service : bookingData.consultation;
 
  if (!mainEntity) {
    return <div className="text-center py-10">No service or consultation data found.</div>;
  }
  // Compute values based on data
  const currentDate = new Date();
  const bookingStart = new Date(bookingData.startTime);
  const bookingEnd = new Date(bookingData.endTime);
 
  // Check if booking is tomorrow
  const tomorrow = new Date(currentDate);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow =
    bookingStart.getDate() === tomorrow.getDate() &&
    bookingStart.getMonth() === tomorrow.getMonth() &&
    bookingStart.getFullYear() === tomorrow.getFullYear();
  const timeFormatted = bookingStart.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const dateFormatted = bookingStart.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  const time = isTomorrow
    ? `Tomorrow at ${timeFormatted}`
    : `${dateFormatted} at ${timeFormatted}`;
  const durationMinutes = Math.round(
    (bookingEnd.getTime() - bookingStart.getTime()) / (1000 * 60)
  );
  const duration = `${durationMinutes} minutes`;
  // Format price with currency symbol (use bookingData.amount for accuracy)
  const formatPrice = (amount: number) => `$${amount.toLocaleString('en-US')}`;
  const formattedPrice = formatPrice(bookingData.amount);
 
  // Get title based on booking type
  const title = `${mainEntity.store?.name || 'Store'} - ${mainEntity.name}`;
 
  // Get date label
  const dateLabel = isTomorrow ? "Tomorrow" : dateFormatted;
 
  // Get image
  const image = mainEntity.profilePic || upcoming;
 
  const items = "1 item";
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl md:text-4xl font-semibold text-primary mb-2">
        {mainEntity.name}
      </h1>
      <h2 className="text-xl md:text-2xl font-semibold text-primary pt-4 mb-6">Upcoming</h2>
     
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <div className="lg:col-span-5">
          <UpComingCard
            image={typeof image === 'string' ? image : image.src}
            title={title}
            time={time}
            price={formattedPrice}
            items={items}
          />
        </div>
       
        <div className="lg:col-span-7">
          <AppointmentDetailsCard
            id={bookingData.id}
            infoImage={importantInfo.src}
            confirmationStatus={bookingData.status}
            dateLabel={dateLabel}
            duration={duration}
            serviceName={mainEntity.name}
            servicePrice={formattedPrice}
            totalPrice={formattedPrice}
            importantInfo={bookingData.notes || "No additional information provided."}
            upcomingImage={typeof image === 'string' ? image : image.src}
            upcomingTitle={title}
            upcomingTime={time}
            upcomingPrice={formattedPrice}
            upcomingItems={items}
          />
        </div>
      </div>
    </div>
  );
}
function BookingDetailsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6">
      <Skeleton className="h-10 w-1/2 mb-4" />
      <Skeleton className="h-8 w-1/3 mb-4" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <div className="lg:col-span-5">
          <div className="flex flex-col sm:flex-row">
            <Skeleton className="h-48 sm:h-32 sm:w-56 w-full" />
            <div className="p-5 flex-1">
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-4 w-32 mb-4" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
        <div className="lg:col-span-7">
          <Skeleton className="h-64 w-full mb-4 rounded-2xl" />
          <div className="p-6 md:p-10">
            <Skeleton className="h-8 w-24 mb-4" />
            <Skeleton className="h-9 w-48 mb-2" />
            <Skeleton className="h-5 w-40 mb-4" />
            <div className="flex items-center my-5 gap-3 bg-text/15 p-5 rounded-xl">
              <Skeleton className="h-6 w-6" />
              <div className="flex-1">
                <Skeleton className="h-5 w-32 mb-1" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between py-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-5 w-20" />
              </div>
              <div className="flex justify-between py-2 border-t">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-16" />
              </div>
              <div className="flex justify-between py-2 border-t border-b">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
            <Skeleton className="h-8 w-48 mt-6 mb-2" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4 mt-2" />
          </div>
        </div>
      </div>
    </div>
  );
}