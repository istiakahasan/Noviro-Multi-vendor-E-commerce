"use client";

import Logo from "@/assets/logo.png";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Home,
  LayoutDashboard,
  User,
} from "lucide-react";
import Image from "next/image";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import Link from "next/link";

const data = {
  user: {
    navMain: [
      {
        title: "Dashboard",
        url: "/user",
        icon: LayoutDashboard,
      },
      {
        title: "Your Profile",
        url: "/user/dashboard/profile",
        icon: User,
      },
      {
        title: "Go Back To Home",
        url: "/",
        icon: Home,
      },
    ],
  },
  // admin: {
  //   navMain: [
  //     {
  //       title: "Dashboard",
  //       url: "/admin/dashboard",
  //       icon: LayoutDashboard,
  //     },
  //     {
  //       title: "Users",
  //       url: "/user/dashboard/users",
  //       icon: HandCoins,
  //       items: [
  //         {
  //           title: "Users",
  //           url: "/user/dashboard/estimates",
  //           icon: Users,
  //         },
  //         {
  //           title: "Pending Users",
  //           url: "/user/dashboard/pending-users",
  //           icon: InfoIcon,
  //         },
  //       ],
  //     },
  //     {
  //       title: "Your Profile",
  //       url: "/user/dashboard/profile",
  //       icon: User,
  //     },
  //     {
  //       title: "Go Back To Home",
  //       url: "/",
  //       icon: Home,
  //     },
  //   ],
  // },
};

// add roles based on your requirements
interface AppSidebarProps {
  role: string;
}

export default function AppSidebar({ role, ...props }: AppSidebarProps) {
  const sidebarData = data[role?.toLowerCase() as keyof typeof data];

  return (
    <Sidebar

      className="w-64 h-[80vh] mt-32"
      {...props}
    >
      <SidebarHeader>
        <Link
          href={"/"}
          className="flex items-center w-full max-h-40 justify-center"
        >
          <Image
            src={Logo.src}
            alt="Logo"
            width={300}
            height={300}
            className="size-auto "
          />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarData?.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
