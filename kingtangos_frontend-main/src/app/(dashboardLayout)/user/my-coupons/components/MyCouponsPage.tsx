/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from "react";
import CouponCard from "./CouponCard";
import { useGetMyCouponQuery } from "@/redux/api/userDashbord/userDashbordApi";
import { Skeleton } from "@/components/ui/skeleton";

const MyCouponsPage = () => {
  const { data, error, isLoading } = useGetMyCouponQuery({});

  const handleUseNow = (code: string) => {
    console.log(`Coupon applied: ${code}`);
  };

  return (
    <div>
      <div className="border-b border-gray-300 py-4 flex justify-between px-4">
        <h1 className="text-xl font-bold">My Coupons</h1>
        <p className="underline text-sm">Rules</p>
      </div>

      <div className="max-w-7xl mx-auto gap-6 my-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {isLoading && Array.from({ length: 4 }).map((_, idx) => (
          <Skeleton  key={idx} />
        ))}

        {!isLoading && error && (
          <div className="text-center py-10 text-red-500 col-span-full">
            Failed to load coupons.
          </div>
        )}

        {!isLoading && data?.data?.data?.length === 0 && (
          <div className="text-center py-10 col-span-full">
            No coupons available.
          </div>
        )}

        {!isLoading && data?.data?.data?.map((coupon: any) => (
          <CouponCard
            key={coupon.id}
            discount={coupon.discount}
            minAmount={coupon.minimumOrderAmount}
            code={coupon.couponCode}
            disclaimer="This coupon cannot be used on clearance items"
            onUse={() => handleUseNow(coupon.couponCode)}
          />
        ))}
      </div>
    </div>
  );
};

export default MyCouponsPage;
