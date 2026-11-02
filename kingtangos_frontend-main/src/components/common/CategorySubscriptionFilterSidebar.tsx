"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { SlidersHorizontal, Plus, Minus, Star } from "lucide-react"
import { Slider } from "../ui/slider"

interface SubCategory {
  id: string
  name: string
  description: string
  categoryId: string
  slug: string
  image: string
  isActive: boolean
}

interface FilterContentProps {
  subcategories: SubCategory[]
  onFilterChange: (filters: FilterState) => void
}

export interface FilterState {
  selectedSubcategories: string[]
  priceRange: [number, number]
  topDealsOnly: boolean
  minRating: number
}

function FilterContent({ subcategories, onFilterChange }: FilterContentProps) {
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([])
  const [showAllCategories, setShowAllCategories] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000])
  const [topDealsOnly, ] = useState(false)
  const [selectedRating, setSelectedRating] = useState<number>(0)
  const [hoverRating, setHoverRating] = useState<number>(0)

  const visibleSubcategories = showAllCategories 
    ? subcategories 
    : subcategories.slice(0, 6)

  const handleSubcategoryChange = (subcategoryId: string, checked: boolean) => {
    const updated = checked
      ? [...selectedSubcategories, subcategoryId]
      : selectedSubcategories.filter((id) => id !== subcategoryId)
    
    setSelectedSubcategories(updated)
    onFilterChange({
      selectedSubcategories: updated,
      priceRange,
      topDealsOnly,
      minRating: selectedRating
    })
  }

  const handlePriceChange = (value: number[]) => {
    const newRange: [number, number] = [value[0], value[1]]
    setPriceRange(newRange)
    onFilterChange({
      selectedSubcategories,
      priceRange: newRange,
      topDealsOnly,
      minRating: selectedRating
    })
  }

  // const handleTopDealsChange = (checked: boolean) => {
  //   setTopDealsOnly(checked)
  //   onFilterChange({
  //     selectedSubcategories,
  //     priceRange,
  //     topDealsOnly: checked,
  //     minRating: selectedRating
  //   })
  // }

  const handleRatingChange = (rating: number) => {
    const newRating = rating === selectedRating ? 0 : rating
    setSelectedRating(newRating)
    onFilterChange({
      selectedSubcategories,
      priceRange,
      topDealsOnly,
      minRating: newRating
    })
  }

  return (
    <div className="p-6 ">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <SlidersHorizontal className="w-6 h-6" />
        <h2 className="text-2xl font-bold">Filters</h2>
      </div>

      {/* Shop By Subcategory */}
      <div className="mb-8">
        <h3 className="text-base font-semibold mb-4">Shop By Subcategory</h3>
        <div className="space-y-3">
          {visibleSubcategories.map((subcategory) => (
            <div key={subcategory.id} className="flex items-center gap-2">
              <Checkbox
                id={subcategory.id}
                checked={selectedSubcategories.includes(subcategory.id)}
                onCheckedChange={(checked) => 
                  handleSubcategoryChange(subcategory.id, checked as boolean)
                }
              />
              <Label 
                htmlFor={subcategory.id} 
                className="text-sm font-normal cursor-pointer"
              >
                {subcategory.name}
              </Label>
            </div>
          ))}
        </div>
        {subcategories.length > 6 && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-3 px-0 h-auto font-normal text-sm hover:bg-transparent"
            onClick={() => setShowAllCategories(!showAllCategories)}
          >
            {showAllCategories ? (
              <>
                <Minus className="w-4 h-4 mr-1" />
                Show Less
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-1" />
                Show More
              </>
            )}
          </Button>
        )}
      </div>

      {/* Price */}
      <div className="mb-8">
        <h3 className="text-base font-semibold mb-4">Price($)</h3>
        <Slider
          min={0}
          max={5000}
          step={1}
          showTooltip
          value={priceRange}
          onValueChange={handlePriceChange}
        />
      </div>

      {/* Special Offer */}

      {/* <div className="mb-8">
        <h3 className="text-base font-semibold mb-4">Special Offer</h3>
        <div className="flex items-center gap-2">
          <Checkbox 
            id="top-deals" 
            checked={topDealsOnly} 
            onCheckedChange={(checked) => handleTopDealsChange(checked as boolean)} 
          />
          <Label htmlFor="top-deals" className="text-sm font-normal cursor-pointer">
            Top Deals
          </Label>
        </div>
      </div> */}

      {/* Rating */}
      <div>
        <h3 className="text-base font-semibold mb-4">Rating</h3>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => handleRatingChange(rating)}
              onMouseEnter={() => setHoverRating(rating)}
              onMouseLeave={() => setHoverRating(0)}
              className="focus:outline-none"
            >
              <Star
                className={`w-5 h-5 transition-colors duration-150 ${
                  rating <= (hoverRating || selectedRating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-700">
            {selectedRating > 0 ? `${selectedRating} star${selectedRating > 1 ? "s" : ""}` : "No rating"}
          </span>
        </div>
      </div>
    </div>
  )
}

interface CategorySubscriptionFilterSidebarProps {
  subcategories: SubCategory[]
  onFilterChange: (filters: FilterState) => void
}

export function CategorySubscriptionFilterSidebar({ 
  subcategories, 
  onFilterChange 
}: CategorySubscriptionFilterSidebarProps) {
  return (
    <>
      <div className="lg:hidden fixed top-[137px] left-4 z-40">
        <Sheet >
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="bg-white shadow-md">
              <SlidersHorizontal className="w-5 h-5" />
              <span className="sr-only">Open filters</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80  p-0 overflow-y-auto">
            <FilterContent 
              subcategories={subcategories} 
              onFilterChange={onFilterChange} 
            />
          </SheetContent>
        </Sheet>
      </div>

      <aside className="hidden lg:block w-80 my-14 overflow-y-auto h-[60vh] bg-white rounded-xl">
        <FilterContent 
          subcategories={subcategories} 
          onFilterChange={onFilterChange} 
        />
      </aside>
    </>
  )
}