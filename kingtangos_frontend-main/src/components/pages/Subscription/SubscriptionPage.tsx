/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Filter, X, CircleCheckBig } from "lucide-react";
import SubscriptionSidebar from "./SubscriptionSidebar";
import Link from "next/link";
import { AiFillStar } from "react-icons/ai";
import { useGetCategoryByProductPlansQuery } from "@/redux/api/plansApi";
import InnerBanner from "@/components/common/InnerBanner";
import PageLoading from "@/components/shared/PageLoading";

export default function SubscriptionPage() {
  const [filters, setFilters] = useState<any>({
    categoryId: undefined,
    minPrice: 0,
    maxPrice: 5000,
    minRating: 0,
  });

  const { data, isLoading } = useGetCategoryByProductPlansQuery(filters);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  if (isLoading) {
    return <PageLoading />;
  }

  if (!data?.data) {
    return <p className="text-center py-10">No products found</p>;
  }

  const clearAllFilters = () => {
    setFilters({
      categoryId: undefined,
      minPrice: 0,
      maxPrice: 5000,
      minRating: 0,
    });
    setIsMobileSidebarOpen(false);
  };

  const filteredCategories = Object.entries(data.data).filter(
    ([, subscriptions]) =>
      Array.isArray(subscriptions) && subscriptions.length > 0,
  );

  const hasSubscriptions = filteredCategories.length > 0;

  return (
    <div className="md:container mx-auto pb-16 pt-5">
      <div className="flex">
        <div className="hidden lg:block">
          <SubscriptionSidebar
            onFiltersChange={(newFilters) => setFilters(newFilters)}
            selectedCategoryId={filters.categoryId}
            selectedPriceRange={[
              filters.minPrice || 0,
              filters.maxPrice || 5000,
            ]}
            rating={filters.minRating || 0}
          />
        </div>

        <div
          className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300
  ${isMobileSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <div
            className="fixed inset-0 bg-black/20 bg-opacity-100"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div
            className={`fixed left-0 top-0 h-full w-80 bg-white shadow-lg overflow-y-auto overscroll-contain
    transform transition-transform duration-300 ease-out
    ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Filters</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileSidebarOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <SubscriptionSidebar
              onFiltersChange={(newFilters) => setFilters(newFilters)}
              selectedCategoryId={filters.categoryId}
              selectedPriceRange={[
                filters.minPrice || 0,
                filters.maxPrice || 5000,
              ]}
              rating={filters.minRating || 0}
            />
          </div>
        </div>

        <div className="flex-1 lg:px-6">
          <div className="lg:hidden mb-4 md:px-0 px-2">
            <Button
              variant="outline"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>

          <div>
            <InnerBanner
              titleBlack="Explore Top "
              titleOrange="Rated Products"
              description="Discover a world of top-rated products from trusted vendors, all in one place."
              // buttonText="Shop Now"
              buttonLink="/book"
              leftBgSrc="https://i.postimg.cc/kXf03P3W/Frame-2147227518.png"
              rightImgSrc="https://i.postimg.cc/gk8wwfbf/3d64b04ecb495d2c9dd5bba590dce3d7cdbe17a7.jpg"
              rightImgAlt="Banner Image"
            />

            {/* <PageBanner
              titleBlack="Explore Top "
              titleOrange="Rated Products"
              description="Discover a world of top-rated products from trusted vendors, all in one place."
              // buttonText="Shop Now"
              buttonLink="/book"
              leftBgSrc="https://i.postimg.cc/kXf03P3W/Frame-2147227518.png"
              rightImgSrc="https://i.postimg.cc/L5cVgMXQ/br.png"
              rightImgAlt="Banner Image"
            /> */}

            {/* Conditional Rendering - Moved OUTSIDE the categories map */}
            {isLoading ? (
              <div className="text-center py-10">
                <p>Loading subscriptions...</p>
              </div>
            ) : !hasSubscriptions ? (
              // No subscriptions found state
              <div className="text-center py-10">
                <p className="text-lg mb-4">
                  No subscriptions found matching your criteria
                </p>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or browse different categories
                </p>

                <Button variant="outline" onClick={clearAllFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              // Categories grid when there are results
              <div className="space-y-10 mt-10 md:px-0 px-2">
                {filteredCategories.map(
                  ([categoryName, subscriptions]: [string, any]) => (
                    <div key={categoryName} className="space-y-5">
                      {/* Category Header */}
                      <div className="flex items-center justify-between">
                        <h2 className="lg:text-3xl md:text-2xl text-xl font-semibold">
                          {categoryName}
                        </h2>
                      </div>

                      {/* Products Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                        {subscriptions.map((subscription: any, idx: number) => (
                          <Link
                            href={`/subscription/${subscription.id}`}
                            key={subscription.id}
                          >
                            <Card className="flex flex-col h-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
                              {/* Image + Hover overlay (unchanged) */}
                              <div className="relative h-48 w-full">
                                <Image
                                  src={subscription.image}
                                  alt={subscription.title || ""}
                                  width={500}
                                  height={500}
                                  className="h-48 w-full object-cover rounded-lg"
                                  loading={idx < 4 ? "eager" : "lazy"}
                                />
                              </div>

                              {/* Body */}
                              <div className="p-5 flex flex-col flex-1">
                                {/* Title */}
                                <h3 className="text-[13px] font-semibold text-gray-800 leading-snug line-clamp-2">
                                  {subscription.title}
                                </h3>

                                {/* Rating */}
                                <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                                  <AiFillStar className="text-yellow-600 text-sm" />
                                  <span>{subscription.averageRating}</span>
                                  <span>({subscription.totalReviews})</span>
                                </div>

                                {/* Price */}
                                <div className="mt-3 text-[15px] font-semibold text-gray-800">
                                  <span>EUR</span> {subscription.amount}/month
                                </div>

                                {/* Feature list */}
                                <ul className="mt-3 space-y-2 flex-1">
                                  {subscription.features.map(
                                    (f: any, i: any) => (
                                      <li
                                        key={i}
                                        className="flex items-start gap-2 text-[13px] text-gray-600"
                                      >
                                        <CircleCheckBig className="mt-[1px] shrink-0 text-blue-400 w-4 h-4" />
                                        <span>{f}</span>
                                      </li>
                                    ),
                                  )}
                                </ul>

                                {/* Button */}
                                <button
                                  type="button"
                                  className="mt-4 w-full rounded-md bg-primary py-2 text-sm font-semibold text-white transition hover:bg-primary/75"
                                >
                                  Get Started
                                </button>
                              </div>
                            </Card>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
