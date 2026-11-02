"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/redux/hooks";
import { toggleSidebar } from "@/lib/uiSlice";
import StoreImg from "@/assets/icons/seller.png";
import UserImg from "@/assets/icons/human-icon.jpg";
import { useGetMeQuery } from "@/redux/api/authApi";
import { useGetMyStoreQuery } from "@/redux/api/storeApi/storeApi";
import { NotificationButton } from "../dashboardLayout/notification/NotificationButton";
import { Menu } from "lucide-react";
// Remove the unused imports
// import { useGetMyAllNotificationQuery } from "@/redux/api/notificationApi/notificationApi";
// import { Notification } from "@/types/notification.type";

export function Header() {
  const dispatch = useAppDispatch();

  // Fetch profile
  const { data } = useGetMeQuery({});
  const userData = data?.data;

  // Fetch store data
  const { data: storeResponse } = useGetMyStoreQuery({});
  const storeData = storeResponse?.data;

  // Remove the notification query and unreadCount calculation from here
  // since NotificationButton handles it internally

  return (
    <header className="bg-white px-4 sm:px-6 py-3 md:border-b md:shadow-sm md:px-8">
      <div className="flex items-center justify-between gap-4">
        {/* Left: brand */}
        <div className="flex items-center gap-3 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(toggleSidebar())}
            className="lg:hidden shrink-0"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="relative w-12 h-12 shrink-0">
            <Image
              src={storeData?.logo || StoreImg.src}
              alt="Store logo"
              width={48}
              height={48}
              className="object-cover rounded-full w-12 h-12"
            />
          </div>
          <div className="truncate">
            <div className="text-lg font-medium leading-tight truncate">
              {storeData?.name || "John's Digital Store"}
            </div>
            <div className="text-[13px] text-gray-500 leading-tight mt-2">
              Seller Dashboard
            </div>
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* NotificationButton now handles the bell icon and badge internally */}
          <NotificationButton />
          
          <div className="w-8 h-8 rounded-full bg-gray-200 border border-amber-50 grid place-items-center text-xs">
            <Image
              src={userData?.profilePic || UserImg.src}
              alt="User"
              width={25}
              height={25}
              className="object-cover rounded-full w-7 h-7"
            />
          </div>
        </div>
      </div>
    </header>
  );
}