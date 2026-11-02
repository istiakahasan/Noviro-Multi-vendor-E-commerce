"use client"

import { ProductPerformanceTable } from "@/components/dashboardLayout/ReportsAnalytics/ProductPerformanceTable"
import { ReportsAnalyticsMatrix } from "@/components/dashboardLayout/ReportsAnalytics/ReportsAnalyticsMatrix"
import { SalesDistributionChart } from "@/components/dashboardLayout/ReportsAnalytics/SalesDistributionChart"
import { SalesTrendChart } from "@/components/dashboardLayout/ReportsAnalytics/SalesTrendChart"
import { ServicePerformanceTable } from "@/components/dashboardLayout/ReportsAnalytics/ServicePerformanceTable"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"


export default function ReportsAnalytics() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-white md:p-6">
        <div className="flex items-center justify-between flex-col lg:flex-row mb-4">
          <div className="mb-3 lg:mb-0">
            <h1 className="lg:text-3xl text-lg font-bold">Reports & Analytics</h1>
          </div>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Calendar className="h-4 w-4" />7 July 2025
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="mt-6 mx-auto">
        <ReportsAnalyticsMatrix />
        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-8">
          <div className="lg:col-span-2">
            <SalesTrendChart />
          </div>
          <div>
            <SalesDistributionChart />
          </div>
        </div>

        {/* Tables */}
        <div className="grid grid-cols-1 gap-8 mb-8">
        <ProductPerformanceTable />
        <ServicePerformanceTable />
        </div>

        {/* Subscription Growth */}
        {/* <div>
          <SubscriptionGrowthChart />
        </div> */}
      </div>
    </main>
  )
}
