/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { CategoryProductFilterSidebar } from "@/components/common/CategoryProductFilterSidebar";
import type { FilterState } from "@/components/common/CategoryProductFilterSidebar";
import AnimationProvider from "@/components/providers/AnimationProvider";
import { useGetCategoryProductQuery } from "@/redux/api/subCategoryApi";
import { useGetSubCategoryByIdQuery } from "@/redux/api/subCategoryApi";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useState, useMemo } from "react";
import { AiFillStar } from "react-icons/ai";

export default function CategoryProductPage() {
  const params = useParams();
  const categoryId = params.id as string;

  // Fetch subcategories for filtering
  const { data: subcategoryData } = useGetSubCategoryByIdQuery(categoryId);
  const subcategories = subcategoryData?.data || [];

  // Fetch data from API
  const { data } = useGetCategoryProductQuery({
    categoryId,
  });

  // Get products from API response
  const products = data?.data?.products || [];

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    selectedSubcategories: [],
    priceRange: [0, 5000],
    topDealsOnly: false,
    minRating: 0,
  });

  // Apply filters to products
  const filteredProducts = useMemo(() => {
    return products.filter((product: any) => {
      // Filter by subcategory
      if (filters.selectedSubcategories.length > 0) {
        if (!filters.selectedSubcategories.includes(product.subCategoryId)) {
          return false;
        }
      }

      // Filter by price
      if (
        product.finalPrice < filters.priceRange[0] ||
        product.finalPrice > filters.priceRange[1]
      ) {
        return false;
      }

      // Filter by top deals
      if (filters.topDealsOnly && !product.isTopDeal) {
        return false;
      }

      // Filter by rating
      if (product.averageRating < filters.minRating) {
        return false;
      }

      return true;
    });
  }, [products, filters]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  return (
    <div className="flex container min-h-screen">
      <CategoryProductFilterSidebar
        subcategories={subcategories}
        onFilterChange={handleFilterChange}
      />
      <main className="flex-1 md:py-14 md:pl-6 pt-12">
        <div className="max-w-full w-full mx-auto">
          <div className="fashion-banner">
            <div className="grid grid-cols-1 lg:grid-cols-2 bg-cover bg-center h-full items-center">
              <div className="max-w-lg mx-auto ">
                <AnimationProvider animation="fade-up" duration={0.7}>
                  <h1 className="text-3xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 leading-tight transition-all duration-500 text-center">
                    Search Anything, <br />
                    <span className="text-orange-500">Find Everything</span>
                  </h1>
                </AnimationProvider>
                <AnimationProvider animation="fade-up" duration={0.9}>
                  <p className="text-gray-600 lg:text-lg text-base mb-8 leading-relaxed transition-all duration-500 delay-100 text-center px-2 lg:px-0">
                    Discover a world of amazing products and services from
                    trusted vendors, all in one place.
                  </p>
                </AnimationProvider>
                <AnimationProvider animation="fade-up" duration={1}>
                  <div className="flex justify-center">
                    <button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-medium transition-all duration-500 delay-200">
                      Shop Now
                    </button>
                  </div>
                </AnimationProvider>
              </div>
            </div>
          </div>

          {/* <CustomBanner
                        titleBlack="Find Consultations,"
                        titleOrange="Get Results!"
                        description="Hire the best industry consultants anytime, anywhere."
                        // buttonText="Hire Now"
                        buttonLink="/consultation"
                        leftBgSrc="https://i.postimg.cc/kXf03P3W/Frame-2147227518.png"
                        rightImgSrc="https://i.postimg.cc/pXWf7pHX/br.png"
                        rightImgAlt="consultant"
                    /> */}

          {/* Products Grid */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 my-10">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product: any) => (
                <Link href={`/product/${product.id}`} key={product.id}>
                  <article
                    key={product.id}
                    className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md p-5"
                  >
                    {/* Product Image */}
                    <div className="relative h-48 w-full bg-gray-100">
                      <Image
                        src={
                          product?.variants?.[0]?.image ||
                          product?.images?.[0] ||
                          "/placeholder.png"
                        }
                        alt={product.name}
                        width={500}
                        height={500}
                        className="h-full w-full object-cover rounded-lg"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="mt-4 flex flex-col gap-2 pb-4 pt-3">
                      <span className="text-sm font-semibold text-gray-800">
                        {product.name}
                      </span>

                      {/* Store Info */}
                      <span className="text-xs text-gray-500">
                        {product.store.name}
                      </span>

                      {/* Rating */}
                      <span className="inline-flex items-center gap-1 text-base text-gray-600">
                        <AiFillStar className="shrink-0 text-xl text-yellow-600" />
                        {product.averageRating.toFixed(1)} (
                        {product.totalReviews})
                      </span>

                      {/* Price */}
                      <div className="text-lg font-semibold mt-4">
                        € {product?.finalPrice}
                      </div>
                    </div>
                  </article>
                </Link>
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
  );
}
