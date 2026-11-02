/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
// import { useCart } from '@/redux/features/cart/cartHooks';
// import { CartItem } from '@/redux/features/cart/cartSlice';
import { Product } from "@/types/productCategory.type";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { AiFillStar } from "react-icons/ai";

interface FashionNewArrivalsProps {
  topDeals: Product[];
}

export default function TopDeals({ topDeals }: FashionNewArrivalsProps) {
  // const { addToCart } = useCart()
  const topDealProducts = topDeals || [];
  const categoryId = topDealProducts[0]?.categoryId ?? "";
  const productId = topDealProducts[0]?.subCategoryId ?? "";

  // const handleAddToCart = (e: React.MouseEvent, product: any) => {
  //     e.preventDefault();
  //     e.stopPropagation();

  //     const cartItem: CartItem = {
  //         id: product.id,
  //         name: product.name,
  //         price: product.price,
  //         image: product.image,
  //         quantity: 1,
  //         discount: product.discount,
  //         averageRating: product.averageRating,
  //         totalReviews: product.totalReviews,
  //         subcategory: product.subcategory
  //     };

  //     addToCart(cartItem);
  // }

  return (
    <section className="mx-auto my-12 lg:px-0 px-2">
      {topDealProducts.length > 0 && (
        <>
          {/* Header */}
          <div className="mb-5 flex items-center justify-between">
            <h2 className=" lg:text-3xl md:text-2xl text-xl font-semibold">Top Deals</h2>
            <Link
              href={`/category/${categoryId}/product/${productId}`}
              className="text-sm font-medium text-gray-800 hover:text-blue-500 underline"
            >
              View All
            </Link>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {topDealProducts.slice(0, 8).map((d, idx) => (
              <Link href={`/product/${d.id}`} key={d.id}>
                <article className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md p-5">
                  {/* Image + Hover overlay */}
                  <div className="relative h-48 w-full bg-gray-100">
                    <Image
                      src={
                        d?.variants?.[0]?.image ||
                        d?.images?.[0] ||
                        "/placeholder.png"
                      }
                      alt={d.name}
                      width={500}
                      height={500}
                      className="h-48 w-full object-cover rounded-lg"
                      loading={idx < 4 ? "eager" : "lazy"}
                    />

                    {/* Hover gradient + button (like the first card in your screenshot) */}
                    <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <div className="pointer-events-auto mb-3 w-full px-3">
                        <Link href={`/product/${d.id}`}>
                          <button
                            // onClick={(e) => handleAddToCart(e, d)}
                            className="w-full rounded-md bg-neutral-900/90 py-2 text-center text-sm font-medium text-white shadow-md hover:bg-neutral-900"
                          >
                            View Details
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="mt-4 pb-4 pt-3">
                    {/* Title + rating */}
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-800">
                        {d.name}
                      </span>
                      <span className="inline-flex items-center gap-1 text-base text-gray-600">
                        <AiFillStar className="shrink-0 text-xl text-yellow-600" />
                        {d.averageRating.toFixed(1)}({d.totalReviews})
                      </span>
                    </div>

                    {/* Price row */}
                    <div className="mb-8 flex items-center gap-3">
                      <div className="text-lg font-semibold">€ {d.price}</div>
                      <div className="text-base text-gray-400 line-through">
                        €-{d.price}
                      </div>
                      <span className="rounded-full bg-gray-900 px-2 py-0.5 text-base font-medium text-white">
                        {d.discount}
                      </span>
                    </div>

                    {/* Subtitle */}
                    {/* <p className="text-sm font-bold text-gray-800">{d.}</p> */}
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
