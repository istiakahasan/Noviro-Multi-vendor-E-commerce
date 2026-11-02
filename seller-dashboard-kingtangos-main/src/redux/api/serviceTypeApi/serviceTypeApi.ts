import baseApi from "../baseApi";

export const serviceTypeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllServiceType: builder.query({
      query: (params) => ({
        url: "servicetypes",
        method: "GET",
        params: { ...params },
      }),
      providesTags: ["ServiceType"],
    }),

    getSingleServiceTypeById: builder.query({
      query: (id) => ({
        url: `servicetypes/${id}`,
        method: "GET",
      }),
      providesTags: ["ServiceType"],
    }),

    createServiceType: builder.mutation({
      query: (data) => ({
        url: "servicetypes/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ServiceType"],
    }),

    updateServiceType: builder.mutation({
      query: ({ id, data }) => ({
        url: `servicetypes/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["ServiceType"],
    }),

    deleteServiceType: builder.mutation({
      query: (id) => ({
        url: `servicetypes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ServiceType"],
    }),
  }),
});

export const {
useGetAllServiceTypeQuery,
useGetSingleServiceTypeByIdQuery,
useCreateServiceTypeMutation,
useUpdateServiceTypeMutation,
useDeleteServiceTypeMutation
} = serviceTypeApi;
