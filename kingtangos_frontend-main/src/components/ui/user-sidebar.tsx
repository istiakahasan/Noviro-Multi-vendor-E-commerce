"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { SlidersHorizontal, Plus, Minus, Star } from "lucide-react"

const subcategories = [
  "Hair & Grooming",
  "Nails & Lashes/Brows",
  "Skin & Aesthetics",
  "Spa & Massage",
  "Health & Medical Wellness",
  "Therapy & Counseling",
  "Physical Therapies",
  "Nutrition & Dietetics",
]

const priceRanges = [
  { id: "under-25", label: "Under USD 25", value: "0-25" },
  { id: "25-50", label: "USD 25 to USD 50", value: "25-50" },
  { id: "50-100", label: "USD 50 to USD 100", value: "50-100" },
  { id: "over-100", label: "Over USD 100", value: "100+" },
  { id: "custom", label: "Custom", value: "custom" },
]

function FilterContent() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [showAllCategories, setShowAllCategories] = useState(false)
  const [selectedPrice, setSelectedPrice] = useState<string>("")
  const [customPriceLow, setCustomPriceLow] = useState("")
  const [customPriceHigh, setCustomPriceHigh] = useState("")
  const [topDeals, setTopDeals] = useState(false)
  const [selectedRating, setSelectedRating] = useState<number>(0)

  const visibleCategories = showAllCategories ? subcategories : subcategories.slice(0, 6)

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category])
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <SlidersHorizontal className="w-6 h-6" />
        <h2 className="text-2xl font-bold">Filters</h2>
      </div>

      {/* Shop By Subcategory */}
      <div className="mb-8">
        <h3 className="text-base font-semibold mb-4">Shop By Subcategory</h3>
        <div className="space-y-3">
          {visibleCategories.map((category) => (
            <div key={category} className="flex items-center gap-2">
              <Checkbox
                id={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
              />
              <Label htmlFor={category} className="text-sm font-normal cursor-pointer">
                {category}
              </Label>
            </div>
          ))}
        </div>
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
      </div>

      {/* Price */}
      <div className="mb-8">
        <h3 className="text-base font-semibold mb-4">Price($)</h3>
        <RadioGroup value={selectedPrice} onValueChange={setSelectedPrice}>
          <div className="space-y-3">
            {priceRanges.map((range) => (
              <div key={range.id} className="flex items-center gap-2">
                <RadioGroupItem value={range.value} id={range.id} />
                <Label htmlFor={range.id} className="text-sm font-normal cursor-pointer">
                  {range.label}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>

        {/* Custom Price Inputs */}
        {selectedPrice === "custom" && (
          <div className="flex items-center gap-2 mt-4">
            <Input
              type="number"
              placeholder="Low"
              value={customPriceLow}
              onChange={(e) => setCustomPriceLow(e.target.value)}
              className="h-10"
            />
            <span className="text-sm text-muted-foreground">To</span>
            <Input
              type="number"
              placeholder="High"
              value={customPriceHigh}
              onChange={(e) => setCustomPriceHigh(e.target.value)}
              className="h-10"
            />
          </div>
        )}
      </div>

      {/* Special Offer */}
      <div className="mb-8">
        <h3 className="text-base font-semibold mb-4">Special Offer</h3>
        <div className="flex items-center gap-2">
          <Checkbox id="top-deals" checked={topDeals} onCheckedChange={(checked) => setTopDeals(checked as boolean)} />
          <Label htmlFor="top-deals" className="text-sm font-normal cursor-pointer">
            Top Deals
          </Label>
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="text-base font-semibold mb-4">Rating</h3>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setSelectedRating(star)}
              className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              aria-label={`${star} star${star > 1 ? "s" : ""}`}
            >
              <Star
                className={`w-6 h-6 ${
                  star <= selectedRating ? "fill-black text-black" : "fill-none text-black"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export function FilterSidebar() {
  return (
    <>
      <div className="lg:hidden fixed top-[137px] left-4 z-40">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="bg-white shadow-md">
              <SlidersHorizontal className="w-5 h-5" />
              <span className="sr-only">Open filters</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0 overflow-y-auto">
            <FilterContent />
          </SheetContent>
        </Sheet>
      </div>

      <aside className="hidden lg:block w-80 my-14 overflow-y-auto h-[95vh] bg-white rounded-xl">
        <FilterContent />
      </aside>
    </>
  )
}
