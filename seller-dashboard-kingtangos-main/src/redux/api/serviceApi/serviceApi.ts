import baseApi from "../baseApi";

export const serviceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // getAllService: builder.query({
    //   query: (params) => ({
    //     url: "/service",
    //     method: "GET",
    //     params: { ...params },
    //   }),
    //   providesTags: ["Service"],
    // }),
    
    getAllService: builder.query({
      query: (params) => ({
        url: "/service/get-by/store",
        method: "GET",
        params: { ...params },
      }),
      providesTags: ["Service"],
    }),

    getSingleServiceById: builder.query({
      query: (id) => ({
        url: `/service/${id}`,
        method: "GET",
      }),
      providesTags: ["Service"],
    }),

    createService: builder.mutation({
      query: (data) => ({
        url: "/service/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Service"],
    }),

    updateService: builder.mutation({
      query: ({ id, data }) => ({
        url: `/service/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Service"],
    }),

    deleteService: builder.mutation({
      query: (id) => ({
        url: `/service/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Service"],
    }),
  }),
});

export const {
useGetAllServiceQuery,
useGetSingleServiceByIdQuery,
useCreateServiceMutation,
useUpdateServiceMutation,
useDeleteServiceMutation,
} = serviceApi;
