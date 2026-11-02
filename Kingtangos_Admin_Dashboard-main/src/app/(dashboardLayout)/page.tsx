"use client";

import { MatrixCard } from "@/components/shared/dashboardLayout/MatrixCard";
import RecentActivities from "@/components/shared/dashboardLayout/RecentActivities";
import RevenueByCategoryChart from "@/components/shared/dashboardLayout/RevinueByCategory";
import { SalesChart } from "@/components/shared/dashboardLayout/SalesChart";
import { WelcomeHeader } from "@/components/shared/dashboardLayout/WelcomeHeader";
import ErrorPage from "@/components/shared/ErrorPage";
import PageLoading from "@/components/shared/PageLoading";
import { useGetDashboardStatsQuery } from "@/redux/features/stats/statsApi";
import { useGetUserQuery } from "@/redux/features/user/userApi";
import PageLoader from "../loading";
import { useUserRole } from "@/hooks/useUserRole";
import ContactWithAdmin from "@/components/shared/dashboardLayout/ContactWithAdmin";

export default function SellerDashboardPage() {
  const { role, isRoleLoading } = useUserRole();

  const { data, isLoading, isError } = useGetUserQuery();
  const {
    data: dashboardStats,
    isLoading: dashboardStatsLoading,
    isError: dashboardStatsError,
  } = useGetDashboardStatsQuery(undefined);

  console.log(data);
  console.log(role);

  // console.log(dashboardStats);

  if (dashboardStatsLoading) return <PageLoader />;
  if (dashboardStatsError) return <div>Something went wrong!</div>;

  if (isLoading || isRoleLoading) return <PageLoading />;
  if (isError) return <ErrorPage />;
  console.log("user========>", data);
  const Name = data?.data.firstName + " " + data?.data.lastName || "Admin";
  console.log(Name);
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Header */}
        <WelcomeHeader name={Name} />

        {/* Metrics Cards */}
        <MatrixCard />
        <div className="flex flex-col xl:flex-row w-full gap-6">
          <div className="w-full xl:w-2/3">
            {/* Sales Chart */}
            <SalesChart />
          </div>
          <div className=" w-full xl:w-1/3">
            <RevenueByCategoryChart />
          </div>
        </div>

        {/* Bottom Section */}
        {role === "SUPER_ADMIN" ? (
          <div className="">
            <RecentActivities />
          </div>
        ) : (
          <div className="mt-4 flex flex-col text-center md:text-left md:flex-row justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Contract with admin</h1>
              <p className="text-gray-400 mt-2">
                Contact with admin if you have any questions or need assistance.
              </p>
          </div>
            <ContactWithAdmin/>
          </div>
        )}
      </div>
    </div>
  );
}
