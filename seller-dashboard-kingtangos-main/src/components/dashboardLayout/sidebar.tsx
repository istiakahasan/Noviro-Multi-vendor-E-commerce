"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { closeSidebar } from "@/lib/uiSlice";
import { cn } from "@/lib/utils";
import { LayoutDashboard, LogOut } from "lucide-react";
import { HiMiniBuildingStorefront } from "react-icons/hi2";
import { BsBoxSeamFill } from "react-icons/bs";
import { FcServices } from "react-icons/fc";
import { GiDiscussion } from "react-icons/gi";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { RiUserSettingsFill, RiUserStarFill } from "react-icons/ri";
import { BsFillCartCheckFill } from "react-icons/bs";
import { RiMessage2Fill } from "react-icons/ri";
import { HiSpeakerphone } from "react-icons/hi";
import { TbReportAnalytics } from "react-icons/tb";
import { FaClock } from "react-icons/fa6";
import { RiCalendarScheduleFill } from "react-icons/ri";
import { TbShoppingCartDiscount } from "react-icons/tb";
// import { FaHandHoldingDollar } from "react-icons/fa6";
import { RiRefundFill } from "react-icons/ri";
import { PiHandWithdrawFill } from "react-icons/pi";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import Logo from "@/assets/logo.png";
import { useGetMeQuery } from "@/redux/api/authApi"; // Import your API hook
import { logout } from "@/redux/features/user/authSlice";

// const navigation = [
//   { name: "Dashboard", href: "/seller-dashboard", icon: LayoutDashboard },
//   { name: "Store Management", href: "/seller-dashboard/store", icon: HiMiniBuildingStorefront },
//   {
//     name: "Product Management",
//     href: "/seller-dashboard/product",
//     icon: Calendar,
//   },
//   {
//     name: "Service Management",
//     href: "/seller-dashboard/service",
//     icon: FileText,
//   },
//   {
//     name: "Consultation ",
//     href: "/seller-dashboard/consultation",
//     icon: CircleDollarSign,
//   },
//   // {
//   //   name: "Schedule Management ",
//   //   href: "/seller-dashboard/schedule",
//   //   icon: CircleDollarSign,
//   // },
//   {
//     name: "Subscription ",
//     href: "/seller-dashboard/subscription",
//     icon: CircleDollarSign,
//   },
//   {
//     name: "Specialist",
//     href: "/seller-dashboard/specialist",
//     icon: CircleDollarSign,
//   },
//   {
//     name: "Orders & Bookings",
//     href: "/seller-dashboard/order-booking",
//     icon: CircleDollarSign,
//   },
//   {
//     name: "Payments & Earnings",
//     href: "/seller-dashboard/payments-earnings",
//     icon: CircleDollarSign,
//   },
//   {
//     name: "Marketing & Promotions",
//     href: "/seller-dashboard/marketing-promotions",
//     icon: CircleDollarSign,
//   },
//   {
//     name: "Reports & Analytics",
//     href: "/seller-dashboard/report-analytics",
//     icon: User,
//   },
// ];

const seller = [
  {
    name: "Dashboard",
    href: "/seller-dashboard",
    icon: LayoutDashboard,
    iconColor: "text-blue-500",
  },
  {
    name: "Store Management",
    href: "/seller-dashboard/store",
    icon: HiMiniBuildingStorefront,
    iconColor: "text-red-500",
  },
  {
    name: "Product Management",
    href: "/seller-dashboard/product",
    icon: BsBoxSeamFill,
    iconColor: "text-blue-600",
  },
  {
    name: "Service Management",
    href: "/seller-dashboard/service",
    icon: FcServices,
    iconColor: "text-purple-500",
  },
  {
    name: "Consultation",
    href: "/seller-dashboard/consultation",
    icon: GiDiscussion,
    iconColor: "text-pink-500",
  },
  {
    name: "Subscription",
    href: "/seller-dashboard/subscription",
    icon: FaMoneyCheckAlt,
    iconColor: "text-red-500",
  },
  {
    name: "Specialist",
    href: "/seller-dashboard/specialist",
    icon: RiUserStarFill,
    iconColor: "text-green-600",
  },
  {
    name: "My Bookings",
    href: "/seller-dashboard/bookings",
    icon: RiCalendarScheduleFill,
    iconColor: "text-blue-500",
  },
  {
    name: "Schedule Management",
    href: "/seller-dashboard/schedule",
    icon: FaClock,
    iconColor: "text-black",
  },
  {
    name: "Special Offers",
    href: "/seller-dashboard/special-offers",
    icon: TbShoppingCartDiscount,
    iconColor: "text-red-700",
  },
  {
    name: "Orders & Bookings",
    href: "/seller-dashboard/order-booking",
    icon: BsFillCartCheckFill,
    iconColor: "text-red-700",
  },
  // {
  //   name: "Payments & Earnings",
  //   href: "/seller-dashboard/payments-earnings",
  //   icon: FaHandHoldingDollar,
  //   iconColor: "text-cyan-500",
  // },
  {
    name: "Withdrawal System",
    href: "/seller-dashboard/withdraw",
    icon: PiHandWithdrawFill,
    iconColor: "text-cyan-500",
  },
  {
    name: "Refund System",
    href: "/seller-dashboard/refund",
    icon: RiRefundFill,
    iconColor: "text-red-500",
  },
  {
    name: "Marketing & Promotions",
    href: "/seller-dashboard/marketing-promotions",
    icon: HiSpeakerphone,
    iconColor: "text-rose-500",
  },
  {
    name: "Reports & Analytics",
    href: "/seller-dashboard/report-analytics",
    icon: TbReportAnalytics,
    iconColor: "text-teal-500",
  },
  {
    name: "Message",
    href: "/seller-dashboard/message",
    icon: RiMessage2Fill,
    iconColor: "text-teal-500",
  },
  {
    name: "Profile Settings",
    href: "/seller-dashboard/profile-settings",
    icon: RiUserSettingsFill,
    iconColor: "text-teal-500",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter(); // ✅ Add this line

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { sidebarOpen, isMobile } = useAppSelector((state) => state.ui);

  // Use the getMe query hook
  const { data: user } = useGetMeQuery({});

  const handleLinkClick = () => {
    dispatch(closeSidebar());
  };

  
  const handleLogout = () => {
  toast.promise(
    new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        try {
          // Simulate a 90% chance of successful logout
          const isSuccess = Math.random() > 0.1;

          if (isSuccess) {
            // Actually dispatch the logout action to clear Redux state, localStorage, and cookies
            dispatch(logout());
            resolve();
          } else {
            reject(new Error("Network error"));
          }
        } catch (error) {
          reject(new Error("Logout failed"));
        }
      }, 1000);
    }),
    {
      loading: "Logging out...",
      success: () => {
        // Redirect to login after success
        setTimeout(() => {
          router.push("/login");
        }, 500);
        return `Goodbye, ${
          user?.name || user?.email || "User"
        }! You have been logged out 👋`;
      },
      error: (err) => `Logout failed: ${err.message}`,
    }
  );
};
  return (
    <>
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-none transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 border-r shadow-sm",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 p-6">
            <Link href="/seller-dashboard" onClick={handleLinkClick}>
              <div className="relative" style={{ width: 200, height: 50 }}>
                <Image
                  src={Logo}
                  fill
                  alt="EventX"
                  className="object-contain"
                  priority
                  sizes="h-auto w-auto"
                  draggable={false}
                />
              </div>
            </Link>
          </div>

          {/* Navigation */}
          {/* <nav className="flex-1 px-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-white"
                      : "text-[#727272] hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav> */}

          <nav className="flex-1 overflow-y-auto px-4 space-y-2">
            {seller.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-white"
                      : "text-[#727272] hover:bg-gray-100 hover:text-gray-900",
                  )}
                >
                  <item.icon
                    className={cn(
                      "w-5 h-5",
                      isActive ? "text-white" : item.iconColor,
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Info & Sign Out */}
          <div className="p-4 border-t space-y-2">
            {/* Display user info if available */}
            {user && (
              <div className="px-3 py-2 text-sm text-gray-600">
                <p className="font-medium truncate">
                  {user.name || user.email}
                </p>
                {user.role && (
                  <p className="text-xs text-gray-500 capitalize">
                    {user.role}
                  </p>
                )}
              </div>
            )}

            {/* Sign Out Button */}
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
    </>
  );
}