import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

// Auth state interface
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
};

// Helper functions for safe storage access
const setLocalStorage = (key: string, value: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, value);
  }
};

const getLocalStorage = (key: string): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key);
  }
  return null;
};

const removeLocalStorage = (key: string) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key);
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;

      // Store in localStorage (SSR-safe)
      setLocalStorage("authUser", JSON.stringify(action.payload));
    },

    setTokens: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;

      // Store tokens in localStorage
      setLocalStorage("accessToken", action.payload.accessToken);
      setLocalStorage("refreshToken", action.payload.refreshToken);

      // Store tokens in cookies with appropriate expiration
      if (typeof window !== "undefined") {
        Cookies.set("accessToken", action.payload.accessToken);
        Cookies.set("refreshToken", action.payload.refreshToken);
      }
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;

      // Remove from localStorage
      removeLocalStorage("authUser");
      removeLocalStorage("accessToken");
      removeLocalStorage("refreshToken");

      // Remove from cookies
      if (typeof window !== "undefined") {
        Cookies.remove("authUser");
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
      }
    },

    // Initialize auth state from stored data (call on app load)
    initializeAuth: (state) => {
      const storedUser = getLocalStorage("authUser");
      const storedAccessToken = getLocalStorage("accessToken");
      const storedRefreshToken = getLocalStorage("refreshToken");

      if (storedUser && storedAccessToken) {
        try {
          state.user = JSON.parse(storedUser);
          state.accessToken = storedAccessToken;
          state.refreshToken = storedRefreshToken;
        } catch (error) {
          // If parsing fails, clear corrupted data
          console.error("Error parsing stored user data:", error);
          removeLocalStorage("authUser");
          removeLocalStorage("accessToken");
          removeLocalStorage("refreshToken");
        }
      }
    },

    // Clear any existing auth errors
    clearAuthError: () => {
      // This can be extended if you add error handling
    },
  },
});

// Export actions
export const {
  setUser,
  setTokens,

  logout,
  initializeAuth,
  clearAuthError,
} = authSlice.actions;

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;

// Export reducer
export default authSlice.reducer;