// src/app/(dashboardLayout)/admin-dashboard/platform-settings/components/Layout.tsx

import React from 'react';
import { PlatformSettingsLayoutProps } from '@/types/global';

const Layout: React.FC<PlatformSettingsLayoutProps> = ({ children, currentTab, onTabChange }) => {
  const tabs = [
    { id: 'general', label: 'General Site Settings' },
    { id: 'commission', label: 'Commission Settings' },
    // { id: 'notification', label: 'Notification Preferences' },
    // { id: 'roles', label: 'Roles & Permissions' },
  ];

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className="bg-white mb-2">
        <div className="p-6">
          <h1 className="text-2xl font-semibold text-gray-900">Platform Settings</h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor and manage all product orders, service bookings, and subscription activities.
          </p>
        </div>

        {/* Tabs */}
        <div className="px-6 rounded-lg bg-gray-50">
          <div className="flex m-4 gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-6 py-3 text-sm font-medium rounded-xl transition-colors ${
                  currentTab === tab.id
                    ? 'bg-gray-200 text-gray-900'
                    : 'bg-transparent text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {children}
      </div>

   
     
    </div>
  );
};

export default Layout;