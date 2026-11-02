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
  specialists: SpecialistInfo[];
}

// 📌 Root Response (THIS YOU EXPORT FOR API RETURN)
export interface ConsultationResponse {
  data: Consultation[];
}
