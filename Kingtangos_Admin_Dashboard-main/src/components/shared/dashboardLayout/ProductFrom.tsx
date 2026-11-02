"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { UploadCloud } from "lucide-react";

type FormValues = {
  productName: string;
  productPrice: string;
  productDescription: string;
  category: string;
  type: string;
  stockQuantity: string;
  discount: string;
  barcode: string;
  tags: string;
  size: string[];
  colors: string[];
  image: FileList;
};

export default function ProductForm() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    if (!imagePreview) {
      toast.error("Please upload an image!");
      return;
    }

    const fullData = { ...data, size: selectedSizes, colors: selectedColors };
    console.log(fullData);
    toast.success("Product added successfully!");
    reset();
    setImagePreview(null);
    setSelectedSizes([]);
    setSelectedColors([]);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size exceeds 2MB!");
        return;
      }
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  return (
    <div className="p-6 border rounded-lg shadow-sm max-w-4xl mx-auto bg-white">
      <h2 className="text-sm font-medium mb-2">Upload Product Image</h2>

      {/* Image Upload */}
      <div className="border-2 border-dashed border-blue-300 rounded-lg h-40 flex flex-col justify-center items-center cursor-pointer relative overflow-hidden bg-blue-50">
        {imagePreview ? (
          <Image
            src={imagePreview}
            alt="Preview"
            fill
            className="object-cover rounded-lg"
          />
        ) : (
          <>
            <UploadCloud className="text-blue-400 mb-2" />
            <p className="text-xs text-gray-500">
              Upload your store Product Image
            </p>
            <p className="text-[11px] text-gray-400">Image Size: Max 2 MB</p>
          </>
        )}
        <input
          type="file"
          accept="image/*"
          {...register("image")}
          onChange={handleImageChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </div>

      {/* Form Fields */}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Product Name</Label>
            <Input {...register("productName", { required: true })} placeholder="Organic Hair Oil" />
            {errors.productName && <p className="text-red-500 text-xs">Product name is required</p>}
          </div>
          <div>
            <Label>Product Price</Label>
            <div className="flex items-center">
              <span className="bg-blue-600 text-white text-sm px-2 rounded-l"> $ </span>
              <Input {...register("productPrice", { required: true })} placeholder="123" className="rounded-l-none" />
            </div>
            {errors.productPrice && <p className="text-red-500 text-xs">Price is required</p>}
          </div>
        </div>

        <div>
          <Label>Product Description</Label>
          <Textarea {...register("productDescription")} placeholder="Write a short product description..." />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Category</Label>
            <Select {...register("category")}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal-care">Personal Care & Wellness</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="fashion">Fashion</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Type</Label>
            <Select {...register("type")}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="top-deal">Top Deal</SelectItem>
                <SelectItem value="regular">Regular</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Stock Quantity</Label>
            <Input {...register("stockQuantity")} placeholder="25" />
          </div>
          <div>
            <Label>Discount</Label>
            <Input {...register("discount")} placeholder="15%" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Barcode</Label>
            <Input {...register("barcode")} placeholder="#PRD-1045" />
          </div>
          <div>
            <Label>Tags</Label>
            <Input {...register("tags")} placeholder="Organic" />
          </div>
        </div>

        {/* Size Options */}
        <div>
          <Label>Size</Label>
          <div className="flex gap-2 mt-1">
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <button
                type="button"
                key={size}
                onClick={() => toggleSize(size)}
                className={`px-3 py-1 rounded border text-sm ${
                  selectedSizes.includes(size)
                    ? "bg-black text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Color Options */}
        <div>
          <Label>Colors</Label>
          <div className="flex gap-2 mt-1">
            {["#4b5563", "#d97706", "#f9a8d4", "#fca5a5", "#8b5cf6", "#a855f7", "#3b82f6", "#06b6d4", "#000"].map(
              (color) => (
                <button
                  type="button"
                  key={color}
                  onClick={() => toggleColor(color)}
                  className={`w-6 h-6 rounded-full border ${
                    selectedColors.includes(color)
                      ? "ring-2 ring-blue-500"
                      : ""
                  }`}
                  style={{ backgroundColor: color }}
                />
              )
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <Button type="submit">Save</Button>
          <Button type="button" variant="outline" onClick={() => reset()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
