// app/components/Accommodation.tsx
"use client";

import Image from "next/image";
import { AiFillStar } from "react-icons/ai";
// import {accommodations } from "@/types/accommodation.type";
import Link from "next/link";
import { accommodations } from "@/types/accomodation.type";

export default function Accommodation() {
  return (
    <section className="container mx-auto my-12">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Accommodation</h2>
        <Link
          href="/accommodation"
          className="text-sm font-medium text-gray-800 hover:text-blue-500 underline"
        >
          View All
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {accommodations.map((d, idx) => (
          <article
            key={d.id}
            className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md p-5"
          >
            {/* Image + Hover overlay */}
            <div className="relative h-48 w-full bg-gray-100">
              <Image
                src={d.image}
                alt={d.title}
                width={500}
                height={500}
                className="h-full w-full object-cover rounded-lg"
                loading={idx < 4 ? "eager" : "lazy"}
              />

              {/* Hover gradient + button */}
              <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <div className="pointer-events-auto mb-3 w-full px-3">
                  <button className="w-full rounded-md bg-neutral-900/90 py-2 text-center text-sm font-medium text-white shadow-md hover:bg-neutral-900">
                    Add To Cart
                  </button>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="mt-4 pb-4 pt-3">
              {/* Title + rating */}
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-800">
                  {d.title}
                </span>
                <span className="inline-flex items-center gap-1 text-base text-gray-600">
                  <AiFillStar className="shrink-0 text-xl text-yellow-600" />
                  {d.rating.toFixed(1)}({d.ratingCount})
                </span>
              </div>

              {/* Price row */}
              <div className="mb-8 flex items-center gap-3">
                <div className="text-lg font-semibold">€ {d.price}</div>
                <div className="text-base text-gray-400 line-through">
                  €-{d.oldPrice}
                </div>
                <span className="rounded-full bg-gray-900 px-2 py-0.5 text-base font-medium text-white">
                  {d.discount}
                </span>
              </div>

              {/* Subtitle */}
              <p className="text-sm font-bold text-gray-800">{d.subtitle}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
