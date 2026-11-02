// app/components/Consultant.tsx
"use client";

import Image from "next/image";
import { AiFillStar } from "react-icons/ai";
import Link from "next/link";
import { useGetConsultationsQuery } from "@/redux/api/consultationsApi";


export default function Consultant() {
  const { data, isError } = useGetConsultationsQuery(undefined);

  if (isError) {
    return (
      <section className="container mx-auto my-12 text-center text-red-500">
        <p>Failed to load consultations.</p>
      </section>
    );
  }

  const consultations = data?.data || [];

  return (
    <section className="md:container lg:px-0 px-2 mx-auto my-12">
      {/* Header (unchanged design) */}
      <div className="mb-5 flex items-center justify-between">
        <h2 className="md:text-2xl text-xl font-semibold">Take Consultant</h2>
        <Link
          href="/consultation"
          className="text-sm font-semibold text-gray-800 underline"
        >
          View All
        </Link>
      </div>

      {/* Grid (unchanged design) */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {consultations.slice(0, 8).map((d,) => (
          <Link href={`/consultation/${d.id}`} key={d.id}>
            <article
              key={d.id}
              className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md p-5"
            >
              {/* Image + Hover overlay (unchanged) */}
              <div className="relative h-48 w-full">
                <Image
                  src={d.profilePic}
                  alt={d?.name}
                  width={500}
                  height={500}
                  className="h-48 w-full object-cover rounded-lg"
                />
                <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <div className="pointer-events-auto mb-3 w-full px-3">
                    <Link href={`/consultation/${d.id}`}>
                      <button className="w-full rounded-md bg-neutral-900/90 py-2 text-center text-sm font-medium text-white shadow-md hover:bg-neutral-900">
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Body (column style, unchanged) */}
              <div className="mt-4 flex flex-col gap-2 pb-4 pt-3">
                <span className="text-sm font-semibold text-gray-800">
                  {d.name}
                </span>

                <span className="inline-flex items-center gap-1 text-base text-gray-600">
                  <AiFillStar className="shrink-0 text-xl text-yellow-600" />
                  {d.averageRating.toFixed(1)}({d.totalReviews})
                </span>
                <p>{d.location}</p>
                <div className="text-lg font-semibold mt-4">€ {d.price}</div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
