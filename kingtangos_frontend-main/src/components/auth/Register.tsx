"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SignupFormData, signupSchema } from "@/lib/validations/auth";
import { useRegisterMutation } from "@/redux/api/authApi";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Logo from "@/assets/logo.png";
import SignupVerifyModal from "./signup-email-verify-modal";

// Define the user data type for the verification modal
export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [userData, setUserData] = useState<UserData | undefined>(undefined);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
    reset,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Watch password field for real-time validation feedback
  const passwordValue = watch("password");

  const [registration, { isLoading }] = useRegisterMutation();
  const router = useRouter();

  const onSubmit = async (data: SignupFormData) => {
    const { firstName, lastName, email, password } = data;
    const name = `${firstName} ${lastName}`.trim();
    const registrationData = { name, email, password };

    try {
      const response = await registration(registrationData).unwrap();
      toast.success(response.message || "Registration successful!");
      
      // Store the user data and email for OTP verification
      const userData: UserData = {
        firstName,
        lastName,
        email,
        password
      };
      setUserData(userData);
      setRegisteredEmail(email);
      setShowVerifyModal(true);
      
      // Optional: Reset form after successful registration
      reset();
      
    } catch (error: unknown) {
      console.error("Registration error:", error);
      
      if (error && typeof error === "object" && "data" in error) {
        const errorData = error.data as { 
          message?: string;
          errors?: Record<string, string[]>;
        };
        
        // Handle field-specific errors
        if (errorData.errors) {
          Object.entries(errorData.errors).forEach(([field, messages]) => {
            if (field in data) {
              setError(field as keyof SignupFormData, {
                type: "server",
                message: messages[0],
              });
            }
          });
        }
        
        // Show general error message
        toast.error(errorData.message || "Registration failed. Please try again.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleVerificationSuccess = () => {
    // This will be called when verification is successful
    setShowVerifyModal(false);
    setUserData(undefined); // Clear user data after successful verification
    toast.success("Email verified successfully! Welcome aboard! 🎉");
    
    // Redirect to login page after successful verification
    setTimeout(() => {
      router.push("/login");
    }, 1500);
  };

  const handleVerificationClose = () => {
    setShowVerifyModal(false);
    setUserData(undefined); // Clear user data when modal closes
  };

  // const handleGoogleSignup = () => {
  //   toast.info("Google signup will be available soon!");
  // };

  // Loading spinner component
  const LoadingSpinner = ({ size = "sm" }: { size?: "sm" | "md" | "lg" }) => (
    <div
      className={`animate-spin rounded-full border-2 border-gray-300 border-t-white ${
        size === "sm" ? "h-4 w-4" : size === "md" ? "h-6 w-6" : "h-8 w-8"
      }`}
    />
  );

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: "" };
    
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    
    const labels = ["", "Weak", "Fair", "Good", "Strong"];
    return { strength, label: labels[strength] };
  };

  const passwordStrength = getPasswordStrength(passwordValue);

  return (
    <>
      <div className="flex justify-center items-center min-h-screen p-4 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md bg-white rounded-lg shadow-sm border border-gray-200 p-8"
        >
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

            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Create Your Account
            </h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="firstName"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  First Name
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  {...register("firstName")}
                  className={errors.firstName ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="lastName"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  {...register("lastName")}
                  className={errors.lastName ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

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
                placeholder="example@example.com"
                {...register("email")}
                className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className={errors.password ? "border-red-500 focus-visible:ring-red-500 pr-10" : "pr-10"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {passwordValue && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Password strength:</span>
                    <span className={`text-xs font-medium ${
                      passwordStrength.strength <= 2 ? "text-red-500" :
                      passwordStrength.strength === 3 ? "text-yellow-500" : "text-green-500"
                    }`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        passwordStrength.strength <= 2 ? "bg-red-500" :
                        passwordStrength.strength === 3 ? "bg-yellow-500" : "bg-green-500"
                      }`}
                      style={{ width: `${(passwordStrength.strength / 4) * 100}%` }}
                    />
                  </div>
                </div>
              )}
              
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                  className={errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500 pr-10" : "pr-10"}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2.5 px-4 rounded-md transition duration-200 font-medium flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Creating Account...</span>
                </>
              ) : (
                "Create Account"
              )}
            </Button>

            {/* Divider */}
            {/* <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or continue with</span>
              </div>
            </div>*/}

            {/* Google Sign Up */}
            {/* <Button
              type="button"
              variant="outline"
              className="w-full py-2.5 border-gray-300 bg-white hover:bg-gray-50 flex items-center justify-center gap-3 font-normal"
              onClick={handleGoogleSignup}
              disabled={isLoading}
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <FcGoogle className="h-5 w-5" />
                  <span className="text-gray-700">Sign up with Google</span>
                </>
              )}
            </Button> */}

            {/* Login Link */}
            {/*
            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
            */}
          </form>
        </motion.div>
      </div>

      {/* Verification Modal */}
      <SignupVerifyModal
        isOpen={showVerifyModal}
        onClose={handleVerificationClose}
        email={registeredEmail}
        userData={userData}
        onVerificationSuccess={handleVerificationSuccess}
      />
    </>
  );
}

export default SignupForm;