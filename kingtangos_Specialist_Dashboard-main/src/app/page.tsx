// import Link from 'next/link';
// import React from 'react';

// const Home  = () => {
//   return (
//     <div>
//       Home

//       <Link href="/specialist-dashboard">Specialist Dashboard</Link>
//     </div>
//   );
// };

// export default Home ;

// // app/page.tsx
// import { redirect } from "next/navigation";

// export default function Home() {
//   redirect("/specialist-dashboard");
// }

// app/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import PageLoading from "@/components/ui/Loading";
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/specialist-dashboard");
    }, 1500); // 1.5 seconds delay before redirect

    return () => clearTimeout(timer);
  }, [router]);

  return <PageLoading />;
}
