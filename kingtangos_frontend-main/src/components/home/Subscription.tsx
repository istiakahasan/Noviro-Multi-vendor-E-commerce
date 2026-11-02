// app/components/Subscription.tsx
"use client";

import Link from "next/link";
import { AiFillStar } from "react-icons/ai";

import { CircleCheckBig } from "lucide-react";
import { usePlansQuery } from "@/redux/api/plansApi";
import Image from "next/image";

export default function Subscription() {

  const { data, isError } = usePlansQuery(undefined);

  if (isError) {
    return (
      <section className="container mx-auto my-12 text-center text-red-500">
        <p>Failed to load plans.</p>
      </section>
    );
  }

  const plans = data?.data || [];

  return (
    <section className="md:container lg:px-0 px-2 mx-auto my-12">
      {/* Header */}
      <div className="mb-6 md:flex items-center justify-between">
        <h2 className="md:text-2xl text-xl font-semibold">Subscription Would You Like</h2>
        <Link
          href="/subscription"
          className="text-sm font-semibold text-gray-800 underline"
        >
          View All
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-stretch">
        {plans.slice(0, 8).map((p) => (
          <Link href={`/subscriptions/${p.id}`} key={p.id} className="h-full block">
            <article
              key={p.id}
              className=" flex flex-col h-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
            >
              {/* Image */}
              <div className="relative h-40 w-full sm:h-44">
                <Image
                  src={p?.image}
                  alt={p.planName}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 25vw"
                // priority={p.id <= 4}
                />

              </div>

              {/* Body */}
              <div className="p-5 flex flex-col flex-1">
                {/* Title */}
                <h3 className="text-[13px] font-semibold text-gray-800 leading-snug line-clamp-2">
                  {p?.planName}
                </h3>

                {/* Rating */}
                <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                  <AiFillStar className="text-yellow-600 text-sm" />
                  <span>{p.averageRating.toFixed(1)}</span>
                  <span>({p.totalReviews})</span>
                </div>

                {/* Price */}
                <div className="mt-3 text-[15px] font-semibold text-gray-800">
                  € {p.amount.toFixed(2)}/month
                </div>

                {/* Feature list */}
                <ul className="mt-3 space-y-2 flex-1">
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
                <Link href={`/subscription/${p.id}`}>
                  <button
                    type="button"
                    className="mt-4 w-full rounded-md bg-[#8A8A8A] py-2 text-sm font-semibold text-white transition hover:bg-[#8A8A8A]/80"
                  >
                    Get Started
                  </button>
                </Link>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
