import baseApi from "@/redux/api/baseApi";

// ========================
// Service Type Types
// ========================

export interface ServiceType {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetAllServiceTypesResponse {
  success: boolean;
  message: string;
  data: ServiceType[];
}

export interface CreateServiceTypeInput {
  name: string;
}

export interface CreateServiceTypeResponse {
  success: boolean;
  message: string;
  data: ServiceType;
}

export interface UpdateServiceTypeInput {
  name: string;
}

export interface UpdateServiceTypeResponse {
  success: boolean;
  message: string;
  data: ServiceType;
}

export interface DeleteServiceTypeResponse {
  success: boolean;
  message: string;
}

// ========================
// API Slice
// ========================
export const serviceTypeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL SERVICE TYPES
    getAllServiceTypes: builder.query<GetAllServiceTypesResponse, void>({
      query: () => "/servicetypes",
      providesTags: ["ServiceTypes"],
    }),

    // POST CREATE SERVICE TYPE
    createServiceType: builder.mutation<
      CreateServiceTypeResponse,
      CreateServiceTypeInput
    >({
      query: (body) => ({
        url: "/servicetypes/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ServiceTypes"],
    }),

    // PUT UPDATE SERVICE TYPE
    updateServiceType: builder.mutation<
      UpdateServiceTypeResponse,
      { id: string; body: UpdateServiceTypeInput }
    >({
      query: ({ id, body }) => ({
        url: `/servicetypes/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["ServiceTypes"],
    }),

    // DELETE SERVICE TYPE
    deleteServiceType: builder.mutation<DeleteServiceTypeResponse, string>({
      query: (id) => ({
        url: `/servicetypes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ServiceTypes"],
    }),
  }),
});

// ========================
// Export Hooks
// ========================
export const {
  useGetAllServiceTypesQuery,
  useLazyGetAllServiceTypesQuery,
  useCreateServiceTypeMutation,
  useUpdateServiceTypeMutation,
  useDeleteServiceTypeMutation,
} = serviceTypeApi;
