export interface StoreCategoryResponse {
  data: {
    products: Product[];
    services: Service[];
    consultations: Consultation[];
    plans: Plan[];
  };
}

/* ---------- PRODUCT ---------- */

export interface Product {
  id: string;
  storeId: string;
  categoryId: string;
  name: string;
  image: string;
  price: number;
  description: string;
  subCategoryId: string;
  type: string;
  stockQuantity: number;
  discount: number;
  finalPrice: number;
  averageRating: number;
  totalReviews: number;
  tags: string[];
  barcode: string;
  sponsored: boolean;
  createdAt: string;
  updatedAt: string;
  isTopDeal: boolean;
  topDealFrom: string | null;
  topDealUntil: string | null;
  category: Category;
  subcategory: SubCategory;
}

export interface Category {
  id: string;
  name: string;
  type: string;
}

export interface SubCategory {
  id: string;
  name: string;
}


/* ---------- SERVICE ---------- */

export interface Service {
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
  category: Category;
  serviceType: {
    id: string;
    name: string;
  };
  specialists: Specialist[];
}

export interface Specialist {
  id: string;
  firstName: string;
  lastName: string;
}


/* ---------- CONSULTATION ---------- */

export interface Consultation {
  id: string;
  storeId: string;
  categoryId: string;
  subCategoryId: string;
  name: string;
  profilePic: string | null;
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
  type: string;
  averageRating: number;
  totalReviews: number;
  totalSlot: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  category: Category;
  specialists: Specialist[];
}


/* ---------- PLANS ---------- */

export interface Plan {
  id: string;
  userId: string;
  categoryId: string;
  subCategoryId: string;
  storeId: string;
  planName: string;
  amount: number;
  currency: string;
  interval: string;
  intervalCount: number;
  freeTrialDays: number | null;
  productId: string;
  priceId: string;
  averageRating: number;
  totalReviews: number;
  active: boolean;
  description: string;
  features: string[];
  createdAt: string;
  updatedAt: string;
  image: string;
  category: Category;
  subCategory: SubCategory;
}
