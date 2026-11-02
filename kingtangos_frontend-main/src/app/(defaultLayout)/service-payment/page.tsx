// app/service-payment/page.tsx
"use client";

import ServicePayForm from "@/components/pages/service/ServicePayForm";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
// import { ArrowLeft } from "lucide-react";
// import Link from "next/link";

interface BookingData {
  serviceId: string;
  specialistId: string;
  providerId: string;
  isOwner: boolean;
  consultationName: string;
  consultationPrice: number;
  selectedDate: string;
  selectedTime: string;
  profilePic: string;
  tags: string;
  slotDuration: number;
}

const Page = () => {
  const searchParams = useSearchParams();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);

  useEffect(() => {
    if (searchParams) {
      const data: BookingData = {
        serviceId: searchParams.get("serviceId") || "",
        specialistId: searchParams.get("specialistId") || "",
        providerId: searchParams.get("providerId") || "",
        isOwner: searchParams.get("isOwner") === "true",
        consultationName: searchParams.get("consultationName") || "",
        consultationPrice: parseFloat(searchParams.get("consultationPrice") || "0"),
        selectedDate: searchParams.get("selectedDate") || "",
        selectedTime: searchParams.get("selectedTime") || "",
        profilePic: searchParams.get("profilePic") || "",
        tags: searchParams.get("tags") || "",
        slotDuration: parseInt(searchParams.get("slotDuration") || "30"),
      };

      console.log("📋 Booking data received from URL:", data);
      setBookingData(data);
    }
  }, [searchParams]);

  if (!bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-primary">
            Loading booking details...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mt-8">
          {/* <Link
            href="/services"
            className="inline-flex items-center gap-2 font-bold text-slate-600 hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Services
          </Link> */}
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="lg:text-3xl text-xl font-bold text-primary mb-2">
                Complete Your Booking
              </h1>
              <p className="text-slate-600 lg:text-base text-sm">
                Review your appointment details and proceed to payment
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <ServicePayForm bookingData={bookingData} />
      </div>
    </div>
  );
};

export default Page;