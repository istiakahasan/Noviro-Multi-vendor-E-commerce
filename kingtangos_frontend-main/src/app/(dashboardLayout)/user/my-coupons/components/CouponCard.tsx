// user/my-coupons/components/CouponCard.tsx

'use client';

import Image from 'next/image';
import React from 'react';

interface CouponCardProps {
  discount: number;
  minAmount: number;
  code: string;
  disclaimer?: string;
  onUse?: () => void;
}

const CouponCard: React.FC<CouponCardProps> = ({
  discount,
  minAmount,
  code,
  disclaimer = 'This coupon cannot be used on clearance items',
  onUse,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 max-w-sm mx-auto relative">
      {/* Discount badge image */}
      <div className="relative flex mb-2">
        <div className="absolute -top-2 -left-7">
          <Image
            src="/coupon-image.png"
            width={200}
            height={200}
            className="absolute z-10 max-h-[80px] max-w-[110px]"
            alt="coupon image"
          />
          <span className="text-white absolute z-20 top-7 left-7 font-bold text-md flex items-center justify-center gap-2">
            {discount}% off
          </span>
        </div>

        {/* Coupon code */}
        <div className="text-md font-bold text-gray-600 ml-24 pt-1">
          CODE: {code.toUpperCase()}
        </div>
      </div>

      {/* Offer text and button */}
      <div className="flex ml-24 items-center justify-between mb-3">
        <span className="text-xs text-gray-900">
          Orders over ${minAmount.toFixed(2)}
        </span>
        <button
          onClick={onUse}
          className="bg-black text-white px-4 py-2 rounded text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Use Now
        </button>
      </div>

      {/* Disclaimer */}
      <p className="text-xs border-t pt-2 text-gray-500 italic">{disclaimer}</p>
    </div>
  );
};

export default CouponCard;
