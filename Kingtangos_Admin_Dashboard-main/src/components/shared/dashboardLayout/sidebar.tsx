"use client";

import { useUserRole } from "@/hooks/useUserRole";
import { closeSidebar } from "@/lib/uiSlice";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  AlignHorizontalJustifyCenter,
  ChartAreaIcon,
  ChartNoAxesCombined,
  HandCoins,
  HandHeart,
  LayoutDashboard,
  Lock,
  LogOut,
  MessageCircle,
  Mic2Icon,
  Route,
  Router,
  Subscript,
  SubscriptIcon,
  Wallet2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BsGear, BsShopWindow, BsWindowDash } from "react-icons/bs";
import { FaRoute, FaServicestack, FaUser } from "react-icons/fa";
import { toast } from "sonner";

export function Sidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { sidebarOpen } = useAppSelector((state) => state.ui);

  const { role, isRoleLoading } = useUserRole();

  //  Navigation items with colorful icons
  const navigation = [
    {
      name: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
      color: "text-[#4BB4FF]",
    },

    ...(role === "SUPER_ADMIN"
      ? [
          {
            name: "User Management",
            href: "/admin-dashboard/user-management/seller",
            icon: FaUser,
            color: "text-[#03848D]",
          },
        ]
      : []),

    {
      name: "Store & Content",
      href: "/admin-dashboard/store-content",
      icon: BsShopWindow,
      color: "text-[#FF5722]",
    },
    {
      name: "Orders & Bookings ",
      href: "/admin-dashboard/orders-bookings",
      icon: HandHeart,
      color: "text-[#28A745]",
    },
    {
      name: "Subscriptions ",
      href: "/admin-dashboard/subscriptions",
      icon: BsWindowDash,
      color: "text-[#000C8B]",
    },
  // ...(role === "SUPER_ADMIN"
  //     ? [
  //           {
  //     name: "Subscription Cancellation",
  //     href: "/admin-dashboard/subscription-cancellation",
  //     icon: Route,
  //     color: "text-[#FB041B]",
  //   },
  //       ]
  //     : []),
  
  ...(role === "SUPER_ADMIN"
    ? [
      {
        name: "Category Management",
        href: "/admin-dashboard/category-management",
        icon: FaRoute,
        color: "text-[#9E0240]",
      },
      {
            name: "Payments & Refunds",
            href: "/admin-dashboard/payments-payouts",
            icon: Wallet2,
            color: "text-[#23358F]",
          },
        ]
      : []),

    {
      name: "Marketing & Promotions",
      href: "/admin-dashboard/marketing",
      icon: Mic2Icon,
      color: "text-[#FFD904]",
    },
    {
      name: "Reports & Analytics",
      href: "/admin-dashboard/reports-analytics",
      icon: ChartNoAxesCombined,
      color: "text-[#901BA2]",
    },
    
    ...(role === "SUPER_ADMIN"
      ? [
        {
          name: "Monitor Chat",
          href: "/admin-dashboard/monitor-chat",
          icon: MessageCircle,
          color: "text-[#0D7CFB]",
        },
          {
            name: "Service Types",
            href: "/admin-dashboard/service-types",
            icon: FaServicestack,
            color: "text-[#000000]",
          },
          {
            name: "Withdrawal Request",
            href: "/admin-dashboard/withdrawal-request",
            icon: HandCoins,
            color: "text-[#19A40D]",
          },
          // {
          //   name: "Support Disputes",
          //   href: "/admin-dashboard/support-disputes",
          //   icon: HandCoins,
          //   color: "text-[#19A40D]",
          // },
          {
            name: "Platform Settings",
            href: "/admin-dashboard/platform-settings",
            icon: BsGear,
            color: "text-[#4F6C6E]",
          },
          {
            name: "Staff management",
            href: "/admin-dashboard/staff-management",
            icon: Lock,
            color: "text-[#D1C000]",
          },
        ]
      : []),

    // {
    //   name: "Platform Settings",
    //   href: "/admin-dashboard/platform-settings",
    //   icon: BsGear,
    //   color: "text-[#4F6C6E]",
    // },
  ];
  const handleLinkClick = () => {
    dispatch(closeSidebar());
  };

  const handleLogout = () => {
    console.log("Logging out...");
    localStorage.removeItem("token");
    window.location.href = "/";
    // toast
    toast.success("You have been logged out 👋");
    // Simulate a 90% chance of successful logout
    // toast.promise(
    //   new Promise<void>((resolve, reject) => {
    //     setTimeout(() => {
    //       const isSuccess = Math.random() > 0.1;
    //       isSuccess ? resolve() : reject(new Error("Network error"));
    //     }, 1000);
    //   }),
    //   {
    //     loading: "Logging out...",
    //     success: "You have been logged out 👋",
    //     error: (err) => `Logout failed: ${err.message}`,
    //   }
    // );
  };

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white h-screen border-none shadow-none transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        sidebarOpen ? "translate-x-0 " : "-translate-x-full",
      )}
    >
      <div className="flex flex-col h-full">
        {/* 🔷 Logo */}
        <Link
          href="/"
          className="flex items-center justify-center gap-2 p-6 border-b"
        >
          <div className="flex items-center gap-3 text-lg font-bold">
            {/* <p className="bg-blue-600 p-2 rounded-lg">
              <BsShopWindow size={20} className="text-white" />
            </p> */}
            <Image
              src="/logo-without-name.png"
              alt="logo"
              width={40}
              height={40}
            />
            <span>Admin Panel</span>
          </div>
        </Link>

        {/* 🧭 Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-4 overflow-auto">
          {navigation.map(({ name, href, icon: Icon, color }) => {
            /**
             * Check if the current pathname is active for this link.
             *
             * - pathname === href: exact match (e.g., "/admin-dashboard/store-content")
             * - pathname.startsWith(href + "/"): covers subroutes (e.g., "/admin-dashboard/store-content/edit")
             */
            const isActive =
              pathname === href || pathname.startsWith(href + "/");

            return (
              <Link
                key={name}
                href={href}
                onClick={handleLinkClick}
                className={cn(
                  "flex items-center gap-3 px-3 py-4 rounded-lg transition font-medium text-[12px]",
                  isActive
                    ? "bg-[#333333] text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-100",
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 transition-transform",
                    color,
                    isActive && "scale-110 text-white",
                  )}
                />
                {name}
              </Link>
            );
          })}
        </nav>

        {/* 🚪 Sign Out */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full text-left text-sm font-medium hover:text-red-600 text-black bg-gray-200 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
