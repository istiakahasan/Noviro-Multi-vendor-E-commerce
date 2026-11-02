
// hooks/useAuth.ts
// import { useGetMeQuery } from '@/services/userApi'; // Adjust the import path
import Cookies from 'js-cookie';
import { useMemo } from 'react';
import { useGetMeQuery } from '../api/authApi';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePic?: string;
}

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  hasAccessToken: boolean;
}

export function useAuth(): UseAuthReturn {
  // Check if access token exists in cookies
  const hasAccessToken = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return !!Cookies.get('accessToken');
  }, []); // Re-compute only on mount

  // Query user data only if token exists
  const { 
    data, 
    isLoading, 
    isError, 
    refetch 
  } = useGetMeQuery(undefined, {
    skip: !hasAccessToken, // Skip query if no accessToken
    // Optional: Polling interval if you want to keep user data fresh
    // pollingInterval: 60000, // 1 minute
  });

  // Extract user data
  const user = useMemo(() => data?.data || null, [data]);
  
  // Check authentication status
  const isAuthenticated = useMemo(
    () => !!user?.id && hasAccessToken,
    [user?.id, hasAccessToken]
  );

  return {
    user,
    isAuthenticated,
    isLoading,
    isError,
    refetch,
    hasAccessToken,
  };
}
