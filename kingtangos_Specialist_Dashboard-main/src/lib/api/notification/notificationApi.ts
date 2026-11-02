import { baseApi } from "../baseApi";

const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<any, void>({
      query: () => "/notification/user/get-alll",
      providesTags: ["Notifications"],
    }),
    getSingleNotification: builder.query<any, string>({
      query: (id) => `/notification/${id}`,
      providesTags: ["Notifications"],
    }),
    readNotification: builder.mutation<any, string>({
      query: (id) => ({
        url: `/notification/read-status/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetSingleNotificationQuery,
  useReadNotificationMutation,
} = notificationApi;
