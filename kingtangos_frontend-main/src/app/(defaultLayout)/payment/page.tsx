"use client";

import { BillingForm } from '@/components/shared/BillingForm'
import React from 'react'
import { useGetAddToCartQuery } from '@/redux/api/cartApi'
import { useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function Payment() {
  const searchParams = useSearchParams();
  const { data: cartData, isLoading } = useGetAddToCartQuery();
  
  const cartItems = cartData?.data?.items ?? [];
  
  // Get discount and coupon from URL params if available
  const discount = parseFloat(searchParams.get('discount') || '0');
  const couponCode = searchParams.get('couponCode') || '';
  const shippingCost = cartItems.length > 0 ? 5.99 : 0;

  // Prepare order items from cart - INCLUDING product details for display
  const orderItems = cartItems.map(item => ({
    productId: item.productId,
    variantId: item.variant?.id || undefined,
    sizeId: item.variant?.sizes[0]?.id || undefined,           
    quantity: item.quantity,
    price: item.product.finalPrice,
    size: item.variant?.sizes[0]?.size || undefined,
    color: item.variant?.color || undefined,
    // Add product details for display in order summary
    product: {
      name: item.product.name,
      images: item.product.images || []
    }
  }));

  console.log("📦 Order Items being sent:", JSON.stringify(orderItems, null, 2));

  if (isLoading) {
    return (
      <div className="py-16 flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="py-16">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-semibold mb-4">No items in cart</h1>
          <p className="text-gray-600 mb-8">
            Please add items to your cart before proceeding to checkout.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='py-16'>
      <div className='max-w-7xl mx-auto px-4'>
        <BillingForm 
          orderItems={orderItems}
          shippingCost={shippingCost}
          couponCode={couponCode}
          discount={discount}
        />
      </div>
    </div>
  )
}