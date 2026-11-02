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

export interface GetAllServicesResponse {
  success: boolean;
  message: string;
  data: ServiceItem[];
}
