"use client";
import { CouponListResponse } from '@/types/storeAllCoupon.type';
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import CouponBox from './CouponBox';

interface ProductCouponCardProps {
  couponData: CouponListResponse | undefined;
}

export default function ProductCouponCard({ couponData }: ProductCouponCardProps) {

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Coupon Card */}
      <div
        onClick={() => setIsOpen(true)}
        className="group relative w-full max-w-md mb-7 cursor-pointer overflow-hidden bg-white rounded-lg p-6 shadow-md transition-all duration-300 hover:shadow-sm hover:scale-104"
      >
        {/* Decorative elements */}
        <div className="absolute -right-8 top-1/2 -translate-y-1/2 h-32 w-32  rounded-full opacity-20 blur-2xl group-hover:opacity-30 transition-opacity" />
        <div className="absolute -left-8 -top-8 h-24 w-24  rounded-full opacity-20 blur-2xl group-hover:opacity-30 transition-opacity" />

        {/* Content */}
        <div className="relative z-10 flex flex-col gap-2">
          <div className="flex items-baseline justify-between gap-4">
            <div className="flex-1">
              <p className="text-black text-sm font-medium opacity-90">GET COUPON</p>
              <h3 className="text-black text-3xl md:text-4xl font-bold leading-tight">
                {couponData?.data?.[0]?.discount}
                {couponData?.data?.[0]?.discountType === 'PERCENTAGE' ? '% OFF' : '€ OFF'}
              </h3>

              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Minmum Order:</span>
                <span className="font-medium">€{couponData?.data?.[0]?.minimumOrderAmount}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-black/30 my-2" />

          <div className="mt-2 text-sm text-black opacity-75 flex items-center gap-2">
            <span>Click for details</span>
            <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>

        {/* Dashed border effect */}
        <div className="absolute inset-0 border-2 border-dashed border-black/20 rounded-lg pointer-events-none" />
      </div>

      {/* Modal Dialog */}
      <div className='overflow-y-auto'>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="w-full max-w-4xl rounded-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Coupon Details</DialogTitle>
              <DialogDescription>
                Get the best deal with this exclusive offer
              </DialogDescription>
            </DialogHeader>

            {/* Coupon Details */}
            <div className="grid grid-cols-2 gap-5">
              {couponData?.data?.map((item) => (
                <div key={item.id} className="mt-4">
                  <CouponBox coupon={item} />
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}