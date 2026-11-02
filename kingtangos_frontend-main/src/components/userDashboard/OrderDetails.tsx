/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrderDetails({
  order,
  isLoading,
  isError,
}: {
  order: any;
  isLoading: boolean;
  isError: boolean;
}) {
  const [selectedImage, setSelectedImage] = useState(0);

  if (isError) return <p className="text-red-500">Failed to load order.</p>;

  // Collect images from all order items' variants (fallback to empty string if missing)
  const images =
    order?.orderItems?.map((item: any) => item?.variant?.image || "") || [];
  // Filter out empty strings for cleaner display
  const validImages = images.filter((img: string) => img);

  // For alt text and details, we'll use the full orderItems array

  return (
    <div className="mb-10">
      {/* -------- LEFT IMAGE SECTION -------- */}
      <div className="flex xl:flex-row flex-col gap-10">
        {/* Thumbnails */}
        <div className="flex md:flex-row flex-col-reverse gap-2">
          <div className="flex md:flex-col gap-[10px]">
            {isLoading
              ? [...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-18 w-18 rounded-lg" />
                ))
              : validImages.map((img: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "relative aspect-[5/4] h-18 w-18 rounded-lg overflow-hidden border-2 transition-all hover:border-gray-400",
                      selectedImage === index
                        ? "border-gray-400"
                        : "border-border",
                    )}
                  >
                    <Image
                      src={img}
                      alt={`Product image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
          </div>

          {/* Main Image */}
          <div className="relative aspect-[5/4] md:w-120 md:h-120 rounded-2xl overflow-hidden bg-muted">
            {isLoading ? (
              <Skeleton className="w-full h-full rounded-2xl" />
            ) : validImages.length > 0 ? (
              <Image
                src={validImages[selectedImage]}
                alt={
                  order?.orderItems?.[selectedImage]?.product?.name ||
                  "Product image"
                }
                fill
                className="object-cover"
                priority
              />
            ) : (
              <p className="flex items-center justify-center h-full text-muted-foreground">
                No images available
              </p>
            )}
          </div>
        </div>

        {/* -------- RIGHT DETAILS SECTION -------- */}
        <div>
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-[250px] mb-3" />
              <Skeleton className="h-4 w-[200px] mb-2" />
              <Skeleton className="h-4 w-[180px] mb-2" />
              <Skeleton className="h-4 w-[150px] mb-2" />
              <Skeleton className="h-4 w-[200px] mb-2" />
              <Skeleton className="h-5 w-[80px] mb-2" />
              {/* Add more skeletons to approximate multi-item list */}
              {[...Array(2)].map((_, i) => (
                <div key={i} className="mt-4">
                  <Skeleton className="h-6 w-[300px] mb-2" />
                  <Skeleton className="h-4 w-[150px] mb-1" />
                  <Skeleton className="h-4 w-[100px] mb-1" />
                  <Skeleton className="h-4 w-[120px] mb-1" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ))}
            </>
          ) : (
            <>
              <h1 className="text-3xl lg:text-4xl font-bold mb-3">
                Order Details
              </h1>

              <p className="text-lg">
                <strong>Order Code:</strong> #{order?.id?.slice(0, 6)}
              </p>
              <p className="text-lg">
                <strong>Order Date:</strong>{" "}
                {order?.createdAt
                  ? new Date(order.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
              <p className="text-lg">
                <strong>Status:</strong> {order?.orderStatus || "N/A"}
              </p>
              <p className="text-lg">
                <strong>Items:</strong> {order?.orderItems?.length || 0} item(s)
              </p>
              <p className="text-lg">
                <strong>Total Cost:</strong>{" "}
                <span className="text-2xl font-semibold text-red-600">
                  ${order?.totalAmount?.toFixed(2) || "0.00"}
                </span>
              </p>

              <div className="mt-4">
                <h2 className="text-black text-xl mb-3">Order Items</h2>
                {order?.orderItems?.length > 0 ? (
                  order.orderItems.map((item: any) => (
                    <div
                      key={item.id}
                      className="mb-6 border-b pb-4 last:border-b-0"
                    >
                      <h3 className="text-xl font-semibold">
                        {item.product?.name || "Unknown Product"} (x
                        {item.quantity})
                      </h3>
                      <p className="text-lg">
                        <strong>Color:</strong> {item.color || "N/A"},{" "}
                        <strong>Size:</strong> {item.size || "N/A"}
                      </p>
                      <p className="text-lg">
                        <strong>Price:</strong> $
                        {item.price?.toFixed(2) || "0.00"}
                      </p>
                      <p className="text-lg">
                        <strong>Subtotal:</strong> $
                        {item.totalPrice?.toFixed(2) || "0.00"}
                      </p>
                      <p className="text-text leading-relaxed mt-2">
                        {item.product?.description ||
                          "No description available."}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-text">No items in this order.</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
