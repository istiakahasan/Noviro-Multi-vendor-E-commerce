"use client";

import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  useGetSingleProductQuery,
  ProductVariant,
  VariantSize,
} from "@/redux/features/store-content/storeContentApi";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FaRegStar } from "react-icons/fa6";
import PageLoader from "@/app/loading";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetSingleProductQuery(id as string);

  const product = data?.data;

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");

  const hasVariants = product?.hasVariants;
  const variants = product?.variants || [];
  const rootImages = product?.images || [];

  const currentVariant = useMemo(() => {
    return hasVariants && variants.length > 0
      ? variants[selectedVariantIndex]
      : null;
  }, [hasVariants, variants, selectedVariantIndex]);

  // Gallery Logic: Use variant images if they exist, otherwise use root images
  const allImages = useMemo(() => {
    if (hasVariants && variants.length > 0) {
      const vImages = variants
        .map((v: ProductVariant) => v.image)
        .filter(Boolean);
      return vImages.length > 0 ? vImages : ["/placeholder.svg"];
    }
    return rootImages.length > 0 ? rootImages : ["/placeholder.svg"];
  }, [hasVariants, variants, rootImages]);

  const mainImage = useMemo(() => {
    if (hasVariants && currentVariant) {
      return currentVariant.image || "/placeholder.svg";
    }
    return allImages[selectedImageIndex] || "/placeholder.svg";
  }, [hasVariants, currentVariant, allImages, selectedImageIndex]);

  useEffect(() => {
    if (
      currentVariant &&
      currentVariant.sizes &&
      currentVariant.sizes.length > 0
    ) {
      setSelectedSize(currentVariant.sizes[0].size);
    } else {
      setSelectedSize("");
    }
  }, [currentVariant]);

  if (isLoading) return <PageLoader />;
  if (isError || !product) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4 px-4">
          <p className="text-xl font-bold text-red-500">Product Not Found</p>
          <p className="text-gray-500 text-sm max-w-xs mx-auto">
            The item you are looking for might have been removed or is currently
            unavailable.
          </p>
          <Link
            href="/admin-dashboard/store-content"
            className="inline-block text-blue-600 hover:underline font-medium"
          >
            Back to Item Management
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 lg:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Image Gallery */}
        <div className="lg:col-span-7">
          <div className="grid grid-cols-12 gap-4">
            {/* Thumbnails */}
            <div className="col-span-12 lg:col-span-2 flex lg:flex-col gap-3 order-2 lg:order-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide">
              {allImages.map((img: string, index: number) => (
                <button
                  key={index}
                  onClick={() => {
                    if (hasVariants) {
                      setSelectedVariantIndex(index);
                    } else {
                      setSelectedImageIndex(index);
                    }
                  }}
                  className={cn(
                    "relative aspect-square w-16 h-16 sm:w-20 sm:h-20 lg:w-full rounded-xl overflow-hidden border-2 transition-all shrink-0",
                    (
                      hasVariants
                        ? selectedVariantIndex === index
                        : selectedImageIndex === index
                    )
                      ? "border-blue-600 ring-4 ring-blue-50"
                      : "border-gray-200 hover:border-blue-300",
                  )}
                >
                  <Image
                    src={img}
                    alt={`Thumb ${index}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="col-span-12 lg:col-span-10 order-1 lg:order-2">
              <div className="relative aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm group">
                <Image
                  src={mainImage}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="lg:col-span-5 space-y-6 sm:space-y-8">
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm text-gray-500 font-medium uppercase tracking-wider">
                Store:
              </span>
              <Link
                href={`/admin-dashboard/store-content/store/${product.storeId}`}
              >
                <span className="text-blue-600 hover:underline text-sm font-bold">
                  {product.store?.name}
                </span>
              </Link>
            </div>
          </div>

          {/* Rating & Badge */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-1 text-yellow-500">
              {[...Array(5)].map((_, i) =>
                i < Math.floor(product.averageRating || 0) ? (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ) : (
                  <FaRegStar key={i} className="w-5 h-5" />
                ),
              )}
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
              <span>{product.averageRating?.toFixed(1) || "0.0"}</span>
              <span className="text-gray-300">|</span>
              <span className="text-gray-500 font-medium">
                {product.totalReviews} Reviews
              </span>
            </div>
            <Badge className="bg-blue-50 text-blue-700 border-none shadow-none font-bold text-[10px] sm:text-xs">
              {product.category?.type === "SERVICE"
                ? "SERVICE"
                : product.type?.toUpperCase() || "PRODUCT"}
            </Badge>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-baseline gap-4 flex-wrap">
              <span className="text-3xl sm:text-4xl font-black text-red-600">
                €{product.finalPrice.toFixed(2)}
              </span>
              {product.discount > 0 && (
                <span className="text-lg sm:text-xl text-gray-400 line-through font-medium">
                  €{product.price.toFixed(2)}
                </span>
              )}
            </div>
            {product.discount > 0 && (
              <p className="text-green-600 font-bold text-xs sm:text-sm bg-green-50 px-3 py-1.5 rounded-full inline-block border border-green-100">
                SAVE {product.discount}% WITH CURRENT OFFER
              </p>
            )}
          </div>

          <div className="bg-gray-50/50 p-4 sm:p-6 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed italic">
              "{product.description}"
            </p>
          </div>

          <hr className="border-gray-100" />

          {/* Variants Selection - Only if hasVariants is true */}
          {hasVariants ? (
            <div className="space-y-6 sm:space-y-8 p-5 sm:p-7 bg-white rounded-2xl border border-gray-100 shadow-sm">
              {/* Colors */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    Select Color
                  </h3>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    {currentVariant?.color}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  {variants.map((v: ProductVariant, index: number) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariantIndex(index)}
                      className={cn(
                        "w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 transition-all hover:scale-110",
                        selectedVariantIndex === index
                          ? "border-blue-600 shadow-lg scale-110 shadow-blue-100"
                          : "border-white shadow-sm hover:border-gray-200",
                      )}
                      style={{ backgroundColor: v.colorCode }}
                      title={v.color}
                    />
                  ))}
                </div>
              </div>

              {/* Sizes */}
              {currentVariant &&
                currentVariant.sizes &&
                currentVariant.sizes.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                      Select Size
                    </h3>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {currentVariant.sizes.map((s: VariantSize) => (
                        <button
                          key={s.id}
                          onClick={() => setSelectedSize(s.size)}
                          disabled={!s.inStock}
                          className={cn(
                            "min-w-[3.5rem] h-12 flex items-center justify-center rounded-xl border-2 text-sm font-black transition-all px-4",
                            selectedSize === s.size
                              ? "bg-gray-900 text-white border-gray-900 shadow-md"
                              : "border-gray-100 bg-gray-50/50 hover:border-gray-300 text-gray-700",
                            !s.inStock && "opacity-20 cursor-not-allowed",
                          )}
                        >
                          {s.size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          ) : (
            <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100 border-dashed text-center">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Standard Inventory Model (No Variants)
              </p>
            </div>
          )}

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm">
              <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mb-2">
                Available Stock
              </p>
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-2 h-2 rounded-full animate-pulse",
                    product.stockQuantity > 0 ? "bg-green-500" : "bg-red-500",
                  )}
                />
                <p
                  className={cn(
                    "text-lg font-black",
                    product.stockQuantity > 0
                      ? "text-gray-900"
                      : "text-red-600",
                  )}
                >
                  {product.stockQuantity > 0
                    ? `${product.stockQuantity} units`
                    : "Out of Stock"}
                </p>
              </div>
            </div>
            <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm">
              <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mb-2">
                Shop Status
              </p>
              <Badge
                className={cn(
                  product.store?.shopStatus === "APPROVED"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700",
                  "border-none shadow-none font-black text-xs px-2.5 py-0.5",
                )}
              >
                {product.store?.shopStatus}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Technical Details Table */}
      <div className="mt-16 sm:mt-24">
        <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
          <div className="bg-gray-900 px-6 sm:px-10 py-6">
            <h2 className="text-lg font-black text-white uppercase tracking-widest">
              Technical Specifications
            </h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableBody>
                <TableRow className="border-b border-gray-50 hover:bg-transparent">
                  <TableCell className="font-extrabold text-gray-400 uppercase text-[9px] tracking-[0.2em] bg-gray-50/50 px-6 sm:px-10 py-6 w-1/3 min-w-[150px]">
                    Reference Barcode
                  </TableCell>
                  <TableCell className="font-mono font-bold text-blue-600 px-6 sm:px-10">
                    {product.barcode || "N/A"}
                  </TableCell>
                </TableRow>
                <TableRow className="border-b border-gray-50 hover:bg-transparent">
                  <TableCell className="font-extrabold text-gray-400 uppercase text-[9px] tracking-[0.2em] bg-gray-50/50 px-6 sm:px-10 py-6">
                    Category
                  </TableCell>
                  <TableCell className="font-bold text-gray-800 px-6 sm:px-10">
                    {product.category?.name}{" "}
                    <span className="text-gray-400 ml-1 font-medium">
                      ({product.category?.type})
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow className="border-b border-gray-50 hover:bg-transparent">
                  <TableCell className="font-extrabold text-gray-400 uppercase text-[9px] tracking-[0.2em] bg-gray-50/50 px-6 sm:px-10 py-6">
                    Subcategory
                  </TableCell>
                  <TableCell className="font-bold text-gray-800 px-6 sm:px-10">
                    {product.subcategory?.name}
                  </TableCell>
                </TableRow>
                <TableRow className="border-b border-gray-50 hover:bg-transparent">
                  <TableCell className="font-extrabold text-gray-400 uppercase text-[9px] tracking-[0.2em] bg-gray-50/50 px-6 sm:px-10 py-6">
                    Metadata Tags
                  </TableCell>
                  <TableCell className="px-6 sm:px-10 py-4 flex flex-wrap gap-2">
                    {product.tags?.map((tag: string) => (
                      <span
                        key={tag}
                        className="text-[10px] bg-gray-100 text-gray-600 px-2.5 py-1.5 rounded-lg font-black border border-gray-200"
                      >
                        {tag.toUpperCase()}
                      </span>
                    ))}
                    {!product.tags?.length && (
                      <span className="text-gray-400 italic text-xs font-medium">
                        None specified
                      </span>
                    )}
                  </TableCell>
                </TableRow>
                <TableRow className="hover:bg-transparent">
                  <TableCell className="font-extrabold text-gray-400 uppercase text-[9px] tracking-[0.2em] bg-gray-50/50 px-6 sm:px-10 py-6">
                    Created On
                  </TableCell>
                  <TableCell className="font-bold text-gray-600 px-6 sm:px-10">
                    {new Date(product.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
