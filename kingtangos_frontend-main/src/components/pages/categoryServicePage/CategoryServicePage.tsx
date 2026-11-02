/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import { CategoryServiceFilterSidebar, FilterState } from '@/components/common/CategoryServiceFilterSidebar'
import AnimationProvider from '@/components/providers/AnimationProvider'
import { useGetCategoryServiceQuery, useGetSubCategoryByIdQuery } from '@/redux/api/subCategoryApi'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import React, { useMemo, useState } from 'react'
import { AiFillStar } from 'react-icons/ai'

export default function CategoryServicePage() {

  const params = useParams()
  const categoryId = params.id as string
  const subCategoryId = params.serviceId as string

  const { data: subcategoryData } = useGetSubCategoryByIdQuery(categoryId)
  const subcategories = subcategoryData?.data || []


  // Fetch data from API
  const { data } = useGetCategoryServiceQuery({
    categoryId,
    subCategoryId
  })

  const [filters, setFilters] = useState<FilterState>({
    selectedSubcategories: [],
    priceRange: [0, 5000],
    topDealsOnly: false,
    minRating: 0
  })

  const services = data?.data || []


  const filteredServices = useMemo(() => {
    return services.filter((service: any) => {

      if (filters.selectedSubcategories.length > 0) {
        if (!filters.selectedSubcategories.includes(service.subCategoryId)) {
          return false
        }
      }

      // Filter by price
      if (service.finalPrice < filters.priceRange[0] ||
        service.finalPrice > filters.priceRange[1]) {
        return false
      }

      // Filter by top deals
      if (filters.topDealsOnly && !service.isTopDeal) {
        return false
      }

      // Filter by rating
      if (service.averageRating < filters.minRating) {
        return false
      }

      return true
    })
  }, [services, filters])

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
  }

  return (
    <div className="flex container min-h-screen">
      <CategoryServiceFilterSidebar
        subcategories={subcategories}
        onFilterChange={handleFilterChange}
      />
      <main className="flex-1 md:py-14 md:pl-6 pt-12">
        <div className="max-w- w-full mx-auto">
          <div className="fashion-banner">
            <div
              className="grid grid-cols-1 lg:grid-cols-2 bg-cover bg-center h-full items-center">
              {/* Text content */}
              <div className="max-w-lg mx-auto ">
                <AnimationProvider animation='fade-up' duration={0.7}>
                  <h1
                    className={`text-3xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 leading-tight transition-all duration-500 text-center `}
                  >
                    Search Anything,
                    <br />
                    <span className="text-orange-500">
                      Find Everything
                    </span>
                  </h1>
                </AnimationProvider>
                <AnimationProvider animation='fade-up' duration={0.9}>
                  <p
                    className={`text-gray-600 lg:text-lg text-base mb-8 leading-relaxed transition-all duration-500 delay-100 text-center px-2 lg:px-0`}
                  >
                    Discover a world of amazing products and services from trusted vendors, all in one place.
                  </p>
                </AnimationProvider>
                <AnimationProvider animation='fade-up' duration={1}>
                  <div className="flex justify-center">
                    <button
                      className={`bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-medium transition-all duration-500 delay-200`}
                    >
                      Shop Now
                    </button>
                  </div>
                </AnimationProvider>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 my-10">
            {filteredServices.length > 0 ? (
              filteredServices.map((service: any) => (
                <article
                  key={service.id}
                  className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md p-5"
                >
                  <div className="relative h-48 w-full bg-gray-100">
                    <Image
                      src={service?.profilePic}
                      alt={service?.name}
                      width={500}
                      height={500}
                      className="h-full w-full object-cover rounded-lg"
                    />
                  </div>

                  <div className="mt-4 flex flex-col gap-2 pb-4 pt-3">
                    <span className="text-sm font-semibold text-gray-800">
                      {service.name}
                    </span>

                    <span className="inline-flex items-center gap-1 text-base text-gray-600">
                      <AiFillStar className="shrink-0 text-xl text-yellow-600" />
                      {service.averageRating.toFixed(1)}({service.totalReviews})
                    </span>

                    <p className="my-3">{service?.location}</p>

                    <div className="text-lg font-semibold mt-4">
                      € {service?.price}
                    </div>
                  </div>
                </article>
              ))
            ) : (
             
              <div className="col-span-full flex justify-center items-center py-20">
                <p className="text-lg font-medium text-gray-500">
                  No products found matching your criteria
                </p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  )
}
