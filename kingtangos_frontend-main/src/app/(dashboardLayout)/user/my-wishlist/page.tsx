/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useMyWishlistQuery } from "@/redux/api/userDashbord/userDashbordApi";
import WishlistSkeleton from "./components/WishlistSkeleton";
import DealCard from "./components/Card";

const WishlistPage = () => {
  const {
    data: wishlistResponse,
    isLoading,
    isError,
    error,
  } = useMyWishlistQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const myWishlists: any[] =
    wishlistResponse?.data?.map((item: any) => item.product) ?? [];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>

        {/* Loading State */}
        {isLoading && <WishlistSkeleton />}

        {/* Error State */}
        {isError && (
          <div className="text-center py-16">
            <p className="text-red-600 text-lg font-medium">
              Failed to load wishlist.
            </p>
            <p className="text-gray-500 mt-2">
              {(error as any)?.data?.message || "Please try again later."}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && myWishlists.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-24 h-24 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-gray-500">
              Save your favorite items and come back later!
            </p>
          </div>
        )}

        {/* Wishlist Items */}
        {!isLoading && !isError && myWishlists.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {myWishlists.map((product) => (
              <DealCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Just For You Section (Future) */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Just for You
          </h2>
          <div className="bg-gray-100 border-2 border-dashed rounded-xl h-48 flex items-center justify-center">
            <p className="text-gray-500">
              Personalized recommendations coming soon...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
