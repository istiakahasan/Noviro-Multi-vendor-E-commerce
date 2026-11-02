"use client";

import { Button } from "@/components/ui/button";
import {
    CategoryType,
    useCreateCategoryMutation,
    useGetCategoryByIdQuery,
    useUpdateCategoryMutation,
} from "@/redux/features/subcategory/subcategoryApi"; // adjust path
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CreateEditCategoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");

  const isEditMode = !!categoryId;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<CategoryType>("SERVICE");

  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();

  // Fetch category data when in edit mode
  const {
    data: categoryData,
    isLoading: isFetching,
    isError: fetchError,
  } = useGetCategoryByIdQuery(categoryId!, {
    skip: !isEditMode || !categoryId,
  });

  useEffect(() => {
    if (isEditMode && categoryData?.data) {
      const cat = categoryData.data;
      setName(cat.name);
      setDescription(cat.description || "");
      setType(cat.type as CategoryType);
    }
  }, [categoryData, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    if (!type) {
      toast.error("Please select a category type");
      return;
    }

    const payload = {
      name: name.trim(),
      description: description.trim(),
      type,
    };

    try {
      if (isEditMode && categoryId) {
        await updateCategory({ id: categoryId, body: payload }).unwrap();
        toast.success("Category updated successfully!");
      } else {
        await createCategory(payload).unwrap();
        toast.success("Category created successfully!");
      }

      // Redirect back to list after success
      router.push("/admin-dashboard/category-management");
    } catch (err: any) {
      console.error(err);
      toast.error(
        err?.data?.message || "Failed to save category. Please try again.",
      );
    }
  };

  if (isEditMode && (isFetching || fetchError)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">
          {isFetching ? "Loading category..." : "Failed to load category"}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto min-h-screen  py-10 px-4 sm:px-6 lg:px-8">
      <div className="pb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode ? "Edit Category" : "Create New Category"}
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          {isEditMode
            ? "Update the details of the existing category"
            : "Add a new category to your system"}
        </p>
      </div>
      <div className=" bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Name + Type row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Category Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Personal Styling Consultation"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                required
              />
            </div>

            {/* Type Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as CategoryType)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition"
                required
              >
                <option value="PRODUCT">Product</option>
                <option value="SERVICE">Service</option>
                <option value="SUBSCRIPTION">Subscription</option>
                <option value="CONSULTATION">Consultation</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a detailed description of this category..."
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-6">
            <Button
              variant={"secondary"}
              type="button"
              onClick={() => router.back()}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isCreating || isUpdating}>
              {isCreating || isUpdating ? (
                <>
                  <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : isEditMode ? (
                "Update Category"
              ) : (
                "Create Category"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
