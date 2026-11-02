"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/redux/hooks";
import { toggleSidebar } from "@/lib/uiSlice";
import { Bell, ChevronDown, Menu, MessageSquare, Search } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
// import StoreImg from "@/assets/icons/seller.png";
import UserImg from "@/assets/icons/user.png";
import { useGetUserQuery } from "@/redux/features/user/userApi";
import { useGetNotificationsQuery } from "@/redux/api/notificationApi";
import { NotificationDrawer } from "@/components/shared/NotificationDrawer";

export function Header() {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: user } = useGetUserQuery();
  const { data: notificationsData } = useGetNotificationsQuery();

  const unreadCount =
    notificationsData?.data?.filter((n: any) => !n.isRead).length || 0;

  return (
    <header className="bg-white px-4 sm:px-6 py-3 border-b border-gray-200">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(toggleSidebar())}
            className="lg:hidden shrink-0"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
        {/* Middle: search */}
        {/* <div className="flex-1 pl-2 max-w-2xl w-full">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              ref={inputRef}
              placeholder="Search products, orders, customers..."
              onChange={(e) => setSearchText(e.target.value)}
              value={searchText}
              className="pl-9 py-2 bg-gray-100 border-none w-full"
            />
          </div>
        </div> */}

        {/* Right: actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setIsNotificationOpen(true)}
          >
            <Bell className="w-5 h-5" />
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

          <Link href="/admin-dashboard/chat" className="">
            <MessageSquare className="w-5 h-5" />
          </Link>
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="shadow-none border-none px-1">
                <div className="">
                  {/* <Image
                    src={UserImg}
                    alt="User"
                    className="object-cover rounded-full"
                  /> */}
                  {/* Left: brand */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-12 h-12 shrink-0">
                      {/* <Image
              src={user?.data?.profilePic || UserImg}
              width={200}
              height={200}
              alt="Store logo"
              className="object-cover rounded-full"
              unoptimized
            /> */}
                      <Image
                        src={user?.data?.profilePic || UserImg}
                        alt="profile"
                        fill
                        className="object-cover rounded-full"
                      />
                    </div>
                    <div className="truncate">
                      <div className="text-sm font-medium leading-tight truncate">
                        {user?.data.firstName + " " + user?.data.lastName}{" "}
                      </div>
                      <div className="text-[11px] text-gray-500 leading-tight">
                        Admin Dashboard
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className="hidden sm:block text-left">
                   <p className="text-sm font-medium leading-tight">John Doe</p>
                   <p className="text-[11px] text-gray-500 leading-tight">  Admin</p>
                </div> */}
                <ChevronDown
                  className={`h-4 w-4 text-gray-500 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white p-1 w-48">
              <Link href="/admin-dashboard/profile">
                <DropdownMenuItem className="hover:bg-gray-100 px-3 py-2 text-sm">
                  Profile
                </DropdownMenuItem>
              </Link>
              <Link href="/admin-dashboard/platform-setting">
                <DropdownMenuItem className="hover:bg-gray-100 px-3 py-2 text-sm">
                  Settings
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
