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
import { Cloud } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useGetMeQuery } from "@/redux/api/authApi";
import {
  useGetAllStoreCategoryQuery,
} from "@/redux/api/productApi/productApi";
import { useGetSingleConsultationByIdQuery, useUpdateConsultationMutation } from "@/redux/api/consultationApi/consultationApi";
import { useGetAllStoreSubCategoryQuery } from "@/redux/api/productApi/productApi";
import { useGetMyAllSpecialistQuery } from "@/redux/api/specialistApi/specialistApi";

interface ConsultationFormData {
  name: string;
  price: string;
  description: string;
  categoryId: string;
  subCategoryId: string;
  duration: string;
  location: string;
  slotDuration: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  type: "VIDEO" | "AUDIO" | "CHAT" | "IN_PERSON";
  totalSlot: string;
  tags: string;
  specialistIds: string[];
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
  slug: string;
  image: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
    type: string;
  };
}

interface Specialist {
  id: string;
  storeId: string;
  userId: string;
  serviceTypeId: string;
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  gender: string;
  bio: string;
  phoneNum: string;
  available: boolean;
  rating: string;
  experience: string;
  status: string;
  specialistTime: string;
  createdAt: string;
  updatedAt: string;
  averageRating: number;
  totalReviews: number;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  serviceType: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
}

const consultationTypes = [
  { value: "VIDEO", label: "Video Consultation" },
  { value: "AUDIO", label: "Audio Consultation" },
  { value: "CHAT", label: "Chat Consultation" },
  { value: "IN_PERSON", label: "In-Person Consultation" },
];

interface EditConsultationFormProps {
  consultationId: string;
}

export function EditConsultationForm({ consultationId }: EditConsultationFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ConsultationFormData>({
    defaultValues: {
      name: "",
      price: "",
      description: "",
      categoryId: "",
      subCategoryId: "",
      duration: "",
      location: "",
      slotDuration: "",
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      type: undefined,
      totalSlot: "",
      tags: "",
      specialistIds: [],
    },
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedSpecialists, setSelectedSpecialists] = useState<string[]>([]);

  // RTK Query hooks
  const { data: userData, isLoading: userLoading } = useGetMeQuery({});
  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetAllStoreCategoryQuery(userData?.data?.stores?.id, {
      skip: !userData?.data?.stores?.id,
    });

  // Fetch consultation data for editing
  const { data: consultationData, isLoading: consultationLoading } = useGetSingleConsultationByIdQuery(consultationId, {
    skip: !consultationId,
  });

  // Subcategory query - only fetch when category is selected
  const selectedCategoryId = watch("categoryId");
  const { 
    data: subCategoriesData, 
    isLoading: subCategoriesLoading,
    isError: subCategoriesError 
  } = useGetAllStoreSubCategoryQuery(selectedCategoryId, {
    skip: !selectedCategoryId,
  });

  // Specialist query - fetch all specialists for the store
  const storeId = userData?.data?.stores?.id;
  const { 
    data: specialistsData, 
    isLoading: specialistsLoading,
    isError: specialistsError 
  } = useGetMyAllSpecialistQuery(
    { storeId }, 
    { skip: !storeId }
  );

  const [updateConsultation, { isLoading: isUpdating }] = useUpdateConsultationMutation();

  // Reset subcategory when category changes
  useEffect(() => {
    if (selectedCategoryId) {
      setValue("subCategoryId", "");
    }
  }, [selectedCategoryId, setValue]);

  // Populate form with existing consultation data
  useEffect(() => {
    if (consultationData?.data) {
      const consultation = consultationData.data;
      
      // Format dates for input fields
      const formatDateForInput = (dateString: string) => {
        return new Date(dateString).toISOString().split('T')[0];
      };

      // Format time for input fields
      const formatTimeForInput = (dateString: string) => {
        return new Date(dateString).toTimeString().slice(0, 5);
      };

      setValue("name", consultation.name);
      setValue("price", consultation.price.toString());
      setValue("description", consultation.description);
      setValue("categoryId", consultation.categoryId);
      setValue("subCategoryId", consultation.subCategoryId);
      setValue("duration", consultation.duration);
      setValue("location", consultation.location);
      setValue("slotDuration", consultation.slotDuration.toString());
      setValue("startDate", consultation.startDate ? formatDateForInput(consultation.startDate) : "");
      setValue("endDate", consultation.endDate ? formatDateForInput(consultation.endDate) : "");
      setValue("startTime", consultation.startTime ? formatTimeForInput(consultation.startTime) : "");
      setValue("endTime", consultation.endTime ? formatTimeForInput(consultation.endTime) : "");
      setValue("type", consultation.type);
      setValue("totalSlot", consultation.totalSlot.toString());
      setValue("tags", consultation.tags?.join(', ') || "");

      // Set selected specialists
      // const specialistIds = consultation.specialists?.map(spec => spec.id) || [];
      const specialistIds = consultation.specialists?.map((spec: Specialist) => spec.id) || [];
      setSelectedSpecialists(specialistIds);
      setValue("specialistIds", specialistIds);

      // Set image preview if exists
      if (consultation.profilePic) {
        setImagePreview(consultation.profilePic);
      }
    }
  }, [consultationData, setValue]);

  // Extract categories from API response
  const categories = categoriesData?.data?.map((item: any) => item.category) || [];

  // Extract subcategories from subcategory API response
  const subCategories = subCategoriesData?.data || [];

  // Extract specialists from API response
  const specialists = specialistsData?.data || [];

  const handleSpecialistChange = (specialistId: string) => {
    const updatedSpecialists = selectedSpecialists.includes(specialistId)
      ? selectedSpecialists.filter(id => id !== specialistId)
      : [...selectedSpecialists, specialistId];
    
    setSelectedSpecialists(updatedSpecialists);
    setValue("specialistIds", updatedSpecialists);
  };

  const onSubmit = async (data: ConsultationFormData) => {
    try {
      if (!storeId) {
        toast.error("Store not found", {
          description: "Please make sure you have a store setup.",
        });
        return;
      }

      if (!data.subCategoryId) {
        toast.error("Subcategory required", {
          description: "Please select a subcategory.",
        });
        return;
      }

      if (data.specialistIds.length === 0) {
        toast.error("Specialist required", {
          description: "Please select at least one specialist for this consultation.",
        });
        return;
      }

      if (!data.type) {
        toast.error("Consultation type required", {
          description: "Please select a consultation type.",
        });
        return;
      }

      // Prepare form data
      const formData = new FormData();

      // Parse tags from comma-separated string to array
      const tagsArray = data.tags
        ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];

      // Create consultation data object matching API structure
      const consultationData = {
        storeId: storeId,
        categoryId: data.categoryId,
        subCategoryId: data.subCategoryId,
        name: data.name,
        price: parseFloat(data.price),
        description: data.description,
        duration: data.duration,
        location: data.location,
        slotDuration: parseInt(data.slotDuration) || 30,
        startDate: data.startDate ? new Date(data.startDate).toISOString() : null,
        endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
        startTime: data.startTime ? new Date(`2025-01-01T${data.startTime}`).toISOString() : null,
        endTime: data.endTime ? new Date(`2025-01-01T${data.endTime}`).toISOString() : null,
        tags: tagsArray,
        type: data.type,
        totalSlot: parseInt(data.totalSlot) || 10,
        specialistIds: data.specialistIds,
      };

      // Remove null values for optional fields
      Object.keys(consultationData).forEach(key => {
        if (consultationData[key as keyof typeof consultationData] === null) {
          delete consultationData[key as keyof typeof consultationData];
        }
      });

      // Append consultation data as JSON string
      formData.append("data", JSON.stringify(consultationData));

      // Append the file if a new one is selected
      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      console.log("Consultation Data Submitted:", consultationData);
      console.log("Store ID:", storeId);
      console.log("Specialist IDs:", data.specialistIds);
      console.log("Consultation Type:", data.type);
      console.log("File:", selectedFile);

      // Call the update mutation
      await updateConsultation({ 
        id: consultationId, 
        data: formData 
      }).unwrap();

      toast.success("Consultation updated successfully!", {
        description: "Your consultation service has been updated.",
      });

      // Redirect to consultation page after successful update
      router.push("/seller-dashboard/consultation");
      
    } catch (error: any) {
      console.error("Form submission error:", error);
      
      if (error.data?.errorMessages) {
        console.error("Validation errors:", error.data.errorMessages);
      }
      
      toast.error("Failed to update consultation", {
        description: error.data?.message || "Please check your input and try again.",
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image too large", {
          description: "Image size must be less than 2 MB.",
        });
        return;
      }

      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    router.push("/seller-dashboard/consultation");
  };

  if (userLoading || consultationLoading) {
    return (
      <div className="max-w-6xl mx-auto py-12 text-center">
        Loading...
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

  if (!consultationData?.data) {
    return (
      <div className="max-w-6xl mx-auto py-12 text-center">
        <p className="text-red-500">
          Consultation not found.
        </p>
      </div>
    );
  }

  // Check if there are any specialists available
  if (specialists.length === 0 && !specialistsLoading && !specialistsError) {
    return (
      <div className="max-w-6xl mx-auto py-12 text-center">
        <p className="text-red-500 mb-4">
          No specialists available for your store.
        </p>
        <p className="text-muted-foreground mb-6">
          You need to create at least one specialist before you can update a consultation.
        </p>
        <Button
          onClick={() => router.push("/seller-dashboard/specialists")}
          className="bg-gray-800 hover:bg-gray-900 text-white"
        >
          Create Specialist
        </Button>
      </div>
    );
  }

  return (
    <section className="max-w-6xl mx-auto py-12">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Image Upload Section */}
        <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 bg-blue-50 text-center">
          <label htmlFor="consultationImage" className="cursor-pointer">
            {imagePreview ? (
              <div className="space-y-2">
                <Image
                  src={imagePreview || "/placeholder.svg"}
                  alt="Preview"
                  width={500}
                  height={500}
                  className="w-32 h-32 object-cover mx-auto rounded"
                />
                <p className="text-sm text-muted-foreground">
                  Click to change image
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Cloud className="w-12 h-12 mx-auto text-gray-400" />
                <p className="font-medium">Upload your consultation image</p>
                <p className="text-sm text-muted-foreground">
                  Image Size: Max 2 MB
                </p>
              </div>
            )}
          </label>
          <input
            id="consultationImage"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        {/* Consultation Name and Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Consultation Name
            </label>
            <Input
              placeholder="Career Growth Consultation"
              {...register("name", {
                required: "Consultation name is required",
              })}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Consultation Price
            </label>
            <div className="flex gap-2">
              <div className="bg-blue-600 text-white rounded px-3 py-2 flex items-center font-semibold">
                €
              </div>
              <Input
                placeholder="75.00"
                type="number"
                step="0.01"
                {...register("price", {
                  required: "Price is required",
                  min: { value: 0, message: "Price must be positive" },
                })}
                className={errors.price ? "border-red-500" : ""}
              />
            </div>
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">
                {errors.price.message}
              </p>
            )}
          </div>
        </div>

        {/* Consultation Description */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Consultation Description
          </label>
          <Textarea
            placeholder="Enter consultation description"
            {...register("description", {
              required: "Description is required",
            })}
            className={`min-h-24 ${errors.description ? "border-red-500" : ""}`}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Category and Subcategory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="w-full">
            <label className="block text-sm font-medium mb-2">Category</label>
            <Select
              value={watch("categoryId")}
              onValueChange={(value) => setValue("categoryId", value)}
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
            {errors.categoryId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium mb-2">Subcategory</label>
            <Select
              value={watch("subCategoryId")}
              onValueChange={(value) => setValue("subCategoryId", value)}
              disabled={!selectedCategoryId || subCategoriesLoading || subCategoriesError}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={
                  !selectedCategoryId 
                    ? "Select category first" 
                    : subCategoriesLoading
                    ? "Loading subcategories..."
                    : subCategoriesError
                    ? "Error loading subcategories"
                    : subCategories.length === 0
                    ? "No subcategories available"
                    : "Select subcategory"
                } />
              </SelectTrigger>
              <SelectContent className="w-full">
                {subCategories.map((subCategory: SubCategory) => (
                  <SelectItem key={subCategory.id} value={subCategory.id}>
                    {subCategory.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.subCategoryId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.subCategoryId.message}
              </p>
            )}
            {subCategoriesError && (
              <p className="text-red-500 text-sm mt-1">
                Failed to load subcategories. Please try again.
              </p>
            )}
          </div>
        </div>

        {/* Specialist Selection - Multiple Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Assign Specialists <span className="text-red-500">*</span>
          </label>
          <div className="space-y-3">
            {specialistsLoading ? (
              <p className="text-sm text-muted-foreground">Loading specialists...</p>
            ) : specialistsError ? (
              <p className="text-red-500 text-sm">Failed to load specialists. Please try again.</p>
            ) : (
              specialists.map((specialist: Specialist) => (
                <div key={specialist.id} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id={`specialist-${specialist.id}`}
                    checked={selectedSpecialists.includes(specialist.id)}
                    onChange={() => handleSpecialistChange(specialist.id)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label 
                    htmlFor={`specialist-${specialist.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {specialist.firstName} {specialist.lastName} - {specialist.title}
                    <p className="text-xs text-muted-foreground mt-1">
                      {specialist.bio}
                    </p>
                  </label>
                </div>
              ))
            )}
          </div>
          {selectedSpecialists.length === 0 && (
            <p className="text-red-500 text-sm mt-1">
              Please select at least one specialist
            </p>
          )}
          <p className="text-sm text-muted-foreground mt-2">
            Select one or more specialists for this consultation
          </p>
        </div>

        {/* Duration and Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Duration</label>
            <Input
              placeholder="45 minutes"
              {...register("duration", {
                required: "Duration is required",
              })}
              className={errors.duration ? "border-red-500" : ""}
            />
            {errors.duration && (
              <p className="text-red-500 text-sm mt-1">
                {errors.duration.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <Input
              placeholder="New York, USA"
              {...register("location", {
                required: "Location is required",
              })}
              className={errors.location ? "border-red-500" : ""}
            />
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">
                {errors.location.message}
              </p>
            )}
          </div>
        </div>

        {/* Slot Duration and Total Slots */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Slot Duration (minutes)
            </label>
            <Input
              placeholder="30"
              type="number"
              min="15"
              {...register("slotDuration", {
                required: "Slot duration is required",
                min: { value: 15, message: "Minimum slot duration is 15 minutes" },
              })}
              className={errors.slotDuration ? "border-red-500" : ""}
            />
            {errors.slotDuration && (
              <p className="text-red-500 text-sm mt-1">
                {errors.slotDuration.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Total Available Slots
            </label>
            <Input
              placeholder="10"
              type="number"
              min="1"
              {...register("totalSlot", {
                required: "Total slots is required",
                min: { value: 1, message: "Must have at least 1 slot" },
              })}
              className={errors.totalSlot ? "border-red-500" : ""}
            />
            {errors.totalSlot && (
              <p className="text-red-500 text-sm mt-1">
                {errors.totalSlot.message}
              </p>
            )}
          </div>
        </div>

        {/* Consultation Type and Tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="w-full">
            <label className="block text-sm font-medium mb-2">
              Consultation Type <span className="text-red-500">*</span>
            </label>
            <Select
              value={watch("type")}
              onValueChange={(value: "VIDEO" | "AUDIO" | "CHAT" | "IN_PERSON") => setValue("type", value)}
            >
              <SelectTrigger className={`w-full ${errors.type ? "border-red-500" : ""}`}>
                <SelectValue placeholder="Select consultation type" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {consultationTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-red-500 text-sm mt-1">
                {errors.type.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Tags (comma separated)
            </label>
            <Input
              placeholder="career, growth, professional"
              {...register("tags")}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Separate multiple tags with commas
            </p>
          </div>
        </div>

        {/* Start and End Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Start Date
            </label>
            <Input
              type="date"
              {...register("startDate", {
                required: "Start date is required",
              })}
              className={errors.startDate ? "border-red-500" : ""}
            />
            {errors.startDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.startDate.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              End Date
            </label>
            <Input
              type="date"
              {...register("endDate", {
                required: "End date is required",
              })}
              className={errors.endDate ? "border-red-500" : ""}
            />
            {errors.endDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.endDate.message}
              </p>
            )}
          </div>
        </div>

        {/* Start and End Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Start Time
            </label>
            <Input
              type="time"
              {...register("startTime", {
                required: "Start time is required",
              })}
              className={errors.startTime ? "border-red-500" : ""}
            />
            {errors.startTime && (
              <p className="text-red-500 text-sm mt-1">
                {errors.startTime.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              End Time
            </label>
            <Input
              type="time"
              {...register("endTime", {
                required: "End time is required",
              })}
              className={errors.endTime ? "border-red-500" : ""}
            />
            {errors.endTime && (
              <p className="text-red-500 text-sm mt-1">
                {errors.endTime.message}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            className="bg-gray-800 hover:bg-gray-900 text-white px-8"
            disabled={isUpdating || selectedSpecialists.length === 0 || !watch("type")}
          >
            {isUpdating ? "Updating..." : "Update Consultation"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isUpdating}
          >
            Cancel
          </Button>
        </div>
      </form>
    </section>
  );
}