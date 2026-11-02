/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, Clock, User } from "lucide-react";
import { toast } from "sonner";
import { useCreateBookingPaymentMutation } from "@/redux/api/payment/paymentApi";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea"; // Import Textarea component

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
  serviceId: string;
  specialistId: string;
  providerId: string;
  isOwner: boolean;
  consultationName: string;
  consultationPrice: number;
  selectedDate: string;
  selectedTime: string;
  profilePic: string;
  tags: string;
  slotDuration: number;
}

interface ServicePayFormProps {
  bookingData: BookingData;
}

export function ServicePayForm({ bookingData }: ServicePayFormProps) {
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
    console.log("=== SERVICE PAY FORM DEBUG ===");
    console.log("Booking data received:", bookingData);
    console.log("Selected date:", bookingData.selectedDate);
    console.log("Selected time:", bookingData.selectedTime);
    console.log("Specialist ID:", bookingData.specialistId);
    console.log("Provider ID:", bookingData.providerId);
    console.log("Is Owner:", bookingData.isOwner);
  }, [bookingData]);

  // Format ISO time for display
  const formatTimeForDisplay = (timeString: string): string => {
    try {
      const date = new Date(timeString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      }
      return timeString;
    } catch {
      return timeString;
    }
  };

  const onSubmitForm = async (formData: PaymentFormData) => {
    try {
      console.log("=== SUBMITTING SERVICE BOOKING ===");
      console.log("Form data:", formData);
      console.log("Booking data:", bookingData);

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

      // Create start time from ISO string
      const startTimeDate = new Date(bookingData.selectedTime);

      if (isNaN(startTimeDate.getTime())) {
        toast.error(
          "Invalid time format. Please go back and select a time again.",
        );
        console.error("Invalid time from ISO:", bookingData.selectedTime);
        return;
      }

      // Set the date part to match the selected date
      startTimeDate.setFullYear(year, month - 1, day);

      // Calculate end time based on slot duration
      const duration = bookingData.slotDuration || 30; // Default to 30 minutes
      const endTimeDate = new Date(startTimeDate.getTime() + duration * 60000);

      // Format to ISO strings for the API
      const bookingDateISO = new Date(
        Date.UTC(year, month - 1, day),
      ).toISOString();
      const startTimeISO = startTimeDate.toISOString();
      const endTimeISO = endTimeDate.toISOString();

      console.log("📅 Time calculations:", {
        selectedDate: bookingData.selectedDate,
        selectedTime: bookingData.selectedTime,
        startTimeDate: startTimeDate.toISOString(),
        endTimeDate: endTimeDate.toISOString(),
        duration: duration,
        localStartTime: startTimeDate.toLocaleString(),
        localEndTime: endTimeDate.toLocaleString(),
      });

      // Generate channel name for meeting
      const channelName = generateRandomChannelName();

      // Generate meeting link (use window location if available, otherwise use a placeholder)
      const baseUrl =
        typeof window !== "undefined" ? window.location.origin : "";
      const meetingLink = `${baseUrl}/meeting/${channelName}?start=${startTimeISO}`;

      console.log("🔗 Generated meeting link:", meetingLink);
      console.log("📱 Channel name:", channelName);

      // Handle specialistId based on isOwner condition
      const specialistIdValue = bookingData.isOwner
        ? null
        : bookingData.specialistId;

      console.log("🔧 Specialist ID logic:", {
        isOwner: bookingData.isOwner,
        originalSpecialistId: bookingData.specialistId,
        sendingSpecialistId: specialistIdValue,
      });

      // Prepare API payload matching the backend format
      const bookingPaymentPayload = {
        consultationId: null,
        serviceId: bookingData.serviceId,
        specialistId: specialistIdValue,
        providerId: bookingData.providerId,
        isOwner: bookingData.isOwner,
        bookingDate: bookingDateISO,
        startTime: startTimeISO,
        endTime: endTimeISO,
        paymentMethod: "stripe",
        price: bookingData.consultationPrice,
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
        meetingLink: meetingLink, // Add the generated meeting link here
        channelName: channelName, // Optionally send channel name if backend needs it
        notes: formData.notes || "", // Add the notes field from the form
      };

      console.log(
        "📦 API Payload:",
        JSON.stringify(bookingPaymentPayload, null, 2),
      );

      // Call the booking payment API
      const response = await createBookingPayment(
        bookingPaymentPayload,
      ).unwrap();

      console.log("✅ Payment Response:", response);

      // Handle different response structures
      if (response.success) {
        const paymentUrl =
          response.data?.checkoutUrl ||
          response.data?.paymentUrl ||
          response.data?.url ||
          response.paymentUrl;

        if (paymentUrl) {
          toast.success(
            "Booking created successfully! Redirecting to payment...",
          );

          // Show meeting link info in toast before redirecting
          toast.info(
            "Your meeting link has been generated and will be sent to your email after payment.",
            {
              duration: 5000,
            },
          );

          window.location.href = paymentUrl;
        } else {
          toast.error("No payment URL received from server.");
          console.error("Missing payment URL in response:", response);
        }
      } else {
        toast.error(
          response.message || "Failed to create booking. Please try again.",
        );
      }
    } catch (error: any) {
      console.error("❌ Error submitting booking:", error);

      // Log full error details
      if (error?.data) {
        console.error("Error details:", error.data);
        console.error("Error messages:", error.data?.errorMessages);
      }

      if (error?.data?.message?.includes("outside service operating hours")) {
        toast.error(
          "The selected time is outside of the specialist's operating hours. Please choose a different time.",
        );
      } else if (
        error?.data?.errorMessages?.[0]?.message?.includes("Invalid Date")
      ) {
        toast.error(
          "Date format error. Please try selecting the date and time again.",
        );
      } else if (error?.status === 400) {
        toast.error(
          error?.data?.message ||
            "Bad request. Please check your booking details and try again.",
        );
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
  const formatDisplayDate = () => {
    try {
      const [year, month, day] = bookingData.selectedDate
        .split("-")
        .map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      });
    } catch {
      return bookingData.selectedDate;
    }
  };

  // Format time for display
  const displayTime = formatTimeForDisplay(bookingData.selectedTime);

  const isLoading = isSubmitting || isPaymentLoading;

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Billing Information Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 py-4 px-3 lg:p-6">
            <div className="flex justify-between items-center mb-8">
              <h1 className="lg:text-2xl text-lg font-bold text-gray-900">
                Billing Information
              </h1>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="lg:text-2xl text6-xl font-bold text-primary">
                  €{totalAmount.toFixed(2)}
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
                  <p className="text-sm text-red-500">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Phone and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <p className="text-sm text-red-500">
                      {errors.phone.message}
                    </p>
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
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
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
                  <p className="text-sm text-red-500">
                    {errors.address.message}
                  </p>
                )}
              </div>

              {/* Country/Region */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <p className="text-sm text-red-500">
                      {errors.country.message}
                    </p>
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
                    <p className="text-sm text-red-500">
                      {errors.state.message}
                    </p>
                  )}
                </div>
              </div>

              {/* City and Postal Code */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="city"
                    className="text-sm font-medium text-gray-700"
                  >
                    City *
                  </Label>
                  <Input
                    id="city"
                    {...register("city")}
                    placeholder="City"
                    className={`py-5 ${errors.city ? "border-red-500" : ""}`}
                  />
                  {errors.city && (
                    <p className="text-sm text-red-500">
                      {errors.city.message}
                    </p>
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
                <Label
                  htmlFor="notes"
                  className="text-sm font-medium text-gray-700"
                >
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
                    <p className="text-sm text-red-500">
                      {errors.notes.message}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500">
                      Maximum 500 characters
                    </p>
                  )}
                </div>
              </div>

              {/* Security Notice and Submit Button */}
              <div className="pt-6 border-t border-gray-200">
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    You are booking{" "}
                    <strong>{bookingData.consultationName}</strong>
                    on <strong>{formatDisplayDate()}</strong>
                    at <strong>{displayTime}</strong>. Total amount:{" "}
                    <strong>€{bookingData.consultationPrice.toFixed(2)}</strong>
                  </p>
                </div>

                <p className="text-sm text-gray-500 mb-4">
                  Your billing information is securely stored and encrypted. A
                  meeting link will be generated and sent to your email upon
                  successful booking. Any notes you provide will be shared with
                  the specialist.
                </p>

                <Button
                  type="submit"
                  className="w-full py-6 text-lg font-semibold bg-primary hover:bg-primary/90 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing Booking...
                    </>
                  ) : (
                    `Pay €${totalAmount.toFixed(2)} & Book Appointment`
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            {/* Order Summary Card */}
            <div className=" py-4 px-3 lg:p-6 bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
              <h3 className="text-lg font-semibold text-primary mb-6">
                Order Summary
              </h3>

              {/* Service Details */}
              <div className="flex items-start gap-4 mb-6 pb-6 border-b border-slate-200">
                {bookingData.profilePic && (
                  <div className="relative flex-shrink-0">
                    <Image
                      src={bookingData.profilePic}
                      alt={bookingData.consultationName}
                      width={500}
                      height={500}
                      className="rounded-lg w-16 h-16 object-cover"
                    />
                  </div>
                )}
                <div>
                  <h4 className="font-medium text-slate-900">
                    {bookingData.consultationName}
                  </h4>
                  <p className="text-sm text-slate-500 mt-1">
                    {bookingData.tags}
                  </p>
                  <p className="text-primary font-semibold mt-2">
                    €{bookingData.consultationPrice.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Appointment Details */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-500">Date</p>
                    <p className="font-medium">{formatDisplayDate()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-500">Time</p>
                    <p className="font-medium text-blue-600">{displayTime}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-500">Service Type</p>
                    <p className="font-medium text-orange-600">
                      {bookingData.tags}
                    </p>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Service Fee</span>
                  <span className="font-medium">
                    €{bookingData.consultationPrice.toFixed(2)}
                  </span>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-slate-900">
                      Total
                    </span>
                    <span className="lg:text-2xl text-lg font-bold text-primary">
                      €{bookingData.consultationPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms */}
            <p className="text-xs text-slate-500 text-center mt-4">
              By clicking the payment button, you agree to our{" "}
              <a href="/terms" className="text-primary hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServicePayForm;