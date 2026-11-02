import baseApi from "../baseApi";

export const specialistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSpecialist: builder.query({
      query: (params) => ({
        url: "/specialist",
        method: "GET",
        params: { ...params },
      }),
      providesTags: ["Specialist"],
    }),

    getMyAllSpecialist: builder.query({
      query: (params) => ({
        url: "/specialist/my-specialists",
        method: "GET",
        params: { ...params },
      }),
      providesTags: ["Specialist"],
    }),

    getSingleSpecialistById: builder.query({
      query: (id) => ({
        url: `/specialist/${id}`,
        method: "GET",
      }),
      providesTags: ["Specialist"],
    }),

    createSpecialist: builder.mutation({
      query: (data) => ({
        url: "/specialist",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Specialist"],
    }),

    updateSpecialist: builder.mutation({
      query: ({ id, data }) => ({
        url: `/specialist/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Specialist"],
    }),

    deleteSpecialist: builder.mutation({
      query: (id) => ({
        url: `/specialist/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Specialist"],
    }),
  }),
});

export const {
useGetAllSpecialistQuery,
useGetMyAllSpecialistQuery,
useGetSingleSpecialistByIdQuery,
useCreateSpecialistMutation,
useUpdateSpecialistMutation,
useDeleteSpecialistMutation,
} = specialistApi;
