/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import ConsultationSidebar from "./ConsultationSideBar";
import { IoStar } from "react-icons/io5";
import Link from "next/link";
import { useGetConsultationsbyCtegoryQuery } from "@/redux/api/consultationsApi";
import PageLoading from "@/components/shared/PageLoading";
import InnerBanner from "@/components/common/InnerBanner";

export default function ConsultationPage() {
  const [filters, setFilters] = useState<any>({
    categoryId: undefined,
    minPrice: 0,
    maxPrice: 5000,
    minRating: 0,
    location: undefined,
  });

  const { data, isLoading } = useGetConsultationsbyCtegoryQuery(filters);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  if (isLoading) {
    return <PageLoading />;
  }

  if (!data?.data) {
    return <p className="text-center py-10">No consultants found</p>;
  }

  const clearAllFilters = () => {
    setFilters({
      categoryId: undefined,
      minPrice: 0,
      maxPrice: 5000,
      minRating: 0,
      location: undefined,
    });
    setIsMobileSidebarOpen(false);
  };

  // Filter out categories that have empty arrays
  const filteredCategories = Object.entries(data.data).filter(
    ([, consultations]) =>
      Array.isArray(consultations) && consultations.length > 0,
  );

  const hasConsultations = filteredCategories.length > 0;

  return (
    <div className="md:container mx-auto -mt-10 pb-12 pt-5">
      <div className="flex">
        {/* Sidebar (Desktop) */}
        <div className="hidden lg:block">
          <ConsultationSidebar
            onFiltersChange={(newFilters) => setFilters(newFilters)}
            selectedCategoryId={filters.categoryId}
            selectedPriceRange={[
              filters.minPrice || 0,
              filters.maxPrice || 5000,
            ]}
            rating={filters.minRating || 0}
          />
        </div>

        {/* Sidebar (Mobile) */}

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
            <ConsultationSidebar
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

        {/* Main Content */}
        <div className="flex-1 lg:px-6 ">
          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4 px-2 md:px-0">
            <Button
              variant="outline"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>

          {/* Banner */}

          <InnerBanner
            titleBlack="Find Consultations,"
            titleOrange="Get Results!"
            description="Hire the best industry consultants anytime, anywhere."
            // buttonText="Hire Now"
            buttonLink="/consultation"
            leftBgSrc="https://i.postimg.cc/kXf03P3W/Frame-2147227518.png"
            rightImgSrc="https://i.postimg.cc/cH0tZhbf/7370193c5bee6c7968a90ace3628462027d0cf38.jpg"
            rightImgAlt="consultant"
          />

          {/* <PageBanner
            titleBlack="Find Consultations,"
            titleOrange="Get Results!"
            description="Hire the best industry consultants anytime, anywhere."
            // buttonText="Hire Now"
            buttonLink="/consultation"
            leftBgSrc="https://i.postimg.cc/kXf03P3W/Frame-2147227518.png"
            rightImgSrc="https://i.postimg.cc/pXWf7pHX/br.png"
            rightImgAlt="consultant"
          /> */}

          {/* Categories / Consultants */}
          {isLoading ? (
            <div className="text-center py-10">
              <p>Loading consultations...</p>
            </div>
          ) : !hasConsultations ? (
            // No consultations found state
            <div className="text-center py-10">
              <p className="text-lg mb-4">
                No consultations found matching your criteria
              </p>
              <p className="text-gray-600 mb-6">
                Try adjusting your filters or browse different categories
              </p>

              <Button variant="outline" onClick={clearAllFilters}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="space-y-10 mt-10 md:px-0 px-2">
              {filteredCategories.map(
                ([categoryName, consultations]: [string, any]) => (
                  <div key={categoryName} className="space-y-5">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <h2 className="lg:text-3xl md:text-2xl text-xl font-semibold">
                        {categoryName}
                      </h2>
                    </div>

                    {/* Listing */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {consultations.map((consultation: any, idx: any) => (
                        <Link
                          key={consultation.id}
                          href={`/consultation/${consultation.id}`}
                          className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md p-5"
                        >
                          <div className="relative h-48 w-full">
                            <Image
                              src={
                                consultation?.profilePic || "/placeholder.svg"
                              }
                              alt={consultation?.name}
                              width={500}
                              height={500}
                              className="h-48 w-full object-cover rounded-lg"
                              loading={idx < 4 ? "eager" : "lazy"}
                            />
                            <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                              <div className="pointer-events-auto mb-3 w-full px-3">
                                <Link
                                  key={consultation.id}
                                  href={`/consultation/${consultation.id}`}
                                >
                                  <button className="w-full rounded-md bg-neutral-900/90 py-2 text-center text-sm font-medium text-white shadow-md hover:bg-neutral-900 transition-colors">
                                    View Details
                                  </button>
                                </Link>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="gap-1">
                              <h3 className="font-medium pt-3 truncate">
                                {consultation.name}
                              </h3>

                              <div className="flex items-center pt-2 gap-1.5">
                                <IoStar className="fill-yellow-400 text-yellow-400" />
                                <span>{consultation.averageRating}</span>
                                <span className="text-gray-500">
                                  ({consultation.totalReviews})
                                </span>
                              </div>

                              <p className="py-1 text-sm text-gray-500">
                                {consultation.location}
                              </p>
                            </div>

                            <div className="flex items-center gap-2 font-semibold">
                              € {consultation.price}
                            </div>
                          </div>
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
  );
}
