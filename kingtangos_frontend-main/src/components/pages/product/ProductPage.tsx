/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { Button } from "@/components/ui/button";
import { useGetCategoryByProductQuery } from "@/redux/api/productsApi";
import { Filter, X } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import ProductSidebar from "./ProductSidebar";
import { IoStar } from "react-icons/io5";
import Link from "next/link";
import InnerBanner from "@/components/common/InnerBanner";
import PageLoading from "@/components/shared/PageLoading";

export default function ProductPage() {
  // const { addToCart } = useCart();
  const [filters, setFilters] = useState<any>({
    categoryId: undefined,
    isTopDeals: false,
    minPrice: 0,
    maxPrice: 5000,
    minRating: 0,
    maxRating: 5,
    stockQuantity: null, // Always filter for in-stock products
  });

  const { data, isLoading } = useGetCategoryByProductQuery(filters);

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  if (!data?.data) {
    return <PageLoading />;
  }

  // const filteredCategories = Object.entries(data.data).filter(
  //   ([, services]) => Array.isArray(services) && services.length > 0,
  // );

    const filteredCategories = data?.data
      ? Object.entries(data.data).filter(
          ([, services]) => Array.isArray(services) && services.length > 0,
        )
      : [];
    if (isLoading) {
      return <PageLoading />;
    }

  const clearAllFilters = () => {
    setFilters({
      categoryId: undefined,
      isTopDeals: false,
      minPrice: 0,
      maxPrice: 5000,
      minRating: 0,
      maxRating: 5,
      stockQuantity: null,
    });
    setIsMobileSidebarOpen(false);
  };

  // const handleAddToCart = (e: React.MouseEvent, product: any) => {
  //   e.preventDefault();
  //   e.stopPropagation();

  //   const cartItem: CartItem = {
  //     id: product.id,
  //     name: product.name,
  //     price: product.price,
  //     image: product.image,
  //     quantity: 1,
  //     discount: product.discount,
  //     averageRating: product.averageRating,
  //     totalReviews: product.totalReviews,
  //     subcategory: product.subcategory,
  //   };

  //   addToCart(cartItem);

  //   // Optional: Show a toast notification
  //   // toast.success(`${product.name} added to cart!`);
  // };

  const hasProducts = filteredCategories.length > 0;

  return (
    <div className="md:container mx-auto -mt-10 pb-12 pt-5 ">
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <ProductSidebar
            onFiltersChange={(filters) => setFilters(filters)}
            selectedCategoryId={filters.categoryId}
            selectedPriceRange={[
              filters.minPrice || 0,
              filters.maxPrice || 5000,
            ]}
            rating={filters.minRating || 0}
            isTopDeal={filters.isTopDeals || false}
          />
        </div>

        {/* Mobile Sidebar */}
    
          <div className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300
  ${isMobileSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            <div
              className="fixed inset-0 bg-black/20 bg-opacity-100"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <div className={`fixed left-0 top-0 h-full w-80 bg-white shadow-lg overflow-y-auto overscroll-contain
    transform transition-transform duration-300 ease-out
    ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
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
              <ProductSidebar
                onFiltersChange={(filters) => setFilters(filters)}
                selectedCategoryId={filters.categoryId}
                selectedPriceRange={[
                  filters.minPrice || 0,
                  filters.maxPrice || 5000,
                ]}
                rating={filters.minRating || 0}
                isTopDeal={filters.isTopDeals || false}
              />
            </div>
          </div>
   

        {/* Products Section */}
        <div className="flex-1 lg:px-6">
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

          <div>
            <InnerBanner
              titleBlack="Explore Top "
              titleOrange="Rated Products"
              description="Discover a world of top-rated products from trusted vendors, all in one place."
              // buttonText="Shop Now"
              buttonLink="/book"
              leftBgSrc="https://i.postimg.cc/kXf03P3W/Frame-2147227518.png"
              rightImgSrc="https://i.postimg.cc/L5cVgMXQ/br.png"
              rightImgAlt="Banner Image"
            />

            {isLoading ? (
              <div className="text-center py-10">
                <PageLoading />
              </div>
            ) : !hasProducts ? (
              // No services found state
              <div className="text-center py-10">
                <p className="text-lg mb-4">
                  No products found matching your criteria
                </p>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or browse different categories
                </p>

                <Button variant="outline" onClick={clearAllFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="space-y-10 lg:px-0 px-2 mt-10">
                {filteredCategories.map(
                  ([categoryName, products]: [string, any]) => (
                    <div key={categoryName} className="space-y-5">
                      {/* Category Header */}
                      <div className="flex items-center justify-between">
                        <h2 className="lg:text-3xl md:text-2xl text-xl font-semibold">
                          {categoryName}
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product: any, idx: any) => (
                          <Link
                            href={`/product/${product.id}`}
                            key={product.id}
                          >
                            <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md p-5">
                              <div className="relative h-48 w-full ">
                                <Image
                                  src={
                                    product?.variants?.[0]?.image ||
                                    product?.images?.[0] ||
                                    "/placeholder-image.jpg"
                                  }
                                  alt={product.name}
                                  width={500}
                                  height={500}
                                  className="h-48 w-full object-cover rounded-lg"
                                  loading={idx < 4 ? "eager" : "lazy"}
                                />

                                <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                  <div className="pointer-events-auto mb-3 w-full px-3">
                                    <Link href={`/product/${product.id}`}>
                                      <button
                                        // onClick={(e) => handleAddToCart(e, product)}
                                        className="w-full rounded-md bg-neutral-900/90 py-2 text-center text-sm font-medium text-white shadow-md hover:bg-neutral-900"
                                      >
                                        View Details
                                      </button>
                                    </Link>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                {/* Rating */}
                                <div className="flex items-center justify-between gap-1">
                                  <h3 className="font-medium text-sm mt-2 truncate">
                                    {product.name}
                                  </h3>
                                  <div className="flex items-center gap-1.5">
                                    <IoStar className="fill-yellow-400 text-yellow-400" />
                                    <div>
                                      <span>{product.averageRating}</span>
                                      <span className="text-gray-500">
                                        ({product.totalReviews})
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Price */}
                                <div>
                                  <span className="font-semibold">
                                    € {product.finalPrice.toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {product.discount > 0 && (
                                    <span className="text-sm text-gray-500 line-through">
                                      € {product.price.toFixed(2)}
                                    </span>
                                  )}

                                  <div className="bg-primary px-3 text-white py-1 w-fit rounded-full">
                                    <p>{product.discount}% off</p>
                                  </div>
                                </div>

                                {product.discount > 0 && (
                                  <p className="text-xs text-gray-600">
                                    Biggest sale in 60+ days
                                  </p>
                                )}
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
    </div>
  );
}
