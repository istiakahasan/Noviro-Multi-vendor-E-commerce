/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { IoArrowBack, IoPencil, IoEye } from "react-icons/io5";
import { useGetSingleProductByIdQuery } from "@/redux/api/productApi/productApi";
import Link from "next/link";

interface ProductDetailsPageProps {
  productViewId: string | null;
}

export default function ProductDetailsPage({
  productViewId,
}: ProductDetailsPageProps) {
  const router = useRouter();

  const {
    data: productData,
    isLoading,
    error,
  } = useGetSingleProductByIdQuery(productViewId!, {
    skip: !productViewId,
  });

  const product = productData?.data;

  const getStockStatus = (stockQuantity: number) => {
    if (stockQuantity > 20)
      return { text: "In Stock", variant: "default" as const };
    if (stockQuantity === 0)
      return { text: "Out of Stock", variant: "destructive" as const };
    return { text: "Low Stock", variant: "secondary" as const };
  };

  const getShopStatus = (status: string) => {
    switch (status) {
      case "PENDING":
        return { variant: "secondary" as const, color: "text-yellow-600" };
      case "APPROVED":
        return { variant: "default" as const, color: "text-green-600" };
      case "REJECTED":
        return { variant: "destructive" as const, color: "text-red-600" };
      default:
        return { variant: "outline" as const, color: "text-gray-600" };
    }
  };

  const getProductStatus = (status: string) => {
    switch (status) {
      case "approved":
        return { variant: "default" as const, text: "Approved" };
      case "pending":
        return { variant: "secondary" as const, text: "Pending" };
      case "rejected":
        return { variant: "destructive" as const, text: "Rejected" };
      default:
        return { variant: "outline" as const, text: status };
    }
  };

  const stockStatus = product ? getStockStatus(product.stockQuantity) : null;
  const shopStatus = product?.store
    ? getShopStatus(product.store.shopStatus)
    : null;
  const productStatus = product ? getProductStatus(product.status) : null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate total stock from variants if product has variants
  const calculateTotalStockFromVariants = () => {
    if (!product?.variants) return 0;
    let total = 0;
    product.variants.forEach((variant: any) => {
      variant.sizes.forEach((size: any) => {
        total += size.quantity;
      });
    });
    return total;
  };

  // Check if product has variants
  const hasVariants = product?.hasVariants || false;
  const totalVariantStock = hasVariants ? calculateTotalStockFromVariants() : 0;

  if (!productViewId) {
    return (
      <div className="min-h-screen p-8">
        <div className="mx-auto container">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-red-600 text-lg mb-4">
                No product ID provided
              </p>
              <Button
                onClick={() => router.push("/seller-dashboard/product")}
                className="mt-4"
              >
                Back to Products
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen p-8">
        <div className="mx-auto container">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading product details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen p-8">
        <div className="mx-auto container">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-red-600 text-lg mb-4">
                Error loading product details
              </p>
              <Button
                onClick={() => router.push("/seller-dashboard/product")}
                className="mt-4"
              >
                Back to Products
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen md:p-8 bg-gray-50">
      <div className="mx-auto container max-w-7xl">
        {/* Header with Breadcrumb and Actions */}
        <div className="mb-6 flex items-center justify-between flex-col lg:flex-row px-2">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push("/seller-dashboard/product")}
              className="h-10 w-10"
            >
              <IoArrowBack className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="lg:text-3xl text-xl font-bold text-gray-900 mb-2">
                Product Details
              </h1>
              <nav className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                <Link href="/seller-dashboard" className="hover:text-gray-700">
                  Dashboard
                </Link>
                <span>/</span>
                <Link
                  href="/seller-dashboard/product"
                  className="hover:text-gray-700"
                >
                  Products
                </Link>
                <span>/</span>
                <span className="text-gray-900">Details</span>
              </nav>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-3">
            <Link href={`/seller-dashboard/product/edit-product/${product.id}`}>
              <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                <IoPencil className="h-4 w-4" />
                Edit Product
              </Button>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Image & Basic Info */}
          <div className="xl:col-span-1 space-y-6">
            {/* Product Image */}
            <Card>
              <div className="text-lg flex items-center gap-2 md:px-4 px-3 pt-2 font-semibold">
                <IoEye className="h-5 w-5" />
                Product Image
              </div>
              <div className="md:p-4 p-3">
                {/* <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                      <span className="text-white font-medium text-lg">No Image Available</span>
                    </div>
                  )}
                </div> */}
                {/* Show variant images if available */}
                {product.variants && product.variants.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">
                      Variant Images:
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {product.variants.map((variant: any) => (
                        <div
                          key={variant.id}
                          className="relative aspect-square rounded-md overflow-hidden border"
                        >
                          {variant.image && (
                            <Image
                              src={variant.image}
                              alt={`${variant.color} variant`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 33vw, 100px"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <Card>
                <div className="md:p-4 p-3 space-y-2">
                  <CardTitle className="text-lg">Product Tags</CardTitle>

                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag: string, index: number) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-sm py-1 px-3"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* Quick Status */}
            <Card>
              <div className="space-y-3 md:p-4 p-3">
                <CardTitle className="text-lg">Quick Status</CardTitle>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Product Status:</span>
                  <Badge
                    variant={productStatus?.variant || "outline"}
                    className="text-sm"
                  >
                    {productStatus?.text || "Unknown"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Has Variants:</span>
                  <Badge
                    variant={product.hasVariants ? "default" : "outline"}
                    className="text-sm"
                  >
                    {product.hasVariants ? "Yes" : "No"}
                  </Badge>
                </div>
                {product.isTopDeal && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Deal Status:</span>
                    <Badge
                      variant="default"
                      className="bg-orange-500 text-white"
                    >
                      Top Deal
                    </Badge>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Sponsored:</span>
                  <Badge
                    variant={product.sponsored ? "default" : "outline"}
                    className="text-sm"
                  >
                    {product.sponsored ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Reviews:</span>
                  <span className="font-semibold">
                    {product.totalReviews || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average Rating:</span>
                  <span className="font-semibold flex items-center gap-1">
                    {product.averageRating?.toFixed(1) || "0.0"} ⭐
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Detailed Information */}
          <div className="xl:col-span-2 space-y-6">
            {/* Product Basic Information */}
            <Card>
              <div className="md:p-4 p-3  space-y-3">
                <CardTitle className="text-lg">Basic Information</CardTitle>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-base">
                      {product.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium text-gray-500 text-sm">
                          Product ID:
                        </span>
                        <p className="text-gray-900 font-mono text-sm break-all mt-1">
                          {product.id}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-500 text-sm">
                          Type:
                        </span>
                        <p className="text-gray-900 mt-1">
                          {product.type || "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-500 text-sm">
                          Store ID:
                        </span>
                        <p className="text-gray-900 font-mono text-sm break-all mt-1">
                          {product.storeId}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium text-gray-500 text-sm">
                          Barcode:
                        </span>
                        <p className="text-gray-900 font-mono mt-1">
                          {product.barcode || "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-500 text-sm">
                          Category ID:
                        </span>
                        <p className="text-gray-900 font-mono text-sm break-all mt-1">
                          {product.categoryId}
                        </p>
                      </div>
                      {product.subCategoryId && (
                        <div>
                          <span className="font-medium text-gray-500 text-sm">
                            Subcategory ID:
                          </span>
                          <p className="text-gray-900 font-mono text-sm break-all mt-1">
                            {product.subCategoryId}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Pricing Information */}
            <Card>
              <div className="md:p-4 p-3  space-y-3">
                <CardTitle className="text-lg">Pricing Information</CardTitle>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gray-50 rounded-lg border">
                    <span className="text-sm text-gray-500 block mb-2">
                      Original Price
                    </span>
                    <p className="text-3xl font-bold text-gray-700">
                      €{product.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
                    <span className="text-sm text-gray-500 block mb-2">
                      Final Price
                    </span>
                    <p className="text-3xl font-bold text-green-600">
                      €{product.finalPrice.toFixed(2)}
                    </p>
                  </div>
                  {product.discount && product.discount > 0 ? (
                    <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
                      <span className="text-sm text-gray-500 block mb-2">
                        Discount
                      </span>
                      <p className="text-3xl font-bold text-red-600">
                        {product.discount}% OFF
                      </p>
                    </div>
                  ) : (
                    <div className="text-center p-6 bg-gray-50 rounded-lg border">
                      <span className="text-sm text-gray-500 block mb-2">
                        Discount
                      </span>
                      <p className="text-3xl font-bold text-gray-600">
                        No Discount
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Inventory & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <div className="md:p-4 p-3 space-y-3">
                  <CardTitle className="text-lg">Inventory Status</CardTitle>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b">
                      <span className="text-gray-600 text-lg">
                        Total Stock:
                      </span>
                      <span className="text-2xl font-semibold">
                        {hasVariants
                          ? totalVariantStock
                          : product.stockQuantity}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b">
                      <span className="text-gray-600 text-lg">
                        Has Variants:
                      </span>
                      <Badge
                        variant={product.hasVariants ? "default" : "outline"}
                        className="text-sm"
                      >
                        {product.hasVariants ? "Yes" : "No"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-gray-600 text-lg">Status:</span>
                      <Badge
                        variant={stockStatus?.variant || "outline"}
                        className="text-base px-3 py-1"
                      >
                        {stockStatus?.text || "Unknown"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Category Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b">
                      <span className="text-gray-600 text-lg">Category:</span>
                      <span className="font-semibold text-lg">
                        {product.category?.name || "N/A"}
                      </span>
                    </div>
                    {product.subcategory && (
                      <div className="flex justify-between items-center py-3 border-b">
                        <span className="text-gray-600 text-lg">
                          Subcategory:
                        </span>
                        <span className="font-semibold text-lg">
                          {product.subcategory.name}
                        </span>
                      </div>
                    )}
                    {product.subcategory?.description && (
                      <div className="py-3">
                        <span className="text-gray-600 text-lg block mb-2">
                          Subcategory Description:
                        </span>
                        <p className="text-gray-700">
                          {product.subcategory.description}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Variants Information */}
            {product.hasVariants &&
              product.variants &&
              product.variants.length > 0 && (
                <Card>
                  <div className="md:p-4 p-3 space-y-3">
                    <CardTitle className="text-lg">Product Variants</CardTitle>
                    <div className="space-y-6">
                      {product.variants.map((variant: any, index: number) => (
                        <div key={variant.id} className="border rounded-lg p-4">
                          <div className="flex items-start gap-4 mb-4">
                            {variant.image && (
                              <div className="relative h-20 w-20 rounded-md overflow-hidden border flex-shrink-0">
                                <Image
                                  src={variant.image}
                                  alt={`${variant.color} variant`}
                                  fill
                                  className="object-cover"
                                  sizes="80px"
                                />
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="flex items-center flex-col md:flex-row gap-3 mb-2">
                                <h4 className="text-lg font-semibold">
                                  Variant {index + 1}
                                </h4>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-sm">
                                    {variant.color}
                                  </Badge>
                                  {variant.colorCode && (
                                    <div
                                      className="w-8 h-8 rounded-lg border"
                                      style={{
                                        backgroundColor: variant.colorCode,
                                      }}
                                      title={variant.colorCode}
                                    />
                                  )}
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mr-6 md:mr-0">
                                {variant.sizes.map((size: any) => (
                                  <div
                                    key={size.id}
                                    className="flex md:flex-row flex-col items-center justify-between p-3 bg-gray-50 rounded-lg"
                                  >
                                    <div>
                                      <span className="font-medium text-gray-700">
                                        Size:
                                      </span>
                                      <span className="ml-2 font-semibold">
                                        {size.size}
                                      </span>
                                    </div>
                                    <div className="gap-2 mb-2 md:mb-0">
                                      <span className="font-medium text-gray-700">
                                        Quantity:
                                      </span>
                                      <span className="ml-2 font-semibold">
                                        {size.quantity}
                                      </span>
                                    </div>
                                    <Badge
                                      variant={
                                        size.inStock ? "default" : "destructive"
                                      }
                                      className="text-sm"
                                    >
                                      {size.inStock
                                        ? "In Stock"
                                        : "Out of Stock"}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              )}

            {/* Store Information */}
            {product.store && (
              <Card>
                <div className="md:p-4 p-3 space-y-3">
                  <CardTitle className="text-lg">Store Information</CardTitle>
                  <div className="flex items-start gap-4 mb-6">
                    {product.store.logo && (
                      <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
                        <Image
                          src={product.store.logo}
                          alt={product.store.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold mb-3">
                        {product.store.name}
                      </h4>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge
                          variant={shopStatus?.variant || "outline"}
                          className="text-sm"
                        >
                          {product.store.shopStatus}
                        </Badge>
                        <Badge variant="outline" className="text-sm">
                          {product.store.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium text-gray-500 text-sm">
                          Location:
                        </span>
                        <p className="text-gray-900 text-lg mt-1">
                          {product.store.location}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-500 text-sm">
                          Phone:
                        </span>
                        <p className="text-gray-900 text-lg mt-1">
                          {product.store.phone}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium text-gray-500 text-sm">
                          Email:
                        </span>
                        <p className="text-gray-900 text-lg break-all mt-1">
                          {product.store.email}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-500 text-sm">
                          Store ID:
                        </span>
                        <p className="text-gray-900 font-mono text-sm break-all mt-1">
                          {product.store.id}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Top Deal Information */}
            {product.isTopDeal && (
              <Card>
                <div className="md:p-4 p-3 space-y-3">
                  <CardTitle className="text-lg">
                    Top Deal Information
                  </CardTitle>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <span className="font-medium text-gray-500 text-sm">
                        Top Deal Active:
                      </span>
                      <p className="text-gray-900 font-semibold text-lg">Yes</p>
                    </div>
                    <div className="space-y-2">
                      <span className="font-medium text-gray-500 text-sm">
                        Top Deal From:
                      </span>
                      <p className="text-gray-900 font-semibold text-lg">
                        {product.topDealFrom
                          ? formatDate(product.topDealFrom)
                          : "Not specified"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <span className="font-medium text-gray-500 text-sm">
                        Top Deal Until:
                      </span>
                      <p className="text-gray-900 font-semibold text-lg">
                        {product.topDealUntil
                          ? formatDate(product.topDealUntil)
                          : "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Timestamps */}
            <Card>
              <div className="md:p-4 p-3 space-y-3">
                <CardTitle className="text-lg">Timestamps</CardTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <span className="font-medium text-gray-500 text-sm">
                      Created Date:
                    </span>
                    <p className="text-gray-900 font-semibold text-lg">
                      {formatDate(product.createdAt)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <span className="font-medium text-gray-500 text-sm">
                      Last Updated:
                    </span>
                    <p className="text-gray-900 font-semibold text-lg">
                      {formatDate(product.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
