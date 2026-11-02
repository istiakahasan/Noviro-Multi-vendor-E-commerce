import { baseApi } from "@/redux/api/baseApi";

interface SendEmailPayload {
  subject: string;
  message: string;
  target: string;
}

interface SendEmailResponse {
  success: boolean;
  message: string;
}

export const marketingApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({

    sendEmail: builder.mutation<SendEmailResponse, SendEmailPayload>({
      query: (body) => ({
        url: "/subscribers/send-promotion-email",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Marketing"],
    }),

  }),
});

export const {
  useSendEmailMutation,
} = marketingApi;

