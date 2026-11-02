/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Upload, X, CreditCard, Loader2 } from "lucide-react"
import Image from "next/image"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useGetAllStoreProductQuery } from "@/redux/api/productApi/productApi"
import { useCreateAdvertisementMutation } from "@/redux/api/advertisementApi/advertisementApi"
import { toast } from "sonner"
import { useUploadFileMutation } from "@/redux/api/uploaderApi.ts/uploderApi"

// ── Helper: read a cookie by name
const getCookie = (name: string): string => {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"))
  return match ? decodeURIComponent(match[2]) : ""
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface AdFormData {
  storeId: string
  productId: string
  totalDays: number
  image: File | null
}

interface CardFormData {
  cardNumber: string
  expMonth: string
  expYear: string
  cvc: string
}

interface Product {
  id: string
  name: string
  storeId: string
  price: number
  description: string
  store?: { id: string; name: string } | null
}

interface Store {
  id: string
  name: string
}

interface AdvertisementPaymentData {
  id: string
  totalPrice: number
  clientSecret: string
  paymentIntentId: string
}

// ─── Component ───────────────────────────────────────────────────────────────

export function CreateAdsForm() {
  // ── Ad form
  const { handleSubmit, setValue, watch } = useForm<AdFormData>({
    defaultValues: {
      storeId: "",
      productId: "",
      totalDays: undefined as any,
      image: null,
    },
  })

  // ── Card payment form
  const cardForm = useForm<CardFormData>({
    defaultValues: { cardNumber: "", expMonth: "", expYear: "", cvc: "" },
  })

  // ── Redux hooks — only image upload and create advertisement use Redux
  const { data: productsData, isLoading: productsLoading } = useGetAllStoreProductQuery({})
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation()
  const [createAdvertisement, { isLoading: isCreating }] = useCreateAdvertisementMutation()

  // ── UI state
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageName, setImageName] = useState<string | null>(null)
  const [customTotalDays, setCustomTotalDays] = useState("")
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [availableProducts, setAvailableProducts] = useState<Product[]>([])

  // ── Payment flow state
  const [step, setStep] = useState<"form" | "payment">("form")
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [adPaymentData, setAdPaymentData] = useState<AdvertisementPaymentData | null>(null)

  const totalDaysOptions = [5, 7, 10, 15, 30]

  // ── Derive unique stores from products
  const stores: Store[] =
    productsData?.data?.data?.reduce((acc: Store[], product: Product) => {
      if (product.store?.id && product.store?.name) {
        if (!acc.some((s) => s.id === product.store?.id)) {
          acc.push({ id: product.store.id, name: product.store.name })
        }
      }
      return acc
    }, []) ?? []

  const selectedStoreId = watch("storeId")
  const selectedTotalDays = watch("totalDays")

  // ── Filter products when store changes
  useEffect(() => {
    if (selectedStoreId && productsData?.data?.data) {
      // const filtered = productsData.data.data.filter(
      //   (p: Product) => p.storeId === selectedStoreId
      // )
      const filtered = productsData.data.data.filter(
  (p: Product) => p.storeId === selectedStoreId && (p as any).status === "approved"
)
      setAvailableProducts(filtered)
      setValue("productId", "")
    } else {
      setAvailableProducts([])
    }
  }, [selectedStoreId, productsData, setValue])

  // ── Image handlers
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file (JPEG, PNG, etc.)")
      return
    }
    setValue("image", file)
    setImageName(file.name)
    const reader = new FileReader()
    reader.onload = (ev) => setImagePreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setValue("image", null)
    setImagePreview(null)
    setImageName(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleAddCustomDays = () => {
    const days = parseInt(customTotalDays)
    if (!isNaN(days) && days > 0) {
      setValue("totalDays", days, { shouldValidate: true })
      setCustomTotalDays("")
      setShowCustomInput(false)
    }
  }

  // ── Reset everything
  const resetForm = () => {
    setValue("storeId", "")
    setValue("productId", "")
    setValue("totalDays", undefined as any)
    removeImage()
    cardForm.reset()
    setStep("form")
    setAdPaymentData(null)
  }

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 1 — Ad form submit
  // 1. Upload image        → Redux (useUploadFileMutation)
  // 2. Create advertisement → Redux (useCreateAdvertisementMutation)
  // 3. Create payment intent → direct fetch
  // ─────────────────────────────────────────────────────────────────────────
  const onSubmit = async (data: AdFormData) => {
    if (!data.storeId)   { toast.error("Please select a store");    return }
    if (!data.productId) { toast.error("Please select a product");  return }
    if (!data.totalDays) { toast.error("Please select total days"); return }
    if (!data.image)     { toast.error("Please select an image");   return }

    try {
      // 1️⃣ Upload image via Redux
      const imageFormData = new FormData()
      imageFormData.append("images", data.image)

      const uploadResult = await uploadFile(imageFormData).unwrap()
      const imageUrl: string = uploadResult?.images?.[0]

      if (!imageUrl) throw new Error("Image upload failed — no URL returned")

      // 2️⃣ Create advertisement via Redux
      const adResult = await createAdvertisement({
        storeId: data.storeId,
        productId: data.productId,
        totalDays: data.totalDays,
        image: imageUrl,
      }).unwrap()

      const advertisementId: string = adResult.data.id
      const totalPrice: number = adResult.data.totalPrice

      toast.success(adResult.message || "Advertisement created!")

      // 3️⃣ Create payment intent via direct fetch
      const intentRes = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/advertisement/stripe/${advertisementId}/payment-intent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getCookie("accessToken")}`,
          },
        }
      )

      if (!intentRes.ok) {
        const err = await intentRes.json()
        throw new Error(err?.message || "Failed to create payment intent")
      }

      const intentResult = await intentRes.json()
      const { clientSecret, paymentIntentId } = intentResult.data

      setAdPaymentData({ id: advertisementId, totalPrice, clientSecret, paymentIntentId })
      setStep("payment")
    } catch (err: any) {
      console.error(err)
      toast.error(err?.data?.message ?? err?.message ?? "Something went wrong")
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 2 — Payment form submit
  // 4. Create Stripe payment method  → direct fetch to api.stripe.com
  // 5. Confirm Stripe payment intent → direct fetch to api.stripe.com
  // ─────────────────────────────────────────────────────────────────────────
  const onPaymentSubmit = async (cardData: CardFormData) => {
    if (!adPaymentData) return

    try {
      setPaymentLoading(true)

      // 4️⃣ Create payment method via direct fetch
      const pmParams = new URLSearchParams({
        "card[number]": cardData.cardNumber.replace(/\s/g, ""),
        "card[exp_month]": cardData.expMonth,
        "card[exp_year]": cardData.expYear,
        "card[cvc]": cardData.cvc,
        type: "card",
      })

      const pmRes = await fetch("https://api.stripe.com/v1/payment_methods", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`,
        },
        body: pmParams.toString(),
      })

      if (!pmRes.ok) {
        const err = await pmRes.json()
        throw new Error(err?.error?.message || "Failed to create payment method")
      }

      const pmData = await pmRes.json()
      const paymentMethodId: string = pmData.id

      // 5️⃣ Confirm payment intent via direct fetch
      const confirmParams = new URLSearchParams({
        payment_method: paymentMethodId,
        client_secret: adPaymentData.clientSecret,
      })

      const confirmRes = await fetch(
        `https://api.stripe.com/v1/payment_intents/${adPaymentData.paymentIntentId}/confirm`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`,
          },
          body: confirmParams.toString(),
        }
      )

      if (!confirmRes.ok) {
        const err = await confirmRes.json()
        throw new Error(err?.error?.message || "Payment confirmation failed")
      }

      toast.success("Payment successful! Your advertisement is now active.")
      resetForm()
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message ?? "Payment failed. Please try again.")
    } finally {
      setPaymentLoading(false)
    }
  }

  const isSubmitting = isUploading || isCreating

  // ─────────────────────────────────────────────────────────────────────────
  // Render: Payment step
  // ─────────────────────────────────────────────────────────────────────────
  if (step === "payment" && adPaymentData) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-black rounded-lg">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Complete Payment</h2>
            <p className="text-sm text-gray-500">
              Total:{" "}
              <span className="font-semibold text-black">${adPaymentData.totalPrice}</span>
            </p>
          </div>
        </div>

        <form onSubmit={cardForm.handleSubmit(onPaymentSubmit)} className="space-y-4">
          {/* Card Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Card Number
            </label>
            <Input
              {...cardForm.register("cardNumber", { required: true })}
              placeholder="4242 4242 4242 4242"
              maxLength={19}
              onChange={(e) => {
                const val = e.target.value
                  .replace(/\D/g, "")
                  .replace(/(.{4})/g, "$1 ")
                  .trim()
                cardForm.setValue("cardNumber", val)
              }}
              className="font-mono"
            />
          </div>

          {/* Expiry */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Month
              </label>
              <Input
                {...cardForm.register("expMonth", { required: true })}
                placeholder="MM"
                maxLength={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Year
              </label>
              <Input
                {...cardForm.register("expYear", { required: true })}
                placeholder="YYYY"
                maxLength={4}
              />
            </div>
          </div>

          {/* CVC */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
            <Input
              {...cardForm.register("cvc", { required: true })}
              placeholder="123"
              maxLength={4}
              type="password"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setStep("form")}
              disabled={paymentLoading}
            >
              Back
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-black text-white hover:bg-gray-800"
              disabled={paymentLoading}
            >
              {paymentLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </span>
              ) : (
                `Pay $${adPaymentData.totalPrice}`
              )}
            </Button>
          </div>
        </form>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Render: Ad creation form
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Advertisement</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Left — Image Upload */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Upload Advertisement Image</h2>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />

            {imagePreview ? (
              <div className="relative border-2 border-dashed border-gray-300 rounded-xl overflow-hidden">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={400}
                  height={250}
                  className="w-full object-contain h-48 md:h-100"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
                <p className="text-xs text-gray-500 p-2 truncate">{imageName}</p>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-700 mb-1">Drop your image here</p>
                <p className="text-xs text-gray-400 mb-1">Format: JPEG, PNG, GIF, WebP</p>
                <p className="text-xs text-gray-400 mb-4">Max file size: 25 MB</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Browse Images
                </Button>
              </div>
            )}
          </div>

          {/* Right — Form Fields */}
          <div className="space-y-4">

            {/* Store */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Store *
              </label>
              <Select
                value={watch("storeId")}
                onValueChange={(v) => setValue("storeId", v, { shouldValidate: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a store" />
                </SelectTrigger>
                <SelectContent>
                  {stores.length > 0 ? (
                    stores.map((store) => (
                      <SelectItem key={store.id} value={store.id}>
                        {store.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="_none" disabled>
                      No stores available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {!watch("storeId") && (
                <p className="text-xs text-red-500 mt-1">Please select a store</p>
              )}
            </div>

            {/* Product */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Product *
              </label>
              <Select
                value={watch("productId")}
                onValueChange={(v) => setValue("productId", v, { shouldValidate: true })}
                disabled={!selectedStoreId || productsLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {availableProducts.length > 0 ? (
                    availableProducts.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} – ${product.price}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="_none" disabled>
                      {selectedStoreId ? "No products available" : "Select a store first"}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {selectedStoreId && !watch("productId") && availableProducts.length > 0 && (
                <p className="text-xs text-red-500 mt-1">Please select a product</p>
              )}
            </div>

            {/* Total Days */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Days *
              </label>
              <div className="flex flex-wrap gap-2">
                {totalDaysOptions.map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setValue("totalDays", days, { shouldValidate: true })}
                    className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                      selectedTotalDays === days
                        ? "bg-black text-white border-black"
                        : "bg-white text-gray-700 border-gray-300 hover:border-black"
                    }`}
                  >
                    {days} {days === 1 ? "Day" : "Days"}
                  </button>
                ))}

                {showCustomInput ? (
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={1}
                      value={customTotalDays}
                      onChange={(e) => setCustomTotalDays(e.target.value)}
                      className="h-8 w-24"
                      placeholder="Days"
                    />
                    <Button type="button" size="sm" onClick={handleAddCustomDays}>
                      Add
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setShowCustomInput(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowCustomInput(true)}
                    className="px-3 py-1.5 rounded-lg border border-dashed border-gray-300 text-sm text-gray-500 hover:border-black flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Custom
                  </button>
                )}
              </div>
              {!selectedTotalDays && (
                <p className="text-xs text-red-500 mt-1">Please select total days</p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="outline" onClick={resetForm} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-black text-white hover:bg-gray-800"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                {isUploading ? "Uploading image..." : "Creating..."}
              </span>
            ) : (
              "Create Advertisement"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}