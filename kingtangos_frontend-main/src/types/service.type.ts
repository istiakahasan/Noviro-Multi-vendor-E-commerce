export interface Store {
  id: string;
  serviceId: string;
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

export interface Category {
  id: string;
  serviceId: string;
  name: string;
  description: string;
  type: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceType {
  id: string;
  serviceId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Specialist {
  id: string;
  serviceId: string;
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
}

export interface SubCategory {
  id: string;
  serviceId: string;
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

export interface DealItem {
  length: number;
  id: string;
  serviceId: string;
  storeId: string;
  categoryId: string;
  serviceTypeId: string;
  name: string;
  profilePic: string;
  price: number;
  description: string;
  duration: string;
  slotDuration: number;
  subCategoryId: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  tags: string[];
  totalSlot: number;
  averageRating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
  store: Store;
  category: Category;
  serviceType: ServiceType;
  specialists: Specialist[];
  subCategory: SubCategory;
}

export interface ServiceResponse {
  success: boolean;
  message: string;
  data: DealItem[];
}

















