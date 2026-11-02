/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
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
import { useGetMeQuery } from "@/redux/api/authApi";
import {
  useGetAllStoreCategoryQuery,
  useGetAllStoreSubCategoryQuery,
} from "@/redux/api/productApi/productApi";
import { useGetAllServiceTypeQuery } from "@/redux/api/serviceTypeApi/serviceTypeApi";
import { useGetMyAllSpecialistQuery } from "@/redux/api/specialistApi/specialistApi";
import { useCreateServiceMutation } from "@/redux/api/serviceApi/serviceApi";

interface ServiceFormData {
  serviceName: string;
  servicePrice: string;
  serviceDescription: string;
  category: string;
  duration: string;
  totalSlot: string;
  location: string;
  tags: string;
  startTime: string;
  endTime: string;
  serviceType: string[];
  specialists: string[];
  serviceImage?: FileList;
  startDate: string;
  endDate: string;
  slotDuration: string;
  subCategory: string;
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

export function AddServiceForm() {
  const { 
    register, 
    handleSubmit, 
    reset, 
    watch, 
    setValue, 
    formState: { errors } 
  } = useForm<ServiceFormData>({
    defaultValues: {
      duration: "30",
      serviceType: [],
      specialists: [],
      slotDuration: "30",
    },
  });

  // State
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedSpecialists, setSelectedSpecialists] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // RTK Query hooks
  const { data: userData, isLoading: userLoading } = useGetMeQuery({});
  
  // Get store ID from user data
  const storeId = userData?.data?.stores?.id;

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

  const { data: serviceTypesData } = useGetAllServiceTypeQuery({});
  const { data: specialistsData } = useGetMyAllSpecialistQuery({});

  // Mutation
  const [createService, { isLoading: isCreating }] = useCreateServiceMutation();

  // Update selected category when category changes
  const watchedCategory = watch("category");
  useEffect(() => {
    if (watchedCategory) {
      setSelectedCategory(watchedCategory);
    }
  }, [watchedCategory]);

  // Set initial category when categories load
  useEffect(() => {
    if (categoriesData?.data?.[0]?.category?.id && !selectedCategory) {
      const firstCategory = categoriesData.data[0].category;
      setSelectedCategory(firstCategory.id);
      setValue("category", firstCategory.id);
    }
  }, [categoriesData, selectedCategory, setValue]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image too large", { description: "Max size 2 MB" });
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const toggleSpecialist = (id: string) => {
    const updatedSpecialists = selectedSpecialists.includes(id)
      ? selectedSpecialists.filter((x) => x !== id)
      : [...selectedSpecialists, id];
    
    setSelectedSpecialists(updatedSpecialists);
    setValue("specialists", updatedSpecialists);
  };

  const onSubmit = async (data: ServiceFormData) => {
    try {
      if (!storeId) {
        toast.error("Store not found", {
          description: "Please make sure you have a store setup.",
        });
        return;
      }

      if (!data.category) {
        toast.error("Category required", {
          description: "Please select a category.",
        });
        return;
      }

      if (!selectedFile) {
        toast.error("Image required", {
          description: "Please upload a service image.",
        });
        return;
      }

      console.log("Form data:", data);
      console.log("Selected category:", selectedCategory);

      // Prepare form data similar to product form
      const formData = new FormData();

      // Create service data object
      const serviceData = {
        storeId,
        categoryId: data.category,
        serviceTypeId: data.serviceType[0], // Assuming single service type for now
        name: data.serviceName,
        price: parseFloat(data.servicePrice),
        description: data.serviceDescription,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
        startTime: new Date(`1970-01-01T${data.startTime}`).toISOString(),
        endTime: new Date(`1970-01-01T${data.endTime}`).toISOString(),
        slotDuration: parseInt(data.slotDuration),
        tags: data.tags.split(",").map((tag) => tag.trim()),
        totalSlot: parseInt(data.totalSlot),
        subCategoryId: data.subCategory,
        specialistIds: selectedSpecialists,
        location: data.location,
      };

      // Append service data as JSON string
      formData.append("data", JSON.stringify(serviceData));

      // Append the file
      formData.append("file", selectedFile);

      console.log("Service Data Submitted:", serviceData);
      console.log("Store ID:", storeId);
      console.log("File:", selectedFile);

      // Call the mutation with formData
      const result = await createService(formData).unwrap();

      if (result.success) {
        toast.success("Service added successfully!", {
          description: "Your service has been added to the system.",
        });

        reset();
        setImagePreview(null);
        setSelectedFile(null);
        setSelectedSpecialists([]);
        setSelectedCategory("");
      }
    } catch (error: any) {
      console.error("Form submission error:", error);
      
      // Handle specific error cases
      if (error?.data?.message?.includes("Category not found")) {
        toast.error("Invalid category", {
          description: "The selected category was not found. Please refresh and try again.",
        });
      } else if (error?.data?.message?.includes("Syntax error")) {
        toast.error("Invalid request format", {
          description: "There was an issue with the request format. Please try again.",
        });
      } else {
        toast.error("Failed to save service", {
          description: "Please check your input and try again.",
        });
      }
    }
  };

  // Extract categories from API response - they are nested in category object
  const categories = categoriesData?.data?.map((storeCategory: StoreCategory) => storeCategory.category) || [];
  
  // Extract subcategories from API response
  const subCategories = subCategoriesData?.data?.subcategories || subCategoriesData?.data || [];

  console.log("Categories:", categories);
  console.log("Subcategories:", subCategories);
  console.log("Selected Category:", selectedCategory);

  if (userLoading) {
    return (
      <div className="max-w-6xl mx-auto py-12 text-center">
        Loading user data...
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

  return (
    <section className="max-w-6xl mx-auto py-12">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Image Upload */}
        <div>
          <p className="text-sm font-medium mb-2">Upload Service Image</p>
          <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 bg-blue-50 text-center">
            <label htmlFor="serviceImage" className="cursor-pointer">
              {imagePreview ? (
                <div className="space-y-2">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={500}
                    height={500}
                    className="w-32 h-32 object-cover mx-auto rounded"
                  />
                  <p className="text-sm text-gray-500">Click to change image</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Cloud className="w-12 h-12 mx-auto text-gray-400" />
                  <p className="font-medium">Upload your service image</p>
                  <p className="text-sm text-gray-500">Image Size: Max 2 MB</p>
                </div>
              )}
            </label>
            <input
              id="serviceImage"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </div>

        {/* Service Name + Price */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Service Name
            </label>
            <Input
              placeholder="Relaxing Full Body Massage"
              {...register("serviceName", {
                required: "Service name is required",
              })}
              className={errors.serviceName ? "border-red-500" : ""}
            />
            {errors.serviceName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.serviceName.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Service Price
            </label>
            <div className="flex gap-2">
              <div className="bg-blue-600 text-white rounded px-3 py-2 flex items-center font-semibold">
                €
              </div>
              <Input
                placeholder="123"
                type="number"
                step="0.01"
                {...register("servicePrice", {
                  required: "Price is required",
                  min: { value: 0, message: "Price must be positive" },
                })}
                className={errors.servicePrice ? "border-red-500" : ""}
              />
            </div>
            {errors.servicePrice && (
              <p className="text-red-500 text-sm mt-1">
                {errors.servicePrice.message}
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Service Description
          </label>
          <Textarea
            placeholder="Enter service description"
            {...register("serviceDescription", {
              required: "Description is required",
            })}
            className={`min-h-24 ${
              errors.serviceDescription ? "border-red-500" : ""
            }`}
          />
          {errors.serviceDescription && (
            <p className="text-red-500 text-sm mt-1">
              {errors.serviceDescription.message}
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
                console.log("Category selected:", value);
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
            {errors.subCategory && (
              <p className="text-red-500 text-sm mt-1">
                {errors.subCategory.message}
              </p>
            )}
          </div>
        </div>

        {/* Service Duration + Slot Duration */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Service Duration (minutes)
            </label>
            <Input
              placeholder="30"
              type="number"
              {...register("duration", {
                required: "Service duration is required",
                min: { value: 1, message: "Duration must be at least 1 minute" },
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
            <label className="block text-sm font-medium mb-2">
              Slot Duration (minutes)
            </label>
            <Input
              placeholder="30"
              type="number"
              {...register("slotDuration", {
                required: "Slot duration is required",
                min: { value: 1, message: "Slot duration must be at least 1 minute" },
              })}
              className={errors.slotDuration ? "border-red-500" : ""}
            />
            {errors.slotDuration && (
              <p className="text-red-500 text-sm mt-1">
                {errors.slotDuration.message}
              </p>
            )}
          </div>
        </div>

        {/* Total Slot + Location */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Total Slots
            </label>
            <Input
              placeholder="10"
              type="number"
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
          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <Input
              placeholder="Location"
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

        {/* Start Date + End Date */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Start Date</label>
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
            <label className="block text-sm font-medium mb-2">End Date</label>
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

        {/* Start Time + End Time */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Start Time</label>
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
            <label className="block text-sm font-medium mb-2">End Time</label>
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

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Tags (comma separated)
          </label>
          <Input
            placeholder="trending, popular, premium"
            {...register("tags", {
              required: "Tags are required",
            })}
            className={errors.tags ? "border-red-500" : ""}
          />
          {errors.tags && (
            <p className="text-red-500 text-sm mt-1">
              {errors.tags.message}
            </p>
          )}
          <p className="text-sm text-muted-foreground mt-1">
            Separate tags with commas
          </p>
        </div>

        {/* Service Type */}
        <div>
          <label className="block text-sm font-medium mb-2">Service Type</label>
          <div className="flex flex-col space-y-2">
            {serviceTypesData?.data?.map((serviceType: any) => (
              <label
                key={serviceType.id}
                className="flex items-center space-x-2"
              >
                <input
                  type="checkbox"
                  value={serviceType.id}
                  {...register("serviceType", {
                    required: "At least one service type is required",
                  })}
                />
                <span>{serviceType.name}</span>
              </label>
            ))}
          </div>
          {errors.serviceType && (
            <p className="text-red-500 text-sm mt-1">
              {errors.serviceType.message}
            </p>
          )}
        </div>

        {/* Specialists */}
        <div>
          <label className="block text-sm font-medium mb-3">
            Assign Specialist
          </label>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {specialistsData?.data?.map((specialist: any) => (
              <div
                key={specialist.id}
                onClick={() => toggleSpecialist(specialist.id)}
                className={`cursor-pointer border rounded-xl p-4 text-center transition ${
                  selectedSpecialists.includes(specialist.id)
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                }`}
              >
                <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-2">
                  <span className="font-medium text-gray-600">
                    {specialist.firstName?.charAt(0)}
                    {specialist.lastName?.charAt(0)}
                  </span>
                </div>
                <p className="font-medium">
                  {specialist.firstName} {specialist.lastName}
                </p>
                <p className="text-sm text-gray-500">{specialist.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            className="bg-gray-800 hover:bg-gray-900 text-white px-8"
            disabled={isCreating}
          >
            {isCreating ? "Saving..." : "Save"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              reset();
              setImagePreview(null);
              setSelectedFile(null);
              setSelectedSpecialists([]);
              setSelectedCategory("");
            }}
            disabled={isCreating}
          >
            Cancel
          </Button>
        </div>
      </form>
    </section>
  );
}