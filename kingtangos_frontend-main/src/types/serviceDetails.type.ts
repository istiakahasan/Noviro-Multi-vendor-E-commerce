
// export interface ServiceDetailsResponse {
//   data: Service;
// }

// /* ===================== MAIN SERVICE ===================== */

// export interface Service {
//   id: string;
//   storeId: string;
//   categoryId: string;
//   serviceTypeId: string;
//   subCategoryId: string;

//   name: string;
//   profilePic: string;
//   price: number;
//   description: string;
//   duration: string;
//   location: string;
//   slotDuration: number;

//   startDate: string; // ISO date
//   endDate: string;   // ISO date
//   startTime: string; // ISO time (1970 date)
//   endTime: string;   // ISO time (1970 date)

//   tags: string[];

//   serviceMode: string;

//   averageRating: number;
//   totalReviews: number;
//   totalSlot: number;

//   createdAt: string;
//   updatedAt: string;

//   store: Store;
//   category: Category;
//   serviceType: ServiceType;
//   specialists: Specialist[];
//   subCategory: SubCategory;
// }

// /* ===================== STORE ===================== */

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

//   shopStatus: "APPROVED" | "PENDING" | "REJECTED";
//   status: "ONLINE" | "OFFLINE";

//   stripeAccountId: string | null;
//   stripeAccountStatus: "not_connected" | "connected";

//   createdAt: string;
//   updatedAt: string;
// }

// /* ===================== CATEGORY ===================== */

// export interface Category {
//   id: string;
//   name: string;
//   description: string;
//   type: "SERVICE" | "PRODUCT";
//   comment: string;
//   createdAt: string;
//   updatedAt: string;
// }

// /* ===================== SERVICE TYPE ===================== */

// export interface ServiceType {
//   id: string;
//   name: string;
//   createdAt: string;
//   updatedAt: string;
// }

// /* ===================== SPECIALIST ===================== */

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
//   gender: "MALE" | "FEMALE" | "OTHER";
//   bio: string;
//   phoneNum: string;
//   available: boolean;
//   rating: string; // comes as string from API ("5.5")
//   experience: string; // e.g. "12 years"
//   status: "Active" | "Inactive";
//   specialistTime: string; // "9:00 AM - 7:00 PM"
//   createdAt: string; // ISO date
//   updatedAt: string; // ISO date
//   averageRating: number;
//   totalReviews: number;
//   user: SpecialistUser;
// }



// /* ===================== SUB CATEGORY ===================== */

// export interface SubCategory {
//   id: string;
//   name: string;
//   description: string;
//   categoryId: string;
//   slug: string;
//   image: string;

//   isActive: boolean;
//   sortOrder: number;

//   createdAt: string;
//   updatedAt: string;
// }



// service.types.ts

export interface ServiceDetailsResponse {
  data: Service;
}

export interface Service {
  id: string;
  storeId: string;
  categoryId: string;
  serviceTypeId: string;
  name: string;
  profilePic: string;
  price: number;
  description: string;
  duration: string;
  location: string;
  slotDuration: number;
  subCategoryId: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  tags: string[];
  averageRating: number;
  totalReviews: number;
  totalSlot: number;
  features: ServiceFeatures;
  serviceMode: "ONLINE" | "OFFLINE";
  providerType: "OWNER" | "SPECIALIST" | "BOTH";
  createdAt: string;
  updatedAt: string;
  status: "approved" | "pending" | "rejected";
  store: Store;
  category: Category;
  serviceType: ServiceType;
  subCategory: SubCategory;
  specialists: Specialist[];
  availableProviders: AvailableProvider[];
}

export interface ServiceFeatures {
  duration: string;
  includes: string[];
  providers: string;
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
  shopStatus: "APPROVED" | "PENDING";
  status: "ONLINE" | "OFFLINE";
  createdAt: string;
  updatedAt: string;
  stripeAccountId: string;
  stripeAccountStatus: "connected" | "not_connected";
  user: User;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profilePic: string;
  passwordChangedAt: string | null;
  isVerified: boolean;
  isResetPassword: boolean;
  canResetPassword: boolean;
  isResentOtp: boolean;
  role: "SELLER" | "SPECIALIST";
  isSubscribed: boolean;
  planExpiration: string | null;
  resetPasswordOTP: string | null;
  resetPasswordOTPExpiresAt: string | null;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
  sellerBalanceId: string | null;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  type: "PRODUCT" | "SERVICE";
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceType {
  id: string;
  name: string;
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
  gender: "MALE" | "FEMALE" | "OTHER";
  bio: string;
  phoneNum: string;
  available: boolean;
  rating: string;
  experience: string;
  status: "Active" | "Inactive";
  specialistTime: string;
  createdAt: string;
  updatedAt: string;
  averageRating: number;
  totalReviews: number;
  user: User;
}

export interface AvailableProvider {
  id: string;
  specialistId?: string;
  name: string;
  email: string;
  profilePic: string;
  type: "OWNER" | "SPECIALIST";
  isOwner: boolean;
}

