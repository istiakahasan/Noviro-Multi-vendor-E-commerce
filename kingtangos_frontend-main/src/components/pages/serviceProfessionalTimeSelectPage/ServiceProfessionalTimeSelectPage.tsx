"use client"
import { useState, useMemo, useEffect } from "react"
import ProfessionalSelectCalendar from "@/components/shared/ProfessionalSelectCalendar"
import TimeSelector from "@/components/shared/TimeSelector"
import { useParams, usePathname } from "next/navigation"
import { useGetServiceBookingSlotsQuery, useGetSingleServiceByIdQuery } from "@/redux/api/servicesApi"
import { useGetBookingDatesQuery } from "@/redux/api/consultationsApi"
import { BookNowCard } from "@/components/shared/BookNowCard"

export default function ServiceProfessionalTimeSelectPage() {
    const params = useParams();
    const serviceId = params.id as string;

    const { data: serviceResponse } = useGetSingleServiceByIdQuery(serviceId);
    const service = serviceResponse?.data;

    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [currentCalendarMonth, setCurrentCalendarMonth] = useState<Date>(new Date());

    const pathName = usePathname();
    const splitedPath = pathName.split("/")
    const servicesId = splitedPath[2]
    const specialistId = splitedPath[4]

    const professionalId = specialistId;

    // 🔥 DEBUG: Log the entire provider structure
    useEffect(() => {
        if (service?.availableProviders) {
            console.log("🔍 === AVAILABLE PROVIDERS ===");
            console.log(JSON.stringify(service.availableProviders, null, 2));
        }
    }, [service]);

    // Get selected professional from availableProviders
    const selectedProfessional = useMemo(() => {
        if (!service?.availableProviders || !professionalId) return null;
        
        console.log("🔍 Looking for professional with ID:", professionalId);
        
        // Find the professional by ID
        const professional = service.availableProviders.find(
            (provider) => provider.id === professionalId || provider.specialistId === professionalId
        );
        
        if (!professional) {
            console.error("❌ Professional not found! Available providers:", 
                service.availableProviders.map(p => ({ 
                    id: p.id, 
                    specialistId: p.specialistId,
                    type: p.type,
                    name: p.name 
                }))
            );
            return null;
        }
        

        
        // 🔥 CRITICAL: Determine the correct IDs based on provider type
        let actualSpecialistId: string;
        let actualProviderId: string;
        
        if (professional.isOwner || professional.type === "OWNER") {
            // For OWNER: both IDs should be the owner's user ID
            // The specialistId might be undefined for owners, so use the id
            actualSpecialistId = professional.specialistId || professional.id;
            actualProviderId = professional.id; // This is the store owner's ID
            
 
        } else {
            // For SPECIALIST: specialistId should exist and be different from id
            actualSpecialistId = professional.specialistId || professional.id;
            actualProviderId = professional.id; // This might be the specialist's provider record ID
            

        }
        
        const result = {
            id: professional.id,
            specialistId: actualSpecialistId,
            name: professional.name,
            providerId: actualProviderId,
            isOwner: professional.isOwner,
        };
        
        // Validate UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(result.specialistId)) {
            console.error("❌ INVALID specialistId format:", result.specialistId);
        }
        if (!uuidRegex.test(result.providerId)) {
            console.error("❌ INVALID providerId format:", result.providerId);
        }
        
        return result;
    }, [service?.availableProviders, professionalId]);

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
    };

    const handleTimeSelect = (time: string) => {
        setSelectedTime(time);
    };

    const { data: bookingDateMonthly } = useGetBookingDatesQuery(
        {
            itemId: servicesId,
            providerId: specialistId,
            year: currentCalendarMonth.getFullYear(),
            month: currentCalendarMonth.getMonth() + 1,
        },
        {
            skip: !servicesId || !specialistId,
        }
    );

    const { data: serviceBookingSlots } = useGetServiceBookingSlotsQuery({
        serviceId: servicesId,
        specialistId: specialistId,
        date: selectedDate ? selectedDate.toISOString().split('T')[0] : "",
    }, {
        skip: !servicesId || !specialistId || !selectedDate,
    })

    const [isOpen, setIsOpen] = useState(false)

    const handleComplete = (date: Date, time: string) => {
        setSelectedDate(date);
        setSelectedTime(time);
        setIsOpen(false);
    }

    return (
        <div className='py-16  mx-auto lg:px-0 px-2 md:container'>
            <h3 className='xl:text-4xl lg:text-3xl md:text-2xl text-2xl font-semibold text-primary'>Select Time</h3>

            <div className="flex lg:flex-row flex-col justify-center gap-36">
                <div className="flex md:flex-row flex-col justify-center lg:gap-10 md:gap-8 items-center">
                    <ProfessionalSelectCalendar
                        bookingDateMonthly={bookingDateMonthly}
                        isOpen={isOpen}
                        onClose={() => setIsOpen(false)}
                        onComplete={handleComplete}
                        onDateSelect={handleDateSelect}
                        currentMonth={currentCalendarMonth}
                        onMonthChange={setCurrentCalendarMonth}
                    />

                    <TimeSelector
                        serviceBookingSlots={serviceBookingSlots}
                        onTimeSelect={handleTimeSelect}
                    />
                </div>

                <BookNowCard
                    service={serviceResponse}
                    bookingDateMonthly={bookingDateMonthly}
                    serviceBookingSlots={serviceBookingSlots}
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    selectedProfessional={selectedProfessional}
                />
            </div>
        </div>
    )
}