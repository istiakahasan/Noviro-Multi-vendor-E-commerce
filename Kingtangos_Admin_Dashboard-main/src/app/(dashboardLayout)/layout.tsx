import type React from "react"
import { DashboardLayout } from "@/components/shared/dashboardLayout/DashboardLayoput"
import ProtectedRoute from "@/components/ProtectedRoute"

export default function DashboardLayoutPage({
  children,
}: {
  children: React.ReactNode
}) {
  return (<ProtectedRoute>

  <DashboardLayout>{children}</DashboardLayout>
  </ProtectedRoute>)
}
