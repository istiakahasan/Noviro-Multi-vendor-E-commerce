// app/product-payment/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ProductPayForm from "@/components/pages/product/ProductPayForm";

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
  
  // 👇 Variant information
  variantId: string;
  variantColor: string;
  variantColorCode?: string;
  sizeId: string;
  size: string;
  
  // 👇 Coupon information
  couponCode?: string;
  couponId?: string;
  couponDiscount?: string;
  finalPriceAfterCoupon?: string;
}

const Page = () => {
  const searchParams = useSearchParams();
  const [productData, setProductData] = useState<ProductData | null>(null);

  useEffect(() => {
    if (searchParams) {
      try {
        const data: ProductData = {
          // Basic product info
          productId: searchParams.get("productId") || "",
          storeId: searchParams.get("storeId") || "",
          productName: searchParams.get("productName") || "",
          
          // Pricing
          price: parseFloat(searchParams.get("price") || "0"),
          unitPrice: parseFloat(searchParams.get("unitPrice") || searchParams.get("finalPrice") || "0"),
          quantity: parseInt(searchParams.get("quantity") || "1"),
          finalPrice: parseFloat(searchParams.get("finalPrice") || "0"),
          discount: parseFloat(searchParams.get("discount") || "0"),
          
          // Media and descriptions
          image: searchParams.get("image") || "",
          description: searchParams.get("description") || "",
          storeName: searchParams.get("storeName") || "",
          
          // 👇 Parse variant fields
          variantId: searchParams.get("variantId") || "",
          variantColor: searchParams.get("variantColor") || "",
          variantColorCode: searchParams.get("variantColorCode") || "",
          sizeId: searchParams.get("sizeId") || "",
          size: searchParams.get("size") || "",
          
          // 👇 Parse coupon fields
          couponCode: searchParams.get("couponCode") || undefined,
          couponId: searchParams.get("couponId") || undefined,
          couponDiscount: searchParams.get("couponDiscount") || "0",
          finalPriceAfterCoupon: searchParams.get("finalPriceAfterCoupon") || undefined,
        };

        console.log("📦 Product data received from URL:", data);
        
        // Validate that we have the required variant data
        if (!data.variantId || !data.sizeId) {
          console.error("Missing variant or size data:", {
            variantId: data.variantId,
            sizeId: data.sizeId,
            variantColor: data.variantColor,
            size: data.size
          });
        }
        
        setProductData(data);
      } catch (error) {
        console.error("Error parsing product data:", error);
      }
    }
  }, [searchParams]);

  if (!productData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-primary">
            Loading product details...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mt-8">
          <Link
            href={`/product/${productData.productId}`}
            className="inline-flex items-center gap-2 font-bold text-slate-600 hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Product
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="lg:text-3xl text-xl font-bold text-primary mb-2">
                Complete Your Purchase
              </h1>
              <p className="text-slate-600 lg:text-base text-sm">
                Review your order details and proceed to payment
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <ProductPayForm productData={productData} />
      </div>
    </div>
  );
};

export default Page;