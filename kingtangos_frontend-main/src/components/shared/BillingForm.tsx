/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Tag } from "lucide-react";
import { toast } from "sonner";
import { useCreateAddToCartPaymentMutation } from "@/redux/api/payment/paymentApi";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { useGetSpecialOfferByIdQuery } from "@/redux/api/specialOfferApi";

// ─── Zod Schema ───────────────────────────────────────────────────────────────
const billingFormSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  country: z.string().min(1, "Please insert country"),
  state: z.string().min(1, "Please insert state"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  postalCode: z.string().min(3, "Postal code must be at least 3 characters"),
  additionalInfo: z.string().optional(),
});

type BillingFormData = z.infer<typeof billingFormSchema>;

// ─── Types ────────────────────────────────────────────────────────────────────
interface ShippingAddress {
  fullName: string;
  country: string;
  state: string;
  phone: string;
  city: string;
  postalCode: string;
  address: string;
  email?: string;
  additionalInfo?: string;
}

interface OrderItem {
  productId: string;
  variantId?: string;
  sizeId?: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
  product?: {
    name: string;
    images?: string[];
  };
}

interface OrderData {
  shippingAddress: ShippingAddress;
  shippingCost: number;
  orderItems: OrderItem[];
}

interface BillingFormProps {
  orderItems?: OrderItem[];
  shippingCost?: number;
  couponCode?: string;
  discount?: number;
  onSubmit?: (data: OrderData) => void;
}

// ─── ProductWithOffer ─────────────────────────────────────────────────────────
// Mirrors the pattern in ProductPayForm:
// - Fetches offer via RTK Query
// - Reports the offer ID up to the parent via `onOfferResolved`
// - Renders the offer badge if active
interface ProductWithOfferProps {
  item: OrderItem;
  onOfferResolved: (productId: string, offerId: string | null) => void;
}

function ProductWithOffer({ item, onOfferResolved }: ProductWithOfferProps) {
  const { data: offerData } = useGetSpecialOfferByIdQuery(item.productId, {
    skip: !item.productId,
  });

  const activeOffer =
    offerData?.data?.hasOffer && offerData?.data?.offer
      ? offerData.data.offer
      : null;

  // ── Report offer ID to parent whenever it resolves (same intent as ProductPayForm) ──
  React.useEffect(() => {
    if (offerData !== undefined) {
      onOfferResolved(item.productId, activeOffer?.id ?? null);
    }
  }, [offerData, activeOffer?.id, item.productId, onOfferResolved]);

  // Calculate pricing for display
  const itemTotal = item.price * item.quantity;
  let finalPrice = itemTotal;

  if (activeOffer) {
    if (activeOffer.discountType === "PERCENTAGE") {
      const discountAmount = (itemTotal * activeOffer.discountValue) / 100;
      const finalDiscount = activeOffer.maximumDiscountAmount
        ? Math.min(discountAmount, activeOffer.maximumDiscountAmount)
        : discountAmount;
      finalPrice = itemTotal - finalDiscount;
    } else {
      finalPrice = Math.max(0, itemTotal - activeOffer.discountValue);
    }
  }

  return (
    <div className="flex gap-3 items-center">
      {/* Product Image */}
      <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden border">
        {item.product?.images?.[0] ? (
          <Image
            src={item.product.images[0]}
            alt={item.product?.name || "Product"}
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-xs text-gray-400">No image</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1">
        <p className="text-sm font-medium line-clamp-1">
          {item.product?.name || "Product"}
        </p>
        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
        {item.color && (
          <p className="text-xs text-gray-500">Color: {item.color}</p>
        )}
        {item.size && (
          <p className="text-xs text-gray-500">Size: {item.size}</p>
        )}

        {/* Special Offer Badge */}
        {activeOffer && (
          <div className="mt-1 p-1.5 bg-orange-50 border border-orange-200 rounded flex items-start gap-1.5 max-w-fit">
            <Tag className="h-3 w-3 text-orange-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-orange-600">
                Special Offer Applied 🎉
              </p>
              <p className="text-xs text-orange-500">
                {activeOffer.discountType === "PERCENTAGE"
                  ? `${activeOffer.discountValue}% OFF`
                  : `€${activeOffer.discountValue} OFF`}{" "}
                • {activeOffer.store?.name || "Store"}
              </p>
              <p className="text-xs text-orange-600 mt-1">
                Special offer price: €{finalPrice.toFixed(2)}
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

      {/* Price */}
      <div className="text-right">
        {activeOffer ? (
          <>
            <p className="text-xs line-through text-gray-400">
              €{itemTotal.toFixed(2)}
            </p>
            <p className="text-sm font-semibold text-orange-600">
              €{finalPrice.toFixed(2)}
            </p>
          </>
        ) : (
          <p className="text-sm font-semibold">€{itemTotal.toFixed(2)}</p>
        )}
      </div>
    </div>
  );
}

// ─── BillingForm ──────────────────────────────────────────────────────────────
export function BillingForm({
  orderItems = [],
  shippingCost = 5.99,
  couponCode = "",
  discount = 0,
  onSubmit,
}: BillingFormProps) {
  const [createPayment, { isLoading: isPaymentLoading }] =
    useCreateAddToCartPaymentMutation();

  // ── Collect resolved offer IDs from all ProductWithOffer children ──────────
  // Uses a ref so updates don't cause re-renders but values are always
  // fresh when the form submits — same approach ProductPayForm uses with
  // its single `activeOffer?.id`.
  const specialOfferMapRef = useRef<Record<string, string>>({});

  const handleOfferResolved = useCallback(
    (productId: string, offerId: string | null) => {
      if (offerId) {
        specialOfferMapRef.current[productId] = offerId;
      } else {
        delete specialOfferMapRef.current[productId];
      }
    },
    [],
  );
  // ──────────────────────────────────────────────────────────────────────────

  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = 5;
  const total = subtotal + shippingCost + tax - discount;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BillingFormData>({
    resolver: zodResolver(billingFormSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      country: "",
      state: "",
      address: "",
      city: "",
      postalCode: "",
      additionalInfo: "",
    },
  });

  const onSubmitForm = async (formData: BillingFormData) => {
    try {
      const shippingAddress = {
        fullName: formData.fullName,
        country: formData.country,
        state: formData.state,
        phone: formData.phone,
        city: formData.city,
        postalCode: formData.postalCode,
        address: formData.address,
      };

      // ── Resolve specialOfferId ─────────────────────────────────────────────
      // If one item → use its offer ID directly (mirrors ProductPayForm).
      // If multiple items → use the first resolved offer ID found.
      const resolvedOfferIds = Object.values(specialOfferMapRef.current);
      const specialOfferId =
        resolvedOfferIds.length > 0 ? resolvedOfferIds[0] : undefined;
      // ──────────────────────────────────────────────────────────────────────

      const orderData: any = {
        shippingAddress,
        shippingCost,
        orderItems: orderItems.map((item) => ({
          productId: item.productId,
          ...(item.variantId && { variantId: item.variantId }),
          ...(item.sizeId && { sizeId: item.sizeId }),
          quantity: item.quantity,
          price: item.price,
          ...(item.size && { size: item.size }),
          ...(item.color && { color: item.color }),
        })),
        paymentMethod: "stripe",
        ...(couponCode && { couponCode }),

        // ── Same pattern as ProductPayForm: only include if an offer exists ──
        ...(specialOfferId && { specialOfferId }),
        // ────────────────────────────────────────────────────────────────────
      };

      console.log("📦 Cart API Payload:", JSON.stringify(orderData, null, 2));

      if (onSubmit) {
        await onSubmit({
          shippingAddress: {
            ...shippingAddress,
            email: formData.email || undefined,
            additionalInfo: formData.additionalInfo || undefined,
          },
          shippingCost,
          orderItems,
        });
        return;
      }

      const response = await createPayment(orderData).unwrap();

      if (response.success && response.data?.paymentUrl) {
        toast.success("Order created successfully! Redirecting to payment...");
        window.location.href = response.data.paymentUrl;
      } else {
        toast.error("Failed to create order. Please try again.");
      }
    } catch (error: any) {
      console.error("❌ Error submitting order:", error);
      const errorMessage =
        error?.data?.message || "Failed to submit order. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
      {/* Billing Form Column */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Billing Information
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
              Full Name *
            </Label>
            <Input
              id="fullName"
              {...register("fullName")}
              placeholder="John Doe"
              className={`py-5 ${errors.fullName ? "border-red-500" : ""}`}
            />
            {errors.fullName && (
              <p className="text-sm text-red-500">{errors.fullName.message}</p>
            )}
          </div>

          {/* Phone and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                Phone *
              </Label>
              <Input
                id="phone"
                {...register("phone")}
                type="tel"
                placeholder="+1 234 567 8900"
                className={`py-5 ${errors.phone ? "border-red-500" : ""}`}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email (Optional)
              </Label>
              <Input
                id="email"
                {...register("email")}
                type="email"
                placeholder="your@email.com"
                className={`py-5 ${errors.email ? "border-red-500" : ""}`}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Country and State */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-2">
              <Label htmlFor="country" className="text-sm font-medium text-gray-700">
                Country *
              </Label>
              <Input
                id="country"
                {...register("country")}
                placeholder="United States"
                className={`py-5 ${errors.country ? "border-red-500" : ""}`}
              />
              {errors.country && (
                <p className="text-sm text-red-500">{errors.country.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                State *
              </Label>
              <Input
                id="state"
                {...register("state")}
                placeholder="California"
                className={`py-5 ${errors.state ? "border-red-500" : ""}`}
              />
              {errors.state && (
                <p className="text-sm text-red-500">{errors.state.message}</p>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium text-gray-700">
              Address *
            </Label>
            <Input
              id="address"
              {...register("address")}
              placeholder="123 Main St, Apt 4B"
              className={`py-5 ${errors.address ? "border-red-500" : ""}`}
            />
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address.message}</p>
            )}
          </div>

          {/* City and Postal Code */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                City *
              </Label>
              <Input
                id="city"
                {...register("city")}
                placeholder="New York"
                className={`py-5 ${errors.city ? "border-red-500" : ""}`}
              />
              {errors.city && (
                <p className="text-sm text-red-500">{errors.city.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode" className="text-sm font-medium text-gray-700">
                Postal Code *
              </Label>
              <Input
                id="postalCode"
                {...register("postalCode")}
                placeholder="10001"
                className={`py-5 ${errors.postalCode ? "border-red-500" : ""}`}
              />
              {errors.postalCode && (
                <p className="text-sm text-red-500">{errors.postalCode.message}</p>
              )}
            </div>
          </div>

          {/* Additional Info */}
          <div className="space-y-2">
            <Label htmlFor="additionalInfo" className="text-sm font-medium text-gray-700">
              Additional Information (Optional)
            </Label>
            <Input
              id="additionalInfo"
              {...register("additionalInfo")}
              placeholder="Delivery instructions, etc."
              className="py-5"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-gray-200">
            <Button
              type="submit"
              className="w-full py-6 text-lg font-semibold bg-black hover:bg-gray-800 text-white"
              disabled={isSubmitting || isPaymentLoading}
            >
              {isSubmitting || isPaymentLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Place Order • €${total.toFixed(2)}`
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Order Summary Column */}
      <div className="space-y-6">
        <Card className="p-6 sticky top-24">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          {/* Order Items — each child reports its offer ID back up */}
          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
            {orderItems.map((item, index) => (
              <ProductWithOffer
                key={`${item.productId}-${index}`}
                item={item}
                onOfferResolved={handleOfferResolved}
              />
            ))}
          </div>

          {/* Price Breakdown */}
          <div className="space-y-2 pt-4 border-t">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span>€{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span>€{shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax</span>
              <span>€{tax.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span>
                <span>-€{discount.toFixed(2)}</span>
              </div>
            )}
            {couponCode && (
              <p className="text-xs text-green-600">Coupon: {couponCode}</p>
            )}
            <div className="flex justify-between font-bold pt-2 mt-2 border-t">
              <span>Total</span>
              <span className="text-primary">€{total.toFixed(2)}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}