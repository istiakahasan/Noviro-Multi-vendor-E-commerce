"use client";

import Image from "next/image";
import { AiFillStar } from "react-icons/ai";
import Link from "next/link";

import { useProductsQuery } from "@/redux/api/productsApi";

export default function NewArrival() {
  const { data, isError } = useProductsQuery(undefined);

  if (isError) {
    return (
      <section className="container mx-auto my-12 text-center text-red-500">
        <p>Failed to load new arrival products.</p>
      </section>
    );
  }

  const products = data?.data.products ?? [];

  return (
    <section className="md:container lg:px-0 px-2 mx-auto my-12">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <h2 className="md:text-2xl text-xl font-semibold">New Arrival</h2>
        <Link
          href="/product"
          className="text-sm font-semibold text-gray-800 underline"
        >
          View All
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.slice(-8).map((d) => (
          <Link href={`/product/${d.id}`} key={d.id}>
            <article
              key={d.id}
              className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md p-5"
            >
              {/* Image + Hover overlay */}
              <div className="relative h-48 w-full flex justify-center">
                <Image
                  src={
                    d?.variants?.[0]?.image ||
                    d?.images?.[0] ||
                    "/placeholder.png"
                  }
                  alt={d?.name}
                  width={300}
                  height={300}
                  className="h-48 w-auto object-cover rounded-lg"
                />

                <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <div className="pointer-events-auto mb-3 w-full px-3">
                    <Link href={`/product/${d.id}`}>
                      <button className="w-full rounded-md bg-neutral-900/90 py-2 text-center text-sm font-medium text-white shadow-md hover:bg-neutral-900">
                        View Details
                      </button>
                    </Link>
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
                <div className="text-lg font-semibold mt-4">€ {d.price}</div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
