"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Calendar, Clock, User } from "lucide-react"
import Image from "next/image"
import { ServiceDetailsResponse } from "@/types/serviceDetails.type";
import { ServiceSlotResponse } from "@/types/serviceSlotResponse.type";
import { ConsultationBookingDateResponse } from "@/types/monthlyDateBooking.type";
import { BookingConfirmationAlert } from "../common/BookingConfirmationAlert";
import { useState } from "react";
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { MdOutlineBusinessCenter } from "react-icons/md"


type ServiceProps = {
  service?: ServiceDetailsResponse;
  bookingDateMonthly?: ConsultationBookingDateResponse
  serviceBookingSlots?: ServiceSlotResponse;
  selectedDate?: Date | null;
  selectedTime?: string | null;
  selectedProfessional?: {
    id: string;
    specialistId?: string;
    name: string;
    providerId?: string;
    isOwner?: boolean;
  } | null;
  onBookingConfirmed?: (bookingDetails: {
    serviceName?: string;
    price?: number;
    date: Date;
    time: string;
    specialistName: string;
    specialistId: string;
  }) => Promise<void> | void;
};

export function BookNowCard({
  service,
  selectedDate,
  selectedTime,
  selectedProfessional: selectedSpecialist,
}: ServiceProps) {

  const router = useRouter();
  const serviceInfo = service?.data;

  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Format date for display
  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    : "Not selected";

  // Format time for display
  const formatTimeForDisplay = (timeString: string): string => {
    try {
      // If it's an ISO string
      if (timeString.includes('T') && timeString.includes('Z')) {
        const date = new Date(timeString);
        return date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      }
      // If it's already in readable format, return as-is
      return timeString;
    } catch {
      return timeString;
    }
  };

  const displayTime = selectedTime ? formatTimeForDisplay(selectedTime) : "Not selected";

  // Format date for URL (YYYY-MM-DD)
  const formatDateForURL = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleConfirmBooking = async () => {
    setIsLoading(true);

    try {
      if (!selectedDate || !selectedTime || !selectedSpecialist) {
        alert("Please select a date, time, and specialist before booking.");
        return;
      }

      console.log("🎯 Selected Specialist Object:", selectedSpecialist);
      
      // Extract the correct IDs from the specialist object
      // The specialistId should be the user ID of the specialist
      const specialistId = selectedSpecialist.specialistId || selectedSpecialist.id;
      
      // The providerId should be the provider/owner ID
      const providerId = selectedSpecialist.providerId || selectedSpecialist.id;
      
      // Check if this specialist is the owner
      const isOwner = selectedSpecialist.isOwner || false;

      console.log("📦 Extracted IDs:", {
        specialistId,
        providerId,
        isOwner,
        originalObject: selectedSpecialist
      });

      // ✅ Create URL with query parameters including all required fields
      const queryParams = new URLSearchParams({
        serviceId: serviceInfo?.id || "",
        specialistId: specialistId,
        providerId: providerId,
        isOwner: isOwner.toString(),
        consultationName: serviceInfo?.name || "Service",
        consultationPrice: serviceInfo?.price?.toString() || "0",
        selectedDate: formatDateForURL(selectedDate),
        selectedTime: selectedTime, // Keep as ISO string
        profilePic: serviceInfo?.profilePic || "/placeholder.svg",
        tags: serviceInfo?.tags?.join(", ") || "Service",
        slotDuration: serviceInfo?.slotDuration?.toString() || "30",
      }).toString();

      console.log("🚀 Navigating to payment with params:", {
        serviceId: serviceInfo?.id,
        specialistId,
        providerId,
        isOwner,
        selectedDate: formatDateForURL(selectedDate),
        selectedTime,
      });
     
      router.push(`/service-payment?${queryParams}`);

    } catch (error) {
      console.error("❌ Booking failed:", error);
    } finally {
      setIsLoading(false);
      setIsAlertOpen(false);
    }
  };

  const handleBookNow = () => {
    // FIRST: Check if user is authenticated
    if (!isAuthenticated) {
      const pendingBooking = {
        selectedDate: selectedDate?.toISOString(),
        selectedTime,
        selectedSpecialist,
        serviceId: serviceInfo?.id,
      };
      sessionStorage.setItem('pendingBooking', JSON.stringify(pendingBooking));

      router.push("/login");
      return;
    }

    // SECOND: Check for required booking details
    if (!selectedDate || !selectedTime || !selectedSpecialist) {
      alert("Please select a date, time, and specialist before booking.");
      return;
    }
    
    console.log("🔍 About to open alert with specialist:", selectedSpecialist);
    setIsAlertOpen(true);
  }

  // Get duration from service
  const duration = serviceInfo?.slotDuration ? `${serviceInfo.slotDuration} minutes` : "Not specified";

  return (
    <>
      <Card className="w-full lg:max-w-md md:max-w-3xl mx-auto bg-white border border-gray-200 shadow-sm">
        <CardContent className="p-6 flex flex-col h-full">
          {/* Header Section */}
          <div className="flex gap-4 mb-6">
            {/* Image */}
            <div className="flex-shrink-0">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={serviceInfo?.profilePic || "/placeholder.svg"}
                  alt={serviceInfo?.name || "Service"}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Title and Rating */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm md:text-base truncate">
                {serviceInfo?.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-semibold text-gray-900 text-sm">
                  {(serviceInfo?.averageRating) || "(0)"}
                </span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`${i < Math.floor(serviceInfo?.averageRating || 0)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                        }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Date and Time Section */}
          <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <MdOutlineBusinessCenter size={18} className="text-gray-600 flex-shrink-0" />
              <div className="flex-1">
                <span className="text-xs text-gray-500">Service Mode</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-medium text-gray-900">
                    {serviceInfo?.serviceMode || "Not found"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User size={18} className="text-gray-600 flex-shrink-0" />
              <div className="flex-1">
                <span className="text-xs text-gray-500">Professional</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-medium text-gray-900">
                    {selectedSpecialist?.name || "Not selected"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar size={18} className="text-gray-600 flex-shrink-0" />
              <div className="flex-1">
                <span className="text-xs text-gray-500">Date</span>
                <p className="text-sm font-medium text-gray-900">
                  {formattedDate}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock size={18} className="text-gray-600 flex-shrink-0" />
              <div className="flex-1">
                <span className="text-xs text-gray-500">Time</span>
                <p className="text-sm font-medium text-gray-900">
                  {displayTime}
                </p>
                {duration !== "Not specified" && (
                  <p className="text-xs text-gray-500 mt-1">Duration: {duration}</p>
                )}
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="space-y-4 mb-6">
            <div className="flex justify-between pb-4 border-b items-center">
              <span className="text-sm font-medium text-gray-900">
                {serviceInfo?.name}
              </span>
              <span className="text-sm font-semibold text-gray-900">
                ${serviceInfo?.price?.toFixed(2) || "0.00"}
              </span>
            </div>

            <div className="flex justify-between pt-2 pb-4 items-center">
              <span className="text-sm font-semibold text-gray-900">Total</span>
              <span className="text-sm font-semibold text-gray-900">
                ${serviceInfo?.price?.toFixed(2) || "0.00"}
              </span>
            </div>
          </div>

          {/* Book Now Button */}
          <Button
            onClick={handleBookNow}
            className="w-full bg-primary hover:bg-primary/85 text-white font-medium py-5 rounded-lg transition-colors"
            disabled={!selectedDate || !selectedTime || !selectedSpecialist}
          >
            {selectedDate && selectedTime && selectedSpecialist
              ? "Book Now"
              : "Select Date, Time & Specialist"}
          </Button>

          {/* Validation message */}
          {(!selectedDate || !selectedTime || !selectedSpecialist) && (
            <p className="text-xs text-amber-600 mt-2 text-center">
              Please select all required details to proceed with booking.
            </p>
          )}
        </CardContent>
      </Card>

      <BookingConfirmationAlert
        open={isAlertOpen}
        onOpenChange={setIsAlertOpen}
        title="Are you sure you want to confirm this booking?"
        description={`Booking ${serviceInfo?.name} with ${selectedSpecialist?.name} on ${formattedDate} at ${displayTime}`}
        confirmText="Confirm Booking"
        cancelText="Cancel"
        onConfirm={handleConfirmBooking}
        isLoading={isLoading}
        isDangerous={false}
      />
    </>
  )
}