// types/apiResponse.ts

// import { StaticImageData } from "next/image";

/* eslint-disable @typescript-eslint/no-explicit-any */
// export interface ConsultationDetailsResponse {
//   data: Consultation;
// }

// export interface Consultation {
//   id: string;
//   storeId: string;
//   categoryId: string;
//   subCategoryId: string;
//   name: string;
//   profilePic: string ;
//   price: number;
//   description: string;
//   duration: string;
//   location: string;
//   slotDuration: number;
//   startDate: string; // ISO string
//   endDate: string;   // ISO string
//   startTime: string; // ISO string
//   endTime: string;   // ISO string
//   tags: string[];
//   type: "IN_PERSON" | string;
//   averageRating: number;
//   totalReviews: number;
//   totalSlot: number;
//   status: "AVAILABLE" | string;
//   createdAt: string; // ISO string
//   updatedAt: string; // ISO string
//   store: Store;
//   category: Category;
//   subCategory: SubCategory;
//   specialists: Specialist[];
//   bookings: any[]; 
//   consultationReview: any[]; 
// }

// export interface Store {
//   id: string;
//   userId: string;
//   name: string;
//   location: string;
//   tags: string[];
//   description: string;
//   logo: string;
//   banner: string;
//   phone: string;
//   email: string;
//   facebookUrl: string;
//   instagramUrl: string;
//   youtubeUrl: string;
//   shopStatus: "APPROVED" | string;
//   status: "OFFLINE" | string;
//   createdAt: string; // ISO string
//   updatedAt: string; // ISO string
// }

// export interface Category {
//   id: string;
//   name: string;
//   description: string;
//   type: "PRODUCT" | string;
//   comment: string;
//   createdAt: string; // ISO string
//   updatedAt: string; // ISO string
// }

// export interface SubCategory {
//   id: string;
//   name: string;
//   description: string;
//   categoryId: string;
//   slug: string;
//   image: string;
//   isActive: boolean;
//   sortOrder: number;
//   createdAt: string; // ISO string
//   updatedAt: string; // ISO string
// }

// export interface SpecialistUser {
//   id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   profilePic: string;
// }

// export interface Specialist {
//   id: string;
//   storeId: string;
//   userId: string;
//   serviceTypeId: string;
//   firstName: string;
//   lastName: string;
//   title: string;
//   email: string;
//   gender: "MALE" | "FEMALE" | string;
//   bio: string;
//   phoneNum: string;
//   available: boolean;
//   rating: string;
//   experience: string;
//   status: "Active" | string;
//   specialistTime: string;
//   createdAt: string; // ISO string
//   updatedAt: string; // ISO string
//   averageRating: number;
//   totalReviews: number;
//   user: SpecialistUser;
// }

// export interface Booking {
//   // define based on actual booking object, empty here
// }

// export interface ConsultationReview {
//   // define based on actual review object, empty here
// }

export interface ConsultationDetailsResponse {
  data: Consultation;
}

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
  providerType: string;
  type: string;
  averageRating: number;
  totalReviews: number;
  totalSlot: number;
  status: string;
  currentStatus: string;
  consultationMode: string;
  createdAt: string;
  updatedAt: string;

  store: Store;
  category: Category;
  subCategory: SubCategory;
  specialists: Specialist[];
  bookings: any[];
  consultationReview: any[];
  availableProviders: AvailableProvider[];
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
  shopStatus: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  stripeAccountId: string;
  stripeAccountStatus: string;
  user: StoreUser;
}

export interface StoreUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePic: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  type: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
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
  createdAt: string;
  updatedAt: string;
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
  user: SpecialistUser;
}

export interface SpecialistUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePic: string;
}

export interface AvailableProvider {
  id: string;
  specialistId: string;
  name: string;
  email: string;
  profilePic: string;
  type: "SPECIALIST" | string;
  isOwner: boolean;
  title: string;
  totalExperience: string;
  rating: number;
  totalReviews: number;
  reviews: Review[];
}

export interface Review {
  id?: string;
  userId?: string;
  rating?: number;
  comment?: string;
  createdAt?: string;
}


