/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { Checkbox } from "../ui/checkbox";
import { FcGoogle } from "react-icons/fc";
import Logo from "../../../public/Images/logo.svg";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import ForgotPasswordModal from "./ForgotPasswordModal";
import { useLoginUserMutation } from "@/lib/api/auth/authApi";

const signinSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

type SigninFormData = z.infer<typeof signinSchema>;

interface JwtPayload {
  role?: string;
}

function SigninFormInner() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [loginUser, { isLoading }] = useLoginUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
  });

  const onSubmit = async (data: SigninFormData) => {
    try {
      const response: any = await loginUser(data).unwrap();

      if (response?.success) {
        const accessToken = response.data.accessToken;
        localStorage.setItem("token", accessToken);
        toast.success("Logged in successfully!");

        const decoded = jwtDecode<JwtPayload>(accessToken);
        const role = decoded.role?.toLowerCase();
        reset();

        switch (role) {
          case "admin":
            router.push("/admin");
            break;
          case "employer":
            router.push("/employer");
            break;
          case "user":
          case "employee":
            router.push("/");
            break;
          default:
            router.push("/");
        }
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Invalid email or password!";
      toast.error(errorMessage);
      setError("root", { message: errorMessage });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-white rounded-lg shadow-sm p-8"
      >
        <div className="text-center mb-8">
          <Image
            src={Logo}
            alt="logo"
            width={160}
            height={58}
            className="h-[58px] w-[160px] object-contain mx-auto"
            priority
          />
          <h1 className="text-2xl font-semibold text-gray-900 mb-2 mt-4">
            Welcome Back
          </h1>
          <p className="text-gray-600">Login to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@gmail.com"
              {...register("email")}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password")}
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </Button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(v) => setRememberMe(Boolean(v))}
                disabled={isLoading}
              />
              <Label htmlFor="remember">Remember Me</Label>
            </div>
            <Button
              type="button"
              variant="link"
              className="text-red-500 p-0"
              onClick={() => setShowForgotPassword(true)}
            >
              Forgot password?
            </Button>
          </div>

          {errors.root && (
            <p className="text-red-500 text-center bg-red-50 py-2 rounded-md">
              {errors.root.message}
            </p>
          )}

          <Button
            type="submit"
            className="w-full bg-gray-900 text-white py-3 hover:bg-gray-800"
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        {/* <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">or with</span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full py-3 border-gray-300"
          disabled={isLoading}
        >
          <FcGoogle className="mr-2" />
          Continue with Google
        </Button> */}

        <ForgotPasswordModal
          open={showForgotPassword}
          onOpenChange={setShowForgotPassword}
        />
      </motion.div>
    </div>
  );
}

export default function SigninForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SigninFormInner />
    </Suspense>
  );
}
