/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { SlidersHorizontal, Star } from "lucide-react";
import { FiPlus } from "react-icons/fi";
import { AiOutlineMinus } from "react-icons/ai";
import { Slider } from "@/components/ui/slider";
import { useGetCategoryByProductQuery } from "@/redux/api/productsApi";

interface CategorySidebarProps {
  onFiltersChange?: (filters: any) => void;
  selectedCategoryId?: string;
  selectedPriceRange: [number, number];
  rating: number;
  isTopDeal: boolean;
}

export default function ProductSidebar({
  onFiltersChange,
  selectedCategoryId: propSelectedCategoryId,
  selectedPriceRange: propSelectedPriceRange,
  rating: propRating,
  isTopDeal: propIsTopDeal,
}: CategorySidebarProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    string | undefined
  >();
  const [selectedPriceRange, setSelectedPriceRange] = useState<
    [number, number]
  >([0, 5000]);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [isTopDeal, setIsTopDeal] = useState<boolean>(false);
  // Add state for stock availability
  const [stockAvailability, setStockAvailability] = useState<
    boolean | undefined
  >(undefined); // undefined = show all

  const { data: categoriesResponse } = useGetCategoryByProductQuery({});

  const categories =
    Object.entries(categoriesResponse?.data || {})
      .filter(([, products]: any) => products && products.length > 0)
      .map(([categoryName, products]: any) => ({
        name: categoryName,
        id: products[0]?.categoryId,
      })) || [];

  // Updating filters to parent component
  useEffect(() => {
    const timeout = setTimeout(() => {
      // Create base filters object
      const filters: any = {
        categoryId: selectedCategoryId,
        minPrice: selectedPriceRange[0],
        maxPrice: selectedPriceRange[1],
        minRating: rating,
        maxRating: 5,
        isTopDeal: isTopDeal,
      };

      // Only add stockQuantity if it's defined (not undefined)
      if (stockAvailability !== undefined) {
        filters.stockQuantity = stockAvailability;
      }

      onFiltersChange?.(filters);
    }, 300);

    return () => clearTimeout(timeout);
  }, [
    selectedCategoryId,
    selectedPriceRange,
    rating,
    isTopDeal,
    stockAvailability,
  ]);

  // Sync with props when they change
  useEffect(() => {
    setSelectedCategoryId(propSelectedCategoryId);
  }, [propSelectedCategoryId]);

  // useEffect(() => {
  //   setSelectedPriceRange(propSelectedPriceRange);
  // }, [propSelectedPriceRange]);

  useEffect(() => {
  if (
    propSelectedPriceRange[0] !== selectedPriceRange[0] ||
    propSelectedPriceRange[1] !== selectedPriceRange[1]
  ) {
    setSelectedPriceRange(propSelectedPriceRange);
  }
}, [propSelectedPriceRange]);

  useEffect(() => {
    setRating(propRating);
  }, [propRating]);

  useEffect(() => {
    setIsTopDeal(propIsTopDeal);
  }, [propIsTopDeal]);

  // Handle stock availability change
  const handleStockChange = (value: boolean) => {
    setStockAvailability((prev) => (prev === value ? undefined : value)); // Toggle: if same value selected, clear filter (show all)
  };

  // Limit visible categories
  const visibleCategories = showAllCategories
    ? categories
    : categories.slice(0, 4);

  return (
    <div className="w-64 bg-white p-6 h-4xl rounded-xl overflow-y-auto touch-pan-y">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <SlidersHorizontal className="w-5 h-5" />
        <h2 className="font-semibold lg:text-2xl text-lg">Filters</h2>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <h3 className="font-semibold text-sm mb-4">Category</h3>
        <div className="space-y-3">
          {visibleCategories.map((cat) => (
            <div key={cat.id} className="flex items-center space-x-2">
              <Checkbox
                id={cat.id}
                checked={selectedCategoryId === cat.id}
                onCheckedChange={(checked) =>
                  setSelectedCategoryId(checked ? cat.id : undefined)
                }
                className="w-4 h-4"
              />
              <label
                htmlFor={cat.id}
                className="text-sm text-gray-700 cursor-pointer"
              >
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

      {/* Price Slider */}
      <div className="mb-8">
        <h3 className="font-semibold text-sm mb-4">Price</h3>
        <span className="mb-3 flex w-full justify-between text-xs font-medium text-muted-foreground">
          <span>Low</span>
          <span>High</span>
        </span>
        <Slider
          value={selectedPriceRange}
          onValueChange={(value: [number, number]) =>
            setSelectedPriceRange(value)
          }
          min={0}
          max={5000}
          step={1}
          showTooltip
          className="touch-pan-x"
        />
      </div>

      {/* Availability */}
      <div className="mb-8">
        <h3 className="font-semibold text-sm mb-4">Availability</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="in-stock"
              checked={stockAvailability === true}
              onCheckedChange={() => handleStockChange(true)}
              className="w-4 h-4"
            />
            <label
              htmlFor="in-stock"
              className="text-sm text-gray-700 cursor-pointer"
            >
              In Stock
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="out-of-stock"
              checked={stockAvailability === false}
              onCheckedChange={() => handleStockChange(false)}
              className="w-4 h-4"
            />
            <label
              htmlFor="out-of-stock"
              className="text-sm text-gray-700 cursor-pointer"
            >
              Out of Stock
            </label>
          </div>
        </div>
      </div>

      {/* Special Offer */}
      <div className="mb-8">
        <h3 className="font-semibold text-sm mb-4">Special Offer</h3>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="top-deals"
            checked={isTopDeal}
            onCheckedChange={(checked) => setIsTopDeal(checked as boolean)}
            className="w-4 h-4"
          />
          <label
            htmlFor="top-deals"
            className="text-sm text-gray-700 cursor-pointer"
          >
            Top Deals
          </label>
        </div>
      </div>

      {/* Ratings Filter */}
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => {
          const index = i + 1;
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
          );
        })}
        <span className="ml-2 text-sm text-gray-700">
          {rating > 0 ? `${rating} star${rating > 1 ? "s" : ""}` : "No rating"}
        </span>
      </div>
    </div>
  );
}
