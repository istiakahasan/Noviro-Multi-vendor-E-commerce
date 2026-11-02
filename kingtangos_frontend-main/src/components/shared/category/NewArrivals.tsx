/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAddCartMutation } from "@/redux/api/cartApi";
import { Product } from "@/types/productCategory.type";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { AiFillStar } from "react-icons/ai";

interface FashionNewArrivalsProps {
  newArrival: Product[];
}

export default function NewArrivals({ newArrival }: FashionNewArrivalsProps) {
  const [addToCart] = useAddCartMutation();
  const newArrivalProduct = newArrival || [];
  const categoryId = newArrivalProduct[0]?.categoryId ?? "";
  const productId = newArrivalProduct[0]?.subCategoryId ?? "";

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

  const handleAddToCart = async (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await addToCart({
        productId: product.id,
        quantity: 1,
      }).unwrap();

      // Optional toast
      // toast.success(`${product.name} added to cart`);
    } catch (error) {
      console.error("Add to cart failed", error);
      // toast.error("Failed to add item");
    }
  };

  return (
    <section className="mx-auto my-12 md:px-0 px-2">
      {newArrivalProduct.length > 0 && (
        <>
          {/* Header */}
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">New Arrival</h2>
            <Link
              href={`/category/${categoryId}/product/${productId}`}
              className="text-sm font-medium text-gray-800 hover:text-blue-500 underline"
            >
              View All
            </Link>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {newArrivalProduct.slice(-8).map((d, idx) => (
              <Link href={`/product/${d.id}`} key={d.id}>
                <article
                  key={d.id}
                  className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md p-5"
                >
                  {/* Image + Hover overlay (unchanged) */}
                  <div className="relative h-48 w-full bg-gray-100">
                    <Image
                      src={
                        d?.variants?.[0]?.image ||
                        d?.images?.[0] ||
                        "/placeholder.png"
                      }
                      alt=""
                      width={500}
                      height={500}
                      className="h-48 w-full object-cover rounded-lg"
                      loading={idx < 4 ? "eager" : "lazy"}
                    />

                    {/* Hover gradient + button (like the first card in your screenshot) */}
                    <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <div className="pointer-events-auto mb-3 w-full px-3">
                        <button
                          onClick={(e) => handleAddToCart(e, d)}
                          className="w-full rounded-md bg-neutral-900/90 py-2 text-center text-sm font-medium text-white shadow-md hover:bg-neutral-900"
                        >
                          Add To Cart
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Body (column style) */}
                  <div className="mt-4 flex flex-col gap-2 pb-4 pt-3">
                    {/* Title */}
                    <span className="text-sm font-semibold text-gray-800">
                      {d.name}
                    </span>

                    {/* Rating */}
                    <span className="inline-flex items-center gap-1 text-base text-gray-600">
                      <AiFillStar className="shrink-0 text-xl text-yellow-600" />
                      {d.averageRating.toFixed(1)}({d.totalReviews})
                    </span>

                    {/* Price */}
                    <div className="text-lg font-semibold mt-4">
                      € {d.price}
                    </div>
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
