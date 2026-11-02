// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Separator } from "@/components/ui/separator";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { motion } from "framer-motion";
// import { Suspense, useState } from "react";
// import { useForm } from "react-hook-form";
// import { Eye, EyeOff } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { toast } from "sonner";
// import { Checkbox } from "../ui/checkbox";
// import { FcGoogle } from "react-icons/fc";
// import Logo from "@/assets/logo.png";
// import { useRouter } from "next/navigation";
// import { useAppDispatch } from "@/redux/hooks";
// import { jwtDecode } from "jwt-decode";
// import ForgotPasswordModal from "./ForgotPasswordModal";

// interface JwtPayload {
//   role?: string;
//   // Add other expected properties from your JWT token
// }

// function SigninFormInner() {
//   const router = useRouter();
//   const dispatch = useAppDispatch();
//   const [showPassword, setShowPassword] = useState(false);
//   const [showForgotPassword, setShowForgotPassword] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     setError,
//     reset,
//   } = useForm({
//     resolver: zodResolver(signinSchema),
//   });

//   const [login, { isLoading: isSubmitting }] = useLoginMutation();

//   const onSubmit = async (data: SigninFormData) => {
//     const { email, password } = data;
//     try {
//       const response = await login({ email, password }).unwrap();

//       if (response?.success) {
//         // Store tokens
//         const accessToken = response?.data?.accessToken;

//         // Dispatch user data to Redux
//         dispatch(
//           setTokens({
//             accessToken: accessToken,
//             refreshToken: ""
//           })
//         );

//         // Decode token to get user role
//         const decoded = jwtDecode<JwtPayload>(accessToken);
//         const role = decoded.role?.toLowerCase();
//         console.log("User role:", role);

//         // Show success message
//         toast.success("Logged in successfully!");
//         reset();

//         // Redirect based on role
//         switch (role) {
//           case "admin":
//             router.push("/admin");
//             break;
//           case "employer":
//             router.push("/employer");
//             break;
//           // case "user":
//           // case "employee":
//           //   router.push("/dashboard");
//           //   break;
//           case "user":
//           case "employee":
//             router.push("/");
//             break;
//           default:
//             router.push("/");
//             break;
//         }
//       } else {
//         toast.error(
//           "Login failed. Invalid email or password. Please try again."
//         );
//         setError("root", { message: "Invalid email or password" });
//       }
//     } catch (error: any) {
//       console.error("Login error:", error);

//       const errorMessage =
//         error?.data?.message ||
//         error?.message ||
//         "An error occurred. Please check your connection and try again.";

//       toast.error(errorMessage);
//       setError("root", {
//         message: errorMessage,
//       });
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.3 }}
//         className="w-full max-w-md bg-white rounded-lg shadow-sm p-8"
//       >
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center gap-2 mb-6">
//             <Image
//               src={Logo}
//               alt="logo"
//               width={160}
//               height={58}
//               className="h-[58px] w-[160px] object-contain"
//               priority
//             />
//           </div>

//           <h1 className="text-2xl font-semibold text-gray-900 mb-2">
//             Welcome Back
//           </h1>
//           <p className="text-gray-600">Welcome back! Login to your account</p>
//         </div>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//           <div className="space-y-2">
//             <Label
//               htmlFor="email"
//               className="text-sm font-medium text-gray-700 mb-2 block"
//             >
//               Email address
//             </Label>
//             <Input
//               id="email"
//               type="email"
//               placeholder="a.odhiambo4@gmail.com"
//               className="w-full"
//               {...register("email")}
//               disabled={isSubmitting}
//             />
//             {errors.email && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.email.message}
//               </p>
//             )}
//           </div>

//           <div className="space-y-2">
//             <Label
//               htmlFor="password"
//               className="text-sm font-medium text-gray-700 mb-2 block"
//             >
//               Password
//             </Label>
//             <div className="relative">
//               <Input
//                 id="password"
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Enter your password"
//                 className="w-full pr-10"
//                 {...register("password")}
//                 disabled={isSubmitting}
//               />
//               <Button
//                 type="button"
//                 variant="ghost"
//                 size="sm"
//                 className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                 onClick={() => setShowPassword(!showPassword)}
//                 disabled={isSubmitting}
//               >
//                 {showPassword ? (
//                   <EyeOff className="h-4 w-4 text-gray-400" />
//                 ) : (
//                   <Eye className="h-4 w-4 text-gray-400" />
//                 )}
//               </Button>
//             </div>
//             {errors.password && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.password.message}
//               </p>
//             )}
//           </div>

//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-2">
//               <Checkbox
//                 id="remember"
//                 checked={rememberMe}
//                 onCheckedChange={(checked) => setRememberMe(checked as boolean)}
//                 disabled={isSubmitting}
//               />
//               <Label htmlFor="remember" className="text-sm text-gray-600">
//                 Remember Me
//               </Label>
//             </div>
//             <Button
//               type="button"
//               variant="link"
//               className="text-sm text-red-500 hover:text-red-600 p-0 h-auto"
//               onClick={() => setShowForgotPassword(true)}
//               disabled={isSubmitting}
//             >
//               Forgot password?
//             </Button>
//           </div>

//           {errors.root && (
//             <div className="text-sm text-red-500 text-center bg-red-50 py-2 rounded-md">
//               {errors.root.message}
//             </div>
//           )}

//           <Button
//             type="submit"
//             className="w-full bg-gray-900 hover:bg-transparent border border-gray-900 hover:text-black text-white py-3 duration-300 ease-in-out hover:ease-out hover:duration-300 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? "Signing In..." : "Sign In"}
//           </Button>
//         </form>

//         <div className="relative my-6">
//           <div className="absolute inset-0 flex items-center">
//             <Separator className="w-full" />
//           </div>
//           <div className="relative flex justify-center text-xs uppercase">
//             <span className="bg-white px-2 text-gray-500">or with</span>
//           </div>
//         </div>

//         {/* Google Login Button */}
//         <div className="flex justify-center">
//           <Button
//             type="button"
//             variant="outline"
//             className="w-full py-3 border-gray-300 bg-transparent hover:bg-gray-50"
//             onClick={() =>
//               toast.info(
//                 "Google authentication would typically be implemented here"
//               )
//             }
//             disabled={isSubmitting}
//           >
//             <FcGoogle className="h-5 w-5 mr-2" />
//             Continue with Google
//           </Button>
//         </div>

//         <div className="text-center text-sm mt-6">
//           <span className="text-gray-600">Don&apos;t have an account? </span>
//           <Link
//             href="/register"
//             className="text-red-500 hover:text-red-600 font-medium"
//           >
//             Sign Up
//           </Link>
//         </div>

//         <ForgotPasswordModal
//           open={showForgotPassword}
//           onOpenChange={setShowForgotPassword}
//         />
//       </motion.div>
//     </div>
//   );
// }

// export default function SigninForm() {
//   return (
//     <Suspense
//       fallback={
//         <div className="min-h-screen flex items-center justify-center bg-gray-50">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
//             <p className="text-sm text-gray-500">Loading...</p>
//           </div>
//         </div>
//       }
//     >
//       <SigninFormInner />
//     </Suspense>
//   );
// }



/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useLoginUserMutation } from "@/redux/features/auth/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { z } from "zod";
import { Checkbox } from "../ui/checkbox";
import ForgotPasswordModal from "./ForgotPasswordModal";

// =========================
// ZOD VALIDATION SCHEMA
// =========================
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

  // =========================
  // ON SUBMIT HANDLER
  // =========================
  const onSubmit = async (data: SigninFormData) => {
    try {
      const response: any = await loginUser(data).unwrap();

      if (response?.success) {
        const accessToken = response.data.accessToken;
        localStorage.setItem("token", accessToken);
        toast.success("Logged in successfully!");

        // Decode token
        const decoded = jwtDecode<JwtPayload>(accessToken);
        const role = decoded.role?.toLowerCase();
        console.log(response.data);
        reset();

        // Redirect user
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
      const errorMessage =
        error?.data?.message || "Invalid email or password!";

      toast.error(errorMessage);

      setError("root", {
        message: errorMessage,
      });
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
        <div className="flex flex-col items-center text-center mb-8">
          <Image
            src={Logo}
            alt="logo"
            width={160}
            height={58}
            className="h-[58px] w-[160px] object-contain"
            priority
          />

          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Login to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email */}
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

          {/* Password */}
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

          {/* Remember + Forgot */}
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
            className="w-full bg-gray-900 text-white py-3"
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
        </div> */}

        {/* <Button
          variant="outline"
          className="w-full py-3 border-gray-300"
          disabled={isLoading}
        >
          <FcGoogle className="mr-2" />
          Continue with Google
        </Button> */}

        {/* <div className="text-center mt-6">
          <span className="text-gray-600">Don’t have an account? </span>
          <Link href="/register" className="text-red-500 font-medium">
            Sign Up
          </Link>
        </div> */}

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
