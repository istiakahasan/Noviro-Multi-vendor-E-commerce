// src/app/meeting/(apis)/api.ts
import baseApi from "@/lib/api/baseApi";

export interface GenerateAgoraTokenRequest {
  channelName: string;
  role: "publisher" | "subscriber";
  userId: string;
}
export interface AgoraMeeting {
  id: string;
  meetingId: string;
  password: string | null;
  createdBy: string;
  createdAt: string;
  expiresAt: string;
  isActive: boolean;
}
export interface GenerateAgoraTokenData {
  token: string;
  appId: string;
  channelName: string;
  uid: number;
  meeting: AgoraMeeting;
}
export interface GenerateAgoraTokenResponse {
  success: boolean;
  message: string;
  data: GenerateAgoraTokenData;
}

export interface ScheduleMeetingRequest {
  title: string;
  startTime: string;
  endTime: string;
  channelName: string;
}

export interface ScheduleMeetingResponse {
  success: boolean;
  message: string;
  data: AgoraMeeting;
}

export const agoraApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    generateAgoraToken: builder.mutation<
      GenerateAgoraTokenResponse,
      GenerateAgoraTokenRequest
    >({
      query: (body) => ({
        url: "/agora/generate-token",
        method: "POST",
        body,
      }),
    }),
    scheduleMeeting: builder.mutation<
      ScheduleMeetingResponse,
      ScheduleMeetingRequest
    >({
      query: (body) => ({
        url: "/agora/schedule-meeting",
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGenerateAgoraTokenMutation, useScheduleMeetingMutation } =
  agoraApi;
