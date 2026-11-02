"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState } from "react";
import Logo from "@/assets/logo.png";
import Image from "next/image";

interface ResetPasswordFormData {
  email: string;
}

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResetPasswordFormData>();

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Log data to console
      console.log("Reset password request:", data);

      // Show success toast
      toast.success("Reset instructions sent to your email!");

      // Reset form
      reset();
    } catch (error) {
      // Show error toast
      toast.error("Failed to send reset instructions. Please try again.");
      console.error("Reset password error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6">
            <Image
              src={Logo}
              alt="logo"
              width={500}
              height={500}
              className="h-[58px] w-[160px]"
            />
          </div>

          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Reset Your Password
          </h1>

          <p className="text-gray-600 text-sm">
            Enter your email address to receive instructions to reset your
            password.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <div>
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700 mb-2 block"
            >
              Email address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="szcbfingsfcfs@gmail.com"
              className="w-full"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Send Code Button */}
          <Button
            type="submit"
            className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Code"}
          </Button>
        </form>
      </div>
    </div>
  );
}
