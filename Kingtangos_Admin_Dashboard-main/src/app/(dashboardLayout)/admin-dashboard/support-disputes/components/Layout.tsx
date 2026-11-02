"use client";
// src/components/Layout.tsx
import React from 'react';
import Header from './Header';
import { MatrixCard } from '@/components/shared/dashboardLayout/MatrixCard';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange }) => {
  const getHeaderContent = () => {
    switch (currentPage) {
      case 'complaint-tickets':
        return {
          title: 'Complaint Tickets',
          description: 'Manage and resolve customer complaints and disputes.'
        };
      case 'live-chat':
        return {
          title: 'Live Chat Monitoring',
          description: 'Monitor ongoing customer support conversations.'
        };
      case 'reports':
        return {
          title: 'Reports & Analytics',
          description: 'Monitor and manage all product orders, service bookings, and subscription activities.'
        };
      default:
        return {
          title: 'Subscriptions Management',
          description: 'Monitor and manage all product orders, service bookings, and subscription activities.'
        };
    }
  };

  const headerContent = getHeaderContent();

  return (
    <div className="min-h-screen ">
      <Header title={headerContent.title} description={headerContent.description} />
      <div className='my-5 p-4'>
        <MatrixCard />
      </div>
      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex gap-4">
            <button
              onClick={() => onPageChange('complaint-tickets')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                currentPage === 'complaint-tickets'
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Complaint Tickets
            </button>
            <button
              onClick={() => onPageChange('live-chat')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                currentPage === 'live-chat'
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Live Chat Monitoring
            </button>
            <button
              onClick={() => onPageChange('reports')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                currentPage === 'reports'
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Reports & Analytics
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default Layout;