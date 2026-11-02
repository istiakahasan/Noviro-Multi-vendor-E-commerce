// Specialist
export interface AvailableSpecialist {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
}

// Slot
export interface AvailableSlot {
  startTime: string; // ISO date string
  endTime: string;   // ISO date string
  availableSpecialists: AvailableSpecialist[];
  totalAvailable: number;
  isAvailable: boolean;
}

// Service
export interface ServiceInfo {
  id: string;
  name: string;
  price: number;
  slotDuration: number; // in minutes
}

// Main response data
export interface ServiceAvailabilityData {
  service: ServiceInfo;
  date: string; // ISO date string
  totalSlots: number;
  availableSlots: AvailableSlot[];
  bookedSlots: number;
}

// API response wrapper
export interface ServiceSlotResponse {
  data: ServiceAvailabilityData;
}
