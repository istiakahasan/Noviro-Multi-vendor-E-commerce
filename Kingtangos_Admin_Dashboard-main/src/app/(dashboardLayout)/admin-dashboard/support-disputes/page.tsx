"use client";
import React, { useState } from 'react';

import ComplaintTicketsPage from './components/ComplaintTicketsPage';
import LiveChatPage from './components/LiveChatPage';
import ReportsPage from './components/ReportsPage';
import Layout from './components/Layout';
export default function App() {
  const [currentPage, setCurrentPage] = useState('reports');

  const renderPage = () => {
    switch (currentPage) {
      case 'complaint-tickets':
        return <ComplaintTicketsPage />;
      case 'live-chat':
        return <LiveChatPage />;
      case 'reports':
        return <ReportsPage />;
      default:
        return <ReportsPage />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}