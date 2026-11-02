import { DashboardLayout } from "@/components/dashboardLayout/DashboardLayoput";
import type React from "react";

export default function DashboardLayoutPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
