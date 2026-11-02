// types/productReviews.type.ts

export interface ProductReviewsResponse {
  data: {
    reviews: Review[];
    pagination: Pagination;
  };
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user: User;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePic: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}


export interface ConsultationDetailsResponse {
  data: Consultation;
}

export interface Consultation {
  id: string;
  storeId: string;
  categoryId: string;
  subCategoryId: string;
  name: string;
  profilePic: string ;
  price: number;
  description: string;
  duration: string;
  location: string;
  slotDuration: number;
  startDate: string; // ISO string
  endDate: string;   // ISO string
  startTime: string; // ISO string
  endTime: string;   // ISO string
  tags: string[];
  type: "IN_PERSON" | string;
  averageRating: number;
  totalReviews: number;
  totalSlot: number;
  status: "AVAILABLE" | string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  store: Store;
  category: Category;
  subCategory: SubCategory;
  specialists: Specialist[];
  bookings: any[]; 
  consultationReview: any[]; 
}

export interface Store {
  id: string;
  userId: string;
  name: string;
  location: string;
  tags: string[];
  description: string;
  logo: string;
  banner: string;
  phone: string;
  email: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  shopStatus: "APPROVED" | string;
  status: "OFFLINE" | string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface Category {
  id: string;
  name: string;
  description: string;
  type: "PRODUCT" | string;
  comment: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface SubCategory {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  slug: string;
  image: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface SpecialistUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePic: string;
}

export interface Specialist {
  id: string;
  storeId: string;
  userId: string;
  serviceTypeId: string;
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  gender: "MALE" | "FEMALE" | string;
  bio: string;
  phoneNum: string;
  available: boolean;
  rating: string;
  experience: string;
  status: "Active" | string;
  specialistTime: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  averageRating: number;
  totalReviews: number;
  user: SpecialistUser;
}

export interface ConsultationDetailsResponse {
  data: Consultation;
}

export interface Consultation {
  id: string;
  storeId: string;
  categoryId: string;
  subCategoryId: string;
  name: string;
  profilePic: string ;
  price: number;
  description: string;
  duration: string;
  location: string;
  slotDuration: number;
  startDate: string; // ISO string
  endDate: string;   // ISO string
  startTime: string; // ISO string
  endTime: string;   // ISO string
  tags: string[];
  type: "IN_PERSON" | string;
  averageRating: number;
  totalReviews: number;
  totalSlot: number;
  status: "AVAILABLE" | string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  store: Store;
  category: Category;
  subCategory: SubCategory;
  specialists: Specialist[];
  bookings: any[]; 
  consultationReview: any[]; 
}

export interface Store {
  id: string;
  userId: string;
  name: string;
  location: string;
  tags: string[];
  description: string;
  logo: string;
  banner: string;
  phone: string;
  email: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  shopStatus: "APPROVED" | string;
  status: "OFFLINE" | string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface Category {
  id: string;
  name: string;
  description: string;
  type: "PRODUCT" | string;
  comment: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface SubCategory {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  slug: string;
  image: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface SpecialistUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePic: string;
}

export interface Specialist {
  id: string;
  storeId: string;
  userId: string;
  serviceTypeId: string;
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  gender: "MALE" | "FEMALE" | string;
  bio: string;
  phoneNum: string;
  available: boolean;
  rating: string;
  experience: string;
  status: "Active" | string;
  specialistTime: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  averageRating: number;
  totalReviews: number;
  user: SpecialistUser;
}
export interface StoreInfo {
  id: string;
  userId: string;
  name: string;
  location: string;
  tags: string[];
  description: string;
  logo: string;
  banner: string;
  phone: string;
  email: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  shopStatus: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryInfo {
  id: string;
  name: string;
  description: string;
  type: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubCategoryInfo {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  slug: string;
  image: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface SpecialistInfo {
  id: string;
  storeId: string;
  userId: string;
  serviceTypeId: string;
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  gender: string;
  bio: string;
  phoneNum: string;
  available: boolean;
  rating: string;
  experience: string;
  status: string;
  specialistTime: string;
  createdAt: string;
  updatedAt: string;
  averageRating: number;
  totalReviews: number;
}


// 📌 Single consultation item
export interface Consultation {
  id: string;
  storeId: string;
  categoryId: string;
  subCategoryId: string;
  name: string;
  profilePic: string;
  price: number;
  description: string;
  duration: string;
  location: string;
  slotDuration: number;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  tags: string[];
  type: "AUDIO" | "VIDEO" | "TEXT" | string;
  averageRating: number;
  totalReviews: number;
  totalSlot: number;
  status: string;
  createdAt: string;
  updatedAt: string;

  store: StoreInfo;
  category: CategoryInfo;
  subCategory: SubCategoryInfo;
  specialists: Specialist[];
}

// 📌 Root Response (THIS YOU EXPORT FOR API RETURN)
export interface ConsultationResponse {
  data: Consultation[];
}


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
export interface SpecialistUser { [key: string]: any }

// export interface SpecialistUser {
//   id: string;
//   firstName: string;
//   lastName: string;
//   profilePic: string;
//   email?: string;
//   phone?: string;
// }

// export interface Specialist {
//   id: string;
//   title: string;
//   user: SpecialistUser;
//   experience?: number;
//   rating?: number;
//   description?: string;
// }

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


export interface ConsultationSlotResponse {
  data: {
    consultation: {
      id: string
      name: string
      price: number
      slotDuration: number
      type: string
    }
    date: string
    totalSlots: number
    availableSlots: AvailableSlot[]
    bookedSlots: number
  }
}

export interface AvailableSlot {
  startTime: string
  endTime: string
  availableSpecialists: Specialist[]
  totalAvailable: number
  isAvailable: boolean
}

export interface Specialist {
  id: string
  firstName: string
  lastName: string
  fullName: string
}
