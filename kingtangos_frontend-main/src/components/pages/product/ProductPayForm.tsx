/* eslint-disable @typescript-eslint/no-explicit-any */
// components/pages/product/ProductPayForm.tsx
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Package, Store, Palette, Ruler, Tag } from "lucide-react";
import { toast } from "sonner";
import { useCreateProductBookingPaymentMutation } from "@/redux/api/payment/paymentApi";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useGetSpecialOfferByIdQuery } from "@/redux/api/specialOfferApi";

// Define Zod schema for validation
const paymentFormSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  country: z.string().min(1, "Please insert country"),
  state: z.string().min(1, "Please insert state"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  postalCode: z.string().min(3, "Postal code must be at least 3 characters"),
});

type PaymentFormData = z.infer<typeof paymentFormSchema>;

interface ProductData {
  // Basic product info
  productId: string;
  storeId: string;
  productName: string;

  // Pricing
  price: number;
  unitPrice: number;
  quantity: number;
  finalPrice: number;
  discount: number;

  // Media and descriptions
  image: string;
  description?: string;
  storeName?: string;

  // Variant information
  variantId: string;
  variantColor: string;
  variantColorCode?: string;
  sizeId: string;
  size: string;

  // Coupon information
  couponCode?: string;
  couponId?: string;
  couponDiscount?: string;
  finalPriceAfterCoupon?: string;
}

interface ProductPayFormProps {
  productData: ProductData;
}

export default function ProductPayForm({ productData }: ProductPayFormProps) {
  const [createProductPayment, { isLoading: isPaymentLoading }] =
    useCreateProductBookingPaymentMutation();

  // ─── Special Offer Check ───────────────────────────────────────────────────
  const { data: offerData } = useGetSpecialOfferByIdQuery(
    productData.productId,
    {
      skip: !productData.productId,
    },
  );

  const activeOffer =
    offerData?.data?.hasOffer && offerData?.data?.offer
      ? offerData.data.offer
      : null;
  // ──────────────────────────────────────────────────────────────────────────

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      country: "",
      state: "",
      address: "",
      city: "",
      postalCode: "",
    },
  });

  useEffect(() => {
    const isPartialVariant =
      !!(productData.variantId || productData.sizeId) &&
      !(productData.variantId && productData.sizeId);
    if (isPartialVariant) {
      toast.error(
        "Product variant information is missing. Please go back and select color and size.",
      );
    }
  }, [productData]);

  const onSubmitForm = async (formData: PaymentFormData) => {
    try {
      console.log("=== SUBMITTING PRODUCT ORDER ===");
      console.log("Form data:", formData);
      console.log("Product data:", productData);
      console.log("Active offer:", activeOffer);

      // Calculate the item price (with coupon if applied)
      const itemUnitPrice = productData.finalPriceAfterCoupon
        ? parseFloat(productData.finalPriceAfterCoupon) / productData.quantity
        : productData.unitPrice;

      const itemTotal = itemUnitPrice * productData.quantity;
      const shippingCost = itemTotal > 50 ? 0 : 2;
      const totalAmount = itemTotal + shippingCost;

      // Prepare API payload with ALL required fields
      const orderPayload: any = {
        orderItems: [
          {
            productId: productData.productId,
            quantity: productData.quantity,
            price: itemUnitPrice,
            // Only include variant/size if they exist
            ...(productData.variantId && { variantId: productData.variantId }),
            ...(productData.sizeId && { sizeId: productData.sizeId }),
            ...(productData.variantColor && {
              variantColor: productData.variantColor,
            }),
            ...(productData.size && { size: productData.size }),
            ...(productData.couponCode && {
              couponCode: productData.couponCode,
              couponId: productData.couponId,
            }),
          },
        ],

        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          country: formData.country,
          state: formData.state,
          city: formData.city,
          postalCode: formData.postalCode,
          address: formData.address,
        },
        shippingCost: shippingCost,
        paymentMethod: "stripe",
        totalAmount: totalAmount,
        storeId: productData.storeId,

        // ─── Include specialOfferId if an active offer exists for this product ───
        ...(activeOffer?.id && { specialOfferId: activeOffer.id }),
        // ─────────────────────────────────────────────────────────────────────────
      };

      console.log("📦 API Payload:", JSON.stringify(orderPayload, null, 2));

      // Call the product payment API
      const response = await createProductPayment(orderPayload).unwrap();

      console.log("✅ Payment Response:", response);

      // Handle response
      if (response.success) {
        const paymentUrl =
          response.data?.paymentUrl ||
          response.data?.checkoutUrl ||
          response.data?.url ||
          response.paymentUrl;

        if (paymentUrl) {
          toast.success(
            "Order created successfully! Redirecting to payment...",
          );
          // Redirect to Stripe payment page
          window.location.href = paymentUrl;
        } else {
          toast.error("No payment URL received from server.");
        }
      } else {
        toast.error(
          response.message || "Failed to create order. Please try again.",
        );
      }
    } catch (error: any) {
      console.error("❌ Error submitting order:", error);

      // Log full error details
      if (error?.data) {
        console.error("Error details:", error.data);
        console.error("Error messages:", error.data?.errorMessages);

        // Check if it's the variant/size error
        const errorMsg =
          error.data?.errorMessages?.[0]?.message || error.data?.message;
        if (errorMsg?.includes("size") || errorMsg?.includes("color")) {
          toast.error(
            "Please select size and color for this product before proceeding.",
          );
        } else if (errorMsg?.includes("email")) {
          toast.error("Email field is not accepted. Please contact support.");
        } else {
          toast.error(
            errorMsg ||
              "Bad request. Please check your order details and try again.",
          );
        }
      } else if (error?.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to submit order. Please try again.");
      }
    }
  };

  // Calculate totals
  const itemUnitPrice = productData.finalPriceAfterCoupon
    ? parseFloat(productData.finalPriceAfterCoupon) / productData.quantity
    : productData.unitPrice;

  const itemTotal = itemUnitPrice * productData.quantity;
  const originalTotal = productData.finalPrice * productData.quantity;
  const shippingCost = itemTotal > 50 ? 0 : 2;
  const totalAmount = itemTotal + shippingCost;

  const isLoading = isSubmitting || isPaymentLoading;

  const isVariantDataMissing =
    !!(productData.variantId || productData.sizeId) &&
    !(productData.variantId && productData.sizeId);

  // Calculate special offer price for display
  const calculateSpecialOfferPrice = () => {
    if (!activeOffer) return null;
    
    const originalTotal = productData.unitPrice * productData.quantity;
    
    if (activeOffer.discountType === "PERCENTAGE") {
      // Calculate percentage discount
      const discountAmount = (originalTotal * activeOffer.discountValue) / 100;
      // Apply maximum discount cap if exists
      const finalDiscount = activeOffer.maximumDiscountAmount 
        ? Math.min(discountAmount, activeOffer.maximumDiscountAmount)
        : discountAmount;
      return (originalTotal - finalDiscount).toFixed(2);
    } else {
      // Fixed discount
      return Math.max(0, originalTotal - activeOffer.discountValue).toFixed(2);
    }
  };

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Billing Information Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 py-4 px-3 lg:p-6">
            <div className="flex justify-between items-center mb-8">
              <h1 className="lg:text-2xl text-lg font-bold text-gray-900">
                Billing Information
              </h1>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="lg:text-2xl text-xl font-bold text-primary">
                  €{totalAmount.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Warning if variant data is missing */}
            {isVariantDataMissing && (
              <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ Product variant information is incomplete. Please go back
                  and select color and size again.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="fullName"
                  className="text-sm font-medium text-gray-700"
                >
                  Full Name *
                </Label>
                <Input
                  id="fullName"
                  {...register("fullName")}
                  placeholder="Insert your full name"
                  className={`py-5 ${errors.fullName ? "border-red-500" : ""}`}
                />
                {errors.fullName && (
                  <p className="text-sm text-red-500">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Phone and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className="text-sm font-medium text-gray-700"
                  >
                    Phone *
                  </Label>
                  <Input
                    id="phone"
                    {...register("phone")}
                    type="tel"
                    placeholder="+880 1567808747"
                    className={`py-5 ${errors.phone ? "border-red-500" : ""}`}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email (Optional)
                  </Label>
                  <Input
                    id="email"
                    {...register("email")}
                    type="email"
                    placeholder="your.email@example.com"
                    className={`py-5 ${errors.email ? "border-red-500" : ""}`}
                  />
                  <p className="text-xs text-gray-500">
                    Note: Email is optional and used only for order confirmation
                  </p>
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label
                  htmlFor="address"
                  className="text-sm font-medium text-gray-700"
                >
                  Address *
                </Label>
                <Input
                  id="address"
                  {...register("address")}
                  placeholder="3891 Ranchview Dr. Richardson, California 62639"
                  className={`py-5 ${errors.address ? "border-red-500" : ""}`}
                />
                {errors.address && (
                  <p className="text-sm text-red-500">
                    {errors.address.message}
                  </p>
                )}
              </div>

              {/* Country/Region */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="country"
                    className="text-sm font-medium text-gray-700"
                  >
                    Country *
                  </Label>
                  <Input
                    id="country"
                    {...register("country")}
                    placeholder="United States"
                    className={`py-5 ${errors.country ? "border-red-500" : ""}`}
                  />
                  {errors.country && (
                    <p className="text-sm text-red-500">
                      {errors.country.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="state"
                    className="text-sm font-medium text-gray-700"
                  >
                    State *
                  </Label>
                  <Input
                    id="state"
                    {...register("state")}
                    placeholder="State"
                    className={`py-5 ${errors.state ? "border-red-500" : ""}`}
                  />
                  {errors.state && (
                    <p className="text-sm text-red-500">
                      {errors.state.message}
                    </p>
                  )}
                </div>
              </div>

              {/* City and Postal Code */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="city"
                    className="text-sm font-medium text-gray-700"
                  >
                    City *
                  </Label>
                  <Input
                    id="city"
                    {...register("city")}
                    placeholder="City"
                    className={`py-5 ${errors.city ? "border-red-500" : ""}`}
                  />
                  {errors.city && (
                    <p className="text-sm text-red-500">
                      {errors.city.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="postalCode"
                    className="text-sm font-medium text-gray-700"
                  >
                    Postal Code *
                  </Label>
                  <Input
                    id="postalCode"
                    {...register("postalCode")}
                    placeholder="ZIP Code"
                    className={`py-5 ${errors.postalCode ? "border-red-500" : ""}`}
                  />
                  {errors.postalCode && (
                    <p className="text-sm text-red-500">
                      {errors.postalCode.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Security Notice and Submit Button */}
              <div className="pt-6 border-t border-gray-200">
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    You are ordering{" "}
                    <strong>
                      {productData.quantity} × {productData.productName}
                    </strong>
                    {productData.variantColor && (
                      <>
                        {" "}
                        in{" "}
                        <span
                          className="inline-block w-3 h-3 rounded-full"
                          style={{
                            backgroundColor:
                              productData.variantColorCode ||
                              productData.variantColor,
                          }}
                        ></span>{" "}
                        {productData.variantColor}
                      </>
                    )}
                    {productData.size && <> (Size: {productData.size})</>}
                  </p>
                  <p className="text-xs text-blue-600 mt-2">
                    {originalTotal > itemTotal && (
                      <span className="line-through mr-2">
                        €{originalTotal.toFixed(2)}
                      </span>
                    )}
                    Item total: <strong>€{itemTotal.toFixed(2)}</strong> |
                    Shipping:{" "}
                    {shippingCost === 0
                      ? "FREE"
                      : `€${shippingCost.toFixed(2)}`}
                  </p>
                  {activeOffer && (
                    <p className="text-xs text-green-600 mt-1 font-semibold">
                      🎉 Special offer applied! Final price includes discount.
                    </p>
                  )}
                </div>

                <p className="text-sm text-gray-500 mb-4">
                  Your billing information is securely stored and encrypted.
                </p>

                <Button
                  type="submit"
                  className="w-full py-6 text-lg font-semibold bg-primary hover:bg-primary/90 text-white"
                  disabled={isLoading || isVariantDataMissing}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing Order...
                    </>
                  ) : isVariantDataMissing ? (
                    "Missing Variant Information"
                  ) : (
                    `Pay €${totalAmount.toFixed(2)} & Place Order`
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            {/* Order Summary Card */}
            <div className="py-4 px-3 lg:p-6 bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
              <h3 className="text-lg font-semibold text-primary mb-6">
                Order Summary
              </h3>

              {/* Product Details */}
              <div className="flex items-start gap-4 mb-6 pb-6 border-b border-slate-200">
                {productData.image && (
                  <div className="relative flex-shrink-0">
                    <Image
                      src={productData.image}
                      alt={productData.productName}
                      width={500}
                      height={500}
                      className="rounded-lg w-16 h-16 object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="font-medium text-slate-900 line-clamp-2">
                    {productData.productName}
                  </h4>

                  {/* Display variant information */}
                  <div className="space-y-1 mt-2">
                    {productData.variantColor && (
                      <div className="flex items-center gap-2">
                        <Palette className="h-3 w-3 text-slate-400" />
                        <span className="text-xs text-slate-600">
                          Color:{" "}
                          <span className="font-medium">
                            {productData.variantColor}
                          </span>
                          {productData.variantColorCode && (
                            <span
                              className="inline-block w-3 h-3 rounded-full ml-1"
                              style={{
                                backgroundColor: productData.variantColorCode,
                              }}
                            ></span>
                          )}
                        </span>
                      </div>
                    )}

                    {productData.size && (
                      <div className="flex items-center gap-2">
                        <Ruler className="h-3 w-3 text-slate-400" />
                        <span className="text-xs text-slate-600">
                          Size:{" "}
                          <span className="font-medium">
                            {productData.size}
                          </span>
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <Package className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-500">
                      Qty: {productData.quantity}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div>
                      {productData.discount > 0 && (
                        <span className="text-sm text-muted-foreground line-through mr-2">
                          €
                          {(productData.price * productData.quantity).toFixed(
                            2,
                          )}
                        </span>
                      )}
                      <span className="text-primary font-semibold">
                        €{itemTotal.toFixed(2)}
                      </span>
                    </div>
                    {productData.discount > 0 && (
                      <Badge className="bg-red-100 text-red-600">
                        {productData.discount}% OFF
                      </Badge>
                    )}
                  </div>

                  {/* Show coupon discount if applied */}
                  {productData.couponCode && (
                    <div className="mt-2 p-1 bg-green-50 rounded text-xs text-green-600">
                      Coupon {productData.couponCode} applied: -€
                      {productData.couponDiscount}
                    </div>
                  )}

                  {/* ─── Show active special offer if found for this product ─── */}
                  {activeOffer && (
                    <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded flex items-start gap-2">
                      <Tag className="h-3 w-3 text-orange-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-orange-600">
                          Special Offer Applied 🎉
                        </p>
                        <p className="text-xs text-orange-500">
                          {activeOffer.discountType === "PERCENTAGE"
                            ? `${activeOffer.discountValue}% OFF`
                            : `€${activeOffer.discountValue} OFF`}{" "}
                          • {activeOffer.store?.name}
                        </p>
                        <p className="text-xs text-orange-600 mt-1">
                          Special offer price: €{calculateSpecialOfferPrice()}
                        </p>
                        {activeOffer.discountType === "PERCENTAGE" &&
                          activeOffer.maximumDiscountAmount && (
                            <p className="text-xs text-orange-400 mt-1">
                              Max discount: €{activeOffer.maximumDiscountAmount}
                            </p>
                          )}
                        {activeOffer.minimumOrderAmount > 0 && (
                          <p className="text-xs text-orange-400 mt-1">
                            Min. order: €{activeOffer.minimumOrderAmount}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Store Details */}
              {productData.storeName && (
                <div className="mb-6 pb-6 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <Store className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-500">Sold by</p>
                      <p className="font-medium">{productData.storeName}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">
                    Items ({productData.quantity})
                  </span>
                  <span className="font-medium">€{itemTotal.toFixed(2)}</span>
                </div>

                {originalTotal > itemTotal && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon Discount</span>
                    <span>-€{(originalTotal - itemTotal).toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-slate-600">Shipping</span>
                  <span className="font-medium">
                    {shippingCost === 0
                      ? "FREE"
                      : `€${shippingCost.toFixed(2)}`}
                  </span>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-slate-900">
                      Total
                    </span>
                    <span className="lg:text-2xl text-lg font-bold text-primary">
                      €{totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="py-4 px-3 lg:p-6 bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
              <h4 className="font-semibold text-slate-900 mb-3">
                Shipping Information
              </h4>
              <ul className="text-sm text-slate-600 space-y-2">
                <li>• Standard shipping: 3-5 business days</li>
                <li>• Free shipping on orders over €50</li>
                <li>• Order processing: 1 business day</li>
                <li>• Tracking provided</li>
              </ul>
            </div>

            {/* Terms */}
            <p className="text-xs text-slate-500 text-center mt-4">
              By clicking the payment button, you agree to our{" "}
              <a href="/terms" className="text-primary hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}