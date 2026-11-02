/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Cloud, X, Plus, Trash2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useGetMeQuery } from "@/redux/api/authApi";
import {
  useUpdateProductMutation,
  useGetAllStoreCategoryQuery,
  useGetAllStoreSubCategoryQuery,
  useGetSingleProductByIdQuery,
} from "@/redux/api/productApi/productApi";
import { useUploadFileMutation } from "@/redux/api/uploaderApi.ts/uploderApi";

interface ProductFormData {
  productName: string;
  productPrice: string;
  productDescription: string;
  category: string;
  subCategory: string;
  type: string;
  stockQuantity: string;
  discount: string;
  barcode: string;
  tags: string;
  aboutProduct: string;
  hasVariants: boolean;
}

interface Category {
  id: string;
  name: string;
  description: string;
  type: string;
}

interface SubCategory {
  id: string;
  name: string;
  description: string;
  categoryId: string;
}

interface VariantColor {
  id: string;
  colorName: string;
  colorCode: string;
  image: string;
  imageFile: File | null;
  imagePreview: string;
  sizes: Array<{
    size: string;
    quantity: string;
  }>;
}

interface ProductImage {
  file: File;
  preview: string;
  url?: string;
}

interface EditProductFormProps {
  productId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function EditProductForm({ productId, onSuccess, onCancel }: EditProductFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: {
      productName: "",
      productPrice: "",
      productDescription: "",
      category: "",
      subCategory: "",
      type: "Top Deal",
      stockQuantity: "",
      discount: "",
      barcode: "",
      tags: "",
      aboutProduct: "",
      hasVariants: false,
    },
  });

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [variantColors, setVariantColors] = useState<VariantColor[]>([]);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [initialVariants, setInitialVariants] = useState<any[]>([]);
  const variantFileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const productFileInputRef = useRef<HTMLInputElement>(null);

  // RTK Query hooks
  const { data: userData, isLoading: userLoading } = useGetMeQuery({});
  const { data: productData, isLoading: productLoading, refetch } = useGetSingleProductByIdQuery(productId);
  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetAllStoreCategoryQuery(userData?.data?.stores?.id, {
      skip: !userData?.data?.stores?.id,
    });
  const { data: subCategoriesData, isLoading: subCategoriesLoading } =
    useGetAllStoreSubCategoryQuery(selectedCategory, {
      skip: !selectedCategory,
    });

  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();

  // Get store ID from user data
  const storeId = userData?.data?.stores?.id;

  // Update selected category when category changes
  const watchedCategory = watch("category");
  useEffect(() => {
    if (watchedCategory) {
      setSelectedCategory(watchedCategory);
    }
  }, [watchedCategory]);

  const hasVariants = watch("hasVariants");

  // Pre-fill form when product data is loaded
  useEffect(() => {
    if (productData?.data) {
      const product = productData.data;
      
      // Determine if product has variants
      const hasVariantsValue = !!(product.variants && product.variants.length > 0);
      
      // Set form values
      setValue("productName", product.name);
      setValue("productPrice", product.price.toString());
      setValue("productDescription", product.description);
      setValue("category", product.categoryId);
      setValue("subCategory", product.subCategoryId);
      setValue("type", product.type || "Top Deal");
      setValue("stockQuantity", product.stockQuantity?.toString() || "0");
      setValue("discount", product.discount?.toString() || "");
      setValue("barcode", product.barcode || "");
      setValue("tags", product.tags?.join(", ") || "");
      setValue("aboutProduct", product.aboutProduct || "");
      setValue("hasVariants", hasVariantsValue);

      // Set selected category for subcategory fetching
      setSelectedCategory(product.categoryId);

      // Set product images
      if (product.images && product.images.length > 0) {
        setExistingImages(product.images);
      }

      // Set variants if they exist
      if (product.variants && product.variants.length > 0) {
        const variants = product.variants.map((variant: any, index: number) => ({
          id: index.toString(), // Use index as temporary ID
          colorName: variant.color,
          colorCode: variant.colorCode || "",
          image: variant.image || "",
          imageFile: null,
          imagePreview: variant.image || "",
          sizes: variant.sizes.map((size: any) => ({
            size: size.size,
            quantity: size.quantity.toString(),
          })),
        }));
        setVariantColors(variants);
        setInitialVariants(product.variants);
      }
    }
  }, [productData, setValue]);

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (!storeId) {
        toast.error("Store not found", {
          description: "Please make sure you have a store setup.",
        });
        return;
      }

      // Handle variant products
      if (data.hasVariants) {
        const hasVariantImage = variantColors.some(
          (variant) => variant.imageFile || variant.image,
        );
        if (!hasVariantImage) {
          toast.error("Variant image required", {
            description: "Please upload at least one variant image.",
          });
          return;
        }

        toast.info("Uploading variant images...");

        // Upload new variant images
        const variantImageUrls: string[] = [];
        for (let i = 0; i < variantColors.length; i++) {
          const variant = variantColors[i];

          // If there's a new file, upload it
          if (variant.imageFile) {
            try {
              const formData = new FormData();
              formData.append("images", variant.imageFile);

              console.log(
                `Uploading variant image ${i + 1}:`,
                variant.imageFile.name,
              );

              const result = await uploadFile(formData).unwrap();

              if (result?.images && result.images.length > 0) {
                variantImageUrls.push(result.images[0]);
                console.log(
                  `Variant upload ${i + 1} successful:`,
                  result.images[0],
                );
              } else {
                throw new Error("No image returned from server");
              }
            } catch (error: any) {
              console.error(`Variant image ${i + 1} upload error:`, error);
              toast.error("Image upload failed", {
                description:
                  error?.data?.message ||
                  error.message ||
                  "Variant image upload failed",
              });
              return;
            }
          } else {
            // Keep existing image URL
            variantImageUrls.push(variant.image);
          }
        }

        toast.success("Variant images uploaded successfully");

        // Build variants array
        const variants = variantColors.map((variant, index) => ({
          color: variant.colorName,
          colorCode: variant.colorCode,
          image: variantImageUrls[index] || "",
          sizes: variant.sizes.map((sizeItem) => ({
            size: sizeItem.size,
            quantity: parseInt(sizeItem.quantity) || 0,
          })),
        }));

        // Create update payload
        const updatePayload = {
          storeId: storeId,
          categoryId: data.category,
          subCategoryId: data.subCategory,
          name: data.productName,
          price: parseFloat(data.productPrice),
          discount: data.discount ? parseFloat(data.discount) : null,
          description: data.productDescription,
          type: data.type,
          tags: data.tags ? data.tags.split(",").map((tag) => tag.trim()) : [],
          barcode: data.barcode || "",
          aboutProduct: data.aboutProduct || "",
          variants: variants,
          images: [], // Empty array for variants case
        };

        console.log("Update Payload:", JSON.stringify(updatePayload, null, 2));

        // Call the update mutation
        await updateProduct({ id: productId, data: updatePayload }).unwrap();

        toast.success("Product updated successfully!", {
          description: "Your product has been updated in the system.",
        });

        // Refetch product data
        await refetch();

        // Call success callback if provided
        if (onSuccess) {
          onSuccess();
        }
      }
      // Handle regular products
      else {
        // Upload new product images
        let productImageUrls = [...existingImages];
        
        // Remove deleted images
        productImageUrls = productImageUrls.filter(url => !imagesToDelete.includes(url));

        if (productImages.length > 0) {
          toast.info("Uploading product images...");

          // Upload each new product image
          for (let i = 0; i < productImages.length; i++) {
            const image = productImages[i];

            if (image.file) {
              try {
                const formData = new FormData();
                formData.append("images", image.file);

                console.log(
                  `Uploading product image ${i + 1}:`,
                  image.file.name,
                );

                const result = await uploadFile(formData).unwrap();

                if (result?.images && result.images.length > 0) {
                  productImageUrls.push(result.images[0]);
                  console.log(
                    `Product upload ${i + 1} successful:`,
                    result.images[0],
                  );
                } else {
                  throw new Error("No image returned from server");
                }
              } catch (error: any) {
                console.error(`Product image ${i + 1} upload error:`, error);
                toast.error("Image upload failed", {
                  description:
                    error?.data?.message ||
                    error.message ||
                    "Product image upload failed",
                });
                return;
              }
            }
          }

          toast.success("Product images uploaded successfully");
        }

        // Create update payload for regular product
        const updatePayload = {
          storeId: storeId,
          categoryId: data.category,
          subCategoryId: data.subCategory,
          name: data.productName,
          price: parseFloat(data.productPrice),
          discount: data.discount ? parseFloat(data.discount) : null,
          description: data.productDescription,
          type: data.type,
          tags: data.tags ? data.tags.split(",").map((tag) => tag.trim()) : [],
          barcode: data.barcode || "",
          aboutProduct: data.aboutProduct || "",
          images: productImageUrls,
          stockQuantity: data.stockQuantity ? parseInt(data.stockQuantity) : 0,
        };

        console.log("Update Payload:", JSON.stringify(updatePayload, null, 2));

        // Call the update mutation
        await updateProduct({ id: productId, data: updatePayload }).unwrap();

        toast.success("Product updated successfully!", {
          description: "Your product has been updated in the system.",
        });

        // Refetch product data
        await refetch();

        // Call success callback if provided
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error: any) {
      console.error("Form submission error:", error);
      toast.error("Failed to update product", {
        description:
          error?.data?.message ||
          error.message ||
          "Please check your input and try again.",
      });
    }
  };

  // Product image upload handlers
  const handleProductImagesChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;

    if (!files || files.length === 0) return;

    // Process each selected file
    Array.from(files).forEach((file) => {
      // Check file size (max 2 MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image too large", {
          description: `${file.name} must be less than 2 MB.`,
        });
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        toast.error("Invalid file type", {
          description: `${file.name} is not an image file.`,
        });
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductImages((prev) => [
          ...prev,
          {
            file,
            preview: reader.result as string,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });

    // Reset the input value so the same file can be selected again if needed
    e.target.value = "";
  };

  const removeExistingImage = (url: string) => {
    setExistingImages((prev) => prev.filter((img) => img !== url));
    setImagesToDelete((prev) => [...prev, url]);
  };

  const removeNewImage = (index: number) => {
    setProductImages((prev) => prev.filter((_, i) => i !== index));
    if (productFileInputRef.current) {
      productFileInputRef.current.value = "";
    }
  };

  // Variant image upload handlers
  const handleVariantImageChange = (
    colorIndex: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Check file size (max 2 MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image too large", {
        description: "Variant image must be less than 2 MB.",
      });
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type", {
        description: "Please upload an image file.",
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const newVariants = [...variantColors];
      newVariants[colorIndex] = {
        ...newVariants[colorIndex],
        imageFile: file,
        imagePreview: reader.result as string,
        image: "", // Clear URL field when uploading file
      };
      setVariantColors(newVariants);
    };
    reader.readAsDataURL(file);
  };

  const removeVariantImage = (colorIndex: number) => {
    const newVariants = [...variantColors];
    newVariants[colorIndex] = {
      ...newVariants[colorIndex],
      imageFile: null,
      imagePreview: "",
      image: "",
    };
    setVariantColors(newVariants);

    // Reset file input
    if (variantFileInputRefs.current[colorIndex]) {
      variantFileInputRefs.current[colorIndex]!.value = "";
    }
  };

  // Variant color functions
  const addVariantColor = () => {
    const newId =
      Date.now().toString() + Math.random().toString(36).substr(2, 9);
    setVariantColors([
      ...variantColors,
      {
        id: newId,
        colorName: "",
        colorCode: "",
        image: "",
        imageFile: null,
        imagePreview: "",
        sizes: [{ size: "", quantity: "" }],
      },
    ]);
  };

  const removeVariantColor = (index: number) => {
    if (variantColors.length > 1) {
      const newVariants = variantColors.filter((_, i) => i !== index);
      setVariantColors(newVariants);
      // Remove ref for deleted variant
      variantFileInputRefs.current.splice(index, 1);
    }
  };

  const updateVariantColor = (
    index: number,
    field: keyof Omit<
      VariantColor,
      "id" | "sizes" | "imageFile" | "imagePreview"
    >,
    value: string,
  ) => {
    const newVariants = [...variantColors];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariantColors(newVariants);
  };

  // Size functions for each variant
  const addVariantSize = (colorIndex: number) => {
    const newVariants = [...variantColors];
    newVariants[colorIndex].sizes.push({ size: "", quantity: "" });
    setVariantColors(newVariants);
  };

  const removeVariantSize = (colorIndex: number, sizeIndex: number) => {
    const newVariants = [...variantColors];
    if (newVariants[colorIndex].sizes.length > 1) {
      newVariants[colorIndex].sizes = newVariants[colorIndex].sizes.filter(
        (_, i) => i !== sizeIndex,
      );
      setVariantColors(newVariants);
    }
  };

  const updateVariantSize = (
    colorIndex: number,
    sizeIndex: number,
    field: "size" | "quantity",
    value: string,
  ) => {
    const newVariants = [...variantColors];
    newVariants[colorIndex].sizes[sizeIndex] = {
      ...newVariants[colorIndex].sizes[sizeIndex],
      [field]: value,
    };
    setVariantColors(newVariants);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  // Extract categories and subcategories from API responses
  const categories =
    categoriesData?.data?.map((item: any) => item.category) || [];
  const subCategories = subCategoriesData?.data || [];

  if (userLoading || productLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-8 h-8 rounded-full animate-pulse bg-primary dark:bg-primary"></div>
          <div className="w-8 h-8 rounded-full animate-pulse bg-primary dark:bg-primary"></div>
          <div className="w-8 h-8 rounded-full animate-pulse bg-primary dark:bg-primary"></div>
        </div>
      </div>
    );
  }

  if (!storeId) {
    return (
      <div className="max-w-6xl mx-auto py-12 text-center">
        <p className="text-red-500">
          No store found. Please set up your store first.
        </p>
      </div>
    );
  }

  if (!productData?.data) {
    return (
      <div className="max-w-6xl mx-auto py-12 text-center">
        <p className="text-red-500">
          Product not found.
        </p>
      </div>
    );
  }

  return (
    <section className="max-w-6xl mx-auto py-12 bg-white rounded-lg shadow md:p-6 p-3">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Product Name and Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Product Name
            </label>
            <Input
              placeholder="Organic Hair Oil"
              {...register("productName", {
                required: "Product name is required",
              })}
              className={errors.productName ? "border-red-500" : ""}
            />
            {errors.productName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.productName.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Product Price
            </label>
            <div className="flex gap-2">
              <div className="bg-blue-600 text-white rounded px-3 py-2 flex items-center font-semibold">
                €
              </div>
              <Input
                placeholder="123"
                type="number"
                step="0.01"
                {...register("productPrice", {
                  required: "Price is required",
                  min: { value: 0, message: "Price must be positive" },
                })}
                className={errors.productPrice ? "border-red-500" : ""}
              />
            </div>
            {errors.productPrice && (
              <p className="text-red-500 text-sm mt-1">
                {errors.productPrice.message}
              </p>
            )}
          </div>
        </div>

        {/* Product Description */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Product Description
          </label>
          <Textarea
            placeholder="Enter product description"
            {...register("productDescription", {
              required: "Description is required",
            })}
            className={`min-h-24 ${
              errors.productDescription ? "border-red-500" : ""
            }`}
          />
          {errors.productDescription && (
            <p className="text-red-500 text-sm mt-1">
              {errors.productDescription.message}
            </p>
          )}
        </div>

        {/* Category and Sub Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="w-full">
            <label className="block text-sm font-medium mb-2">Category</label>
            <Select
              value={watch("category")}
              onValueChange={(value) => {
                setValue("category", value);
                setValue("subCategory", ""); // Reset subcategory when category changes
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {categoriesLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading categories...
                  </SelectItem>
                ) : categories.length > 0 ? (
                  categories.map((category: Category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-categories" disabled>
                    No categories available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">
                {errors.category.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Sub Category
            </label>
            <Select
              value={watch("subCategory")}
              onValueChange={(value) => setValue("subCategory", value)}
              disabled={!selectedCategory || subCategoriesLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    !selectedCategory
                      ? "Select category first"
                      : subCategoriesLoading
                      ? "Loading subcategories..."
                      : "Select subcategory"
                  }
                />
              </SelectTrigger>
              <SelectContent className="w-full">
                {subCategories.length > 0 ? (
                  subCategories.map((subCategory: SubCategory) => (
                    <SelectItem key={subCategory.id} value={subCategory.id}>
                      {subCategory.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-subcategories" disabled>
                    No subcategories available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {errors.subCategory && (
              <p className="text-red-500 text-sm mt-1">
                {errors.subCategory.message}
              </p>
            )}
          </div>
        </div>

        {/* Has Variants Toggle */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="hasVariants"
            {...register("hasVariants")}
            className="w-4 h-4 rounded"
          />
          <label htmlFor="hasVariants" className="text-sm font-medium">
            This product has variants (colors with sizes)
          </label>
        </div>

        {/* Product Images Section - Only show if hasVariants is false */}
        {!hasVariants && (
          <div className="border rounded-lg p-6 bg-gray-50">
            <h3 className="text-lg font-medium mb-4">Product Images</h3>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white hover:border-blue-500 transition-colors">
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleProductImagesChange}
                ref={productFileInputRef}
                id="product-images"
              />

              {(existingImages.length > 0 || productImages.length > 0) ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Existing images */}
                    {existingImages.map((url, index) => (
                      <div key={`existing-${index}`} className="relative group">
                        <Image
                          src={url}
                          alt={`Existing product image ${index + 1}`}
                          width={150}
                          height={150}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(url)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    
                    {/* New images */}
                    {productImages.map((image, index) => (
                      <div key={`new-${index}`} className="relative group">
                        <Image
                          src={image.preview}
                          alt={`New product image ${index + 1}`}
                          width={150}
                          height={150}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <label
                    htmlFor="product-images"
                    className="cursor-pointer block text-center w-full py-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <p className="text-sm text-muted-foreground">
                      Click to add more images or drag and drop
                    </p>
                  </label>
                </div>
              ) : (
                <label
                  htmlFor="product-images"
                  className="cursor-pointer block text-center"
                >
                  <div className="space-y-4 py-4">
                    <Cloud className="w-8 h-8 mx-auto text-gray-400" />
                    <div>
                      <p className="font-medium">Upload product images</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Drag & drop or click to browse
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>• Multiple images allowed</p>
                      <p>• Max 2 MB per image</p>
                      <p>• Supported formats: JPG, PNG, WebP</p>
                    </div>
                  </div>
                </label>
              )}
            </div>
          </div>
        )}

        {/* Variants Section - Only show if hasVariants is true */}
        {hasVariants && (
          <div className="border rounded-lg p-6 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Product Variants</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addVariantColor}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Color Variant
              </Button>
            </div>

            <div className="space-y-8">
              {variantColors.map((variant, colorIndex) => (
                <div
                  key={variant.id}
                  className="border rounded-lg p-4 bg-white"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">
                      Color Variant {colorIndex + 1}
                    </h4>
                    {variantColors.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeVariantColor(colorIndex)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  {/* Color Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Color Name
                      </label>
                      <Input
                        placeholder="e.g., Walnut, Oak"
                        value={variant.colorName}
                        onChange={(e) =>
                          updateVariantColor(
                            colorIndex,
                            "colorName",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Color Code (Hex)
                      </label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="#8B4513"
                          value={variant.colorCode}
                          onChange={(e) =>
                            updateVariantColor(
                              colorIndex,
                              "colorCode",
                              e.target.value,
                            )
                          }
                        />
                        {variant.colorCode && (
                          <div
                            className="w-10 h-10 rounded border"
                            style={{ backgroundColor: variant.colorCode }}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Variant Image Upload */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">
                      Variant Image *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white hover:border-blue-500 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleVariantImageChange(colorIndex, e)
                        }
                        ref={(el) => {
                          variantFileInputRefs.current[colorIndex] = el;
                        }}
                        id={`variant-image-${colorIndex}`}
                      />

                      {variant.imagePreview ? (
                        <div className="space-y-4">
                          <div className="flex items-center justify-center">
                            <div className="relative group">
                              <Image
                                src={variant.imagePreview || "/placeholder.svg"}
                                alt={`Variant ${colorIndex + 1} preview`}
                                width={150}
                                height={150}
                                className="w-full max-w-xs h-40 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => removeVariantImage(colorIndex)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground text-center">
                            Click to change image or drag and drop
                          </p>
                        </div>
                      ) : (
                        <label
                          htmlFor={`variant-image-${colorIndex}`}
                          className="cursor-pointer block text-center"
                        >
                          <div className="space-y-4 py-4">
                            <Cloud className="w-8 h-8 mx-auto text-gray-400" />
                            <div>
                              <p className="font-medium">
                                Upload variant image
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                Drag & drop or click to browse
                              </p>
                            </div>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <p>• Single image per variant</p>
                              <p>• Max 2 MB</p>
                              <p>• Supported formats: JPG, PNG, WebP</p>
                            </div>
                          </div>
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Sizes for this color */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h5 className="font-medium">Sizes for this color</h5>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addVariantSize(colorIndex)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Size
                      </Button>
                    </div>

                    {variant.sizes.map((sizeItem, sizeIndex) => (
                      <div
                        key={sizeIndex}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
                      >
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Size Name
                          </label>
                          <Input
                            placeholder="e.g., Standard, Large"
                            value={sizeItem.size}
                            onChange={(e) =>
                              updateVariantSize(
                                colorIndex,
                                sizeIndex,
                                "size",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Quantity
                          </label>
                          <Input
                            type="number"
                            placeholder="0"
                            min="0"
                            value={sizeItem.quantity}
                            onChange={(e) =>
                              updateVariantSize(
                                colorIndex,
                                sizeIndex,
                                "quantity",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div className="flex items-end">
                          {variant.sizes.length > 1 && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                removeVariantSize(colorIndex, sizeIndex)
                              }
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-sm text-muted-foreground mt-4">
              * Each color variant can have multiple sizes with different
              quantities. * Variant images are required for each color
              variant.
            </p>
          </div>
        )}

        {/* Type, Stock Quantity, and Discount */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Type</label>
            <Input
              placeholder="eg., Top Deal, New Arrival"
              {...register("type", {
                required: "Type is required",
              })}
              className={errors.type ? "border-red-500" : ""}
            />
            {errors.type && (
              <p className="text-red-500 text-sm mt-1">
                {errors.type.message}
              </p>
            )}
          </div>
          {!hasVariants && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Stock Quantity
              </label>
              <Input
                placeholder="25"
                type="number"
                min="0"
                {...register("stockQuantity")}
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Discount (%)
            </label>
            <Input
              placeholder="10"
              type="number"
              step="0.01"
              min="0"
              max="100"
              {...register("discount")}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Enter discount percentage (e.g., 10 for 10%)
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Barcode</label>
            <Input placeholder="PROD-1045" {...register("barcode")} />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium mb-2">Tags</label>
          <Input
            placeholder="organic, natural, hair care"
            {...register("tags")}
          />
          <p className="text-sm text-muted-foreground mt-1">
            Separate tags with commas
          </p>
        </div>

        {/* About this product */}
        <div>
          <label className="block text-sm font-medium mb-2">
            About this product
          </label>
          <Textarea
            placeholder="Enter additional product information"
            {...register("aboutProduct")}
            className="min-h-24"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            className="bg-gray-800 hover:bg-gray-900 text-white px-8"
            disabled={isUpdating || isUploading}
          >
            {isUpdating || isUploading ? "Updating..." : "Update Product"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isUpdating || isUploading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </section>
  );
}