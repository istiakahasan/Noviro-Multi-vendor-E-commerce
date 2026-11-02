"use client";

import React from "react";
import upcoming from "@/assets/user-dashboard/upcoming-service.png";
import importantInfo from "@/assets/user-dashboard/important-info.png";
import UpComingCard from "@/components/userDashboard/UpComingCard";
import AppointmentDetailsCard from "@/components/userDashboard/AppointmentDetailsCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetSingleBookingQuery } from "@/redux/api/userDashbord/userDashbordApi";


export default function ServiceDetailsPage({
  serviceId,
}: {
  serviceId: string;
}) {
  const id = serviceId;
  const { data: response, isLoading } = useGetSingleBookingQuery(id as string);

  console.log("ServiceDetailsPage response:", response);

  if (isLoading) {
    return (
      <div>
        <Skeleton className="h-10 w-1/2 mb-4" />
        <Skeleton className="h-8 w-1/3 mb-4" />
        <div className="grid grid-cols-12 gap-12">
          <div className="col-span-5">
            <div className="flex">
              <Skeleton className="h-32 w-56" />
              <div className="p-5">
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-4 w-32 mb-4" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
          <div className="col-span-7">
            <Skeleton className="h-[349px] w-full mb-4 rounded-2xl" />
            <div className="p-10">
              <Skeleton className="h-8 w-24 mb-4" />
              <Skeleton className="h-9 w-48 mb-2" />
              <Skeleton className="h-5 w-40 mb-4" />
              <div className="flex items-center my-5 gap-3 bg-text/15 p-5 rounded-xl">
                <Skeleton className="h-6 w-6" />
                <div>
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
              <div className="flex justify-between border-b pb-4">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-5 w-20" />
              </div>
              <div className="flex justify-between border-t pt-4">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-8 w-32 mt-6 mb-2" />
              <Skeleton className="h-5 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const bookingData = response?.data;

  if (!bookingData) {
    return <div>No booking data found.</div>;
  }

  // Compute values based on data
  const currentDate = new Date("2026-02-04T00:00:00.000Z");
  const bookingStart = new Date(bookingData.startTime);
  const bookingEnd = new Date(bookingData.endTime);
  const isTomorrow =
    bookingStart.getDate() === currentDate.getDate() + 1 &&
    bookingStart.getMonth() === currentDate.getMonth() &&
    bookingStart.getFullYear() === currentDate.getFullYear();

  const timeFormatted = bookingStart.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const time = isTomorrow
    ? `Tomorrow at ${timeFormatted}`
    : `${bookingStart.toLocaleDateString()} at ${timeFormatted}`;

  const durationMinutes =
    (bookingEnd.getTime() - bookingStart.getTime()) / (1000 * 60);
  const duration = `${durationMinutes} minutes duration`;

  const price = `${bookingData.amount}`;
  const title = `${bookingData.service.store.name} - ${bookingData.service.name}`;
  const dateLabel = isTomorrow ? "Tomorrow" : bookingStart.toLocaleDateString();
  const servicePrice = price;
  const totalPrice = price;
  const image = bookingData.service.profilePic || upcoming.src; // Fallback to hardcoded if no pic
  const items = "1 item";

  return (
    <div>
      <h1 className="text-4xl font-semibold text-primary">
        {bookingData.service.name}
      </h1>
      <h2 className="text-2xl font-semibold text-primary pt-4">Upcoming</h2>
      <div className="grid grid-cols-12 gap-12">
        <div className="col-span-5">
          <UpComingCard
            image={image}
            title={title}
            time={time}
            price={price}
            items={items}
          />
        </div>
        <div className="col-span-7 rounded-2xl">
          <AppointmentDetailsCard
            id={id}
            infoImage={importantInfo.src}
            confirmationStatus={bookingData.status}
            dateLabel={dateLabel}
            duration={duration}
            serviceName={bookingData.service.name}
            servicePrice={servicePrice}
            totalPrice={totalPrice}
            importantInfo={bookingData.notes}
            upcomingImage={image}
            upcomingTitle={title}
            upcomingTime={time}
            upcomingPrice={price}
            upcomingItems={items}
          />
        </div>
      </div>
    </div>
  );
}
