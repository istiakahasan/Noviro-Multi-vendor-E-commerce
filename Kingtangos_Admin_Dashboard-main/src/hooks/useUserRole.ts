import { useGetUserQuery } from "@/redux/features/user/userApi";


export const useUserRole: any = () => {
  const { data, isLoading, isError }:any = useGetUserQuery();

  const role = data?.data?.role ?? null;

  return {
    role,           // "ADMIN" | "SUPER_ADMIN" | "STAFF" | null
    isLoading,
    isError,
  };
};
