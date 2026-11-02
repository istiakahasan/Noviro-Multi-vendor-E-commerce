import baseApi from "../baseApi";


const uploaderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation({
      query: (data) => ({
        url: "/uploads/images",
        method: "POST",
        body: data,
      }),
    }),
    
  }),
});

export const { useUploadFileMutation } = uploaderApi;
