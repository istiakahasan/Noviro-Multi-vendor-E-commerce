/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { AiFillStar } from "react-icons/ai";
import Link from "next/link";
import { useGetActiveAdvertisementQuery } from "@/redux/api/topDealsApi";

export default function Feature() {
  const { data, isError } = useGetActiveAdvertisementQuery();

  if (isError) {
    return (
      <section className="container mx-auto my-12 text-center text-red-500">
        <p>Failed to load Features.</p>
      </section>
    );
  }

  const features = (Array.isArray(data?.data) ? data?.data : []) || [];
  const products = features?.map((feature: any) => feature.product) || [];

  return (
    <section className="md:container lg:px-0 px-2 mx-auto my-12">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <h2 className="md:text-2xl text-xl font-semibold">Feature</h2>
        <Link
          href="/feature"
          className="text-sm font-medium text-gray-800 hover:text-blue-500 underline"
        >
          View All
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products?.slice(0, 8).map((d: any) => (
          <Link href={`/product/${d.id}`} key={d.id} className="block">
            <article className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md p-5">
              {/* Image + Hover overlay */}
              <div className="relative h-48 w-full">
                <Image
                  src={
                    d?.variants?.[0]?.image ||
                    d?.images?.[0] ||
                    "/placeholder.png"
                  }
                  alt={d?.name}
                  className="h-48 w-full object-cover rounded-lg"
                  width={500}
                  height={500}
                />

                <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <div className="pointer-events-auto mb-3 w-full px-3">
                    <Link href={`/product/${d.id}`}>
                      <button className="w-full rounded-md bg-neutral-900/90 py-2 text-center text-sm font-medium text-white shadow-md hover:bg-neutral-900 transition-colors">
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
                    {d.averageRating}({d.totalReviews})
                  </span>
                </div>

                {/* Price row */}
                <div className="text-lg font-semibold">€ {d.finalPrice}</div>
                <div className="mb-8 flex items-center gap-3">
                  <div className="text-base text-gray-400 line-through">
                    €-{d.price}
                  </div>
                  <span className="rounded-full bg-gray-900 px-2 py-0.5 text-base font-medium text-white">
                    {d.discount}%
                  </span>
                </div>

                {/* Subtitle */}
                <p className="text-sm font-bold text-gray-800">
                  {d.subcategory?.name}
                </p>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
