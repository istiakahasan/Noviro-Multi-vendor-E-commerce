import { Service } from "@/types/productCategory.type";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { AiFillStar } from "react-icons/ai";

interface takeConsultantProps {
  consultant: Service[];
}

export default function Consultant({ consultant }: takeConsultantProps) {
  const takeAllConsultant = consultant || [];
  const categoryId = takeAllConsultant[0]?.categoryId ?? "";
  const consultationId = takeAllConsultant[0]?.subCategoryId ?? "";

  return (
    <section className="mx-auto my-12 lg:px-0 px-2">
      {takeAllConsultant.length > 0 && (
        <>
          {/* Header (unchanged design) */}
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Take Consultant</h2>
            <Link
              href={`/category/${categoryId}/consultation/${consultationId}`}
              className="text-sm font-semibold text-gray-800 underline"
            >
              View All
            </Link>
          </div>

          {/* Grid (unchanged design) */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {takeAllConsultant.slice(0, 4).map((consultant, idx) => (
              <article
                key={consultant.id}
                className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md p-5"
              >
                {/* Image + Hover overlay (unchanged) */}
                <div className="relative h-48 w-full bg-gray-100">
                  <Image
                    src={consultant.profilePic}
                    alt={consultant.name}
                    width={500}
                    height={500}
                    className="h-full w-full object-cover rounded-lg"
                    loading={idx < 4 ? "eager" : "lazy"}
                  />

                  {/* Hover gradient + button (like the first card in your screenshot) */}
                  <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <div className="pointer-events-auto mb-3 w-full px-3">
                      <button className="w-full rounded-md bg-neutral-900/90 py-2 text-center text-sm font-medium text-white shadow-md hover:bg-neutral-900">
                        view Details
                      </button>
                    </div>
                  </div>
                </div>

                {/* Body (column style, unchanged) */}
                <div className="mt-4 flex flex-col gap-2 pb-4 pt-3">
                  <span className="text-sm font-semibold text-black">
                    {consultant.name}
                  </span>

                  <span className="text-xs text-gray-500">
                    {consultant.store.location}
                  </span>

                  <span className="inline-flex items-center gap-1 text-base text-gray-600">
                    <AiFillStar className="shrink-0 text-xl text-yellow-600" />
                    {consultant.averageRating.toFixed(1)}(
                    {consultant.totalReviews})
                  </span>

                  <div className="text-lg font-semibold mt-4">
                    € {consultant.price}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
