export interface ChildrenProps {
  children: React.ReactNode;
}

export type PageType = "complaint-tickets" | "live-chat" | "reports";
export type TicketStatus = "Resolved" | "Pending" | "Open" | "Escalated";
export type StatColorType = "red" | "yellow" | "green" | "blue";
export type ChangeType = "positive" | "negative";
export type MessageSender = "agent" | "user";

export interface Ticket {
  id: string;
  type: string;
  customer: string;
  seller: string;
  summary: string;
  lastUpdated: string;
  status: TicketStatus;
}

export interface ChatMessage {
  sender: MessageSender;
  text: string;
}

export interface ChatSession {
  user: string;
  time: string;
  date: string;
  messages: ChatMessage[];
}

export interface ResolutionDataPoint {
  month: string;
  resolved: number;
  opened: number;
}

export interface ComplaintDataPoint {
  name: string;
  value: number;
  fill: string;
}

export interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  change: string;
  changeType: ChangeType;
  color: StatColorType;
}

export interface HeaderProps {
  title: string;
  description: string;
}

export interface NavTabProps {
  pages: PageType[];
  pageLabels: Record<PageType, string>;
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
}

export interface LayoutProps {
  children: React.ReactNode;
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
}

export interface SearchBarProps {
  placeholder: string;
  onSearch?: (value: string) => void;
}

export interface FilterButtonProps {
  label: string;
  onClick?: () => void;
}

export interface TableHeaderProps {
  columns: string[];
}

export interface TableRowProps {
  ticket: Ticket;
  onView?: (ticket: Ticket) => void;
}

export interface ChatHeaderProps {
  user: string;
  time: string;
}

export interface ChatMessagesProps {
  date: string;
  messages: ChatMessage[];
}

export interface ChatInputProps {
  onSend?: (message: string) => void;
}

export interface PieChartProps {
  data: ComplaintDataPoint[];
  title: string;
}

export interface BarChartProps {
  data: ResolutionDataPoint[];
  title: string;
}

export interface PerformanceCardProps {
  percentage: number;
  label: string;
}

//? types for platform setting

// Add these types to your existing types/global.ts file

export interface Role {
  id: string;
  name: string;
  permissions: string[];
  description: string;
}

export interface CommissionRate {
  id: string;
  category: string;
  rate: number;
}

export interface NotificationChannel {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export interface NotificationRecipient {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export interface GeneralSettings {
  platformName: string;
  logo: Blob | File | string | null;
  supportEmail: string;
  supportPhone: string;
  termsOfServiceUrl: string;
  privacyPolicyUrl: string;
  refundPolicyUrl: string;
}

export interface PlatformSettingsLayoutProps {
  children: React.ReactNode;
  currentTab: string;
  onTabChange: (tab: string) => void;
}

// from homepage for subscription details

export interface Plan {
  id: string;
  userId: string;
  image: string;
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
  active: boolean;
  averageRating: number;
  totalReviews: number;
  description: string;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PlansResponse {
  data: Plan[];
}

// subscription.types.ts

export interface SubscriptionPlan {
  id: string;
  userId: string;
  categoryId: string;
  subCategoryId: string;
  storeId: string;

  planName: string;
  description: string;

  amount: number;
  currency: string; // e.g. "usd"
  interval: "day" | "week" | "month" | "year";
  intervalCount: number;
  freeTrialDays: number | null;

  productId: string;
  priceId: string;

  averageRating: number;
  totalReviews: number;
  active: boolean;

  features: string[];
  image: string;

  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface PlanCategoryResponse {
  data: SubscriptionPlan[];
}

export type Currency = "usd" | "bdt" | "eur" | "inr" | string;
export type Interval = "day" | "week" | "month" | "year" | string;

export interface SubscriptionDetails {
  id: string;
  userId: string;
  categoryId: string;
  subCategoryId: string;
  storeId: string;
  planName: string;
  amount: number;
  currency: Currency;
  interval: Interval;
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
  status: string;
}

export interface SubscriptionDetailsResponse {
  data: SubscriptionDetails | undefined;
}
export interface SubscriptionReviewResponse {
  data: {
    reviews: Review[];
    pagination: Pagination;
  };
}

export interface Review {
  id: string;
  userId: string;
  subscriptionId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user: ReviewUser;
}

export interface ReviewUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ServiceDetailsResponse {
  data: Service;
}

/* ===================== MAIN SERVICE ===================== */

/* ===================== MAIN SERVICE ===================== */

export interface ServiceFeatureItem {
  price?: number;
  duration?: string;
  available?: boolean;
  serviceName: string;
}

export interface ServiceFeaturesObject {
  duration?: string;
  includes?: string[];
  providers?: string;
}

export type ServiceFeatures = ServiceFeatureItem[] | ServiceFeaturesObject;

export interface ServiceReviewUser {
  id: string;
  firstName: string;
  lastName: string;
  profilePic: string;
}

export interface ServiceReview {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: ServiceReviewUser;
  replies?: any[];
}

export interface ServiceAvailableProvider {
  id: string;
  name: string;
  email: string;
  profilePic: string;
  type: string;
  isOwner: boolean;
  title?: string;
  totalExperience?: string;
  rating?: number;
  totalReviews?: number;
  reviews?: ServiceReview[];
}

export interface ServiceSpecialist {
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
  user: {
    id: string;
    profilePic: string;
  };
  specialist?: ServiceReview[];
}

export interface Service {
  id: string;
  storeId: string;
  categoryId: string;
  serviceTypeId: string;
  subCategoryId: string;

  name: string;
  profilePic: string;
  price: number;
  description: string;
  duration: string;
  location: string;
  slotDuration: number;

  startDate: string; // ISO date
  endDate: string; // ISO date
  startTime: string; // ISO time (1970 date)
  endTime: string; // ISO time (1970 date)

  tags: string[];

  averageRating: number;
  totalReviews: number;
  totalSlot: number;

  createdAt: string;
  updatedAt: string;

  status: "approved" | "pending" | string;
  serviceMode: "OFFLINE" | "ONLINE" | string;
  providerType: "SPECIALIST_ONLY" | "OWNER_ONLY" | "BOTH" | string;

  store: {
    id: string;
    name: string;
    logo: string;
    banner: string;
    status: string;
    location: string;
  };
  category: {
    id: string;
    name: string;
  };
  serviceType: {
    id: string;
    name: string;
  };
  specialists: ServiceSpecialist[];
  availableProviders: ServiceAvailableProvider[];
  subCategory: {
    id: string;
    name: string;
  };
  features: ServiceFeatures;
}
