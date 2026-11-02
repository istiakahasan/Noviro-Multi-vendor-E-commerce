// settingsApi.ts
import baseApi from "@/redux/api/baseApi";

// =========================
// TYPES
// =========================
export interface CommissionSettingsData {
  id: string;
  commissionPercent: string;
  minWithdrawal: string;
  maxWithdrawal: string;
  withdrawalFee: string;
  processingDays: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommissionSettingsResponse {
  success: boolean;
  message: string;
  data: CommissionSettingsData;
}

export interface CreateCommissionSettingsRequest {
  commissionPercent: number;
  minWithdrawal: number;
  maxWithdrawal: number;
  withdrawalFee: number;
  processingDays: number;
}

export interface UpdateCommissionSettingsRequest {
  commissionPercent?: number;
  minWithdrawal?: number;
  maxWithdrawal?: number;
  withdrawalFee?: number;
  processingDays?: number;
  isActive?: boolean;
}

// ───────────────────────────────────────────────────────────────
// NEW: Platform Settings Types
// ───────────────────────────────────────────────────────────────

export interface PlatformSettingsRequest {
  platformName: string;
  supportEmail: string;
  supportPhone: string;
  termsOfService: string;
  privacyPolicy: string;
  refundPolicy: string;
  file?: File; // the image file (logo)
}

export interface PlatformSettingsResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    platformName: string;
    logoUrl: string;
    supportEmail: string;
    supportPhone: string;
    termsOfService: string;
    privacyPolicy: string;
    refundPolicy: string;
    createdAt: string;
    updatedAt: string;
    message: string;
    action: string;
  };
}
export interface CommissionSettingsData {
  id: string;
  commissionPercent: string;
  minWithdrawal: string;
  maxWithdrawal: string;
  withdrawalFee: string;
  processingDays: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommissionSettingsResponse {
  success: boolean;
  message: string;
  data: CommissionSettingsData;
}

export interface CreateCommissionSettingsRequest {
  commissionPercent: number;
  minWithdrawal: number;
  maxWithdrawal: number;
  withdrawalFee: number;
  processingDays: number;
}

export interface UpdateCommissionSettingsRequest {
  commissionPercent?: number;
  minWithdrawal?: number;
  maxWithdrawal?: number;
  withdrawalFee?: number;
  processingDays?: number;
  isActive?: boolean;
}

// =========================
// API ENDPOINTS
// =========================
export const settingsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // GET commission settings
    getCommissionSettings: build.query<CommissionSettingsResponse, void>({
      query: () => ({
        url: "/commission/settings",
        method: "GET",
      }),
      providesTags: ["CommissionSettings"],
    }),

    // CREATE commission settings
    createCommissionSettings: build.mutation<CommissionSettingsResponse, CreateCommissionSettingsRequest>({
      query: (body) => ({
        url: "/commission/settings",
        method: "POST",
        body,
      }),
      invalidatesTags: ["CommissionSettings"],
    }),

    // UPDATE single commission settings
    updateCommissionSettings: build.mutation<
      CommissionSettingsResponse,
      { id: string; data: UpdateCommissionSettingsRequest }
    >({
      query: ({ id, data }) => ({
        url: `/commission/settings/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["CommissionSettings"],
    }),
    createPlatformSettings: build.mutation<
      PlatformSettingsResponse,
      PlatformSettingsRequest
    >({
      query: (data) => {
        const formData = new FormData();

        // Append the JSON object as a string under key "data"
        formData.append(
          "data",
          JSON.stringify({
            platformName: data.platformName,
            supportEmail: data.supportEmail,
            supportPhone: data.supportPhone,
            termsOfService: data.termsOfService,
            privacyPolicy: data.privacyPolicy,
            refundPolicy: data.refundPolicy,
          })
        );

        // Append the image file under key "file" if provided
        if (data.file) {
          formData.append("file", data.file);
        }

        return {
          url: "/platformsettings",
          method: "POST",
          body: formData,
          // IMPORTANT: Do NOT set Content-Type — browser auto-sets multipart/form-data
        };
      },
      invalidatesTags: ["CommissionSettings"], // optional: refetch if you have GET later
    }),
  }),
});

// =========================
// EXPORT HOOKS
// =========================
export const {
  useGetCommissionSettingsQuery,
  useCreateCommissionSettingsMutation,
  useUpdateCommissionSettingsMutation,
  useCreatePlatformSettingsMutation
} = settingsApi;

export default settingsApi;
