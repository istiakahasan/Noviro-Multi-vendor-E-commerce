// 'use client';
// import React from 'react';
// import { Bell, MessageSquare, ChevronDown, Search } from 'lucide-react';
// import Image from 'next/image';
// import { FaBell } from "react-icons/fa";
// import { AiFillMessage } from 'react-icons/ai';

// const Header: React.FC = () => {
//   return (
//     <header className="flex items-center justify-between bg-white- md:border-b md:shadow-sm px-4 md:px-8 py-3">
//       {/* Left Section: Profile Info */}
//       <div className="flex items-center gap-3">
//         {/* <Image
//           src="https://i.ibb.co.com/PyXSVMn/Ellipse-3.png"
//           alt="User"
//           width={42}
//           height={42}
//           className="rounded-full object-cover"
//         /> */}
//         <div className="flex flex-col">
//           <h2 className="text-sm font-semibold text-gray-800">John</h2>
//           <p className="text-xs text-gray-500">Style Specialist</p>
//         </div>
//       </div>

//       {/* Center Section: Search Bar */}
//       <div className="flex-1 max-w-lg mx-6 hidden sm:flex relative">
//         <Search className="absolute left-3 top-2.5 w-4 h-4  text-gray-400" />
//         <input
//           type="text"
//           placeholder="Search products, orders, customers..."
//           className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#6D6D6D]/10 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//         />
//       </div>

//       {/* Right Section: Icons + Avatar */}
//       <div className="flex items-center gap-5">
//         {/* Notifications */}
//         <div className="relative cursor-pointer">
//           {/* <Bell className="w-5 h-5 text-gray-700" /> */}
//           <FaBell className='w-5 h-5 text-gray-700'/>
//           <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-semibold rounded-full px-1.5">
//             3
//           </span>
//         </div>

//         {/* Messages */}
//         <div className="relative cursor-pointer">
//           <AiFillMessage className="w-5 h-5 text-gray-700" />
//           <span className="absolute -top-1 -right-2 bg-blue-500 text-white text-[10px] font-semibold rounded-full px-1.5">
//             5
//           </span>
//         </div>

//         {/* Rightmost Profile Dropdown */}
//         <div className="flex items-center gap-2 cursor-pointer">
//           <Image
//             src="https://i.ibb.co.com/tPkRmdmZ/Background-1.png"
//             alt="User"
//             width={34}
//             height={34}
//             className="rounded-full object-cover"
//           />
//           <ChevronDown className="w-4 h-4 text-gray-500" />
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;

"use client";
import React, { useState } from "react";
import { Bell, ChevronDown, LogOut, Search, User } from "lucide-react";
import Image from "next/image";
import { FaBell } from "react-icons/fa";
import { AiFillMessage } from "react-icons/ai";
import Link from "next/link";
import { toast } from "sonner";
import { useGetUserQuery } from "@/lib/api/users/userApi";
import { NotificationDrawer } from "@/components/notification/NotificationDrawer";
import { useGetNotificationsQuery } from "@/lib/api/notification/notificationApi";
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const { data: notificationsData } = useGetNotificationsQuery();
  const unreadCount =
    notificationsData?.data?.filter((n: any) => !n.isRead).length || 0;

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("You have been logged out");
    window.location.href = "/";
  };

  const { data, isLoading, isError } = useGetUserQuery();

  if (isLoading) return <span>Loading...</span>;
  if (isError) return <div>something went wrong</div>;

  return (
    <header className="flex items-center justify-between bg-white md:border-b md:shadow-sm px-4 md:px-8 py-3">
      {/* Left Section */}
      <div className="flex items-center gap-3"></div>

      {/* Search Bar */}
      {/* <div className="flex-1 max-w-lg mx-6 hidden sm:flex relative">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search products, orders, customers..."
          className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#6D6D6D]/10 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div> */}

      {/* Right Section */}
      <div className="flex items-center gap-5">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={() => setIsNotificationOpen(true)}
        >
          <Bell className="w-5 h-5 text-gray-700" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>

        <NotificationDrawer
          open={isNotificationOpen}
          onOpenChange={setIsNotificationOpen}
        />

        {/* Messages */}
        {/* <div className="relative cursor-pointer">
          <AiFillMessage className="w-5 h-5 text-gray-700" />
          <span className="absolute -top-1 -right-2 bg-blue-500 text-white text-[10px] font-semibold rounded-full px-1.5">
            5
          </span>
        </div> */}

        {/* Working Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 hover:opacity-90 transition"
          >
            <div className="w-12 h-12">
              <img
                // src="https://i.ibb.co.com/tPkRmdmZ/Background-1.png"
                src={data?.data?.profilePic || "/images/user.jpeg"}
                alt="User"
                className="rounded-full w-full h-full object-cover ring-2 ring-white shadow-sm"
              />
            </div>
            <div className="flex flex-col">
              {data?.data ? (
                <h2 className="text-sm font-semibold text-gray-800">
                  {data?.data?.firstName} {data?.data?.lastName}
                </h2>
              ) : (
                "Loading..."
              )}
              {/* <p className="text-xs text-gray-500">Style Specialist</p> */}
            </div>
            <ChevronDown
              className={`w-4 h-4 text-gray-500 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsOpen(false)}
              />

              {/* Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                <Link
                  href="/specialist-dashboard/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition text-sm font-medium"
                >
                  <User size={16} />
                  Profile
                </Link>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition text-sm font-medium"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
