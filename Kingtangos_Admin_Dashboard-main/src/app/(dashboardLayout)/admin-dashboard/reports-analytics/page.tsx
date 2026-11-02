"use client";

import { Button } from "@/components/ui/button";
// import { useGetReportAnaliticsStatsQuery } from "@/redux/features/stats/statsApi";
import CategoryPerformance from "./components/CategoryPerformance";
import CustomerActivity from "./components/CustomerActivity";
import MatrixForAnalitics from "./components/MatrixForAnalitics";
import RevenueGrowthTrends from "./components/RevenueGrowthTrends";
import SalesReports from "./components/SalesReports";
import TopSellers from "./components/TopSellers";
import { downloadPDF } from "@/lib/pdf-utils";
import { Download } from "lucide-react";

const ReportAnaliticsPage = () => {
  // const {data,isLoading,isError} = useGetReportAnaliticsStatsQuery();

  // console.log(data);

  const handleDownload = async () => {
    await downloadPDF("report-content", "reports-analytics.pdf");
  };

  return (
    <div className="container mx-auto">
      <div className="my-5 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Reports & Analytics </h1>
          <p className="text-[#6D6D6D] text-sm">
            Monitor and manage all product orders, service bookings, and
            subscription activities.
          </p>
        </div>
        <Button className="mt-3" onClick={handleDownload}>
          {" "}
          <Download size={16} /> Download Report
        </Button>
      </div>

      <div id="report-content">
        {/* stats card  */}
        <div>
          <MatrixForAnalitics />
        </div>
        {/* SalesReports  */}
        <div className="mt-7 ">
          <SalesReports />
        </div>

        {/* Category Performance and Revenue Growth Trends section  */}
        <div className="flex gap-5 mt-6">
          <div className="flex-1">
            <CategoryPerformance />
          </div>
          <div className="flex-1">
            <RevenueGrowthTrends />
          </div>
        </div>
        {/* top sellers section  */}
        <div className="mt-6">
          <TopSellers />
        </div>

        <div className="mt-6">
          <CustomerActivity />
        </div>
      </div>
    </div>
  );
};

export default ReportAnaliticsPage;
