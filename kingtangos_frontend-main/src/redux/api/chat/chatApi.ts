import { baseApi } from "../baseApi";


export const messageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllMessage: builder.query({
      query: (receiverId) => ({
        url: "/messages/get-message",
        method: "GET",
        params: { receiverId },
      }),
      providesTags: ["MessageChat"],
    }),

    getMyConversation: builder.query({
      query: () => ({
        url: `/messages/get-my-convercation`,
        method: "GET",
      }),
      providesTags: ["MessageChat"],
    }),

    CreateSendMessage: builder.mutation({
      query: (data) => ({
        url: "/messages/send-message",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["MessageChat"],
    }),


    deleteMessage: builder.mutation({
      query: ({ id, data }) => ({
        url: `/messages/${id}`,
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["MessageChat"],
    }),
  }),
});

export const {
  useGetAllMessageQuery,
  useGetMyConversationQuery,
  useCreateSendMessageMutation,
  useDeleteMessageMutation
} = messageApi;
