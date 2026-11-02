
export interface CategoryConsultationResponse {
  data: Consultation[];
}


export interface Consultation {
  id: string;
  storeId: string;
  categoryId: string;
  subCategoryId: string;

  name: string;                 // consultation title
  profilePic: string;           // expert/consultation image
  price: number;
  description: string;

  duration: string;             // e.g. "30 min" / "9 hours"
  location: string;             // can be physical or online
  slotDuration: number;         // minutes per consultation slot

  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;

  tags: string[];
  type: "VIDEO" | "AUDIO" | "TEXT" | string; // consultation mode

  averageRating: number;
  totalReviews: number;

  totalSlot: number;
  status: "AVAILABLE" | "UNAVAILABLE" | string;

  createdAt: string;
  updatedAt: string;

  store: ConsultationStore;
  category: Category;
  subCategory: SubCategory;
  specialists: Specialist[];
}

// =========================
// 🏢 Consultation Provider
// =========================
export interface ConsultationStore {
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

  shopStatus: "APPROVED" | "PENDING" | "REJECTED" | string;
  status: "ONLINE" | "OFFLINE" | string;

  createdAt: string;
  updatedAt: string;
}

// =========================
// 📂 Category Model
// =========================
export interface Category {
  id: string;
  name: string;
  description: string;
  type: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

// =========================
// 🧾 Sub Category Model
// =========================
export interface SubCategory {
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

// =========================
// 👨‍⚕️ Consultation Specialist
// =========================
export interface Specialist {
  id: string;
  storeId: string;
  userId: string;
  serviceTypeId: string;

  firstName: string;
  lastName: string;
  title: string;                 // e.g. Senior Consultant
  email: string;
  gender: "MALE" | "FEMALE" | "OTHER" | string;

  bio: string;
  phoneNum: string;
  available: boolean;

  rating: string;               // comes as string from API
  experience: string;           // e.g. "10 years"
  status: string;               // e.g. Active
  specialistTime: string;       // e.g. "sat - thu"

  createdAt: string;
  updatedAt: string;

  averageRating: number;
  totalReviews: number;
}
