"use client";
import { jwtDecode } from "jwt-decode";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

interface DecodedToken {
  role?: string;
  exp?: number;
}

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isVerified, setIsVerified] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const decoded: DecodedToken = jwtDecode(token);
      console.log("decoded token", decoded);

      //   Check role
      if (
        decoded?.role !== "ADMIN" &&
        decoded?.role !== "SUPER_ADMIN" &&
        decoded?.role !== "STAFF"
      ) {
        localStorage.removeItem("token"); // force logout
        router.replace("/login");
        return;
      }

      // RESTRICTED ROUTES FOR STAFF
      if (decoded?.role === "STAFF") {
        const restrictedRoutes = [
          "/admin-dashboard/platform-setting",
          "/admin-dashboard/platform-settings",
          "/admin-dashboard/user-management",
          "/admin-dashboard/payments-payouts",
          "/admin-dashboard/withdrawal-request",
          "/admin-dashboard/staff-management",
          "/admin-dashboard/subscription-cancellation",
          "/admin-dashboard/category-management",
          "/admin-dashboard/monitor-chat",
        ];

        console.log("Current path:", pathname);
        console.log("User role:", decoded?.role);

        // Check if current path starts with any restricted route
        const isRestricted =
          pathname &&
          restrictedRoutes.some((route) => pathname.startsWith(route));

        console.log("Is restricted:", isRestricted);

        if (isRestricted) {
          console.log("Redirecting to /access-denied");
          router.replace("/access-denied");
          return;
        }
      }

      // Check token expiry
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        router.replace("/login");
        return;
      }

      setIsVerified(true);
    } catch (error) {
      localStorage.removeItem("token");
      router.replace("/login");
    }
  }, [router, pathname]);

  if (!isVerified) return null; // Prevent flicker

  return <div>{children}</div>;
};

export default ProtectedRoute;
