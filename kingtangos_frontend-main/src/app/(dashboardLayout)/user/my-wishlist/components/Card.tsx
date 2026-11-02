/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { AiFillStar } from "react-icons/ai";

interface DealCardProps {
  product: any;
}

export default function DealCard({ product }: DealCardProps) {
  const {
    name,
    image,
    price,
    finalPrice,
    discount,
    averageRating = 0,
    totalReviews = 0,
    description,
    store,
  } = product;

  const hasDiscount = discount > 0;
  const displayPrice = hasDiscount ? finalPrice : price;

  return (
    <div className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image */}
      <div className="relative h-56 bg-gray-100">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
            -{discount}% OFF
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
          <button className="w-full bg-white text-gray-900 font-medium py-3 rounded-lg hover:bg-gray-100 transition">
            Add to Cart
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm">
            {name}
          </h3>
          <div className="flex items-center gap-1 text-yellow-500 text-sm">
            <AiFillStar />
            <span>
              {averageRating > 0 ? averageRating.toFixed(1) : "0.0"} ({totalReviews})
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-500 mb-2">{store.name}</p>
        <p className="text-xs text-gray-600 line-clamp-2 mb-4">{description}</p>

        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-gray-900">
            €{displayPrice.toFixed(2)}
          </span>
          {hasDiscount && price !== finalPrice && (
            <span className="text-sm text-gray-400 line-through">
              €{price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}