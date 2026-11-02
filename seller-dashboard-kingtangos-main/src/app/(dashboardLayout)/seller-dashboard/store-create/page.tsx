"use client";

import StoreAccountForm from "@/components/dashboardLayout/StoreAccountForm";
import { useGetMeQuery } from "@/redux/api/authApi";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
  const router = useRouter();

  const { data, isLoading } = useGetMeQuery(undefined);

  useEffect(() => {
    // ✅ If store already exists, redirect
    if (!isLoading && data?.data?.stores?.id) {
      router.replace("/seller-dashboard");
    }
  }, [data, isLoading, router]);

  if (isLoading) {
    return <p>Checking store...</p>;
  }

  // ✅ If no store, show create store form
  return <StoreAccountForm />;
};

export default Page;








// import StoreAccountForm from '@/components/dashboardLayout/StoreAccountForm';
// import React from 'react';

// const page = () => {
//     return (
//         <div>
//             <StoreAccountForm />
//         </div>
//     );
// };

// export default page;