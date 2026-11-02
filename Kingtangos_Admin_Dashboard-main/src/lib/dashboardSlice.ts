import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface DashboardStats {
  newUsers: number;
  activeEvents: number;
  boostRevenue: number;
  ticketSales: number;
  pendingReports: number;
}

interface DashboardState {
  stats: DashboardStats;
  timePeriod: "7 Days" | "30 Days" | "Custom";
}

const initialState: DashboardState = {
  stats: {
    newUsers: 4876,
    activeEvents: 568,
    boostRevenue: 12876,
    ticketSales: 8026,
    pendingReports: 40,
  },
  timePeriod: "7 Days",
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setTimePeriod: (
      state,
      action: PayloadAction<"7 Days" | "30 Days" | "Custom">
    ) => {
      state.timePeriod = action.payload;
    },
    updateStats: (state, action: PayloadAction<Partial<DashboardStats>>) => {
      state.stats = { ...state.stats, ...action.payload };
    },
  },
});

export const { setTimePeriod, updateStats } = dashboardSlice.actions;
export default dashboardSlice.reducer;
