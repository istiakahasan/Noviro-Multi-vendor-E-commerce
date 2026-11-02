import { baseApi } from "../baseApi";

export const aiMessageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    CreateAiSendMessage: builder.mutation({
      query: (data) => ({
        url: "http://72.60.46.183:8085/chat",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["MessageChat"],
    }),
  }),
});

export const {
  useCreateAiSendMessageMutation                                                                                                                                                                                                                                                                                              
} = aiMessageApi
