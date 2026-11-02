import { MatrixCard } from "@/components/dashboardLayout/MatrixCard";
import { NotificationsAlerts } from "@/components/dashboardLayout/NotificationsAlerts";
import { RecentOrders } from "@/components/dashboardLayout/RecentOrders";
import { SalesChart } from "@/components/dashboardLayout/SalesChart";
import { WelcomeHeader } from "@/components/dashboardLayout/WelcomeHeader";


export default function SellerDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 md:p-6">
      <div className="container mx-auto space-y-6">
        {/* Welcome Header */}
        <WelcomeHeader />

        {/* Metrics Cards */}
        <MatrixCard />
        {/* Sales Chart */}
        <SalesChart />

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentOrders />
          <NotificationsAlerts />
        </div>
      </div>
    </div>
  );
}
