"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight } from "lucide-react"

interface PaymentFormData {
  cardNumber: string
  expiryDate: string
  cvc: string
  nameOnCard: string
  address: string
  country: string
  postalCode: string
}

const COUNTRIES = [
  "United State",
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "India",
  "Brazil",
  "Mexico",
]

export function PaymentCard() {
  const [formData, setFormData] = useState<PaymentFormData>({
    cardNumber: "",
    expiryDate: "",
    cvc: "",
    nameOnCard: "",
    address: "",
    country: "United State",
    postalCode: "",
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s/g, "")
    value = value.replace(/(\d{4})/g, "$1 ").trim()
    setFormData({ ...formData, cardNumber: value })
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "")
    if (value.length >= 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4)
    }
    setFormData({ ...formData, expiryDate: value })
  }

  const handleCVCChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4)
    setFormData({ ...formData, cvc: value })
  }

  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    setFormData({ ...formData, postalCode: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    console.log("Payment submitted:", formData)
    setIsLoading(false)
  }

  return (
    <div className="w-full max-w-">
      <div className="rounded-2xl p-1 bg-gradient-to-br from-blue-500 via-blue-400 to-orange-500">
        <div className="rounded-xl p-6 md:p-8 bg-white">
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-6">Payment Method</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Card Information Section */}
            <div className="space-y-3">
              <Label className="text-lg text-primary">Card Information</Label>
              <Input
                type="text"
                placeholder="4242 5859 5684 2585"
                value={formData.cardNumber}
                onChange={handleCardNumberChange}
                maxLength={19}
                className="text-base py-5"
              />

              <div className="grid grid-cols-2 ">
                <Input
                  type="text"
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChange={handleExpiryChange}
                  maxLength={5}
                  className="text-base py-5 rounded-none rounded-l-lg"
                />
                <Input
                  type="text"
                  placeholder="CVC"
                  value={formData.cvc}
                  onChange={handleCVCChange}
                  maxLength={4}
                  className="text-base py-5 rounded-none rounded-r-lg"
                />
              </div>
            </div>

            {/* Name On Card Section */}
            <div className="space-y-3">
              <Label className="text-lg text-primary">Name On Card</Label>
              <Input
                type="text"
                placeholder="3891 Ranchview Dr. Richardson, California 62639"
                value={formData.nameOnCard}
                onChange={(e) => setFormData({ ...formData, nameOnCard: e.target.value })}
                className="text-base py-5"
              />
            </div>

            {/* Country or Region Section */}
            <div className="space-y-3">
              <Label className="text-lg text-primary">Country or region</Label>
              <Select value={formData.country} onValueChange={(value) => setFormData({ ...formData, country: value })}>
                <SelectTrigger className="text-base py-5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Postal Code Section */}
            <div className="space-y-3">
              <Input
                type="text"
                placeholder="10001"
                value={formData.postalCode}
                onChange={handlePostalCodeChange}
                className="text-base py-5"
              />
            </div>

            {/* Buy Now Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/85 py-5 text-white font-semibold py-3 text-base rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              {isLoading ? "Processing..." : "Buy Now"}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
