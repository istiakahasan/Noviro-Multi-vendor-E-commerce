"use client";

import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  useCreateStoreMutation,
  useGetAllCategoryQuery,
} from "@/redux/api/storeApi/storeApi";

// Types based on API response
interface Category {
  id: string;
  name: string;
  description: string;
  type: string;
}

interface FormData {
  name: string;
  categoryIds: string[];
  location: string;
  tags: string[];
  description: string;
  phone: string;
  email: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  stripeAccountId: string;
  logo: File | null;
  banner: File | null;
}

export default function StoreAccountForm() {
  const router = useRouter();
  const { register, handleSubmit, reset, watch, setValue } = useForm<FormData>({
    defaultValues: {
      categoryIds: [],
      tags: [],
      name: "",
      location: "",
      description: "",
      phone: "",
      email: "",
      facebookUrl: "",
      instagramUrl: "",
      youtubeUrl: "",
      stripeAccountId: "",
      logo: null,
      banner: null,
    },
  });

  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetAllCategoryQuery({});
  const [createStore, { isLoading: creatingStore }] = useCreateStoreMutation();

  const categories = categoriesData?.data || [];

  const [dragActive, setDragActive] = useState<"logo" | "banner" | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [tagsInput, setTagsInput] = useState("");

  const selectedCategoryIds = watch("categoryIds") || [];

  const handleCategoryChange = (categoryId: string, isChecked: boolean) => {
    if (isChecked) {
      setValue("categoryIds", [...selectedCategoryIds, categoryId]);
    } else {
      setValue(
        "categoryIds",
        selectedCategoryIds.filter((id) => id !== categoryId)
      );
    }
  };

  const handleTagsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagsInput(e.target.value);
  };

  const handleTagsInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagsInput.trim()) {
      e.preventDefault();
      const currentTags = watch("tags") || [];
      const newTag = tagsInput.trim();

      if (!currentTags.includes(newTag)) {
        setValue("tags", [...currentTags, newTag]);
      }

      setTagsInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = watch("tags") || [];
    setValue(
      "tags",
      currentTags.filter((tag) => tag !== tagToRemove)
    );
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setPreview: (url: string | null) => void,
    fieldName: "logo" | "banner"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size must be less than 2MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      setValue(fieldName, file);

      toast.success(
        `${fieldName === "logo" ? "Logo" : "Banner"} uploaded successfully`
      );
    }
  };

  const handleDrag = (e: React.DragEvent, field: "logo" | "banner") => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(field);
    } else if (e.type === "dragleave") {
      setDragActive(null);
    }
  };

  const handleDrop = (
    e: React.DragEvent,
    field: "logo" | "banner",
    setPreview: (url: string | null) => void
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(null);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size must be less than 2MB");
        return;
      }
      const fakeEvent = {
        target: { files },
      } as React.ChangeEvent<HTMLInputElement>;
      handleFileChange(fakeEvent, setPreview, field);
    }
  };

  const onSubmit = async (data: FormData) => {
    // Validate required fields
    if (data.categoryIds.length === 0) {
      toast.error("Please select at least one category");
      return;
    }

    if (!data.name.trim()) {
      toast.error("Shop name is required");
      return;
    }

    if (!data.stripeAccountId.trim()) {
      toast.error("Stripe Account ID is required");
      return;
    }

    if (!data.logo) {
      toast.error("Please upload a store logo");
      return;
    }

    if (!data.banner) {
      toast.error("Please upload a store banner");
      return;
    }

    try {
      const formData = new FormData();

      const storeData = {
        name: data.name,
        categoryIds: data.categoryIds,
        location: data.location,
        tags: data.tags,
        description: data.description,
        phone: data.phone,
        email: data.email,
        facebookUrl: data.facebookUrl,
        instagramUrl: data.instagramUrl,
        youtubeUrl: data.youtubeUrl,
        stripeAccountId: data.stripeAccountId,
      };

      formData.append("data", JSON.stringify(storeData));

      if (data.logo) {
        formData.append("logo", data.logo);
      }
      if (data.banner) {
        formData.append("banner", data.banner);
      }

      await createStore(formData).unwrap();
      toast.success("Store created successfully!");

      setTimeout(() => {
        router.push("/seller-dashboard");
      }, 500);
    } catch (error) {
      console.error("Error creating store:", error);
      toast.error("Failed to create store. Please try again.");
    }
  };

  const currentTags = watch("tags") || [];

  return (
    <section className="container mx-auto px-8 my-12">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">
          Create an account
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Select Category - Required */}
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Select Category <span className="text-red-500">*</span>
            </h2>
            <div className="space-y-3 border border-gray-200 rounded-lg p-4">
              {categoriesLoading ? (
                <div className="text-center py-4">Loading categories...</div>
              ) : categories.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No categories available
                </div>
              ) : (
                categories.map((category: Category) => (
                  <label
                    key={category.id}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategoryIds.includes(category.id)}
                      onChange={(e) =>
                        handleCategoryChange(category.id, e.target.checked)
                      }
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">
                      {category.name}
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Shop Information */}
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Shop Information
            </h2>
            <div className="space-y-4 border border-gray-200 rounded-lg p-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Shop Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("name", { required: true })}
                  placeholder="Enter shop name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-gray-900 placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Location 
                </label>
                <input
                  type="text"
                  {...register("location")}
                  placeholder="Enter location"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-gray-900 placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Tags 
                </label>
                <div className="border border-gray-300 rounded-lg p-2 min-h-[42px]">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {currentTags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={handleTagsInputChange}
                    onKeyDown={handleTagsInputKeyDown}
                    placeholder="Type a tag and press Enter"
                    className="w-full px-2 py-1 focus:outline-none text-gray-900 placeholder-gray-400"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Press Enter to add multiple tags
                </p>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Description
                </label>
                <textarea
                  {...register("description")}
                  placeholder="Enter description"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-gray-900 placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Phone 
                </label>
                <input
                  type="text"
                  {...register("phone")}
                  placeholder="Enter phone number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-gray-900 placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  {...register("email", { required: true })}     
                  placeholder="Enter email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-gray-900 placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Facebook URL
                </label>
                <input
                  type="url"
                  {...register("facebookUrl")}
                  placeholder="Enter Facebook URL"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-gray-900 placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Instagram URL
                </label>
                <input
                  type="url"
                  {...register("instagramUrl")}
                  placeholder="Enter Instagram URL"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-gray-900 placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  YouTube URL 
                </label>
                <input
                  type="url"
                  {...register("youtubeUrl")}
                  placeholder="Enter YouTube URL"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-gray-900 placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Stripe Account ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("stripeAccountId", { required: true })}
                  placeholder="acct_1OECJyCvoHc3qCnA"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Upload Logo - Required */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Upload Logo <span className="text-red-500">*</span>
            </label>
            <div
              onDragEnter={(e) => handleDrag(e, "logo")}
              onDragLeave={(e) => handleDrag(e, "logo")}
              onDragOver={(e) => handleDrag(e, "logo")}
              onDrop={(e) => handleDrop(e, "logo", setLogoPreview)}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                dragActive === "logo"
                  ? "border-blue-500 bg-blue-50"
                  : "border-blue-300 bg-blue-50 hover:border-blue-400"
              }`}
            >
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="logo-input"
                onChange={(e) => handleFileChange(e, setLogoPreview, "logo")}
              />
              {logoPreview ? (
                <label htmlFor="logo-input" className="cursor-pointer">
                  <Image
                    src={logoPreview || "/placeholder.svg"}
                    alt="Logo preview"
                    width={500}
                    height={500}
                    className="w-20 h-20 object-cover mx-auto rounded mb-2"
                  />
                  <p className="text-sm text-gray-600">Click to change logo</p>
                </label>
              ) : (
                <label htmlFor="logo-input" className="cursor-pointer">
                  <div className="flex justify-center mb-2">
                    <Upload className="w-8 h-8 text-gray-600" />
                  </div>
                  <p className="text-sm text-gray-600">
                    Upload your store logo
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Image Size: Max 2 MB
                  </p>
                </label>
              )}
            </div>
          </div>

          {/* Upload Banner - Required */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Upload Banner <span className="text-red-500">*</span>
            </label>
            <div
              onDragEnter={(e) => handleDrag(e, "banner")}
              onDragLeave={(e) => handleDrag(e, "banner")}
              onDragOver={(e) => handleDrag(e, "banner")}
              onDrop={(e) => handleDrop(e, "banner", setBannerPreview)}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                dragActive === "banner"
                  ? "border-blue-500 bg-blue-50"
                  : "border-blue-300 bg-blue-50 hover:border-blue-400"
              }`}
            >
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="banner-input"
                onChange={(e) =>
                  handleFileChange(e, setBannerPreview, "banner")
                }
              />
              {bannerPreview ? (
                <label htmlFor="banner-input" className="cursor-pointer">
                  <Image
                    src={bannerPreview || "/placeholder.svg"}
                    alt="Banner preview"
                    width={500}
                    height={500}
                    className="w-full h-40 object-cover mx-auto rounded mb-2"
                  />
                  <p className="text-sm text-gray-600">
                    Click to change banner
                  </p>
                </label>
              ) : (
                <label htmlFor="banner-input" className="cursor-pointer">
                  <div className="flex justify-center mb-2">
                    <Upload className="w-8 h-8 text-gray-600" />
                  </div>
                  <p className="text-sm text-gray-600">
                    Upload your store banner
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Image Size: Max 2 MB
                  </p>
                </label>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={() => reset()}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={creatingStore}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creatingStore ? "Creating..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}