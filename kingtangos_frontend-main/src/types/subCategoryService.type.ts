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
  startDate: string;  
  endDate: string;    
  startTime: string;  
  endTime: string;    
  tags: string[];
  averageRating: number;
  totalReviews: number;
  totalSlot: number;
  createdAt: string;  
  updatedAt: string;  
}


export interface CategoryServiceResponse {
  success?: boolean;
  message?: string;
  data: ServiceItem[];
}
