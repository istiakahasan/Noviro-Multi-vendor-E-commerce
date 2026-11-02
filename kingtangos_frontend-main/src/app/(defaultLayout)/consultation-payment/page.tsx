"use client";

import { ConsultationPayForm } from "@/components/pages/Consultation/ConsultationPayForm";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface BookingData {
  consultationId: string;
  specialistId: string;
  providerId: string;
  isOwner: boolean;
  consultationName: string;
  consultationPrice: number;
  selectedDate: string; // YYYY-MM-DD format
  selectedTime: string; // HH:MM AM/PM format (e.g., "10:00 AM")
  profilePic: string;
  tags: string;
}

const Page = () => {
  const searchParams = useSearchParams();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);

  useEffect(() => {
    if (searchParams) {
      const data: BookingData = {
        consultationId: searchParams.get("consultationId") || "",
        specialistId: searchParams.get("specialistId") || "",
        providerId: searchParams.get("providerId") || "",
        isOwner: searchParams.get("isOwner") === "true",
        consultationName: searchParams.get("consultationName") || "",
        consultationPrice: parseFloat(
          searchParams.get("consultationPrice") || "0"
        ),
        selectedDate: searchParams.get("selectedDate") || "",
        selectedTime: searchParams.get("selectedTime") || "",
        profilePic: searchParams.get("profilePic") || "",
        tags: searchParams.get("tags") || "",
      };

      console.log("📋 Booking data received in payment page:", data);
      console.log("📅 Selected date:", data.selectedDate);
      console.log("⏰ Selected time:", data.selectedTime);

      setBookingData(data);
    }
  }, [searchParams]);

  if (!bookingData) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-primary">
            Loading booking details...
          </h2>
          <p className="text-text mt-2">
            Please wait while we load your appointment details.
          </p>
        </div>
      </div>
    );
  }

  const formatBookingDate = (dateString: string): string => {
    try {
      const [year, month, day] = dateString.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-4xl mx-auto">
        {/* Booking Summary Card */}
        <div className="mb-8 p-6 bg-white rounded-xl shadow-md border border-slate-200">
          <h2 className="text-2xl font-bold text-primary mb-4">
            Appointment Summary
          </h2>

          <div className="flex items-start gap-6">
            {bookingData.profilePic && (
              <div className="relative">
                <Image
                  src={bookingData.profilePic}
                  alt={bookingData.consultationName}
                  width={500}
                  height={500}
                  className="rounded-lg w-24 h-24 object-cover"
                />
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Online
                  </span>
                </div>
              </div>
            )}

            <div className="flex-1">
              <h3 className="text-xl font-semibold text-primary">
                {bookingData.consultationName}
              </h3>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600">Appointment Date:</p>
                  {/* <p className="font-medium text-slate-900">
                    {(() => {
                      try {
                        const [year, month, day] = bookingData.selectedDate.split('-').map(Number);
                        const date = new Date(year, month - 1, day);
                        return date.toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        });
                      } catch (error) {
                        return bookingData.selectedDate;
                      }
                    })()}
                  </p> */}
                  <p className="font-medium text-slate-900">
                    {formatBookingDate(bookingData.selectedDate)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-600">Appointment Time:</p>
                  <p className="font-medium text-blue-600">
                    {bookingData.selectedTime}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-600">Consultation Fee:</p>
                  <p className="font-medium text-primary">
                    ${bookingData.consultationPrice.toFixed(2)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-600">Service Type:</p>
                  <p className="font-medium text-orange-600">
                    {bookingData.tags}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ConsultationPayForm bookingData={bookingData} />
      </div>
    </div>
  );
};

export default Page;
