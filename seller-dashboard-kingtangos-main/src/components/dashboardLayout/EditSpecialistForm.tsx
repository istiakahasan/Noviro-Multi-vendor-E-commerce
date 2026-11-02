/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Cloud } from "lucide-react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { useGetMeQuery } from "@/redux/api/authApi"
import { useGetSingleSpecialistByIdQuery, useUpdateSpecialistMutation} from "@/redux/api/specialistApi/specialistApi"
import { useGetAllServiceTypeQuery } from "@/redux/api/serviceTypeApi/serviceTypeApi"
import { useRouter } from "next/navigation"

interface ServiceType {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

interface Specialist {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNum: string
  title: string
  bio: string
  experience: string
  specialistTime: string
  gender: string
  serviceTypeId: string
  available?: boolean
  rating?: string
  image?: string
  storeId?: string
  status?: string
}

interface EditSpecialistFormProps {
  specialistId: string
}

interface SpecialistFormData {
  firstName: string
  lastName: string
  email: string
  phoneNum: string
  title: string
  bio: string
  experience: string
  specialistTime: string
  gender: string
  serviceTypeId: string
  available?: boolean
  rating?: string
}

export function EditSpecialistForm({ specialistId }: EditSpecialistFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<SpecialistFormData>()

  const router = useRouter()
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // RTK Query hooks
  const { data: userData } = useGetMeQuery({})
  const [updateSpecialist, { isLoading: isUpdating }] = useUpdateSpecialistMutation()
  
  // Fetch specialist data by ID
  const { 
    data: specialistResponse, 
    isLoading: isLoadingSpecialist,
    error: specialistError 
  } = useGetSingleSpecialistByIdQuery(specialistId)

  const { 
    data: serviceTypesResponse, 
    isLoading: isLoadingServiceTypes,
    error: serviceTypesError 
  } = useGetAllServiceTypeQuery({})

  const specialist: Specialist | undefined = specialistResponse?.data
  const serviceTypes: ServiceType[] = serviceTypesResponse?.data || []
  const storeId = userData?.data?.stores?.id

  // Initialize form with specialist data when it's loaded
  useEffect(() => {
    if (specialist) {
      reset({
        firstName: specialist.firstName || "",
        lastName: specialist.lastName || "",
        email: specialist.email || "",
        phoneNum: specialist.phoneNum || "",
        title: specialist.title || "",
        bio: specialist.bio || "",
        experience: specialist.experience || "",
        specialistTime: specialist.specialistTime || "",
        gender: specialist.gender || "",
        serviceTypeId: specialist.serviceTypeId || "",
        available: specialist.available !== undefined ? specialist.available : true,
        rating: specialist.rating || "0",
      })
      setImagePreview(specialist.image || null)
    }
  }, [specialist, reset])

  const onSubmit = async (data: SpecialistFormData) => {
    try {
      if (!storeId) {
        toast.error("Store not found")
        return
      }

      if (!specialist) {
        toast.error("Specialist data not loaded")
        return
      }

      // Create the update data object with only valid fields
      const updateData = {
        firstName: data.firstName,
        lastName: data.lastName,
        title: data.title,
        email: data.email,
        gender: data.gender,
        bio: data.bio,
        available: data.available !== undefined ? data.available : true,
        rating: data.rating || "0",
        experience: data.experience,
        status: "Active",
        specialistTime: data.specialistTime,
        phoneNum: data.phoneNum,
        // Use relation connection for serviceType
        serviceType: {
          connect: {
            id: data.serviceTypeId
          }
        }
      }

      console.log("Updating specialist with data:", updateData)

      // Update specialist
      await updateSpecialist({ 
        id: specialistId, 
        data: updateData 
      }).unwrap()

      toast.success("Specialist updated successfully!")
      router.push("/seller-dashboard/specialist")
      
    } catch (error: any) {
      console.error("Update error:", error)
      
      // Handle specific error cases
      if (error.data?.errorMessages) {
        const errorMessage = error.data.errorMessages[0]?.message;
        if (errorMessage?.includes("serviceTypeId")) {
          toast.error("Update failed", {
            description: "Invalid service type selection.",
          });
        } else if (errorMessage?.includes("storeId")) {
          toast.error("Update failed", {
            description: "Cannot update store information for specialist.",
          });
        } else if (errorMessage?.includes("price")) {
          toast.error("Update failed", {
            description: "Price field is not supported for specialists.",
          });
        } else {
          toast.error("Failed to update specialist", {
            description: error.data.message || "Please check your input and try again.",
          });
        }
      } else {
        toast.error("Failed to update specialist", {
          description: error.data?.message || "Please try again",
        });
      }
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image too large (max 2MB)")
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGenderChange = (value: string) => {
    setValue("gender", value)
  }

  const handleServiceTypeChange = (value: string) => {
    setValue("serviceTypeId", value)
  }

  // Show loading states
  if (isLoadingSpecialist) {
    return (
      <div className="max-w-6xl mx-auto py-12 text-center">
        <div className="text-lg">Loading specialist data...</div>
      </div>
    )
  }

  if (specialistError) {
    return (
      <div className="max-w-6xl mx-auto py-12 text-center">
        <p className="text-red-500 text-lg">Failed to load specialist data</p>
        <Button 
          onClick={() => router.push("/seller-dashboard/specialist")}
          className="mt-4"
        >
          Back to Specialists
        </Button>
      </div>
    )
  }

  if (!specialist) {
    return (
      <div className="max-w-6xl mx-auto py-12 text-center">
        <p className="text-red-500 text-lg">Specialist not found</p>
        <Button 
          onClick={() => router.push("/seller-dashboard/specialist")}
          className="mt-4"
        >
          Back to Specialists
        </Button>
      </div>
    )
  }

  if (serviceTypesError) {
    return (
      <div className="max-w-6xl mx-auto py-12 text-center">
        <p className="text-red-500">Failed to load service types</p>
      </div>
    )
  }

  if (!storeId) {
    return (
      <div className="max-w-6xl mx-auto py-12 text-center">
        <p className="text-red-500">No store found</p>
      </div>
    )
  }

  return (
    <section className="max-w-6xl mx-auto py-12">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Specialist</h1>
        <p className="text-muted-foreground">Update specialist information</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Image Upload Section */}
        <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 bg-blue-50 text-center">
          <label htmlFor="specialistImage" className="cursor-pointer">
            {imagePreview ? (
              <div className="space-y-2">
                <Image
                  src={imagePreview || "/placeholder.svg"}
                  alt="Specialist preview"
                  width={128}
                  height={128}
                  className="w-32 h-32 object-cover mx-auto rounded"
                />
                <p className="text-sm text-muted-foreground">Click to change image</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Cloud className="w-12 h-12 mx-auto text-gray-400" />
                <p className="font-medium">Upload Specialist Image</p>
                <p className="text-sm text-muted-foreground">Image Size: Max 2 MB</p>
              </div>
            )}
          </label>
          <input
            id="specialistImage"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
          <p className="text-sm text-muted-foreground mt-2">
            Note: Image upload functionality will be implemented separately
          </p>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">First Name *</label>
            <Input
              placeholder="John"
              {...register("firstName", { required: "First name is required" })}
              className={errors.firstName ? "border-red-500" : ""}
            />
            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Last Name *</label>
            <Input
              placeholder="Doe"
              {...register("lastName", { required: "Last name is required" })}
              className={errors.lastName ? "border-red-500" : ""}
            />
            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Email *</label>
            <Input
              type="email"
              placeholder="john.doe@example.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone Number *</label>
            <Input
              type="tel"
              placeholder="+1 (555) 123-4567"
              {...register("phoneNum", {
                required: "Phone number is required",
                pattern: {
                  value: /^\+?[\d\s\-\(\)]+$/,
                  message: "Please enter a valid phone number"
                }
              })}
              className={errors.phoneNum ? "border-red-500" : ""}
            />
            {errors.phoneNum && <p className="text-red-500 text-sm mt-1">{errors.phoneNum.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <Input
              placeholder="Senior Specialist"
              {...register("title", { required: "Title is required" })}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Service Type *</label>
            <Select 
              onValueChange={handleServiceTypeChange} 
              defaultValue={specialist.serviceTypeId}
            >
              <SelectTrigger className={errors.serviceTypeId ? "border-red-500 w-full" : "w-full"}>
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {isLoadingServiceTypes ? (
                  <SelectItem value="loading" disabled>Loading service types...</SelectItem>
                ) : serviceTypes.length === 0 ? (
                  <SelectItem value="empty" disabled>No service types available</SelectItem>
                ) : (
                  serviceTypes.map((serviceType) => (
                    <SelectItem key={serviceType.id} value={serviceType.id}>
                      {serviceType.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {errors.serviceTypeId && <p className="text-red-500 text-sm mt-1">Service type is required</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Bio *</label>
          <Textarea
            placeholder="Enter specialist bio"
            {...register("bio", { required: "Bio is required" })}
            className={`min-h-24 ${errors.bio ? "border-red-500" : ""}`}
          />
          {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Experience</label>
            <Input placeholder="10+ years" {...register("experience")} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Specialist Time *</label>
            <Input 
              placeholder="Sat - Fri (10 AM - 11 PM)"
              {...register("specialistTime", { required: "Specialist time is required" })}
              className={errors.specialistTime ? "border-red-500" : ""}
            />
            {errors.specialistTime && <p className="text-red-500 text-sm mt-1">{errors.specialistTime.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Gender *</label>
            <Select 
              onValueChange={handleGenderChange} 
              defaultValue={specialist.gender}
            >
              <SelectTrigger className={errors.gender ? "border-red-500 w-full" : "w-full"}>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && <p className="text-red-500 text-sm mt-1">Gender is required</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Rating</label>
            <Input
              placeholder="0"
              type="number"
              step="0.1"
              min="0"
              max="5"
              {...register("rating")}
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button 
            type="submit" 
            className="bg-gray-800 hover:bg-gray-900 text-white px-8"
            disabled={isUpdating || isLoadingServiceTypes}
          >
            {isUpdating ? "Updating..." : "Update Specialist"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/seller-dashboard/specialist")}
            disabled={isUpdating}
          >
            Cancel
          </Button>
        </div>

        {serviceTypes.length === 0 && !isLoadingServiceTypes && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm">
              <strong>No service types available.</strong> You need to create service types before updating specialists.
            </p>
          </div>
        )}
      </form>
    </section>
  )
}