"use client";
import { Button } from "@/components/ui/button";
import consultationImg from "@/assets/cousultation/consultant.png";
import { Badge } from "@/components/ui/badge";
import {
  useGetBookingDatesQuery,
  useGetBookingSlotsQuery,
  useGetConsultationDetailsQuery,
} from "@/redux/api/consultationsApi";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { LuScrollText } from "react-icons/lu";
import Link from "next/link";
import { AppointmentBookingCalendar } from "@/components/shared/AppointmentBookingCalendar";

export default function BookAppointmentPage() {
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [selectedSpecialistId, setSelectedSpecialistId] = useState("");
  const [selectedProviderId, setSelectedProviderId] = useState(""); // Add providerId state
  const [selectedDate, setSelectedDate] = useState("");

  const pathName = usePathname();
  const splitedPath = pathName.split("/");
  const servicesId = splitedPath[2];
  const specialistId = splitedPath[3];

  const { data } = useGetConsultationDetailsQuery(servicesId as string);
  const consultation = data?.data;

  // 🔥 Extract provider information from consultation data
  const providerInfo = useMemo(() => {
    if (!consultation?.availableProviders?.[0]) return null;

    console.log("🔍 === CONSULTATION PROVIDER DATA ===");
    console.log("Available Providers:", consultation.availableProviders);

    // Find the correct provider - either the one matching specialistId or the first one
    const provider =
      consultation.availableProviders.find(
        (p) => p.specialistId === specialistId || p.id === specialistId,
      ) || consultation.availableProviders[0];

    if (!provider) return null;

    console.log("✅ Selected Provider:", provider);

    // Determine the correct IDs based on provider type
    let actualSpecialistId: string;
    let actualProviderId: string;

    if (provider.isOwner || provider.type === "OWNER") {
      // For OWNER: both IDs should be the owner's user ID
      actualSpecialistId = provider.specialistId || provider.id;
      actualProviderId = provider.id;
      console.log("👤 Provider is OWNER");
    } else {
      // For SPECIALIST: specialistId should exist and be different from id
      actualSpecialistId = provider.specialistId || provider.id;
      actualProviderId = provider.id;
      console.log("👤 Provider is SPECIALIST");
    }

    const result = {
      id: provider.id,
      specialistId: actualSpecialistId,
      providerId: actualProviderId, // This is the CRITICAL providerId for API calls
      name: provider.name,
      email: provider.email,
      profilePic: provider.profilePic,
      isOwner: provider.isOwner,
      type: provider.type,
    };

    console.log("🎯 Extracted Provider Info:", result);
    console.log("🔑 IDs for API calls:");
    console.log("  - providerId (for booking APIs):", result.providerId);
    console.log("  - specialistId (user ID):", result.specialistId);

    return result;
  }, [consultation, specialistId]);

  // 🔥 Update selected IDs when providerInfo changes
  useEffect(() => {
    if (providerInfo) {
      setSelectedSpecialistId(providerInfo.specialistId);
      setSelectedProviderId(providerInfo.providerId);
      console.log("🔄 Updated IDs:", {
        specialistId: providerInfo.specialistId,
        providerId: providerInfo.providerId,
      });
    }
  }, [providerInfo]);

  const handleSpecialistSelect = (specialistId: string, serviceId: string) => {
    setSelectedSpecialistId(specialistId);
    setSelectedServiceId(serviceId);
  };

  const handleDateSelect = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    setSelectedDate(formattedDate);
  };

  const today = new Date();

  // 🔥 Use the CORRECT providerId for API calls
  const { data: bookingDateMonthly } = useGetBookingDatesQuery(
    {
      itemId: servicesId,
      providerId:
        selectedProviderId || providerInfo?.providerId || specialistId,
      year: today.getFullYear(),
      month: today.getMonth() + 1,
    },
    {
      skip: !servicesId || !selectedProviderId,
    },
  );

  // 🔥 Use the CORRECT providerId for slots API
  const { data: bookingSlots } = useGetBookingSlotsQuery(
    {
      itemId: servicesId,
      providerId:
        selectedProviderId || providerInfo?.providerId || specialistId,
      date: selectedDate,
    },
    {
      skip: !servicesId || !selectedProviderId || !selectedDate,
    },
  );

  const [isOpen, setIsOpen] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState<{
    date: Date | null;
    time: string | null;
  }>({ date: null, time: null });

  // Debug effect
  useEffect(() => {
    console.log("📊 Current State:", {
      selectedProviderId,
      selectedSpecialistId,
      providerInfo,
      selectedDate,
      servicesId,
    });

    if (selectedDateTime.date) {
      const year = selectedDateTime.date.getFullYear();
      const month = String(selectedDateTime.date.getMonth() + 1).padStart(
        2,
        "0",
      );
      const day = String(selectedDateTime.date.getDate()).padStart(2, "0");
      console.log("Manual format YYYY-MM-DD:", `${year}-${month}-${day}`);
    }
  }, [
    selectedDateTime,
    selectedProviderId,
    providerInfo,
    selectedSpecialistId,
    selectedDate,
    servicesId,
  ]);

  const handleComplete = (date: Date, time: string) => {
    if (!date || isNaN(date.getTime())) {
      console.error("ERROR: Invalid date received in handleComplete!");
      alert("Invalid date selected. Please try again.");
      return;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    console.log("Formatted date for API:", formattedDate);

    setSelectedDate(formattedDate);
    setSelectedDateTime({
      date,
      time,
    });
    setIsOpen(false);
  };

  useEffect(() => {
    console.log("selectedDate changed:", selectedDate);
  }, [selectedDate]);

  return (
    <div className="container mx-auto py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-14 py-10">
        <div>
          <div className="flex gap-3 items-center mb-5">
            {/* <Image src={icon} alt="icon" width={20} height={20} />
            <p className='text-primary'>Patient Selection</p> */}
          </div>

          <div>
            <form></form>

            <div className="-10">
              <div className="flex gap-2.5 items-center">
                <LuScrollText className="text-xl" />
                <p className="text-primary font-semibold">Consultation Fee</p>
              </div>
              <div className="flex justify-between items-center mt-3">
                <h3 className="text-text">Consultation Fee</h3>
                <p className="text-primary">${consultation?.price}</p>
              </div>
              <div className="flex justify-between items-center mt-3">
                <h3 className="text-primary font-semibold">Net amount</h3>
                <p className="text-primary">${consultation?.price}</p>
              </div>
            </div>
            <div className="flex xl:flex-row flex-col justify-between items-center mt-3">
              <div className="shadow-sm bg-white p-5 w-full rounded-lg">
                <div className="flex items-center gap-3">
                  <Image src={consultationImg} alt="" height={24} width={24} />
                  <h3 className="text-primary font-semibold">
                    Type of Consultation
                  </h3>
                </div>
                <div className="flex gap-3 mt-5">
                  <FaCalendarAlt className="text-primary text-2xl" />
                  <p className="text-text">
                    Schedule video consultation
                    <div
                      onClick={() => setIsOpen(true)}
                      className="flex items-center cursor-pointer gap-3 pt-2 text-[#0066FF] hover:underline"
                    >
                      <p>Select appointment time & date</p>
                      <FiEdit className="text-lg" />
                    </div>
                  </p>
                </div>
              </div>
            </div>

            {selectedDateTime.date && selectedDateTime.time && (
              <div
                onClick={() =>
                  handleSpecialistSelect(
                    selectedSpecialistId,
                    selectedServiceId,
                  )
                }
                className="mt-8 p-6 bg-white rounded-xl shadow-md border border-slate-200"
              >
                <p className="text-sm text-slate-600 mb-2">
                  Selected Date & Time:
                </p>
                <p className="text-xl font-semibold text-slate-900">
                  {selectedDateTime.date.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-lg text-blue-600 mt-1">
                  {selectedDateTime.time}
                </p>
              </div>
            )}

            <AppointmentBookingCalendar
              bookingDateMonthly={bookingDateMonthly}
              bookingSlots={bookingSlots}
              onDateSelect={handleDateSelect}
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              onComplete={handleComplete}
            />
          </div>
        </div>

        <div>
          <div className="flex gap-10">
            <div className="relative">
              <Image
                src={
                  providerInfo?.profilePic ||
                  consultation?.profilePic ||
                  "/default-avatar.png"
                }
                className="rounded-lg"
                alt="Description"
                width={100}
                height={132}
              />
              <div className="flex justify-center -mt-5">
                <Badge className="bg-[#28A745] hover:bg-[#28A745]/90 rounded-full">
                  {consultation?.consultationMode}
                </Badge>
              </div>
            </div>

            <div className="flex flex-col">
              <h2 className="md:text-2xl text-xl font-semibold text-primary">
                {providerInfo?.name || consultation?.name}
              </h2>
              <p className="text-text md:text-base text-sm mt-2.5">
                {consultation?.description}
              </p>
              <Badge
                className="mt-3 bg-orange-500 w-fit text-white pr-12 py-2 hover:bg-orange-600"
                style={{
                  clipPath: "polygon(0 0, 90% 0, 75% 50%, 90% 100%, 0 100%)",
                }}
              >
                {consultation?.tags}
              </Badge>

              <Button
                disabled={!selectedDateTime.date || !selectedDateTime.time}
                className={`w-fit px-6 font-medium mt-2.5 text-base 
                  ${
                    !selectedDateTime.date || !selectedDateTime.time
                      ? "bg-primary/85 cursor-not-allowed"
                      : "bg-primary hover:bg-primary/90"
                  }`}
              >
                <Link
                  href={{
                    pathname: "/consultation-payment",
                    query: {
                      consultationId: servicesId || "", // Change from serviceId to consultationId
                      specialistId: selectedSpecialistId || "",
                      providerId: selectedProviderId || "",
                      // Add isOwner field from providerInfo
                      isOwner: providerInfo?.isOwner ? "true" : "false",
                      consultationName: consultation?.name || "",
                      consultationPrice: consultation?.price?.toString() || "0",
                      selectedDate:
                        selectedDateTime.date &&
                        !isNaN(selectedDateTime.date.getTime())
                          ? selectedDate
                          : "",
                      selectedTime: selectedDateTime.time || "",
                      profilePic:
                        providerInfo?.profilePic ||
                        consultation?.profilePic ||
                        "",
                      tags: consultation?.tags || "",
                      providerName: providerInfo?.name || "",
                    },
                  }}
                  onClick={(e) => {
                    if (
                      !selectedDateTime.date ||
                      isNaN(selectedDateTime.date.getTime()) ||
                      !selectedDateTime.time ||
                      !selectedProviderId
                    ) {
                      e.preventDefault();
                      console.error("Missing data:", {
                        date: selectedDateTime.date,
                        time: selectedDateTime.time,
                        providerId: selectedProviderId,
                      });
                      alert("Please select a valid date and time.");
                      return;
                    }

                  }}
                >
                  Book Now
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
