"use client";
import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Link from "next/link";
import React, { useState } from "react";
import { X } from "lucide-react";
import { MdOutlineSpaceDashboard } from "react-icons/md";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const SidebarContent = () => (
    <>
      {/* My Orders */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-primary mb-4">
          <Link href={"/user/my-account"}>My Account</Link>
        </h1>
        <div className="text-md font-medium text-gray-700 mb-2">My Orders</div>
        <ul className="space-y-1 text-sm text-gray-600">
          <li>
            <Link
              href="/user/all-orders"
              className="hover:text-gray-900 block py-1"
            >
              All Orders
            </Link>
          </li>
          <li>
            <Link
              href="/user/pending-order"
              className="hover:text-gray-900 block py-1"
            >
              Pending
            </Link>
          </li>
          <li>
            <Link
              href="/user/shipped-order"
              className="hover:text-gray-900 block py-1"
            >
              Shipped
            </Link>
          </li>
          <li>
            <Link
              href="/user/return-order"
              className="hover:text-gray-900 block py-1"
            >
              Return
            </Link>
          </li>
        </ul>
      </div>

      {/* My Schedule */}
      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-700 mb-2">
          My Schedule
        </div>
        <ul className="space-y-1 text-sm text-gray-600">
          <li>
            <Link
              href="/user/all-booking"
              className="hover:text-gray-900 block py-1"
            >
              All Bookings
            </Link>
          </li>
          <li>
            <Link
              href="/user/service"
              className="hover:text-gray-900 block py-1"
            >
              Services
            </Link>
          </li>
          <li>
            <Link
              href="/user/consultation"
              className="hover:text-gray-900 block py-1"
            >
              Consultations
            </Link>
          </li>
          <li>
            <Link
              href="/user/subscriptions"
              className="hover:text-gray-900 block py-1"
            >
              Subscriptions
            </Link>
          </li>
          <li>
            <Link
              href="/user/cancel-subscriptions"
              className="hover:text-gray-900 block py-1"
            >
              Cancel Subscriptions
            </Link>
          </li>
        </ul>
      </div>

      {/* My Coupons */}
      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-700 mb-2">My Coupons</div>
        <ul className="space-y-1 text-sm text-gray-600">
          <li>
            <Link
              href="/user/my-coupons"
              className="hover:text-gray-900 block py-1"
            >
              Coupons
            </Link>
          </li>
        </ul>
      </div>

      {/* Chat */}
      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-700 mb-2">Chat</div>
        <ul className="space-y-1 text-sm text-gray-600">
          <li>
            <Link href="/user/chat" className="hover:text-gray-900 block py-1">
              Chat
            </Link>
          </li>
        </ul>
      </div>

      {/* Chat */}
      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-700 mb-2">My Reviews</div>
        <ul className="space-y-1 text-sm text-gray-600">
          <li>
            <Link href="/user/products-reviews" className="hover:text-gray-900 block py-1">
              Products Reviews
            </Link>
          </li>
        </ul>
      </div>

      {/* Account Info */}
      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-700 mb-2">
          Account Info
        </div>
        <ul className="space-y-1 text-sm text-gray-600">
          <li>
            <Link
              href="/user/profile"
              className="hover:text-gray-900 block py-1"
            >
              Account Setting
            </Link>
          </li>
          <li>
            <Link
              href="/user/my-wishlist"
              className="hover:text-gray-900 block py-1"
            >
              My Wishlist
            </Link>
          </li>
          {/* <li><Link href="/user/recently-viewed" className="hover:text-gray-900 block py-1">Recently Viewed</Link></li> */}
        </ul>
      </div>

      {/* Log Out */}
      <div className="pt-6 border-t border-gray-200">
        <Link
          href="#"
          className="text-sm text-red-600 hover:text-red-800 flex items-center gap-2"
        >
          <span>↩</span> Log Out
        </Link>
      </div>
    </>
  );

  return (
    <SidebarProvider className="bg-background">
      <SidebarInset>
        <Navbar />

        {/* Mobile Sidebar Toggle Button */}
        <div className="lg:hidden container mx-auto px-4 mt-32 mb-4">
          <button
            onClick={toggleMobileSidebar}
            className="flex items-center gap-2 px-2 py-2 bg-white border border-gray-200 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300 ease-in-out"
          >
            {isMobileSidebarOpen ? (
              <X size={18} />
            ) : (
              <MdOutlineSpaceDashboard size={20} />
            )}
          </button>
        </div>

        <div className="bg-background">
          <div className="container mx-auto px-4 flex flex-col h-full lg:flex-row gap-6">
            {/* Mobile Sidebar - Smooth Animated Overlay */}
            <div
              className={`lg:hidden fixed inset-0 z-50 transition-all duration-500 ease-in-out ${
                isMobileSidebarOpen
                  ? "opacity-100 visible"
                  : "opacity-0 invisible"
              }`}
            >
              {/* Background Overlay */}
              <div
                className={`absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity duration-500 ${
                  isMobileSidebarOpen ? "opacity-100" : "opacity-0"
                }`}
                onClick={toggleMobileSidebar}
              ></div>

              {/* Sidebar Slide Animation */}
              <div
                className={`absolute left-0 top-0 h-full w-80 bg-white overflow-y-auto p-6 shadow-xl transform transition-transform duration-500 ease-in-out ${
                  isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-800">
                    My Account
                  </h2>
                  <button
                    onClick={toggleMobileSidebar}
                    className="p-2 hover:bg-gray-100 rounded-md transition"
                  >
                    <X size={20} />
                  </button>
                </div>
                <SidebarContent />
              </div>
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden mt-2.5 lg:block w-64 flex-shrink-0 h-fit bg-white sticky rounded-md shadow-sm border border-gray-200 p-6 space-y-6 overflow-y-auto transition-all duration-300">
              <SidebarContent />
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0 h-full transition-all duration-300 ease-in-out">
              {children}
            </main>
          </div>
        </div>

        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
