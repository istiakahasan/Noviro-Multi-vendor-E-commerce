/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Cloud } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useGetMeQuery } from "@/redux/api/authApi";
import {
  useGetAllStoreCategoryQuery,
  useGetAllStoreSubCategoryQuery,
} from "@/redux/api/productApi/productApi";
import { 
  useGetSingleSubscriptionPlanByIdQuery,
  useUpdateSubscriptionPlanMutation 
} from "@/redux/api/subscriptionApi/subscriptionApi";

interface SubscriptionPlanFormData {
  planName: string;
  amount: string;
  description: string;
  categoryId: string;
  subCategoryId: string;
  interval: string;
  intervalCount: string;
  freeTrialDays: string;
  features: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  slotDuration: string;
  tags: string;
  totalSlot: string;
  active: boolean;
  image?: FileList;
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

interface StoreCategory {
  id: string;
  storeId: string;
  categoryId: string;
  createdAt: string;
  category: Category;
}

interface SubscriptionPlan {
  id: string;
  userId: string;
  categoryId: string;
  subCategoryId: string | null;
  storeId: string;
  planName: string;
  amount: number;
  currency: string;
  interval: string;
  intervalCount: number;
  freeTrialDays: number | null;
  productId: string | null;
  priceId: string | null;
  averageRating: number;
  totalReviews: number;
  active: boolean;
  description: string | null;
  features: string[];
  createdAt: string;
  updatedAt: string;
  image: string | null;
  status: string;
  // Optional fields that might exist
  startDate?: string | null;
  endDate?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  slotDuration?: number | null;
  tags?: string[];
  totalSlot?: number | null;
}

interface UpdateSubscriptionPlanFormProps {
  subscriptionId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function UpdateSubscriptionPlanForm({ 
  subscriptionId, 
  onSuccess, 
  onCancel 
}: UpdateSubscriptionPlanFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SubscriptionPlanFormData>({
    defaultValues: {
      planName: "",
      amount: "",
      description: "",
      categoryId: "",
      subCategoryId: "",
      interval: "",
      intervalCount: "",
      freeTrialDays: "",
      features: "",
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      slotDuration: "",
      tags: "",
      totalSlot: "",
      active: true,
    },
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [features, setFeatures] = useState<string[]>([""]);

  const { data: userData, isLoading: userLoading } = useGetMeQuery({});

  // Get store ID from user data
  const storeId = userData?.data?.stores?.id;

  // Fetch the existing subscription data
  const { data: subscriptionData, isLoading: subscriptionLoading, refetch } = 
    useGetSingleSubscriptionPlanByIdQuery(subscriptionId, {
      skip: !subscriptionId,
    });

  // Fetch categories for the store
  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetAllStoreCategoryQuery(storeId, {
      skip: !storeId,
    });

  // Fetch subcategories when a category is selected
  const { data: subCategoriesData, isLoading: subCategoriesLoading } =
    useGetAllStoreSubCategoryQuery(selectedCategory, {
      skip: !selectedCategory,
    });

  const [updateSubscriptionPlan, { isLoading: isUpdating }] = 
    useUpdateSubscriptionPlanMutation();

  // Update selected category when category changes
  const watchedCategory = watch("categoryId");
  useEffect(() => {
    if (watchedCategory) {
      setSelectedCategory(watchedCategory);
    }
  }, [watchedCategory]);

  // Populate form with existing subscription data
  useEffect(() => {
    if (subscriptionData?.data) {
      const plan: SubscriptionPlan = subscriptionData.data;
      
      // Set form values
      setValue("planName", plan.planName);
      setValue("amount", plan.amount.toString());
      setValue("description", plan.description || "");
      setValue("categoryId", plan.categoryId);
      setValue("subCategoryId", plan.subCategoryId || "");
      setValue("interval", plan.interval);
      setValue("intervalCount", plan.intervalCount.toString());
      setValue("freeTrialDays", plan.freeTrialDays?.toString() || "");
      setValue("features", plan.features?.join(",") || "");
      
      // Handle optional date fields
      if (plan.startDate) {
        setValue("startDate", plan.startDate.split('T')[0]);
      }
      if (plan.endDate) {
        setValue("endDate", plan.endDate.split('T')[0]);
      }
      
      // Handle time fields - extract time from ISO string if it exists
      if (plan.startTime) {
        const timeString = new Date(plan.startTime).toTimeString().slice(0, 5);
        setValue("startTime", timeString);
      }
      if (plan.endTime) {
        const timeString = new Date(plan.endTime).toTimeString().slice(0, 5);
        setValue("endTime", timeString);
      }
      
      // Handle optional numeric fields
      if (plan.slotDuration) {
        setValue("slotDuration", plan.slotDuration.toString());
      }
      if (plan.tags && plan.tags.length > 0) {
        setValue("tags", plan.tags.join(","));
      }
      if (plan.totalSlot) {
        setValue("totalSlot", plan.totalSlot.toString());
      }
      
      setValue("active", plan.active);

      // Set features array
      if (plan.features && plan.features.length > 0) {
        setFeatures(plan.features);
      } else {
        setFeatures([""]);
      }

      // Set image preview if exists
      if (plan.image) {
        setImagePreview(plan.image);
      }

      // Set selected category
      setSelectedCategory(plan.categoryId);
    }
  }, [subscriptionData, setValue]);

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
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
    setValue("features", newFeatures.filter((f) => f.trim() !== "").join(","));
  };

  const addFeature = () => {
    setFeatures([...features, ""]);
  };

  const removeFeature = (index: number) => {
    const newFeatures = features.filter((_, i) => i !== index);
    setFeatures(newFeatures.length > 0 ? newFeatures : [""]);
    setValue("features", newFeatures.filter((f) => f.trim() !== "").join(","));
  };

const onSubmit = async (data: SubscriptionPlanFormData) => {
  try {
    if (!storeId) {
      toast.error("Store not found", {
        description: "Please make sure you have a store setup.",
      });
      return;
    }

    if (!subscriptionId) {
      toast.error("Subscription ID not found", {
        description: "Cannot update subscription without an ID.",
      });
      return;
    }

    if (!data.categoryId) {
      toast.error("Category required", {
        description: "Please select a category.",
      });
      return;
    }

    // Process features - filter out empty strings
    const processedFeatures = features
      .map((feature) => feature.trim())
      .filter((feature) => feature !== "");

    // Process tags - split by comma and clean up
    const processedTags = data.tags
      ? data.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag !== "")
      : [];

    // Define the payload type
    interface UpdatePayload {
      storeId: string;
      categoryId: string;
      subCategoryId: string | null;
      planName: string;
      amount: number;
      description: string;
      interval: string;
      intervalCount: number;
      freeTrialDays: number | null;
      features: string[];
      startDate: string | null;
      endDate: string | null;
      startTime: string | null;
      endTime: string | null;
      slotDuration: number | null;
      tags: string[];
      totalSlot: number | null;
      active: boolean;
      [key: string]: any; // Add index signature for dynamic access
    }

    // Create the update payload
    const updatePayload: UpdatePayload = {
      storeId,
      categoryId: data.categoryId,
      subCategoryId: data.subCategoryId || null,
      planName: data.planName,
      amount: parseFloat(data.amount),
      description: data.description || "",
      interval: data.interval,
      intervalCount: parseInt(data.intervalCount),
      freeTrialDays: data.freeTrialDays ? parseInt(data.freeTrialDays) : null,
      features: processedFeatures,
      startDate: data.startDate ? new Date(data.startDate).toISOString() : null,
      endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
      startTime: data.startTime ? new Date(`1970-01-01T${data.startTime}:00`).toISOString() : null,
      endTime: data.endTime ? new Date(`1970-01-01T${data.endTime}:00`).toISOString() : null,
      slotDuration: data.slotDuration ? parseInt(data.slotDuration) : null,
      tags: processedTags,
      totalSlot: data.totalSlot ? parseInt(data.totalSlot) : null,
      active: data.active,
    };

    // Remove undefined or null values
    const cleanPayload: Partial<UpdatePayload> = {};
    
    // Use Object.entries for safer iteration
    (Object.entries(updatePayload) as [keyof UpdatePayload, any][]).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        cleanPayload[key] = value;
      }
    });

    // Create FormData
    const formData = new FormData();
    
    // Stringify the clean payload and append it as 'data'
    formData.append('data', JSON.stringify(cleanPayload));
    
    // Append the file if selected
    if (selectedFile) {
      formData.append('file', selectedFile);
    }

    console.log("Sending data:", JSON.stringify(cleanPayload));
    console.log("File:", selectedFile?.name);

    // Send the FormData
    const result = await updateSubscriptionPlan({ 
      id: subscriptionId, 
      data: formData 
    }).unwrap();

    if (result.success) {
      toast.success("Subscription plan updated successfully!", {
        description: "Your subscription plan has been updated.",
      });

      await refetch();

      if (onSuccess) {
        onSuccess();
      }
    }
  } catch (error: any) {
    console.error("Form submission error:", error);

    if (error?.data?.message) {
      toast.error("Failed to update subscription plan", {
        description: error.data.message,
      });
    } else if (error?.data?.error?.message) {
      toast.error("Failed to update subscription plan", {
        description: error.data.error.message,
      });
    } else if (error?.message?.includes("Network")) {
      toast.error("Network error", {
        description: "Please check your internet connection.",
      });
    } else {
      toast.error("Failed to update subscription plan", {
        description: "An unexpected error occurred. Please try again.",
      });
    }
  }
};

  // Extract categories from API response
  const categories =
    categoriesData?.data?.map(
      (storeCategory: StoreCategory) => storeCategory.category,
    ) || [];

  // Extract subcategories from API response
  const subCategories = subCategoriesData?.data || [];

  if (userLoading || subscriptionLoading) {
    return (
      <div className="max-w-6xl mx-auto py-12 text-center">
        <div className="flex justify-center items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          <span>Loading subscription data...</span>
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

  if (!subscriptionData?.data) {
    return (
      <div className="max-w-6xl mx-auto py-12 text-center">
        <p className="text-red-500">
          Subscription plan not found.
        </p>
      </div>
    );
  }

  const currentPlan = subscriptionData.data as SubscriptionPlan;

  return (
    <section className="max-w-6xl mx-auto py-12">
      <h1 className="text-2xl font-bold mb-6">Update Subscription Plan</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Image Upload */}
        <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 bg-blue-50 text-center">
          <label htmlFor="image" className="cursor-pointer">
            {imagePreview ? (
              <div className="space-y-2">
                <Image
                  src={imagePreview}
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
                <p className="font-medium">Upload Subscription Plan Image</p>
                <p className="text-sm text-muted-foreground">
                  Image Size: Max 2 MB
                </p>
              </div>
            )}
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
          {selectedFile && (
            <p className="text-sm text-green-600 mt-2">
              New image selected: {selectedFile.name}
            </p>
          )}
        </div>

        {/* Name + Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Subscription Name
            </label>
            <Input
              placeholder="Personal Styling Consultation"
              {...register("planName", {
                required: "Subscription name is required",
              })}
              className={errors.planName ? "border-red-500" : ""}
            />
            {errors.planName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.planName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Subscription Price
            </label>
            <div className="flex gap-2">
              <div className="bg-blue-600 text-white rounded px-3 py-2 flex items-center font-semibold uppercase">
                {currentPlan.currency || '€'}
              </div>
              <Input
                placeholder="150.99"
                type="number"
                step="0.01"
                {...register("amount", {
                  required: "Price is required",
                  min: { value: 0.01, message: "Price must be greater than 0" },
                })}
                className={errors.amount ? "border-red-500" : ""}
              />
            </div>
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">
                {errors.amount.message}
              </p>
            )}
          </div>
        </div>

        {/* Category and Sub Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="w-full">
            <label className="block text-sm font-medium mb-2">Category</label>
            <Select
              value={watch("categoryId")}
              onValueChange={(value) => {
                setValue("categoryId", value);
                setValue("subCategoryId", ""); // Reset subcategory when category changes
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
            {errors.categoryId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Sub Category
            </label>
            <Select
              value={watch("subCategoryId")}
              onValueChange={(value) => setValue("subCategoryId", value)}
              disabled={!selectedCategory || subCategoriesLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    !selectedCategory
                      ? "Select category first"
                      : subCategoriesLoading
                        ? "Loading subcategories..."
                        : subCategories.length === 0
                          ? "No subcategories available"
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
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Subscription Description
          </label>
          <Textarea
            placeholder="Enter subscription description"
            {...register("description")}
            className="min-h-24"
          />
        </div>

        {/* Billing Interval */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Billing Interval
            </label>
            <Select
              value={watch("interval")}
              onValueChange={(value) => setValue("interval", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select interval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Weekly</SelectItem>
                <SelectItem value="month">Monthly</SelectItem>
                <SelectItem value="year">Yearly</SelectItem>
                <SelectItem value="lifetime">Lifetime</SelectItem>
              </SelectContent>
            </Select>
            {errors.interval && (
              <p className="text-red-500 text-sm mt-1">
                {errors.interval.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Interval Count
            </label>
            <Input
              placeholder="1"
              type="number"
              {...register("intervalCount", {
                required: "Interval count is required",
                min: { value: 1, message: "Must be at least 1" },
              })}
              className={errors.intervalCount ? "border-red-500" : ""}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Number of intervals between billings
            </p>
            {errors.intervalCount && (
              <p className="text-red-500 text-sm mt-1">
                {errors.intervalCount.message}
              </p>
            )}
          </div>
        </div>

        {/* Free Trial Days */}
        <div className="w-full md:w-1/2">
          <label className="block text-sm font-medium mb-2">
            Free Trial Days (Optional)
          </label>
          <Input
            placeholder="e.g., 7"
            type="number"
            {...register("freeTrialDays", {
              min: { value: 0, message: "Cannot be negative" },
            })}
          />
          <p className="text-sm text-muted-foreground mt-1">
            Leave empty if no free trial
          </p>
        </div>

        {/* Schedule Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Start Date</label>
            <Input
              type="date"
              {...register("startDate")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">End Date</label>
            <Input
              type="date"
              {...register("endDate")}
            />
          </div>
        </div>

        {/* Schedule Times */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Start Time</label>
            <Input
              type="time"
              {...register("startTime")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">End Time</label>
            <Input
              type="time"
              {...register("endTime")}
            />
          </div>
        </div>

        {/* Slot Duration and Total Slots */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Slot Duration (minutes)
            </label>
            <Input
              placeholder="60"
              type="number"
              {...register("slotDuration", {
                min: { value: 15, message: "Minimum 15 minutes" },
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
              Total Slots
            </label>
            <Input
              placeholder="10"
              type="number"
              {...register("totalSlot", {
                min: { value: 1, message: "Minimum 1 slot" },
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

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Tags (comma separated)
          </label>
          <Input
            placeholder="premium, consultation, personal"
            {...register("tags")}
          />
          <p className="text-sm text-muted-foreground mt-1">
            Separate tags with commas
          </p>
        </div>

        {/* Features/Benefits */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Features Included
          </label>
          <div className="border rounded-lg p-4 space-y-2">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  placeholder={`Feature ${index + 1}`}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeFeature(index)}
                  disabled={features.length <= 1 && feature === ""}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addFeature}
              className="mt-2"
            >
              + Add Feature
            </Button>
          </div>
        </div>

        {/* Active Status */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="active"
            checked={watch("active")}
            onCheckedChange={(checked) => setValue("active", checked === true)}
          />
          <label
            htmlFor="active"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Active Subscription
          </label>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            className="bg-gray-800 hover:bg-gray-900 text-white px-8"
            disabled={isUpdating}
          >
            {isUpdating ? "Updating..." : "Update Subscription"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </form>
    </section>
  );
}