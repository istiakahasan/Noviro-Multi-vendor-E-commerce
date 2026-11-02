import baseApi from "../baseApi";

// ────────────────────────────────────────────────
// Profile shape from your actual response
export interface SpecialistProfile {
  id: string;
  storeId: string;
  userId: string;
  serviceTypeId: string;
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
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
    firstName: string;
    lastName: string;
    email: string;
    profilePic: string | null;
    role: string;
    isVerified: boolean;
    status: string;
    createdAt: string;
    updatedAt: string;
  };

  serviceType: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };

  store: {
    id: string;
    name: string;
    location: string;
    description: string;
    logo: string | null;
    banner: string | null;
    phone: string;
    email: string;
    shopStatus: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface GetMyProfileResponse {
  success: boolean;
  message: string;
  data: SpecialistProfile;
}

// ────────────────────────────────────────────────
// For PATCH /users/update-profile (multipart/form-data compatible)
export interface UpdateProfileBody {
  firstName?: string;
  lastName?: string;
  title?: string;
  email?: string;
  phoneNum?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  bio?: string;
  available?: boolean;
  rating?: string;
  experience?: string;
  status?: string;
  specialistTime?: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: SpecialistProfile;
}

// ────────────────────────────────────────────────
export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get profile
    getMyProfile: builder.query<GetMyProfileResponse, void>({
      query: () => "/specialist/my-specialist/profile",
      providesTags: ["SpecialistProfile"],
    }),

    // Update profile (PATCH) — accepts FormData or object
    updateProfile: builder.mutation<UpdateProfileResponse, FormData | UpdateProfileBody>({
      query: (body) => ({
        url: "/users/speclist/profile-update",
        method: "PATCH",
        body,
        // Do NOT set Content-Type — browser will set multipart/form-data with boundary when FormData is used
      }),
      invalidatesTags: ["SpecialistProfile"],
    }),
  }),
});

export const {
  useGetMyProfileQuery,
  useUpdateProfileMutation,
} = settingsApi;