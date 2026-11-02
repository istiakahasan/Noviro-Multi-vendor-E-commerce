export interface ProductCategoryResponse {
  data: {
    topDealProducts: Product[];
    newlyAddedProducts: Product[];
    bestServices: Service[];
    consultantServices: Service[];
    Subscription: Plan[];
  };
}

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
    images: string[];
  stockQuantity: number;
  discount: number;
  finalPrice: number | null;
  averageRating: number;
  totalReviews: number;
  tags: string[];
  barcode: string;
  createdAt: string;
  updatedAt: string;
  isTopDeal: boolean;
  topDealFrom: string | null;
  topDealUntil: string | null;
  variants: Variant[];
}

export interface Variant {
  id: string;
  productId: string;
  color: string;
  colorCode: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  sizes: Size[];
}

export interface Size {
  id: string;
  variantId: string;
  size: string;
  quantity: number;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
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
  store: Store;
  serviceType: ServiceType;
  specialists: Specialist[];
  subCategory?: SubCategory; // Only present in consultantServices
}

interface Store {
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


export interface Plan {
  id: string;
  userId: string;
  categoryId: string;
  subCategoryId: string;
  storeId: string;
  planName: string;
  amount: number;
  image: string;
  currency: string;
  interval: string;
  intervalCount: number;
  freeTrialDays: number | null;
  productId: string;
  priceId: string;
  active: boolean;
  description: string;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

interface ServiceType {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface Specialist {
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
}

interface SubCategory {
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