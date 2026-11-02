// src/app/(dashboardLayout)/admin-dashboard/platform-settings/page.tsx

"use client";
import { useState } from "react";
import CommissionSettings from "./components/CommissionSettings";
import GeneralSiteSettings from "./components/GeneralSiteSettings";
import Layout from "./components/Layout";
import NotificationPreferences from "./components/NotificationPreferences";
import RolesPermissions from "./components/RolesPermissions";

export default function PlatformSettingsPage() {
  const [currentTab, setCurrentTab] = useState("general");

  const renderContent = () => {
    switch (currentTab) {
      case "general":
        return <GeneralSiteSettings />;
      case "commission":
        return <CommissionSettings />;
      case "notification":
        return <NotificationPreferences />;
      case "roles":
        return <RolesPermissions />;
      default:
        return <GeneralSiteSettings />;
    }
  };

  return (
    <Layout currentTab={currentTab} onTabChange={setCurrentTab}>
      {renderContent()}
    </Layout>
  );
}
