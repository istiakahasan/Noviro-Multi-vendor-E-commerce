/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { Heart, Minus, Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import YouMayLikeCard from "@/components/product/YouMayLikeCard";
import Link from "next/link";
import ReviewProduct from "@/components/shared/review/ReviewProduct";
import { useParams } from "next/navigation";
import {
  useAddProductWishlistMutation,
  useGetProductDetailsQuery,
  useGetProductReviewsQuery,
} from "@/redux/api/productsApi";
import { FaRegStar } from "react-icons/fa6";
import { useAddCartMutation, useGetAddToCartQuery } from "@/redux/api/cartApi";
import { toast } from "sonner";
import {
  useCreateCouponValidateMutation,
  useGetAllCouponByStoreIdQuery,
} from "@/redux/api/couponApi";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import ProductCouponCard from "@/components/common/ProductCouponCard";
import { Size } from "@/types/productDetails.type";
import PageLoading from "@/components/shared/PageLoading";
import { useAuth } from "@/redux/hooks/useAuth";

export default function ProductDetailsPage() {
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);

  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);

  const router = useRouter();

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");

  const [isFavorite, setIsFavorite] = useState(false);
  // const [selectedQuantity, setSelectedQuantity] = useState(1)

  const { isAuthenticated } = useAuth();

  const [validateCoupon, { isLoading: isCouponLoading }] =
    useCreateCouponValidateMutation();

  const [addProductWishlist, { isLoading: isAddingToWishlist }] =
    useAddProductWishlistMutation();

  const { id } = useParams();
  const { data, isLoading, error } = useGetProductDetailsQuery(id as string);
  const productId = data?.data.id as string;
  const storeId = data?.data?.storeId as string;

  const { data: couponData } = useGetAllCouponByStoreIdQuery(storeId);

  const { data: reviews } = useGetProductReviewsQuery(id as string);

  const [addToCart, { isLoading: isAddingToCart, error: addCartError }] =
    useAddCartMutation();

  const { data: cartData } = useGetAddToCartQuery();

  const cartItems = cartData?.data?.items ?? [];
  const totalItems = cartData?.data?.totalItems ?? 0;
  const subtotal = cartData?.data?.totalPrice ?? 0;

  const product = data?.data;

  const variants = useMemo(() => {
    return Array.isArray(product?.variants) ? product.variants : [];
  }, [product?.variants]);

  const displayImages = useMemo(() => {
    if (variants.length > 0) {
      return variants.map((v) => v.image).filter(Boolean);
    }

    if (Array.isArray(product?.images)) {
      return product.images;
    }

    return [];
  }, [variants, product?.images]);

  const selectedVariant = useMemo(() => {
    return variants[selectedVariantIndex] || null;
  }, [variants, selectedVariantIndex]);

  const variantImages = useMemo(() => {
    return variants.map((variant) => variant.image);
  }, [variants]);

  const availableSizes = useMemo(() => {
    return selectedVariant?.sizes || [];
  }, [selectedVariant]);

  const basePrice = useMemo(() => {
    return product?.finalPrice || 0;
  }, [product?.finalPrice]);

  const totalPrice = useMemo(() => {
    return basePrice * quantity;
  }, [basePrice, quantity]);

  useEffect(() => {
    if (availableSizes.length > 0) {
      setSelectedSize(availableSizes[0]?.size || "");
    } else {
      setSelectedSize("");
    }
  }, [selectedVariantIndex, availableSizes]);

  useEffect(() => {
    if (variants.length > 0) {
      setSelectedVariantIndex(0);
    }
  }, [variants]);

  //
  useEffect(() => {
    setSelectedVariantIndex(0);
  }, [displayImages]);

  // Option 2: Show error toast when mutation fails
  useEffect(() => {
    if (addCartError) {
      toast.error("Failed to add item to cart. Please try again.");
    }
  }, [addCartError]);

  const handleAddToWishlist = async () => {
    if (!productId) {
      toast.error("Product not found");
      return;
    }

    try {
      const result = await addProductWishlist({ productId }).unwrap();

      if (result.data.success) {
        setIsFavorite(result.data.inWishlist);
        toast.success(result.data.message);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update wishlist");
    }
  };

  if (isLoading) return <PageLoading />;
  if (error) return <p>Something went wrong!</p>;

  const stock = product?.stockQuantity ?? 0;
  //   e.preventDefault();
  //   e.stopPropagation();

  //   if (!product || !product.id) {
  //     toast.error("Product information is missing");
  //     return;
  //   }

  //   if (stock === 0) {
  //     toast.error("This product is out of stock");
  //     return;
  //   }

  //   if (quantity > stock) {
  //     toast.error(`Only ${stock} items available in stock`);
  //     return;
  //   }

  //   // Get the selected size object
  //   const selectedSizeObj = availableSizes.find(
  //     (size: Size) => size.size === selectedSize,
  //   );

  //   // Validate size selection
  //   if (!selectedSizeObj || !selectedSizeObj.inStock) {
  //     toast.error("Please select a valid size");
  //     return;
  //   }

  //   const toastId = toast.loading(
  //     `Adding ${quantity} × ${product.name} to cart...`,
  //   );

  //   try {
  //     // Call the mutation
  //     await addToCart({
  //       productId: product.id,
  //       sizeId: selectedSizeObj?.id,
  //       quantity: quantity,

  //       // 👇 NEW FIELDS
  //       variantId: selectedVariant?.id,
  //       color: selectedVariant?.color,
  //       size: selectedSize,
  //     }).unwrap();

  //     toast.success(`${quantity} × ${product.name} added to cart!`, {
  //       id: toastId,
  //     });
  //   } catch (error) {
  //     toast.error("Failed to add item to cart. Please try again.", {
  //       id: toastId,
  //     });
  //     console.error("Failed to add to cart:", error);
  //   }
  // };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      const currentPath = window.location.pathname;
      sessionStorage.setItem("redirectAfterLogin", currentPath);
      toast.error("Please login to add items to cart");
      router.push("/login");
      return;
    }

    if (!product || !product.id) {
      toast.error("Product information is missing");
      return;
    }

    if (stock === 0) {
      toast.error("This product is out of stock");
      return;
    }

    if (quantity > stock) {
      toast.error(`Only ${stock} items available in stock`);
      return;
    }

    const toastId = toast.loading(
      `Adding ${quantity} × ${product.name} to cart...`,
    );

    try {
      // Prepare cart item data
      const cartItem: any = {
        productId: product.id,
        quantity: quantity,
      };

      // Only add sizeId if a size is selected
      if (selectedSize) {
        const selectedSizeObj = availableSizes.find(
          (size: Size) => size.size === selectedSize,
        );
        if (selectedSizeObj) {
          cartItem.sizeId = selectedSizeObj.id;
          cartItem.size = selectedSize;
        }
      }

      // Only add variant data if a variant is selected
      if (selectedVariant) {
        cartItem.variantId = selectedVariant.id;
        cartItem.color = selectedVariant.color;
      }

      // Call the mutation
      await addToCart(cartItem).unwrap();

      toast.success(`${quantity} × ${product.name} added to cart!`, {
        id: toastId,
      });
    } catch (error) {
      toast.error("Failed to add item to cart. Please try again.", {
        id: toastId,
      });
      console.error("Failed to add to cart:", error);
    }
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);

      if (appliedCoupon) {
        toast.info("Quantity changed. Please reapply coupon.");
        removeCoupon();
      }
    }
  };

  const handleIncreaseQuantity = () => {
    if (stock && quantity < stock) {
      setQuantity((prev) => prev + 1);

      if (appliedCoupon) {
        toast.info("Quantity changed. Please reapply coupon.");
        removeCoupon();
      }
    } else if (!stock) {
      setQuantity((prev) => prev + 1);

      if (appliedCoupon) {
        toast.info("Quantity changed. Please reapply coupon.");
        removeCoupon();
      }
    } else {
      toast.error(`Only ${stock} items available in stock`);
    }
  };

  const handleQuantityInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    if (value === "") {
      setQuantity(1);

      if (appliedCoupon) {
        toast.info("Quantity changed. Please reapply coupon.");
        removeCoupon();
      }
      return;
    }

    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue > 0) {
      if (stock && numValue > stock) {
        toast.error(`Only ${stock} items available in stock`);
        setQuantity(stock);
      } else {
        setQuantity(numValue);

        if (appliedCoupon) {
          toast.info("Quantity changed. Please reapply coupon.");
          removeCoupon();
        }
      }
    }
  };

  const removeCoupon = () => {
    setDiscountAmount(0);
    setFinalAmount(null);
    setAppliedCoupon(null);
    setCouponError("");
    setCouponCode("");
  };

  const handleApplyCoupon = async () => {
    setCouponError("");
    setDiscountAmount(0);
    setFinalAmount(null);

    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      toast.error("Please enter a coupon code");
      return;
    }

    const couponExists = couponData?.data?.find(
      (coupon) => coupon.couponCode.toLowerCase() === couponCode.toLowerCase(),
    );

    if (!couponExists) {
      setCouponError("Invalid coupon code");
      toast.error("Invalid coupon code");
      return;
    }

    try {
      const orderAmount = totalPrice;

      const res = await validateCoupon({
        couponCode: couponCode.trim(),
        userId: "temp-user-id",
        orderAmount: orderAmount,
        storeId: storeId,
      }).unwrap();

      if (res.data.isValid) {
        setDiscountAmount(res.data.discountAmount);
        setFinalAmount(res.data.finalAmount);
        setAppliedCoupon(couponExists);
        toast.success("Coupon applied successfully!");
      } else {
        const errorMessage = "Invalid coupon";
        setCouponError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err: any) {
      const errorMessage = err?.data?.message || "Invalid or expired coupon";
      setCouponError(errorMessage);
      toast.error(errorMessage);
    }
  };

const handleBuyNow = (e: React.MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();

  if (!isAuthenticated) {
    const currentPath = window.location.pathname;
    sessionStorage.setItem("redirectAfterLogin", currentPath);
    toast.error("Please login to add items to cart");
    router.push("/login");
    return;
  }

  if (!product) {
    toast.error("Product information is not available");
    return;
  }

  if (stock === 0) {
    toast.error("This product is out of stock");
    return;
  }

  if (quantity > stock) {
    toast.error(`Only ${stock} items available in stock`);
    return;
  }

  // Get the main image
  const mainImage = displayImages[selectedVariantIndex] || "";
  const unitPrice = product.finalPrice;

  // Base params without variant/size info
  const baseParams: Record<string, string> = {
    productId: product.id,
    storeId: product.storeId || "",
    productName: product.name || "",
    price: product.price.toString(),
    unitPrice: unitPrice.toString(),
    quantity: quantity.toString(),
    finalPrice: (product.finalPrice || product.price).toString(),
    discount: (product.discount || 0).toString(),
    image: mainImage,
    description: product.description || "",
    storeName: product.store?.name || "",
  };

  // Only validate and include variant/size data if variants exist
  if (variants.length > 0) {
    const selectedSizeObj = availableSizes.find(
      (size: Size) => size.size === selectedSize,
    );

    if (!selectedSizeObj || !selectedSizeObj.inStock) {
      toast.error("Please select a valid size");
      return;
    }

    if (!selectedVariant) {
      toast.error("Please select a color");
      return;
    }

    baseParams.variantId = selectedVariant?.id || "";
    baseParams.variantColor = selectedVariant?.color || "";
    baseParams.variantColorCode = selectedVariant?.colorCode || "";
    baseParams.sizeId = selectedSizeObj?.id || "";
    baseParams.size = selectedSize || "";
  }

  // Add coupon data if applied
  if (appliedCoupon) {
    baseParams.couponCode = appliedCoupon.couponCode;
    baseParams.couponId = appliedCoupon.id || "";
    baseParams.couponDiscount = discountAmount.toString();
    baseParams.finalPriceAfterCoupon = finalAmount?.toString() || "";
  }

  const params = new URLSearchParams(baseParams);

  // Navigate to product payment page
  router.push(`/product-payment?${params.toString()}`);
};

  // Handle variant selection
  const handleVariantSelect = (index: number) => {
    setSelectedVariantIndex(index);
  };

  // Handle size selection
  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

  return (
    <div className="md:container mx-auto -mt-10 pt-5">
      <div className="grid grid-cols-12">
        <div className="xl:col-span-9 lg:col-span-8 col-span-12">
          <div className="container mx-auto md:px-3 px-0 py-8 lg:py-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 xl:gap-8 lg:gap-5 md:gap-4">
              {/* Left: Thumbnail Gallery - Hidden on mobile */}
              <div className="flex gap-3 order-2 md:order-2 lg:order-1 md:col-span-4 lg:col-span-2 xl:col-span-1 md:flex-col">
                {displayImages.map((img: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleVariantSelect(index)}
                    className={cn(
                      "relative aspect-square rounded-lg xl:h-20 xl:w-20 h-20 w-20 md:mx-0 mx-1 lg:h-16 lg:w-16 overflow-hidden border-2 transition-all hover:border-gray-400",
                      selectedVariantIndex === index
                        ? "border-red-400/80"
                        : "border-border",
                    )}
                  >
                    <Image
                      src={img}
                      alt={`Product thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Center: Main Product Image */}
              <div className="order-1 md:order-1 lg:order-2 md:col-span-8 lg:col-span-9 xl:col-span-6">
                <div className="relative aspect-[4/4] rounded-2xl overflow-hidden bg-muted">
                  <Image
                    src={
                      displayImages[selectedVariantIndex] || "/placeholder.svg"
                    }
                    alt={product?.name || "Product image"}
                    fill
                    className="object-cover"
                    priority
                  />

                  <button
                    onClick={handleAddToWishlist}
                    disabled={isAddingToWishlist}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors"
                  >
                    <Heart
                      className={cn(
                        "w-5 h-5 transition-colors",
                        isFavorite
                          ? "fill-red-500 text-red-500"
                          : "text-primary",
                      )}
                    />
                  </button>
                </div>
              </div>

              {/* Right: Product Details */}
              <div className="order-3 md:order-3 lg:order-3 md:col-span-12 lg:col-span-5 md:px-0 px-2 space-y-6">
                <div>
                  <h1 className="lg:text-3xl md:text-2xl text-xl xl:text-4xl font-bold text-balance mb-3">
                    {product?.name}
                  </h1>
                  <Link href={`/product/${id}/${product?.storeId}`}>
                    <p className="text-sm text-blue-600 hover:underline inline-block mb-4">
                      Visit the {product?.store?.name} store
                    </p>
                  </Link>

                  {/* Rating and Reviews */}
                  <div className="flex flex-wrap items-center gap-3 text-sm mb-4">
                    <div className="flex items-center gap-1">
                      {product?.averageRating && product.averageRating > 0
                        ? [...Array(product.averageRating)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-5 h-5 fill-yellow-400 text-yellow-400"
                            />
                          ))
                        : [...Array(5)].map((_, i) => (
                            <FaRegStar
                              key={i}
                              className="w-5 h-5 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                    </div>
                    <span className="font-medium">
                      {product?.totalReviews} Reviews
                    </span>
                    <span className="text-muted-foreground">⚡</span>
                    <span className="text-muted-foreground">
                      178 sold in last 10 days
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="xl:text-3xl md:text-2xl text-xl font-bold text-red-600">
                      €{product?.finalPrice.toFixed(2)}
                    </span>
                    <span className="lg:text-base md:text-base text-sm text-muted-foreground line-through">
                      €{product?.price.toFixed(2)}
                    </span>
                    <Badge className="bg-transparent hover:bg-transparent text-[#CE2226] shadow-none text-xs">
                      {product?.discount}% Off
                    </Badge>
                  </div>
                </div>

                {/* Colors */}
                {variants.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Colors</h3>
                    <div className="flex gap-2">
                      {variants.map((variant, index) => (
                        <button
                          key={variant.id}
                          onClick={() => handleVariantSelect(index)}
                          className={cn(
                            "w-12 h-12 rounded-full border-2 transition-all hover:scale-105",
                            selectedVariantIndex === index
                              ? "ring-2 ring-primary"
                              : "border-border",
                          )}
                          style={{ backgroundColor: variant.colorCode }}
                          title={variant.color}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Size */}
                {variants.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Size</h3>
                    <div className="flex flex-wrap gap-2">
                      {availableSizes.map((size: Size) => (
                        <button
                          key={size.id}
                          onClick={() => handleSizeSelect(size.size)}
                          disabled={!size.inStock}
                          className={cn(
                            "xl:px-6 px-4 py-2 xl:py-2.5 rounded-lg border-2 font-medium transition-all",
                            selectedSize === size.size
                              ? "border-primary bg-muted"
                              : "border-border bg-background",
                            !size.inStock && "opacity-50 cursor-not-allowed",
                          )}
                        >
                          {size.size}
                          {!size.inStock && " (Out of Stock)"}
                        </button>
                      ))}
                      {availableSizes.length === 0 && (
                        <p className="text-muted-foreground">
                          No sizes available for this color
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom: Description and About */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12 pt-12 border-t md:px-0 px-2">
              {/* Description */}
              <div>
                <h2 className="md:text-2xl text-xl font-bold mb-4">Description</h2>
                <p className="text-muted-foreground md:text-base text-sm leading-relaxed">
                  {product?.description}
                </p>
              </div>

              {/* About this item */}
            </div>
          </div>
        </div>
        <div className="xl:col-span-3 lg:col-span-4 col-span-12 md:pr-4 px-2 w-full mb-5 lg:mt-12">
          {couponData?.data?.length ? (
            <ProductCouponCard couponData={couponData} />
          ) : null}

          <div className="bg-white px-5 py-7 rounded-xl">
            {/* <div className="flex items-baseline">
                            <span className="text-4xl font-bold">€{product?.finalPrice.toFixed(2)}</span>
                            <span className="text-lg text-gray-400 line-through"> €{product?.price.toFixed(2)}</span>
                        </div> */}

            {/* <div className="py-3 text-gray-400">
                            €53.59 Shipping & Import <br />
                            Charges to Spain
                        </div> */}
            <p className="text-green-600 mb-3">
              {stock > 0 ? "In Stock" : "Out of Stock"}
            </p>
            {/* Quantity */}
            <div>
              <div className="flex justify-between my-2">
                <p className="md:text-lg text-base font-medium">Quantity</p>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDecreaseQuantity}
                    disabled={quantity <= 1}
                    className="w-8 h-8 p-0"
                  >
                    <Minus size={16} />
                  </Button>

                  <input
                    type="text"
                    value={quantity}
                    onChange={handleQuantityInputChange}
                    min="1"
                    max={stock || undefined}
                    disabled
                    className="w-6 h-8 text-center"
                  />

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleIncreaseQuantity}
                    disabled={stock > 0 && quantity >= stock}
                    className="w-8 h-8 p-0"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </div>
            </div>

            <h3 className="font-semibold md:text-xl text-lg mt-3 mb-2">Have a coupon?</h3>
            <div className="flex gap-2 pb-2">
              <Input
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => {
                  setCouponCode(e.target.value);
                  setCouponError(""); // Clear error when typing
                }}
                className={`flex-1 py-5 ${couponError ? "border-red-500" : ""}`}
                disabled={appliedCoupon}
              />
              {appliedCoupon ? (
                <Button
                  onClick={removeCoupon}
                  className="py-5 bg-red-600 hover:bg-red-700 text-white"
                >
                  Remove
                </Button>
              ) : (
                <Button
                  onClick={handleApplyCoupon}
                  disabled={isCouponLoading}
                  className="py-5 bg-primary text-white hover:bg-primary/90"
                >
                  {isCouponLoading ? "Applying..." : "Apply"}
                </Button>
              )}
            </div>

            {/* Coupon Error Message */}
            {couponError && (
              <div className="text-sm text-red-600 mb-2">{couponError}</div>
            )}

            {/* Applied Coupon Info */}
            {appliedCoupon && (
              <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-green-800 text-sm">
                      Coupon applied:{" "}
                      <span className="font-bold">
                        {appliedCoupon.couponCode}
                      </span>
                    </p>
                    <p className="text-xs text-green-600">
                      {appliedCoupon.discount}
                      {appliedCoupon.discountType === "PERCENTAGE"
                        ? "%"
                        : "€"}{" "}
                      OFF
                    </p>
                  </div>
                  <span className="text-green-700 font-bold">
                    -€{discountAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-2 py-3 border-t border-b">
              <div className="flex justify-between">
                <p className="text-muted-foreground md:text-base text-sm">Price (each):</p>
                <span>€{basePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <p className="text-muted-foreground md:text-base text-sm">Quantity:</p>
                <span>{quantity}</span>
              </div>

              {/* Discount Applied */}
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <p>Coupon Discount:</p>
                  <span>-€{discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between md:text-lg text-base font-bold pt-2">
                <p>Total Price:</p>
                <span
                  className={
                    discountAmount > 0 ? "text-green-600" : "text-red-600"
                  }
                >
                  €{(finalAmount || totalPrice).toFixed(2)}
                  {discountAmount > 0 && (
                    <span className="text-sm text-muted-foreground line-through ml-2">
                      €{totalPrice.toFixed(2)}
                    </span>
                  )}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-3">
              <Button
                onClick={handleAddToCart}
                className="w-full h-12 text-base bg-primary hover:bg-primary/85 font-semibold"
                size="lg"
                disabled={isAddingToCart || stock === 0}
              >
                {isAddingToCart
                  ? "Adding to Cart..."
                  : stock === 0
                    ? "Out of Stock"
                    : "Add To Cart"}
              </Button>

              <Button
                variant="outline"
                className="w-full h-12 text-base font-semibold bg-transparent"
                size="lg"
                onClick={handleBuyNow}
                disabled={stock === 0}
              >
                {stock === 0
                  ? "Out of Stock"
                    : "Buy Now"}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <ReviewProduct productId={productId} reviews={reviews} />
      </div>

      <YouMayLikeCard categoryId={data?.data.categoryId as string} />
    </div>
  );
}
