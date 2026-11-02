/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCreateBookingPaymentMutation } from "@/redux/api/payment/paymentApi";
import { Textarea } from "@/components/ui/textarea";

// Define Zod schema for validation
const paymentFormSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  country: z.string().min(1, "Please insert country"),
  state: z.string().min(1, "Please insert state"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  postalCode: z.string().min(3, "Postal code must be at least 3 characters"),
  notes: z.string().max(500, "Notes cannot exceed 500 characters").optional(), // Added notes field
});

type PaymentFormData = z.infer<typeof paymentFormSchema>;

interface BookingData {
  consultationId: string;
  specialistId: string;
  providerId: string;
  isOwner: boolean;
  consultationName: string;
  consultationPrice: number;
  selectedDate: string; // YYYY-MM-DD format
  selectedTime: string; // HH:MM format (e.g., "10:00")
  profilePic: string;
  tags: string;
}

interface ConsultationPayFormProps {
  bookingData: BookingData;
}

export function ConsultationPayForm({ bookingData }: ConsultationPayFormProps) {
  const [createBookingPayment, { isLoading: isPaymentLoading }] =
    useCreateBookingPaymentMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      country: "",
      state: "",
      address: "",
      city: "",
      postalCode: "",
      notes: "", // Added default value for notes
    },
  });

  // Function to generate random channel name
  function generateRandomChannelName(): string {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    const getPart = (length: number) =>
      Array.from(
        { length },
        () => chars[Math.floor(Math.random() * chars.length)],
      ).join("");

    return `${getPart(4)}-${getPart(5)}-${getPart(3)}`;
  }

  // Debug effect
  useEffect(() => {
    console.log("=== CONSULTATION PAY FORM DEBUG ===");
    console.log("Booking data received:", bookingData);
    console.log("Selected date:", bookingData.selectedDate);
    console.log("Selected time:", bookingData.selectedTime);
    console.log("Specialist ID:", bookingData.specialistId);
    console.log("Provider ID:", bookingData.providerId);
    console.log("Is Owner:", bookingData.isOwner);
  }, [bookingData]);

  // In your ConsultationPayForm component, update the onSubmitForm function:

const onSubmitForm = async (formData: PaymentFormData) => {
  try {
    console.log("=== SUBMITTING FORM ===");
    console.log("Form data:", formData);
    console.log("Booking data:", bookingData);

    // Validate all required fields
    if (!bookingData.consultationId) {
      toast.error("Missing consultation ID. Please go back and try again.");
      return;
    }

    if (!bookingData.providerId) {
      toast.error("Missing provider ID. Please go back and try again.");
      return;
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(bookingData.selectedDate)) {
      toast.error(
        "Invalid date format. Please go back and select a date again.",
      );
      console.error("Invalid date format:", bookingData.selectedDate);
      return;
    }

    // Parse the date
    const [year, month, day] = bookingData.selectedDate
      .split("-")
      .map(Number);
    const date = new Date(year, month - 1, day);

    if (isNaN(date.getTime())) {
      toast.error(
        "Invalid appointment date. Please go back and select a valid date.",
      );
      console.error("Invalid date:", bookingData.selectedDate);
      return;
    }

    // Parse time from format like "10:00 AM"
    let hours = 0;
    let minutes = 0;

    const timeMatch = bookingData.selectedTime.match(
      /(\d+):(\d+)\s*(AM|PM)/i,
    );
    if (timeMatch) {
      hours = parseInt(timeMatch[1]);
      minutes = parseInt(timeMatch[2]);
      const period = timeMatch[3].toUpperCase();

      // Convert 12-hour format to 24-hour format
      if (period === "PM" && hours < 12) {
        hours += 12;
      }
      if (period === "AM" && hours === 12) {
        hours = 0;
      }
    } else {
      // Try parsing as 24-hour format
      const [h, m] = bookingData.selectedTime.split(":").map(Number);
      if (!isNaN(h) && !isNaN(m)) {
        hours = h;
        minutes = m;
      } else {
        toast.error(
          "Invalid time format. Please go back and select a time again.",
        );
        console.error("Invalid time format:", bookingData.selectedTime);
        return;
      }
    }

    console.log("Parsed time:", {
      hours,
      minutes,
      original: bookingData.selectedTime,
    });

    // Create dates
    const startTimeDate = new Date(year, month - 1, day, hours, minutes);
    const endTimeDate = new Date(startTimeDate.getTime() + 45 * 60000); // 45 minutes (consultation slot duration)

    // Format to ISO strings
    const bookingDateISO = date.toISOString();
    const startTimeISO = startTimeDate.toISOString();
    const endTimeISO = endTimeDate.toISOString();

    console.log("Generated ISO dates:", {
      bookingDate: bookingDateISO,
      startTime: startTimeISO,
      endTime: endTimeISO,
      localStartTime: startTimeDate.toLocaleString(),
      localEndTime: endTimeDate.toLocaleString(),
    });

    // Generate channel name for meeting
    const channelName = generateRandomChannelName();

    // Generate meeting link
    const baseUrl =
      typeof window !== "undefined" ? window.location.origin : "";
    // const meetingLink = `${baseUrl}/meeting/${channelName}`;
    const meetingLink = `${baseUrl}/meeting/${channelName}?start=${startTimeISO}`;

    console.log("🔗 Generated meeting link:", meetingLink);
    console.log("📱 Channel name:", channelName);

    // CRITICAL: Handle specialistId based on isOwner condition
    // If isOwner is true, specialistId should be null
    // If isOwner is false, specialistId should be the actual specialistId
    const specialistIdValue = bookingData.isOwner
      ? null
      : bookingData.specialistId;

    console.log("🔧 Specialist ID logic:", {
      isOwner: bookingData.isOwner,
      originalSpecialistId: bookingData.specialistId,
      sendingSpecialistId: specialistIdValue,
    });

    // Prepare API payload - CORRECTED STRUCTURE
    const bookingPaymentPayload = {
      consultationId: bookingData.consultationId, // This is the main consultation/service ID
      specialistId: specialistIdValue, // This could be null if isOwner
      providerId: bookingData.providerId, // This is the provider's ID from availableProviders
      isOwner: bookingData.isOwner, // Boolean indicating if provider is owner
      bookingDate: bookingDateISO,
      startTime: startTimeISO,
      endTime: endTimeISO,
      paymentMethod: "stripe", // Default payment method
      patientInfo: {
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email || "",
        country: formData.country,
        state: formData.state,
        city: formData.city,
        postalCode: formData.postalCode,
        address: formData.address,
      },
      serviceName: bookingData.consultationName,
      tags: bookingData.tags,
      meetingLink: meetingLink,
      channelName: channelName,
      notes: formData.notes || "",
    };

    console.log(
      "📦 API Payload:",
      JSON.stringify(bookingPaymentPayload, null, 2),
    );

    // Validate the payload before sending
    if (!bookingPaymentPayload.consultationId) {
      toast.error("Missing consultation ID. Cannot proceed with booking.");
      return;
    }

    if (!bookingPaymentPayload.providerId) {
      toast.error("Missing provider ID. Cannot proceed with booking.");
      return;
    }

    if (!bookingPaymentPayload.specialistId && !bookingPaymentPayload.isOwner) {
      toast.error("Missing specialist information.");
      return;
    }

    // Call the booking payment API
    const response = await createBookingPayment(
      bookingPaymentPayload,
    ).unwrap();

    console.log("✅ Payment Response:", response);

    if (response.success && response.data?.checkoutUrl) {
      toast.success(
        "Booking created successfully! Redirecting to payment...",
      );

      // Redirect to Stripe payment URL
      window.location.href = response.data.checkoutUrl;
    } else {
      toast.error(
        response.message || "Failed to create booking. Please try again.",
      );
    }
  } catch (error: any) {
    console.error("❌ Error submitting booking:", error);

    // More detailed error logging
    if (error?.data) {
      console.error("Error details:", JSON.stringify(error.data, null, 2));
      
      if (error.data?.errorMessages) {
        error.data.errorMessages.forEach((err: any, index: number) => {
          console.error(`Error ${index + 1}:`, err.message);
        });
      }
    }

    if (error?.status === 400) {
      if (error?.data?.message?.includes("Invalid Date")) {
        toast.error(
          "Date format error. Please try selecting the date and time again.",
        );
      } else if (error?.data?.message?.includes("consultationId")) {
        toast.error("Invalid consultation ID. Please try again.");
      } else if (error?.data?.message?.includes("providerId")) {
        toast.error("Invalid provider ID. Please try again.");
      } else {
        toast.error(
          "Bad request. Please check your booking details and try again.",
        );
      }
    } else if (error?.data?.message) {
      toast.error(error.data.message);
    } else {
      toast.error("Failed to submit booking. Please try again.");
    }
  }
};

  // Calculate total amount
  const totalAmount = bookingData.consultationPrice;

  // Format date for display
  // const formatDisplayDate = () => {
  //   try {
  //     const [year, month, day] = bookingData.selectedDate.split('-').map(Number);
  //     const date = new Date(year, month - 1, day);
  //     return date.toLocaleDateString("en-US", {
  //       year: "numeric",
  //       month: "short",
  //       day: "numeric",
  //     });
  //   } catch (error) {
  //     return bookingData.selectedDate;
  //   }
  // };

  const formatDisplayDate = () => {
    try {
      const [year, month, day] = bookingData.selectedDate
        .split("-")
        .map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return bookingData.selectedDate;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Billing Information
        </h1>
        <div className="text-right">
          <p className="text-sm text-gray-600">Total Amount</p>
          <p className="text-2xl font-bold text-primary">
            ${totalAmount.toFixed(2)}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
        {/* Full Name */}
        <div className="space-y-2">
          <Label
            htmlFor="fullName"
            className="text-sm font-medium text-gray-700"
          >
            Full Name *
          </Label>
          <Input
            id="fullName"
            {...register("fullName")}
            placeholder="Insert your full name"
            className={`py-5 ${errors.fullName ? "border-red-500" : ""}`}
          />
          {errors.fullName && (
            <p className="text-sm text-red-500">{errors.fullName.message}</p>
          )}
        </div>

        {/* Phone and Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-2">
            <Label
              htmlFor="phone"
              className="text-sm font-medium text-gray-700"
            >
              Phone *
            </Label>
            <Input
              id="phone"
              {...register("phone")}
              type="tel"
              placeholder="+880 1567808747"
              className={`py-5 ${errors.phone ? "border-red-500" : ""}`}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email (Optional)
            </Label>
            <Input
              id="email"
              {...register("email")}
              type="email"
              placeholder="your.email@example.com"
              className={`py-5 ${errors.email ? "border-red-500" : ""}`}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label
            htmlFor="address"
            className="text-sm font-medium text-gray-700"
          >
            Address *
          </Label>
          <Input
            id="address"
            {...register("address")}
            placeholder="3891 Ranchview Dr. Richardson, California 62639"
            className={`py-5 ${errors.address ? "border-red-500" : ""}`}
          />
          {errors.address && (
            <p className="text-sm text-red-500">{errors.address.message}</p>
          )}
        </div>

        {/* Country/Region */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-2">
            <Label
              htmlFor="country"
              className="text-sm font-medium text-gray-700"
            >
              Country *
            </Label>
            <Input
              id="country"
              {...register("country")}
              placeholder="United States"
              className={`py-5 ${errors.country ? "border-red-500" : ""}`}
            />
            {errors.country && (
              <p className="text-sm text-red-500">{errors.country.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="state"
              className="text-sm font-medium text-gray-700"
            >
              State *
            </Label>
            <Input
              id="state"
              {...register("state")}
              placeholder="State"
              className={`py-5 ${errors.state ? "border-red-500" : ""}`}
            />
            {errors.state && (
              <p className="text-sm text-red-500">{errors.state.message}</p>
            )}
          </div>
        </div>

        {/* City and Postal Code */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-2">
            <Label htmlFor="city" className="text-sm font-medium text-gray-700">
              City *
            </Label>
            <Input
              id="city"
              {...register("city")}
              placeholder="City"
              className={`py-5 ${errors.city ? "border-red-500" : ""}`}
            />
            {errors.city && (
              <p className="text-sm text-red-500">{errors.city.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="postalCode"
              className="text-sm font-medium text-gray-700"
            >
              Postal Code *
            </Label>
            <Input
              id="postalCode"
              {...register("postalCode")}
              placeholder="ZIP Code"
              className={`py-5 ${errors.postalCode ? "border-red-500" : ""}`}
            />
            {errors.postalCode && (
              <p className="text-sm text-red-500">
                {errors.postalCode.message}
              </p>
            )}
          </div>
        </div>

        {/* Notes Field */}
        <div className="space-y-2">
          <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
            Additional Notes (Optional)
          </Label>
          <Textarea
            id="notes"
            {...register("notes")}
            placeholder="Any special requirements, medical history, or questions you'd like to share with the specialist..."
            className={`min-h-[120px] resize-none ${errors.notes ? "border-red-500" : ""}`}
          />
          <div className="flex justify-between items-center">
            {errors.notes ? (
              <p className="text-sm text-red-500">{errors.notes.message}</p>
            ) : (
              <p className="text-xs text-gray-500">Maximum 500 characters</p>
            )}
          </div>
        </div>

        {/* Security Notice */}
        <div className="pt-4 border-t border-gray-200">
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              You are booking a consultation with{" "}
              <strong>{bookingData.consultationName}</strong>
              on <strong>{formatDisplayDate()}</strong>
              at <strong>{bookingData.selectedTime}</strong>. Total:{" "}
              <strong>${bookingData.consultationPrice}</strong>
            </p>
          </div>

          <p className="text-sm text-gray-500 mb-4">
            Your billing information is securely stored and encrypted.
          </p>

          <Button
            type="submit"
            className="w-full py-6 text-lg font-semibold bg-black hover:bg-gray-800 text-white"
            disabled={isSubmitting || isPaymentLoading}
          >
            {isSubmitting || isPaymentLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Booking...
              </>
            ) : (
              `Pay $${totalAmount.toFixed(2)} & Book Appointment`
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
