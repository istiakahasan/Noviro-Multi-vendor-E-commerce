/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"
import { CategorySubscriptionFilterSidebar, FilterState } from '@/components/common/CategorySubscriptionFilterSidebar'
// import { FilterSidebar } from '@/components/common/FilterSidebar'
import AnimationProvider from '@/components/providers/AnimationProvider'
import { useGetCategorySubscriptionQuery, useGetSubCategoryByIdQuery } from '@/redux/api/subCategoryApi'
import { CircleCheckBig } from 'lucide-react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import React, { useMemo, useState } from 'react'
import { AiFillStar } from 'react-icons/ai'

export default function CategorySubscriptionPage() {

    const params = useParams()
    const categoryId = params.id as string
    const subCategoryId = params.subscriptionId as string

    // Fetch data from API
    const { data } = useGetCategorySubscriptionQuery({
        categoryId,
        subCategoryId
    })

    const { data: subcategoryData } = useGetSubCategoryByIdQuery(categoryId)
    const subcategories = subcategoryData?.data || []

    const [filters, setFilters] = useState<FilterState>({
        selectedSubcategories: [],
        priceRange: [0, 5000],
        topDealsOnly: false,
        minRating: 0
    })

    const subscriptions = data?.data || []

    const filteredSubscriptions = useMemo(() => {
        return subscriptions.filter((subscription: any) => {
            // Filter by subcategory
            if (filters.selectedSubcategories.length > 0) {
                if (!filters.selectedSubcategories.includes(subscription.subCategoryId)) {
                    return false
                }
            }

            // Filter by price
            const amount = Number(subscription.amount)
            if (
                amount < filters.priceRange[0] ||
                amount > filters.priceRange[1]
            ) {
                return false
            }

            // Filter by top deals
            if (filters.topDealsOnly && !subscription.isTopDeal) {
                return false
            }

            // Filter by rating
            if (subscription.averageRating < filters.minRating) {
                return false
            }

            return true
        })
    }, [subscriptions, filters])

    const handleFilterChange = (newFilters: FilterState) => {
        setFilters(newFilters)
    }


    return (
        <div className="flex container min-h-screen">

            <CategorySubscriptionFilterSidebar
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

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 my-10">
                        {filteredSubscriptions.length > 0 ? (
                            filteredSubscriptions.map((subscription: any) => (
                                <article
                                    key={subscription.id}
                                    className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                                >
                                    {/* Image */}
                                    <div className="relative h-40 w-full sm:h-44">
                                        <Image
                                        src={subscription?.profilePic || '/placeholder-image.png'}
                                        alt={subscription?.planName}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 25vw"
                                        priority={subscription.id <= 4}
                                    />
                                    </div>

                                    {/* Body */}
                                    <div className="p-5">
                                        {/* Title */}
                                        <h3 className="text-[13px] font-semibold text-gray-800 leading-snug line-clamp-2">
                                            {subscription?.planName}
                                        </h3>

                                        {/* Rating */}
                                        <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                                            <AiFillStar className="text-yellow-600 text-sm" />
                                            <span>{subscription.averageRating.toFixed(1)}</span>
                                            <span>({subscription.totalReviews})</span>
                                        </div>

                                        {/* Price */}
                                        <div className="mt-3 text-[15px] font-semibold text-gray-800">
                                            € {subscription.amount}/month
                                        </div>

                                        {/* Feature list */}
                                        <ul className="mt-3 space-y-2">
                                            {subscription.features ?? [].map((f: string, i: any) => (
                                                <li
                                                    key={i}
                                                    className="flex items-start gap-2 text-[13px] text-gray-600"
                                                >
                                                    <CircleCheckBig className="mt-[1px] shrink-0 text-blue-400 w-4 h-4" />
                                                    <span>{f}</span>
                                                </li>
                                            ))
                                            }
                                        </ul>

                                        {/* Button */}
                                        <button
                                            type="button"
                                            className="mt-4 w-full rounded-md bg-primary py-2 text-sm font-semibold text-white transition hover:bg-primary/75"
                                        >
                                            Get Started
                                        </button>
                                    </div>
                                </article>
                            ))
                        ) : (

                            <div className="col-span-full flex justify-center items-center py-20">
                                <p className="text-lg font-medium text-gray-500">
                                    No subscriptions found matching your criteria
                                </p>
                            </div>
                        )}

                    </div>
                </div>
            </main>
        </div>
    )
}
