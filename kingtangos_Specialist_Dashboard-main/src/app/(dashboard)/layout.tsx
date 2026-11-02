// 'use client';
// import React from 'react';
// import Sidebar from './component/Sidebar';
// import Header from './component/Header';


// const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       <div className='h-screen sticky top-0'>

//       {/* Sidebar */}
//       <Sidebar />
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 flex-col overflow-hidden relative">
//         <div className='sticky top-0 z-10'>
          
//         <Header />
//         </div>
//         <main className="flex-1 text-black p-4 md:p-6">{children}</main>
//         <p className='text-gray-400 text-center pt-4 text-sm'>
//           Copyright 2025 Noviro.com All Rights Reserved. 
//         </p>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;


























'use client';
import React, { useState } from 'react';
import Sidebar from './component/Sidebar';
import Header from './component/Header';
import { Menu, X } from 'lucide-react';
import ProtectedWrapper from '@/components/ProtectedWrapper';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  // Sidebar toggle state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <ProtectedWrapper>

    <div className="flex min-h-screen bg-gray-50 relative">
      {/* =========================
          🧭 1. SIDEBAR SECTION
      ========================== */}

      {/* --- Desktop Sidebar (always visible on md+) --- */}
      <div className="h-screen sticky top-0 hidden md:block">
        <Sidebar />
      </div>

      {/* --- Mobile Sidebar (slide in/out) --- */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r shadow-sm transform transition-transform duration-300 md:hidden ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar />
      </div>

      {/* --- Overlay (click to close sidebar) --- */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* =========================
          🧭 2. MAIN CONTENT AREA
      ========================== */}
      <div className="flex-1 flex flex-col overflow-hidden relative">

        {/* ===== Mobile Header (hamburger + Header) ===== */}
        <div className="sticky top-0 z-20 bg-white shadow-sm md:hidden">
          <div className="flex items-center gap-3 px-4 py-3">
            {/* Hamburger Button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="flex-shrink-0"
            >
              {isSidebarOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            {/* Header Content (takes full width) */}
            <div className="flex-1">
              <Header />
            </div>
          </div>
        </div>

        {/* ===== Desktop Header ===== */}
        <div className="sticky top-0 z-10 hidden md:block">
          <Header />
        </div>

        {/* ===== Page Content ===== */}
        <main className="flex-1 text-black p-4 md:p-6">{children}</main>

        {/* ===== Footer ===== */}
        <p className="text-gray-400 text-center pt-4 text-sm">
          Copyright 2025 Noviro.com All Rights Reserved.
        </p>
      </div>
    </div>
               </ProtectedWrapper>
    
  );
};

export default DashboardLayout;
