// app/add/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { UploadCloud } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useCreateSubcategoryMutation,
  useGetAllCategoriesQuery,
  useGetSubcategoryByIdQuery,
  useUpdateSubcategoryMutation,
} from "@/redux/features/subcategory/subcategoryApi";
import { toast } from "sonner";
import PageLoader from "@/app/loading";

const SubcategoryFormPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subcategoryId = searchParams.get("id");

  const isEditMode = !!subcategoryId;

  const [subcategoryName, setSubcategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Fetch categories
  const { data: categoriesData, isLoading: isLoadingCategories } =
    useGetAllCategoriesQuery({});

  // Fetch single subcategory if in edit mode
  const { data: subcategoryData, isLoading: isLoadingSubcategory } =
    useGetSubcategoryByIdQuery(subcategoryId || "", {
      skip: !isEditMode,
    });

  // Mutations
  const [createSubcategory, { isLoading: isCreating }] =
    useCreateSubcategoryMutation();
  const [updateSubcategory, { isLoading: isUpdating }] =
    useUpdateSubcategoryMutation();

  const categories = categoriesData?.data ?? [];

  // Prefill form in edit mode
  useEffect(() => {
    if (isEditMode && subcategoryData?.data) {
      const sub = subcategoryData.data;
      setSubcategoryName(sub.name);
      setDescription(sub.description);
      setSelectedCategoryId(sub.categoryId);
      setPreview(sub.image);
    }
  }, [isEditMode, subcategoryData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB");
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCategoryId) {
      toast.error("Please select a category");
      return;
    }

    if (!subcategoryName.trim()) {
      toast.error("Subcategory name is required");
      return;
    }

    // Prepare metadata
    const metadata = {
      name: subcategoryName.trim(),
      description: description.trim(),
      categoryId: selectedCategoryId,
      slug: "", // Backend will generate from name
    };

    const metadataJson = JSON.stringify(metadata);

    const formData = new FormData();
    formData.append("data", metadataJson);

    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    try {
      let response;
      if (isEditMode) {
        response = await updateSubcategory({
          id: subcategoryId!,
          formData,
        }).unwrap();
        toast.success("Subcategory updated successfully");
      } else {
        response = await createSubcategory({ formData }).unwrap();
        toast.success("Subcategory created successfully");
      }

      // Redirect back to manage page
      router.push("/admin-dashboard/category-management/subcategory-management");
    } catch (err: any) {
      toast.error(
        err?.data?.message ||
          `Failed to ${isEditMode ? "update" : "create"} subcategory`
      );
    }
  };

  const isLoading = isLoadingCategories || (isEditMode && isLoadingSubcategory);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-8 py-10">
          <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            {isEditMode ? "Edit Subcategory" : "Add New Subcategory"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Name + Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Subcategory Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={subcategoryName}
                  onChange={(e) => setSubcategoryName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Enter subcategory name"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category
                </label>
                <select
                  id="category"
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white outline-none transition appearance-none"
                  required
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Subcategory Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                placeholder="Describe this subcategory..."
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subcategory Image
              </label>

              <div
                className={`border-2 border-dashed border-blue-400 rounded-xl p-10 text-center hover:border-blue-500 transition-colors cursor-pointer bg-blue-50/30 ${
                  preview ? "bg-white" : ""
                }`}
                onClick={() => document.getElementById("file-input")?.click()}
              >
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />

                {preview ? (
                  <div className="space-y-3">
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-h-48 mx-auto rounded-lg shadow-sm object-contain"
                    />
                    <p className="text-sm text-gray-600">
                      {selectedFile?.name || "Current image"} •{" "}
                      {selectedFile
                        ? (selectedFile.size / 1024 / 1024).toFixed(2) + " MB"
                        : ""}
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreview(null);
                        setSelectedFile(null);
                      }}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Remove image
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <UploadCloud className="w-8 h-8 text-blue-600" />
                    </div>
                    <p className="text-gray-700 font-medium">
                      Upload your Subcategory Image
                    </p>
                    <p className="text-sm text-gray-500">
                      Image Size: Max 2 MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={
                  isCreating ||
                  isUpdating ||
                  isLoadingCategories ||
                  !subcategoryName.trim() ||
                  !selectedCategoryId
                }
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isCreating || isUpdating ? (
                  <>
                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                    {isEditMode ? "Updating..." : "Creating..."}
                  </>
                ) : isEditMode ? (
                  "Update Subcategory"
                ) : (
                  "Create Subcategory"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubcategoryFormPage;
