import { Service } from "@/types/productCategory.type";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { AiFillStar } from "react-icons/ai";

interface CategoryBestServiceProps {
  bestService: Service[];
}

export default function BestService({ bestService }: CategoryBestServiceProps) {
  const bestAllService = bestService || [];
  const categoryId = bestAllService[0]?.categoryId ?? "";
  const serviceId = bestAllService[0]?.subCategoryId ?? "";

  return (
    <section className="mx-auto my-12 lg:px-0 px-2">
      {bestAllService.length > 0 && (
        <>
          {/* Header */}
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Best Service</h2>
            <Link
              href={`/category/${categoryId}/service/${serviceId}`}
              className="text-sm font-semibold text-gray-800 underline"
            >
              View All
            </Link>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {bestAllService.slice(0, 8).map((d) => (
              <article
                key={d.id}
                className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md p-5"
              >
                {/* Image + Hover overlay */}
                <div className="relative h-48 w-full bg-gray-100">
                  {d?.profilePic ? (
                    <Image
                      src={d.profilePic}
                      alt={d?.name || "Service Image"}
                      width={500}
                      height={500}
                      className="h-full w-full object-cover rounded-lg"
                    />
                  ) : (
                    // Optionally, display a placeholder image when profilePic is missing or invalid
                    <div className="h-full w-full bg-gray-300 flex items-center justify-center text-white text-lg rounded-lg">
                      No Image
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="mt-4 flex flex-col gap-2 pb-4 pt-3">
                  <span className="text-sm font-semibold text-gray-800">
                    {d?.name}
                  </span>
                  <span className="inline-flex items-center gap-1 text-base text-gray-600">
                    <AiFillStar className="shrink-0 text-xl text-yellow-600" />
                    {d.averageRating.toFixed(1)} ({d?.totalReviews})
                  </span>
                  <p className="my-3">{d?.store?.location}</p>
                  <div className="text-lg font-semibold">EUR {d?.price}</div>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
