/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { AiFillStar } from "react-icons/ai";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import {
  useDeleteAllCartItemMutation,
  useDeleteToCartItemMutation,
  useGetAddToCartQuery,
  useUpdateCartMutation,
} from "@/redux/api/cartApi";
import { useCreateCouponValidateMutation } from "@/redux/api/couponApi";

export default function CartPage() {
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");

  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState<number | null>(null);
  // const totalToPay = finalAmount ?? total;


  const [validateCoupon, { isLoading: isCouponLoading }] =
    useCreateCouponValidateMutation();


  const handleApplyCoupon = async () => {
    setCouponError("");

    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    try {
      const res = await validateCoupon({
        couponCode,
        userId: cartItems[0]?.userId, // replace later
        orderAmount: subtotal,
        storeId: cartItems[0]?.product?.store?.id,
      }).unwrap();

      if (res.data.isValid) {
        setDiscountAmount(res.data.discountAmount);
        setFinalAmount(res.data.finalAmount);
      } else {
        setDiscountAmount(0);
        setFinalAmount(null);
        setCouponError("Invalid coupon");
      }
    }
     catch (err) {
      setDiscountAmount(0);
      setFinalAmount(null);
      setCouponError("Invalid or expired coupon");
    }
  };

  /* ================= API ================= */
  const { data, isLoading } = useGetAddToCartQuery();
  const cartItems = data?.data?.items ?? [];
  const totalItems = data?.data?.totalItems ?? 0;
  const subtotal = data?.data?.totalPrice ?? 0;

  const [updateCart] = useUpdateCartMutation();
  const [deleteItem] = useDeleteToCartItemMutation();
  const [deleteAllCartItem, { isLoading: isDeletingAll }] = useDeleteAllCartItemMutation();

  /* ================= Handlers ================= */
  const incrementQuantity = async (cartItemId: string, quantity: number) => {
    await updateCart({ cartItemId, quantity: quantity + 1 });
  };

  const decrementQuantity = async (cartItemId: string, quantity: number) => {
    if (quantity <= 1) return;
    await updateCart({ cartItemId, quantity: quantity - 1 });
  };

  const removeFromCart = async (cartItemId: string) => {
    await deleteItem(cartItemId);
  };

  const handleDeleteAll = async () => {
    try {
      // Pass empty object as argument for this DELETE request
      await deleteAllCartItem({}).unwrap();
    } catch (error) {
      console.error("Failed to delete all items:", error);
    }
  };

  /* ================= Group by Seller ================= */
  const groupItemsBySeller = () => {
    const sellers: Record<string, typeof cartItems> = {};
    cartItems.forEach((item) => {
      const sellerId = item.product.store.id;
      if (!sellers[sellerId]) sellers[sellerId] = [];
      sellers[sellerId].push(item);
    });
    return sellers;
  };

  const sellers = groupItemsBySeller();
  const tax = 5;
  const shipping = cartItems.length > 0 ? 5.99 : 0;
  const total = subtotal + shipping + tax;
  const totalToPay = finalAmount ?? total;

  /* ================= Empty Cart ================= */
  if (!isLoading && cartItems.length === 0) {
    return (
      <div className="py-16">
        <div className="container mx-auto text-center">
          <ShoppingBag className="w-24 h-24 text-gray-300 mb-6 mx-auto" />
          <h1 className="text-3xl font-semibold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">
            Looks like you haven&apos;t added any items yet.
          </p>
          <Link href="/">
            <Button className="px-8 py-6 text-lg">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="py-16">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold mb-6">
            Shopping Cart ({totalItems} {totalItems === 1 ? "item" : "items"})
          </h1>


        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          {/* ================= CART ITEMS ================= */}
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleDeleteAll}
              disabled={isDeletingAll || cartItems.length === 0}
              className="group flex items-center float-end gap-2 rounded-md -mt-14 border border-red-200 
             bg-red-50 px-4 py-2 text-sm font-medium text-red-600
             transition-all duration-200
             hover:bg-red-600 hover:text-white hover:border-red-600
             focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
            >
              <Trash2
                size={18}
                className="transition-transform duration-200 group-hover:scale-110"
              />
              <span>Delete all items</span>
            </button>
            {Object.entries(sellers).map(([sellerId, sellerItems]) => (
              <Card key={sellerId} className="bg-transparent border-0 shadow-none">
                {sellerItems.map((item) => {
                  const product = item.product;

                  return (
                    <Card
                      key={item.id}
                      className="mt-5 p-4 md:p-6 bg-white border"
                    >
                      <div className="flex flex-col md:flex-row gap-4">
                        {/* Image */}
                        <div className="w-32 h-32 flex-shrink-0">
                          <Image
                            src={product.images?.[0] || "/placeholder.png"}
                            alt={product.name}
                            width={128}
                            height={128}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-semibold text-lg">
                                {product.name}
                              </h3>

                              <div className="flex items-center gap-2 mt-1">
                                <AiFillStar className="text-yellow-500" />
                                <span className="text-sm">
                                  {product.averageRating || 0}
                                </span>
                                <span className="text-sm text-gray-500">
                                  ({product.totalReviews || 0} reviews)
                                </span>
                              </div>
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500"
                            >
                              <Trash2 size={18} />
                            </Button>
                          </div>

                          {/* Price & Quantity */}
                          <div className="flex justify-between items-center mt-4">
                            <div className="text-2xl font-bold">
                              € {(product.finalPrice * item.quantity).toFixed(2)}
                            </div>

                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={item.quantity <= 1}
                                onClick={() =>
                                  decrementQuantity(item.id, item.quantity)
                                }
                              >
                                <Minus size={16} />
                              </Button>

                              <span className="w-8 text-center">
                                {item.quantity}
                              </span>

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  incrementQuantity(item.id, item.quantity)
                                }
                              >
                                <Plus size={16} />
                              </Button>
                            </div>
                          </div>

                          <p className="text-sm text-gray-600 mt-1">
                            €{product.finalPrice} each
                          </p>

                          {product.category && (
                            <p className="text-sm mt-2">
                              Category: {product.category.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </Card>
            ))}
          </div>

          {/* ================= SUMMARY (NO CHECKOUT LOGIC CHANGED) ================= */}
          <div className="space-y-6">
            <Card className="p-6 mt-5">

              {/* <h3 className="font-semibold text-xl mb-3">Have a coupon?</h3>
              <div className="flex gap-2 pb-2">
                <Input
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 py-5"
                />
                <Button
                  onClick={handleApplyCoupon}
                  disabled={isCouponLoading}
                  className="py-5 bg-primary text-white hover:bg-primary/90"
                >
                  {isCouponLoading ? "Applying..." : "Apply"}
                </Button>
              </div> */}

              {discountAmount > 0 && (
                <p className="text-green-600 text-sm mt-1">
                  Coupon applied! You saved €{discountAmount.toFixed(2)}
                </p>
              )}

              {couponError && (
                <p className="text-red-500 text-sm mt-1">{couponError}</p>
              )}


              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>€{subtotal.toFixed(2)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-€{discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>€{shipping.toFixed(2)}</span>
                </div>

                 <div className="flex justify-between">
                  <span>Tax</span>
                  <span>€{tax}</span>
                </div>
              </div>


              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">€{totalToPay.toFixed(2)}</span>
                </div>
                {/* <p className="text-sm text-gray-500 mt-2">
                  Including €{tax.toFixed(2)} in taxes
                </p> */}
              </div>

              <Button 
                onClick={() => {
                  const params = new URLSearchParams();
                  if (discountAmount > 0 && couponCode) {
                    params.set('couponCode', couponCode);
                    params.set('discount', discountAmount.toFixed(2));
                  }
                  window.location.href = `/payment${params.toString() ? '?' + params.toString() : ''}`;
                }}
                className="w-full bg-primary text-white hover:bg-primary/90 h-12 text-lg"
              >
                Proceed to Checkout
              </Button>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}