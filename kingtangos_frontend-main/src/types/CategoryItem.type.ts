// Single service item
export interface ServiceItem {
  id: string;
  storeId: string;
  categoryId: string;
  serviceTypeId: string;
  name: string;
  profilePic: string | null;
  price: number;
  description: string;
  duration: string;
  location: string;
  slotDuration: number;
  subCategoryId: string;
  startDate: string;  // ISO datetime string
  endDate: string;    // ISO datetime string
  startTime: string;  // ISO datetime string
  endTime: string;    // ISO datetime string
  tags: string[];
  averageRating: number;
  totalReviews: number;
  totalSlot: number;
  createdAt: string;
  updatedAt: string;
}

// API response for getting all services
export interface GetAllServicesResponse {
  success: boolean;
  message: string;
  data: ServiceItem[];
}

// Category type for your categories API
export interface Category {
  id: string;
  name: string;
  description: string;
  type: "CONSULTATION" | string;
  comment: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    storeCategories: number;
    products: number;
    services: number;
    consultations: number;
  };
}

// API response for getting all categories
export interface GetAllCategoriesResponse {
  data: Category[];
}
