// Types
export interface AdvertisingItem {
  id: string;
  storeId: string;
  productId: string;
  status: string;
  isActive: boolean;
  pricePerHour: number;
  totalDays: number;
  totalPrice: number;
  image: string;
  startDate: string | null;
  endDate: string | null;
  pausedAt: string | null;
  impressions: number;
  clicks: number;
  createdAt: string;
  updatedAt: string;
  product: {
    id: string;
    name: string;
    price: number;
    description: string;
    images: string[];
    discount: number;
    finalPrice: number;
  };
}

export interface StatusConfig {
  color: string;
  text: string;
  textColor: string;
}



