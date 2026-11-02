import baseApi from "@/redux/api/baseApi";

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
    getAllMessageAdmin: builder.query<any, void>({
      query: () => ({
        url: "/messages/admin",
        method: "GET",
      }),
      providesTags: ["MessageChat"],
    }),

    getMyConversation: builder.query<any, void>({
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
    getAdminSingleConversation: builder.query({
      query: (conversationId) => ({
        url: `/messages/admin/convercation/${conversationId}`,
        method: "GET",
      }),
      providesTags: (result, error, conversationId) => [
        { type: "MessageChat", id: conversationId },
      ],
    }),
  }),
});

export const {
  useGetAllMessageQuery,
  useGetAllMessageAdminQuery,
  useGetMyConversationQuery,
  useCreateSendMessageMutation,
  useDeleteMessageMutation,
  useGetAdminSingleConversationQuery,
} = messageApi;
