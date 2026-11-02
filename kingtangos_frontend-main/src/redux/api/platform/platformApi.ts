import { baseApi } from "@/redux/api/baseApi";
import { StoreResponse } from "@/types/store.type";


export const platformApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getAllPlatformData: builder.query<StoreResponse, string>({
      query: () => ({
        url: "/platformsettings",
        method: "GET",
      }),
      providesTags: ["Platform"],
    }),
  }),
});

export const {
useGetAllPlatformDataQuery,
} = platformApi;