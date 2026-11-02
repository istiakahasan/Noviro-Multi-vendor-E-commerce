export interface Category {
  id: string;
  name: string;
  description: string;
  type: string;
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

export interface CategoriesResponse {
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  data: Category[];
}

