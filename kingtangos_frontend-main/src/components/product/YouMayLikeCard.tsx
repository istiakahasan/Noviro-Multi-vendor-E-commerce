import { useGetYouMayLikeProductsQuery } from "@/redux/api/productsApi";

import Image from "next/image";
import Link from "next/link";

import React from "react";
import { AiFillStar } from "react-icons/ai";
import { PiWarningCircleLight } from "react-icons/pi";

type YouMayLikeCardProps = {
  categoryId: string;
};

export default function YouMayLikeCard({
  categoryId: productId,
}: YouMayLikeCardProps) {
  const { data } = useGetYouMayLikeProductsQuery(productId);
  const likedProducts = data?.data?.products ?? [];

  return (
    <div className="flex md:container md:px-0 px-2 min-h-auto">
      <main className="flex-1 md:pt-14 md:pl-6 pt-12">
        <div className="max-w- w-full mx-auto">
          <h2 className="lg:text-2xl md:text-xl text-lg font-semibold">You May Also Like</h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 mt-5 mb-10">
            {likedProducts.slice(0, 15).map((like) => (
              <Link href={`/product/${like.id}`} key={like.id}>
                <article
                  key={like.id}
                  className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md p-5"
                >
                  {/* Image + Hover overlay (unchanged) */}
                  <div className="relative h-48 w-full bg-gray-100">
                    <Image
                      src={
                        like?.variants?.[0]?.image ||
                        like?.images?.[0] ||
                        "/placeholder.png"
                      }
                      alt={like.name}
                      width={500}
                      height={500}
                      className="h-48 w-full object-cover rounded-lg"
                    />
                  </div>

                  {like.sponsored && (
                    <span className="rounded-full text-primary/60 px-2 py-0.5 font-medium">
                      <PiWarningCircleLight /> Sponsored
                    </span>
                  )}

                  {/* Body (column style, unchanged) */}
                  <div className="mt-4 flex flex-col gap-2 pb-4 pt-3">
                    <span className="text-sm font-semibold text-gray-800">
                      {like.name}
                    </span>

                    {/* <span className="text-xs text-gray-500">{consultant.location}</span> */}

                    <span className="inline-flex items-center gap-1 text-base text-gray-600">
                      <AiFillStar className="shrink-0 text-xl text-yellow-600" />
                      {like.averageRating.toFixed(1)}({like.totalReviews})
                    </span>

                    <div className="text-lg font-semibold mt-4">
                      EUR {like.finalPrice}
                    </div>

                    <div className="flex items-center gap-2">
                      {like.discount > 0 && (
                        <span className="text-sm text-gray-500 line-through">
                          EUR {like.price.toFixed(2)}
                        </span>
                      )}

                      <div className="bg-primary px-3 text-white py-1 w-fit rounded-full">
                        <p>{like.discount}% off</p>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
