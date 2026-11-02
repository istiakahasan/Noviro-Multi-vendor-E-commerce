import { NotificationResponse } from "@/types/notification.type";
import baseApi from "../baseApi";


export const notificationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getMyAllNotification: builder.query<NotificationResponse, void>({
            query: () => ({
                url: "/notification/user/get-alll",
                method: "GET",
            }),
            providesTags: ["Notification"],
        }),

        getSingleNotification: builder.query<NotificationResponse, string>({
            query: (id) => ({
                url: `/notification/${id}`,
                method: "GET",
            }),
            providesTags: ["Notification"],
        }),

        updateNotificationStatus: builder.mutation<NotificationResponse, { notificationId: string }>({
            query: (data) => ({
                url: `/notification/read-status/${data.notificationId}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Notification"],
        }),


    }),

});

export const {
    useGetMyAllNotificationQuery,
    useGetSingleNotificationQuery,
    useUpdateNotificationStatusMutation
} = notificationApi;
