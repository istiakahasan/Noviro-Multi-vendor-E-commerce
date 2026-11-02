/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import PageBanner from "../PageBanner";
import { useTopDealsQuery } from "@/redux/api/topDealsApi";
import Link from "next/link";
import { AiFillStar } from "react-icons/ai";
import { PiWarningCircleLight } from "react-icons/pi";
import TopDealsSidebar from "./TopDealsSidebar";

export default function TopDealsPage() {

  const [filters, setFilters] = useState<any>({
    categoryId: [],
  });

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { data, isLoading } = useTopDealsQuery(filters);
  const deals = data?.data || [];

  console.log("----", deals);

  // Filter out categories that have empty arrays
  // const filteredCategories = data?.data
  //   ? Object.entries(data.data).filter(([, services]) =>
  //     Array.isArray(services) && services.length > 0
  //   )
  //   : [];


const hasProducts = Array.isArray(deals) && deals.length > 0;


  return (
    <div className="container mx-auto py-20">

      <div className="flex">
        {/* Sidebar - Always visible on desktop */}
        <div className="hidden lg:block">
          <TopDealsSidebar onFiltersChange={(filters: any) => setFilters(filters)} />
        </div>

        {/* Mobile Sidebar */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-lg overflow-y-auto">
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
              <TopDealsSidebar onFiltersChange={(filters: any) => setFilters(filters)} />
            </div>
          </div>
        )}

        <div className="flex-1 px-4 lg:px-6">
          {/* Mobile filter button */}
          <div className="lg:hidden mb-4">
            <Button
              variant="outline"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>

          {/* Page Banner - Always visible */}
          <PageBanner
            titleBlack="Find Services,"
            titleOrange="Get Results!"
            description="Discover a world of services and products from trusted vendors, all in one place."
            buttonText="Shop Now"
            buttonLink="/book"
            leftBgSrc="https://i.postimg.cc/kXf03P3W/Frame-2147227518.png"
            rightImgSrc="https://i.postimg.cc/pXWf7pHX/br.png"
            rightImgAlt="subscription plan"
          />

          {isLoading ? (
            <div className="text-center py-10">
              <p>Loading services...</p>
            </div>
            ) : !hasProducts ? (
              // No services found state
              <div className="text-center py-10">
                <p className="text-lg mb-4">No services found matching your criteria</p>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or browse different categories
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    // Reset filters
                    setFilters({ categoryId: [] });
                    // Close mobile sidebar if open
                    setIsMobileSidebarOpen(false);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
          ) : (
            // Services grid - Only render when services exist
            <div className="space-y-10">


              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {deals.map((product: any, idx) => (
                  <Link href={`/product/${product.id}`} key={product.id}>

                    <article
                      key={product.id}
                      className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md p-5"
                    >
                      {/* Image + Hover overlay */}
                      <div className="relative h-48 w-full bg-gray-100">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={500}
                          height={500}
                          className="h-full w-full object-cover rounded-lg"
                          loading={idx < 4 ? "eager" : "lazy"}
                        />
                        <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                          <div className="pointer-events-auto mb-3 w-full px-3">
                            <Link href={"/cart"}>
                              <button className="w-full rounded-md bg-neutral-900/90 py-2 text-center text-sm font-medium text-white shadow-md hover:bg-neutral-900">
                                Add To Cart
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>

                      {/* Body */}
                      <div className="mt-4 pb-4 pt-3">

                        {product.sponsored && (
                          <span className="rounded-full text-primary/60 px-2 py-0.5 font-medium">
                           <PiWarningCircleLight /> Sponsored
                         
                          </span>
                        )}

                        {/* Title + rating */}
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-800">
                            {product.name}
                          </span>
                          <span className="inline-flex items-center gap-1 text-base text-gray-600">
                            <AiFillStar className="shrink-0 text-xl text-yellow-600" />
                            {product.averageRating.toFixed(1)}({product.totalReviews})
                          </span>
                        </div>

                        {/* Price row */}
                        <div className="mb-8 flex items-center gap-3">
                          <div className="text-lg font-semibold">EUR {product.price}</div>
                          <div className="text-base text-gray-400 line-through">
                            EUR {product.price}
                          </div>
                          <span className="rounded-full bg-gray-900 px-2 py-0.5 text-base font-medium text-white">
                            {product.discount}% off
                          </span>
                        </div>

                        {/* Subtitle */}
                        <p className="text-sm font-bold text-gray-800">{product.subcategory.name}</p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>

          )}
        </div>
      </div>
    </div>
  );
}