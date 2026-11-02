import { createSlice } from "@reduxjs/toolkit";

interface UiState {
  sidebarOpen: boolean;
  isMobile: boolean;
  isTablet: boolean;
}

const initialState: UiState = {
  sidebarOpen: false,
  isMobile: false,
  isTablet: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    closeSidebar: (state) => {
      state.sidebarOpen = false;
    },
    setIsMobile: (state, action) => {
      state.isMobile = action.payload;
    },
    setIsTablet: (state, action) => {
      state.isMobile = action.payload;
    },
  },
});

export const { toggleSidebar, closeSidebar, setIsMobile, setIsTablet } =
  uiSlice.actions;
export default uiSlice.reducer;
