

'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

// Icons
import { BiSolidDashboard } from "react-icons/bi";
import { BsCalendarCheckFill } from "react-icons/bs";
import { BiSolidTimeFive } from "react-icons/bi";
import { TbMessageChatbotFilled } from "react-icons/tb";
import { FaStar } from "react-icons/fa6";
import { HiMiniUserCircle } from "react-icons/hi2";
import logo from '@/../public/Images/logo.svg';

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/specialist-dashboard', icon: BiSolidDashboard, color: 'text-gray-700' },
    { name: 'My Bookings', href: '/specialist-dashboard/bookings', icon: BsCalendarCheckFill, color: 'text-[#FF5722]' },
    { name: 'Schedule Management', href: '/specialist-dashboard/schedule', icon: BiSolidTimeFive, color: 'text-[#C40000]' },
    { name: 'Customer Communication', href: '/specialist-dashboard/communication', icon: TbMessageChatbotFilled, color: 'text-[#0066FF]' },
    { name: 'Reviews & Ratings', href: '/specialist-dashboard/reviews', icon: FaStar, color: 'text-[#FFC107]' },
    { name: 'My Profile', href: '/specialist-dashboard/profile', icon: HiMiniUserCircle, color: 'text-[#006678]' },
  ];

  return (
    <aside className="flex flex-col w-64 h-full overflow-auto bg-white border-r shadow-sm">

      {/* Logo */}
      <Link href="/specialist-dashboard" className="flex items-center gap-2 p-4 border-b">
        <Image src={logo} alt="Logo" width={120} height={40} />
      </Link>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map(({ name, href, icon: Icon, color }) => {
          const isActive =
            href === '/specialist-dashboard'
              ? pathname === '/specialist-dashboard'
              : pathname.includes(href);
          return (
            <Link
              key={name}
              href={href}
              className={`flex text-[14px] items-center gap-3 px-3 py-2 rounded-lg transition font-medium ${
                isActive
                  ? 'bg-[#333333] text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon
                className={`w-5 h-5 ${color} ${
                  isActive ? 'scale-110 text-white' : ''
                } transition-transform`}
              />
              {name}
            </Link>
          );
        })}
      </nav>

      {/* Help Section */}
      <div className="p-4 mt-auto">
        <div className="rounded-xl p-3 text-center text-sm bg-gradient-to-r from-[#F3E6FF] to-[#DEECFF]">
          <p className="font-semibold text-start text-gray-800">Need Help?</p>
          <p className="text-xs text-gray-500">Contact your store manager</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
