// export interface ConsultationBookingDateResponse {
//   data: ConsultationBookingData |undefined;
//   available: string[];
// }

// export interface ConsultationBookingData {
//   service: ConsultationService;
//   specialistId: string;
//   month: number;
//   year: number;
//   availability: ConsultationAvailability[];
// }

// export interface ConsultationService {
//   id: string;
//   name: string;
//   type: "CONSULTATION" | string;
// }

// export interface ConsultationAvailability {
//   date: string;        // "2025-11-01"
//   day: number;         // 1-31
//   dayName: string;     // "saturday"
//   available: boolean;  // true / false
//   bookings: number;
//   slots: number;
// }


// types/consultation.ts

// Individual availability day interface
export interface AvailabilityDay {
  date: string;          // Format: "2026-01-10"
  day: number;           // Day of month: 10
  dayName: string;       // "saturday"
  available: boolean;    // true/false
  bookings: number;      // 0
  slots: number;         // 8
}

// Service information interface
export interface ServiceInfo {
  id: string;            // "ca06b781-9d87-4e70-8c23-2ffaaf259340"
  name: string;          // "Premium Hair Styling & Cut"
  type: string;          // "SERVICE"
}

// Main monthly availability response interface
export interface ConsultationBookingDateResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    service: ServiceInfo;
    specialistId: string;   // "22f719f5-53cc-403e-a22e-481a5a18277e"
    month: number;          // 1 (January)
    year: number;          // 2026
    availability: AvailabilityDay[];
  };
  errorMessages?: Array<{
    path: string;
    message: string;
  }>;
  stack?: string;
}

// Response structure for booking slots (if needed)
export interface BookingSlot {
  slotId: string;
  startTime: string;     // Format: "10:00:00"
  endTime: string;       // Format: "10:30:00"
  isAvailable: boolean;
}

export interface BookingSlotsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    date: string;        // "2026-01-10"
    slots: BookingSlot[];
    totalAvailableSlots: number;
    totalBookedSlots: number;
  };
  errorMessages?: Array<{
    path: string;
    message: string;
  }>;
  stack?: string;
}

// Specialist/Professional interface (for the dropdown)
export interface SpecialistUser {
  id: string;
  firstName: string;
  lastName: string;
  profilePic: string;
  email?: string;
  phone?: string;
}

export interface Specialist {
  id: string;
  title: string;
  user: SpecialistUser;
  experience?: number;
  rating?: number;
  description?: string;
}

export interface ServiceWithSpecialists {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  type: string;
  specialists: Specialist[];
}

export interface ServiceResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ServiceWithSpecialists;
  errorMessages?: Array<{
    path: string;
    message: string;
  }>;
  stack?: string;
}

// RTK Query parameter types
export interface GetBookingDatesParams {
  serviceId: string;
  specialistId: string;
}

export interface GetBookingSlotsParams {
  consultationId: string;
  specialistId: string;
  date: string;  // Format: "2026-01-10"
}

// Utility types for the calendar component
export interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isAvailable: boolean;
  availabilityData?: AvailabilityDay;
}

// Props for ProfessionalSelectCalendar component
export interface ProfessionalSelectCalendarProps {
  bookingDateMonthly?: {
    service: ServiceInfo;
    specialistId: string;
    month: number;
    year: number;
    availability: AvailabilityDay[];
  };
  isOpen: boolean;
  onClose: () => void;
  onComplete: (date: Date, time: string) => void;
  onDateSelect: (date: Date) => void;
  selectedDate?: Date | null;
}
