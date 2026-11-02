import { Plan } from "@/types/productCategory.type";
import { CircleCheckBig } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { AiFillStar } from "react-icons/ai";

interface subscriptionProps {
  subscription: Plan[];
}

export default function Subscription({ subscription }: subscriptionProps) {
  const subscriptionPlan = subscription || [];
  const categoryId = subscriptionPlan[0]?.categoryId ?? "";
  const subscriptionId = subscriptionPlan[0]?.subCategoryId ?? "";

  return (
    <section className="mx-auto my-12 lg:px-0 px-2">
      {subscriptionPlan.length > 0 && (
        <>
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              Subscription Would You Like
            </h2>
            <Link
              href={`/category/${categoryId}/subscription/${subscriptionId}`}
              className="text-sm font-semibold text-gray-800 underline"
            >
              View All
            </Link>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {subscriptionPlan.slice(0, 8).map((p, idx) => (
              <article
                key={p.id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
              >
                {/* Image */}
                {/* Image + Hover overlay (unchanged) */}
                <div className="relative h-48 w-full bg-gray-100">
                  <Image
                    src={p?.image || "/placeholder-image.jpg"}
                    alt={p.planName}
                    width={500}
                    height={500}
                    className="h-full w-full object-cover rounded-lg"
                    loading={idx < 4 ? "eager" : "lazy"}
                  />

                  {/* Hover gradient + button (like the first card in your screenshot) */}
                  <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <div className="pointer-events-auto mb-3 w-full px-3">
                      <button className="w-full rounded-md bg-neutral-900/90 py-2 text-center text-sm font-medium text-white shadow-md hover:bg-neutral-900">
                        Add To Cart
                      </button>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5">
                  {/* Title */}
                  <h3 className="text-[13px] font-semibold text-gray-800 leading-snug line-clamp-2">
                    {p.planName}
                  </h3>

                  {/* Rating */}
                  <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                    <AiFillStar className="text-yellow-600 text-sm" />
                    {/* <span>{p.averageRating.toFixed(1)}</span>
                <span>({p.totalReviews})</span> */}
                  </div>

                  {/* Price */}
                  <div className="mt-3 text-[15px] font-semibold text-gray-800">
                    € {p.amount.toFixed(2)}/month
                  </div>

                  {/* Feature list */}
                  <ul className="mt-3 space-y-2">
                    {p.features.map((f, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-[13px] text-gray-600"
                      >
                        <CircleCheckBig className="mt-[1px] shrink-0 text-blue-400 w-4 h-4" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Button */}
                  <button
                    type="button"
                    className="mt-4 w-full rounded-md bg-primary py-2 text-sm font-semibold text-white transition hover:bg-primary/75"
                  >
                    Get Started
                  </button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
