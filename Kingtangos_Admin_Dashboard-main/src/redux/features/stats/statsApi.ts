// import baseApi from "@/redux/api/baseApi";

// // =========================
// // EXISTING TYPES (unchanged)
// // =========================
// export interface DashboardTotals {
//   sellers: number;
//   customers: number;
//   activeOrdersToday: number;
//   totalRevenue: number;
//   pendingPayouts: number;
// }

// export interface RevenueByFeatureItem {
//   label: string;
//   value: number;
// }

// export interface DashboardSummaryData {
//   totals: DashboardTotals;
//   salesTrend: unknown[];
//   revenueByFeature: RevenueByFeatureItem[];
// }

// export interface DashboardSummaryResponse {
//   success: boolean;
//   message: string;
//   data: DashboardSummaryData;
// }

// export interface GrowthSection {
//   thisMonth: number;
//   lastMonth: number;
//   growthRate: number;
// }

// export interface MonthlyRevenueTrend {
//   month: string;
//   revenue: number;
// }

// export interface SellerAnalyticsItem {
//   planId: string;
//   thisMonthRevenue: number;
//   lastMonthRevenue: number;
//   storeGrowthRate: number;
//   totalRevenueGrowthRate: number;
// }

// export interface ReportAnalyticsData {
//   revenue: GrowthSection;
//   orders: GrowthSection;
//   activeUsers: GrowthSection;
//   monthlyRevenueTrend: MonthlyRevenueTrend[];
//   sellerAnalytics: SellerAnalyticsItem[];
// }

// export interface ReportAnalyticsResponse {
//   success: boolean;
//   message: string;
//   data: ReportAnalyticsData;
// }

// export interface SubscriptionReportData {
//   totalActiveSubscriptions: number;
//   monthlyRecurringRevenue: number;
//   churnRate: number;
//   sellerEarnings: number;
//   monthlyRevenueTrend: Record<string, number>;
//   topPerformingPlans: Array<{
//     planName: string;
//     revenue: number;
//   }>;
//   topSellerEarnings: Array<{
//     storeId: string;
//     storeName: string;
//     earnings: number;
//   }>;
// }

// export interface SubscriptionReportResponse {
//   success: boolean;
//   message: string;
//   data: SubscriptionReportData;
// }

// export interface PlanPerformanceItem {
//   planName: string;
//   type: "month" | "year";
//   activeSubscribers: number;
//   revenue: number;
//   growthRate: number;
// }

// export interface PlanPerformanceResponse {
//   success: boolean;
//   message: string;
//   data: PlanPerformanceItem[];
// }

// // =========================
// // NEW: REVENUE BY FEATURE / MONTHLY TYPES
// // =========================

// export interface RevenueByCategoryItem {
//   label: string;
//   value: number;
//   percentage: number;
// }

// export interface RevenueGrowthInfo {
//   growthPercentage: number;
//   averageGrowth6Months: number;
// }

// export interface MonthlyTrendItem {
//   month: string; // e.g., "2025-11"
//   revenue: number;
//   growth: number;
// }

// export interface RevenueByFeatureData {
//   revenueByCategory: {
//     current: RevenueByCategoryItem[];
//   };
//   revenueGrowth: RevenueGrowthInfo;
//   monthlyTrend: MonthlyTrendItem[];
// }

// export interface RevenueByFeatureResponse {
//   success: boolean;
//   message: string;
//   data: RevenueByFeatureData;
// }

// // =========================
// // API ENDPOINTS
// // =========================

// export const dashboardApi = baseApi.injectEndpoints({
//   endpoints: (build) => ({
//     // Existing Dashboard Summary
//     getDashboardStats: build.query<DashboardSummaryResponse, void>({
//       query: () => ({
//         url: "/admin-dashboard-routes/summary",
//         method: "GET",
//       }),
//     }),

//     // Reports  & Analytics - Main
//     getReportAnaliticsStats: build.query<ReportAnalyticsResponse, void>({
//       query: () => ({
//         url: "/reports-analytics/",
//         method: "GET",
//       }),
//     }),

//     // NEW: Revenue by Feature / Monthly Breakdown
//     getRevenueByFeatureOrMonthly: build.query<RevenueByFeatureResponse, void>({
//       query: () => ({
//         url: "/reports-analytics/revenueByFeature",
//         method: "GET",
//       }),
//     }),

//     // Subscription Report (Main)
//     getSubscriptionTrack: build.query<SubscriptionReportResponse, void>({
//       query: () => ({
//         url: "/subscription-report",
//         method: "GET",
//       }),
//     }),

//     // Subscription Plan Performance List
//     getSubscriptionPlanPerformance: build.query<PlanPerformanceResponse, void>({
//       query: () => ({
//         url: "/subscription-report/plan-performance",
//         method: "GET",
//       }),
//     }),
//   }),
// });

// // =========================
// // EXPORT ALL HOOKS
// // =========================

// export const {
//   useGetDashboardStatsQuery,
//   useGetReportAnaliticsStatsQuery,
//   useGetRevenueByFeatureOrMonthlyQuery, // Newly added hook
//   useGetSubscriptionTrackQuery,
//   useGetSubscriptionPlanPerformanceQuery,
// } = dashboardApi;

// export default dashboardApi;




import baseApi from "@/redux/api/baseApi";

// =========================
// EXISTING TYPES (unchanged)
// =========================
export interface DashboardTotals {
  sellers: number;
  customers: number;
  activeOrdersToday: number;
  totalRevenue: number;
  pendingPayouts: number;
}

export interface RevenueByFeatureItem {
  label: string;
  value: number;
}

export interface DashboardSummaryData {
  totals: DashboardTotals;
  salesTrend: unknown[];
  revenueByFeature: RevenueByFeatureItem[];
}

export interface DashboardSummaryResponse {
  success: boolean;
  message: string;
  data: DashboardSummaryData;
}

export interface GrowthSection {
  thisMonth: number;
  lastMonth: number;
  growthRate: number;
}

export interface MonthlyRevenueTrend {
  month: string;
  revenue: number;
}

export interface SellerAnalyticsItem {
  planId: string;
  thisMonthRevenue: number;
  lastMonthRevenue: number;
  storeGrowthRate: number;
  totalRevenueGrowthRate: number;
}

export interface ReportAnalyticsData {
  revenue: GrowthSection;
  orders: GrowthSection;
  activeUsers: GrowthSection;
  monthlyRevenueTrend: MonthlyRevenueTrend[];
  sellerAnalytics: SellerAnalyticsItem[];
}

export interface ReportAnalyticsResponse {
  success: boolean;
  message: string;
  data: ReportAnalyticsData;
}

export interface SubscriptionReportData {
  totalActiveSubscriptions: number;
  monthlyRecurringRevenue: number;
  churnRate: number;
  sellerEarnings: number;
  monthlyRevenueTrend: Record<string, number>;
  topPerformingPlans: Array<{
    planName: string;
    revenue: number;
  }>;
  topSellerEarnings: Array<{
    storeId: string;
    storeName: string;
    earnings: number;
  }>;
}

export interface SubscriptionReportResponse {
  success: boolean;
  message: string;
  data: SubscriptionReportData;
}

export interface PlanPerformanceItem {
  planName: string;
  type: "month" | "year";
  activeSubscribers: number;
  revenue: number;
  growthRate: number;
}

export interface PlanPerformanceResponse {
  success: boolean;
  message: string;
  data: PlanPerformanceItem[];
}

// =========================
// REVENUE BY FEATURE TYPES
// =========================
export interface RevenueByCategoryItem {
  label: string;
  value: number;
  percentage: number;
}

export interface RevenueGrowthInfo {
  growthPercentage: number;
  averageGrowth6Months: number;
}

export interface MonthlyTrendItem {
  month: string;
  revenue: number;
  growth: number;
}

export interface RevenueByFeatureData {
  revenueByCategory: {
    current: RevenueByCategoryItem[];
  };
  revenueGrowth: RevenueGrowthInfo;
  monthlyTrend: MonthlyTrendItem[];
}

export interface RevenueByFeatureResponse {
  success: boolean;
  message: string;
  data: RevenueByFeatureData;
}

// =========================
// NEW: CUSTOMER ACTIVITY TYPES
// =========================
export interface CustomerActivitySummary {
  totalCustomers: number;
  activeCustomers: number;
  inactiveCustomers: number;
  activePercentage: number;
}

export interface CustomerMonthlyTrend {
  month: string;        // e.g., "Nov"
  monthKey: string;     // e.g., "2025-10"
  activeCustomers: number;
  inactiveCustomers: number;
  total: number;
}

export interface CustomerActivityData {
  summary: CustomerActivitySummary;
  monthlyTrend: CustomerMonthlyTrend[];
}

export interface CustomerActivityResponse {
  success: boolean;
  message: string;
  data: CustomerActivityData;
}

// =========================
// API ENDPOINTS
// =========================

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Existing Dashboard Summary
    getDashboardStats: build.query<DashboardSummaryResponse, void>({
      query: () => ({
        url: "/admin-dashboard-routes/summary",
        method: "GET",
      }),
    }),

    // Reports & Analytics - Main
    getReportAnaliticsStats: build.query<ReportAnalyticsResponse, void>({
      query: () => ({
        url: "/reports-analytics/",
        method: "GET",
      }),
    }),

    // Revenue by Feature / Monthly Breakdown
    getRevenueByFeatureOrMonthly: build.query<RevenueByFeatureResponse, void>({
      query: () => ({
        url: "/reports-analytics/revenueByFeature",
        method: "GET",
      }),
    }),

    // NEW: Customer Activity (Active vs Inactive Users)
    getCustomerActivity: build.query<CustomerActivityResponse, void>({
      query: () => ({
        url: "/reports-analytics/activeUsersNotActiveUsers",
        method: "GET",
      }),
    }),

    // Subscription Report (Main)
    getSubscriptionTrack: build.query<SubscriptionReportResponse, void>({
      query: () => ({
        url: "/subscription-report",
        method: "GET",
      }),
    }),

    // Subscription Plan Performance List
    getSubscriptionPlanPerformance: build.query<PlanPerformanceResponse, void>({
      query: () => ({
        url: "/subscription-report/plan-performance",
        method: "GET",
      }),
    }),
  }),
});

// =========================
// EXPORT ALL HOOKS
// =========================

export const {
  useGetDashboardStatsQuery,
  useGetReportAnaliticsStatsQuery,
  useGetRevenueByFeatureOrMonthlyQuery,
  useGetCustomerActivityQuery,                  // Newly added!
  useGetSubscriptionTrackQuery,
  useGetSubscriptionPlanPerformanceQuery,
} = dashboardApi;

export default dashboardApi;