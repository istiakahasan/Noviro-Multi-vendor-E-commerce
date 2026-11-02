/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { SlidersHorizontal } from "lucide-react"
import { AiOutlineMinus } from "react-icons/ai"
import { FiPlus } from "react-icons/fi"
import { Slider } from "@/components/ui/slider"                                       
import { useTopDealsQuery } from "@/redux/api/topDealsApi"

interface CategorySidebarProps {
  onFiltersChange?: (filters: any) => void
}

export default function TopDealsSidebar({ onFiltersChange }: CategorySidebarProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>()
  const [selectedPriceRange, setSelectedPriceRange] = useState<[number, number]>([0, 5000])
  // const [rating, setRating] = useState(0)
  // const [hover, setHover] = useState(0)
  const [showAllCategories, setShowAllCategories] = useState(false)

  const { data: categoriesResponse } = useTopDealsQuery({})


  // Filter categories to only show those with non-empty arrays
  // const categories =
  //   Object.entries(categoriesResponse?.data || {})
  //     .filter(([ , consultations]: any) => consultations && consultations.length > 0) // Filter out empty arrays
  //     .map(([categoryName, consultations]: any) => ({
  //       name: categoryName,
  //       id: consultations[0]?.categoryId 
  //     })) || [];

  const categories =
  Array.isArray(categoriesResponse?.data)
    ? categoriesResponse.data
        .map((item: any) => ({
          id: item.category?.id,
          name: item.category?.name,
        }))
        // remove duplicates
        .filter(
          (cat: any, index: number, self: any[]) =>
            index === self.findIndex((c) => c.id === cat.id)
        )
    : [];


  useEffect(() => {
    const timeout = setTimeout(() => {
      const filters: any = {}

      if (selectedCategoryId) {
        filters.categoryId = selectedCategoryId
      }

      if (selectedPriceRange[0] !== 0 || selectedPriceRange[1] !== 100) {
        filters.minPrice = selectedPriceRange[0]
        filters.maxPrice = selectedPriceRange[1]
      }

      // Only add rating if user selected a rating
      // if (rating > 0) {
      //   filters.minRating = rating
      //   filters.maxRating = 5
      // }

      onFiltersChange?.(filters)
    }, 300)

    return () => clearTimeout(timeout)
  }, [selectedCategoryId, selectedPriceRange])
  



  // Limit visible categories
  const visibleCategories = showAllCategories ? categories : categories.slice(0, 4)


  return (
    <div className="w-64 bg-white p-6 h-4xl rounded-xl overflow-y-auto">

      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <SlidersHorizontal className="w-5 h-5" />
        <h2 className="font-semibold lg:text-2xl text-lg">Filters</h2>
      </div>

      {/* Categories - Only render if there are categories */}
      {categories.length > 0 && (
        <div className="mb-8">
          <h3 className="font-semibold text-sm mb-4">Category</h3>
          <div className="space-y-3">
            {visibleCategories.map((cat) => (
              <div key={cat.id} className="flex items-center space-x-2">
                <Checkbox
                  id={cat.id}
                  checked={selectedCategoryId === cat.id}
                  onCheckedChange={(checked) => setSelectedCategoryId(checked ? cat.id : undefined)}
                  className="w-4 h-4"
                />
                <label htmlFor={cat.id} className="text-sm text-gray-700 cursor-pointer">
                  {cat.name}
                </label>
              </div>
            ))}

            {categories.length > 4 && (
              <button
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="text-sm mt-2 flex items-center gap-2"
              >
                {showAllCategories ? (
                  <>
                    <AiOutlineMinus /> See Less
                  </>
                ) : (
                  <>
                    <FiPlus /> See More
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Price Slider */}
      <div className="mb-8">
        <h3 className="font-semibold text-sm mb-4">Price</h3>
        <span className="mb-3 flex w-full justify-between text-xs font-medium text-muted-foreground">
          <span>Low</span>
          <span>High</span>
        </span>
        <Slider
          value={selectedPriceRange}
          onValueChange={(value: [number, number]) => setSelectedPriceRange(value)}
          min={0}
          max={5000}
          step={1}
          showTooltip
        />
      </div>

      {/* Ratings Filter */}
      {/* <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => {
          const index = i + 1
          return (
            <button
              key={index}
              type="button"
              onClick={() => setRating(index)}
              onMouseEnter={() => setHover(index)}
              onMouseLeave={() => setHover(0)}
              className="focus:outline-none"
            >
              <Star
                className={`w-5 h-5 transition-colors duration-150 ${
                  index <= (hover || rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          )
        })}
        <span className="ml-2 text-sm text-gray-700">
          {rating > 0 ? `${rating} star${rating > 1 ? "s" : ""}` : "No rating"}
        </span>
      </div> */}
    </div>
  )
}