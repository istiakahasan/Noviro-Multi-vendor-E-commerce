import { StaticImport } from "next/dist/shared/lib/get-img-props";

export interface StoreResponse {
  data: {
    stores: Store[];
  };
}

export interface Store {
  id: string;
  userId: string;
  name: string;
  location: string;
  tags: string[];
  description: string;
  logo: string;
  banner: string | StaticImport | undefined;
  phone: string;
  email: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  shopStatus: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  storeCategories: StoreCategory[];
  user: StoreUser;
  _count: StoreCount;
}

export interface StoreCategory {
  id: string;
  storeId: string;
  categoryId: string;
  createdAt: string;
  category: StoreCategoryDetails;
}

export interface StoreCategoryDetails {
  id: string;
  name: string;
  description: string;
  type: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoreUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface StoreCount {
  products: number;
  services: number;
  specialists: number;
}
