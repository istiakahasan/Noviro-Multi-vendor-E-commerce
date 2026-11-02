/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGetMeQuery } from "@/redux/api/authApi"
import { useCreateSpecialistMutation } from "@/redux/api/specialistApi/specialistApi"
import { useGetAllServiceTypeQuery } from "@/redux/api/serviceTypeApi/serviceTypeApi"
import { useRouter } from "next/navigation"

interface ServiceType {
  id: string
  name: string
  createdAt: string
  updatedAt: string
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
  price: string
  available?: boolean
  rating?: string
}

export function AddSpecialistForm() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<SpecialistFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNum: "",
      title: "",
      bio: "",
      experience: "",
      specialistTime: "",
      gender: "",
      serviceTypeId: "",
      price: "",
      available: true,
      rating: "0",
    },
  })
  const router = useRouter();

  // RTK Query hooks
  const { data: userData, isLoading: userLoading } = useGetMeQuery({})
  const [createSpecialist, { isLoading: isCreating }] = useCreateSpecialistMutation()
  
  // Use the service types query hook
  const { 
    data: serviceTypesResponse, 
    isLoading: isLoadingServiceTypes,
    error: serviceTypesError 
  } = useGetAllServiceTypeQuery({})

  // Extract service types from the response
  const serviceTypes: ServiceType[] = serviceTypesResponse?.data || []

  // Get store ID from user data
  const storeId = userData?.data?.stores?.id

  const onSubmit = async (data: SpecialistFormData) => {
    try {
      if (!storeId) {
        toast.error("Store not found", {
          description: "Please make sure you have a store setup.",
        })
        return
      }

      if (!data.serviceTypeId) {
        toast.error("Service Type is required", {
          description: "Please select a valid service type.",
        })
        return
      }

      if (!data.gender) {
        toast.error("Gender is required", {
          description: "Please select a gender.",
        })
        return
      }

      if (!data.specialistTime) {
        toast.error("Specialist Time is required", {
          description: "Please enter specialist availability time.",
        })
        return
      }

      // Validate that the selected service type exists
      const selectedServiceType = serviceTypes.find(st => st.id === data.serviceTypeId)
      if (!selectedServiceType) {
        toast.error("Invalid Service Type", {
          description: "Please select a valid service type from the list.",
        })
        return
      }

      // Create the specialist data object matching the backend expectations
      const specialistData = {
        storeId: storeId,
        serviceTypeId: data.serviceTypeId,
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
      }

      console.log("Submitting specialist data:", specialistData)

      // Call the mutation with the JSON data directly
      await createSpecialist(specialistData).unwrap()

      toast.success("Specialist saved successfully!", {
        description: "Your specialist has been added to the system.",
      })

      reset()
      router.push("/seller-dashboard/specialist");
    } catch (error: any) {
      console.error("Form submission error:", error)
      
      if (error.data) {
        console.error("Error response data:", error.data)
        console.error("Error messages:", error.data.errorMessages)
        
        // Handle specific error cases
        if (error.data.message?.includes("Foreign key constraint failed")) {
          toast.error("Invalid Service Type", {
            description: "The selected service type does not exist. Please choose a valid service type.",
          })
          return
        }
      }
      
      toast.error("Failed to save specialist", {
        description: error.data?.message || "Please check your input and try again.",
      })
    }
  }

  const handleGenderChange = (value: string) => {
    setValue("gender", value)
  }

  const handleServiceTypeChange = (value: string) => {
    setValue("serviceTypeId", value)
  }

  // Show error if service types failed to load
  if (serviceTypesError) {
    return (
      <div className="max-w-6xl mx-auto py-12 text-center">
        <p className="text-red-500">
          Failed to load service types. Please try again later.
        </p>
      </div>
    )
  }

  if (userLoading) {
    return (
      <div className="max-w-6xl mx-auto py-12 text-center">
        Loading user data...
      </div>
    )
  }

  if (!storeId) {
    return (
      <div className="max-w-6xl mx-auto py-12 text-center">
        <p className="text-red-500">
          No store found. Please set up your store first.
        </p>
      </div>
    )
  }

  return (
    <section className="max-w-6xl mx-auto py-12 bg-gray-50 rounded-lg shadow p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Specialist First Name and Last Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">First Name *</label>
            <Input
              placeholder="John"
              {...register("firstName", {
                required: "First name is required",
              })}
              className={errors.firstName ? "border-red-500" : ""}
            />
            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Last Name *</label>
            <Input
              placeholder="Doe"
              {...register("lastName", {
                required: "Last name is required",
              })}
              className={errors.lastName ? "border-red-500" : ""}
            />
            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
          </div>
        </div>

        {/* Email and Phone Number */}
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

        {/* Title and Service Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <Input
              placeholder="Senior Specialist"
              {...register("title", {
                required: "Title is required",
              })}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Service Type *</label>
            <Select onValueChange={handleServiceTypeChange}>
              <SelectTrigger className={`w-full h-12 px-4 text-base ${errors.serviceTypeId ? "border-red-500" : ""}`}>
                <SelectValue placeholder={
                  isLoadingServiceTypes ? "Loading service types..." : "Select a service type"
                } />
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
            <p className="text-sm text-muted-foreground mt-1">
              {isLoadingServiceTypes 
                ? "Loading service types..." 
                : serviceTypes.length > 0 
                  ? `${serviceTypes.length} service types available` 
                  : "No service types found. Please create service types first."}
            </p>
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium mb-2">Bio *</label>
          <Textarea
            placeholder="Enter specialist bio"
            {...register("bio", {
              required: "Bio is required",
            })}
            className={`min-h-24 ${errors.bio ? "border-red-500" : ""}`}
          />
          {errors.bio && (
            <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>
          )}
        </div>

        {/* Experience and Specialist Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Experience</label>
            <Input 
              placeholder="10+ years" 
              {...register("experience")} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Specialist Time *</label>
            <Input 
              placeholder="Sat - Fri (10 AM - 11 PM)"
              {...register("specialistTime", {
                required: "Specialist time is required",
              })}
              className={errors.specialistTime ? "border-red-500" : ""}
            />
            {errors.specialistTime && <p className="text-red-500 text-sm mt-1">{errors.specialistTime.message}</p>}
          </div>
        </div>

        {/* Gender and Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Gender *</label>
            <Select onValueChange={handleGenderChange}>
              <SelectTrigger className={`w-full h-12 px-4 text-base ${errors.gender ? "border-red-500" : ""}`}>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && <p className="text-red-500 text-sm mt-1">Gender is required</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Price</label>
            <div className="flex gap-2">
              <div className="bg-blue-600 text-white rounded px-3 py-2 flex items-center font-semibold">€</div>
              <Input
                placeholder="123"
                type="number"
                step="0.01"
                {...register("price", {
                  min: { value: 0, message: "Price must be positive" }
                })}
                className={errors.price ? "border-red-500" : ""}
              />
            </div>
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <Button 
            type="submit" 
            className="bg-gray-800 hover:bg-gray-900 text-white px-8"
            disabled={isCreating || serviceTypes.length === 0 || isLoadingServiceTypes}
          >
            {isCreating ? "Saving..." : "Save"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              reset()
            }}
            disabled={isCreating}
          >
            Cancel
          </Button>
        </div>

        {serviceTypes.length === 0 && !isLoadingServiceTypes && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm">
              <strong>No service types available.</strong> You need to create service types before adding specialists.
            </p>
          </div>
        )}
      </form>
    </section>
  )
}