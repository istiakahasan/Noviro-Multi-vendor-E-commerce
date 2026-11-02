// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { jwtDecode } from "jwt-decode";

// interface DecodedToken {
//   role?: string;
//   exp?: number;
// }

// export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
//   const router = useRouter();
//   const [isVerified, setIsVerified] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       router.replace("/auth/login");
//       return;
//     }

//     try {
//       const decoded: DecodedToken = jwtDecode(token);
//       console.log("decoded token", decoded);

//       // Check role
//       if (decoded.role !== "specialist") {
//         localStorage.removeItem("token"); // force logout
//         router.replace("/auth/login");
//         return;
//       }

//       // Check token expiry
//       if (decoded.exp && decoded.exp * 1000 < Date.now()) {
//         localStorage.removeItem("token");
//         router.replace("/auth/login");
//         return;
//       }

//       setIsVerified(true);
//     } catch (error) {
//       localStorage.removeItem("token");
//       router.replace("/auth/login");
//     }
//   }, []);

// //   if (!isVerified) return null; // Prevent flicker

//   return <>{children}</>;
// }

"use client";
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface DecodedToken {
  role?: string;
  exp?: number;
}

const ProtectedRoute = ({children}:{children: React.ReactNode}) => {
    const [isVerified, setIsVerified] = useState(false);
    const router = useRouter();
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
      if (decoded?.role !== "SPECIALIST") {
        localStorage.removeItem("token"); // force logout
        router.replace("/login");
        return;
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
  }, []);

    if (!isVerified) return null; // Prevent flicker

    return (
        <div>
            {children}
        </div>
    );
};

export default ProtectedRoute;