"use client";

import type React from "react";

import { useIsMobile } from "@/hooks/use-mobile";

import { setIsMobile } from "@/lib/uiSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Header } from "@/components/ui/header";
import { Sidebar } from "./sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const { sidebarOpen } = useAppSelector((state) => state.ui);

  useEffect(() => {
    dispatch(setIsMobile(isMobile));
  }, [isMobile, dispatch]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const routeSegment = pathname.split("/").filter(Boolean).pop() || "dashboard";
  //   console.log("Path: ", routeSegment);

  return (
    <div className="flex h-screen bg-gray-50">
     <div className="overflow-y-auto h-screen custom-scroll">
  <Sidebar />
</div>


      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => dispatch({ type: "ui/closeSidebar" })}
        />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6 bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}
