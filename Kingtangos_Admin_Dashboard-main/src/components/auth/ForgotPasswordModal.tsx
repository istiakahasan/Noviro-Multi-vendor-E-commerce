// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   forgotPasswordSchema,
//   otpVerificationSchema,
//   resetPasswordSchema,
//   ForgotPasswordFormData,
//   OtpVerificationFormData,
//   ResetPasswordFormData,
// } from "@/lib/validations/auth";
// import { Mail, Shield, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
// import { toast } from "sonner";
// import { useForgotPasswordMutation, useResetPasswordMutation, useVerifyResetPasswordOtpMutation } from "@/redux/api/authApi";

// interface ForgotPasswordModalProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// }

// type Step = "email" | "otp" | "password" | "success";

// export default function ForgotPasswordModal({
//   open,
//   onOpenChange,
// }: ForgotPasswordModalProps) {
//   const [step, setStep] = useState<Step>("email");
//   const [email, setEmail] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   // API mutations
//   const [forgotPassword, { isLoading: isSendingEmail }] = useForgotPasswordMutation();
//   const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyResetPasswordOtpMutation();
//   const [resetPassword, { isLoading: isResettingPassword }] = useResetPasswordMutation();

//   const isLoading = isSendingEmail || isVerifyingOtp || isResettingPassword;

//   // Email form
//   const emailForm = useForm<ForgotPasswordFormData>({
//     resolver: zodResolver(forgotPasswordSchema),
//   });

//   // OTP form
//   const otpForm = useForm<OtpVerificationFormData>({
//     resolver: zodResolver(otpVerificationSchema),
//   });

//   // Password form
//   const passwordForm = useForm<ResetPasswordFormData>({
//     resolver: zodResolver(resetPasswordSchema),
//   });

//   const handleEmailSubmit = async (data: ForgotPasswordFormData) => {
//     try {
//       setEmail(data.email);

//       // Send email in the correct format
//       await forgotPassword({ email: data.email }).unwrap();

//       setStep("otp");
//       toast.success("Reset code sent to your email");
//     } catch (error: any) {
//       console.error("Failed to send reset email:", error);
//       emailForm.setError("root", {
//         message: error?.data?.message || "Failed to send reset email",
//       });
//     }
//   };

//   const handleOtpSubmit = async (data: OtpVerificationFormData) => {
//     try {
//       // Verify OTP in the correct format
//       await verifyOtp({
//         email: email,
//         otp: data.otp // Keep as string if backend expects string, or convert to number if needed
//       }).unwrap();

//       setStep("password");
//       toast.success("Code verified successfully");
//     } catch (error: any) {
//       console.error("Failed to verify OTP:", error);
//       otpForm.setError("root", {
//         message: error?.data?.message || "Invalid verification code",
//       });
//     }
//   };

//   const handlePasswordSubmit = async (data: ResetPasswordFormData) => {
//     try {
//       // Reset password in the correct format
//       await resetPassword({
//         email: email,
//         newPassword: data.password,
//         confirmPassword: data.confirmPassword
//       }).unwrap();

//       setStep("success");
//       toast.success("Password reset successfully");
//     } catch (error: any) {
//       console.error("Failed to reset password:", error);
//       passwordForm.setError("root", {
//         message: error?.data?.message || "Failed to reset password",
//       });
//     }
//   };

//   const handleClose = () => {
//     setStep("email");
//     setEmail("");
//     emailForm.reset();
//     otpForm.reset();
//     passwordForm.reset();
//     onOpenChange(false);
//   };

//   const getStepIcon = () => {
//     switch (step) {
//       case "email":
//         return <Mail className="h-6 w-6 text-primary" />;
//       case "otp":
//         return <Shield className="h-6 w-6 text-primary" />;
//       case "password":
//         return <Lock className="h-6 w-6 text-primary" />;
//       case "success":
//         return <CheckCircle className="h-6 w-6 text-green-500" />;
//     }
//   };

//   const getStepTitle = () => {
//     switch (step) {
//       case "email":
//         return "Forgot Password";
//       case "otp":
//         return "Verify Code";
//       case "password":
//         return "Reset Password";
//       case "success":
//         return "Password Reset";
//     }
//   };

//   const getStepDescription = () => {
//     switch (step) {
//       case "email":
//         return "Enter your email address and we'll send you a verification code";
//       case "otp":
//         return `Enter the 6-digit code sent to ${email}`;
//       case "password":
//         return "Create a new password for your account";
//       case "success":
//         return "Your password has been reset successfully";
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <div className="flex items-center justify-center mb-4">
//             <motion.div
//               key={step}
//               initial={{ scale: 0, rotate: -180 }}
//               animate={{ scale: 1, rotate: 0 }}
//               transition={{ type: "spring", duration: 0.6 }}
//               className="p-3 rounded-full bg-primary/10"
//             >
//               {getStepIcon()}
//             </motion.div>
//           </div>
//           <DialogTitle className="text-center">{getStepTitle()}</DialogTitle>
//           <DialogDescription className="text-center">
//             {getStepDescription()}
//           </DialogDescription>
//         </DialogHeader>

//         <AnimatePresence mode="wait">
//           {step === "email" && (
//             <motion.div
//               key="email"
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: -20 }}
//               className="space-y-4"
//             >
//               <form
//                 onSubmit={emailForm.handleSubmit(handleEmailSubmit)}
//                 className="space-y-4"
//               >
//                 <div className="space-y-2">
//                   <Label htmlFor="email">Email Address</Label>
//                   <Input
//                     id="email"
//                     type="email"
//                     placeholder="Enter your email"
//                     {...emailForm.register("email")}
//                   />
//                   {emailForm.formState.errors.email && (
//                     <p className="text-sm text-destructive">
//                       {emailForm.formState.errors.email.message}
//                     </p>
//                   )}
//                 </div>

//                 {emailForm.formState.errors.root && (
//                   <div className="text-sm text-destructive text-center">
//                     {emailForm.formState.errors.root.message}
//                   </div>
//                 )}

//                 <div className="flex gap-2">
//                   <Button
//                     type="button"
//                     variant="outline"
//                     className="flex-1"
//                     onClick={handleClose}
//                   >
//                     Cancel
//                   </Button>
//                   <Button type="submit" className="flex-1" disabled={isLoading}>
//                     {isSendingEmail ? "Sending..." : "Send Code"}
//                   </Button>
//                 </div>
//               </form>
//             </motion.div>
//           )}

//           {step === "otp" && (
//             <motion.div
//               key="otp"
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: -20 }}
//               className="space-y-4"
//             >
//               <form
//                 onSubmit={otpForm.handleSubmit(handleOtpSubmit)}
//                 className="space-y-4"
//               >
//                 <div className="space-y-2">
//                   <Label htmlFor="otp">Verification Code</Label>
//                   <Input
//                     id="otp"
//                     type="text"
//                     placeholder="Enter 6-digit code"
//                     maxLength={6}
//                     className="text-center text-lg tracking-widest"
//                     {...otpForm.register("otp")}
//                   />
//                   {otpForm.formState.errors.otp && (
//                     <p className="text-sm text-destructive">
//                       {otpForm.formState.errors.otp.message}
//                     </p>
//                   )}
//                 </div>

//                 <div className="text-center">
//                   <Button
//                     type="button"
//                     variant="link"
//                     className="text-sm"
//                     onClick={() => handleEmailSubmit({ email })}
//                     disabled={isLoading}
//                   >
//                     Didn&apos;t receive code? Resend
//                   </Button>
//                 </div>

//                 {otpForm.formState.errors.root && (
//                   <div className="text-sm text-destructive text-center">
//                     {otpForm.formState.errors.root.message}
//                   </div>
//                 )}

//                 <div className="flex gap-2">
//                   <Button
//                     type="button"
//                     variant="outline"
//                     className="flex-1"
//                     onClick={() => setStep("email")}
//                   >
//                     Back
//                   </Button>
//                   <Button type="submit" className="flex-1" disabled={isLoading}>
//                     {isVerifyingOtp ? "Verifying..." : "Verify Code"}
//                   </Button>
//                 </div>
//               </form>
//             </motion.div>
//           )}

//           {step === "password" && (
//             <motion.div
//               key="password"
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: -20 }}
//               className="space-y-4"
//             >
//               <form
//                 onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
//                 className="space-y-4"
//               >
//                 <div className="space-y-2">
//                   <Label htmlFor="password">New Password</Label>
//                   <div className="relative">
//                     <Input
//                       id="password"
//                       type={showPassword ? "text" : "password"}
//                       placeholder="Enter new password"
//                       {...passwordForm.register("password")}
//                     />
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="sm"
//                       className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                       onClick={() => setShowPassword(!showPassword)}
//                     >
//                       {showPassword ? (
//                         <EyeOff className="h-4 w-4" />
//                       ) : (
//                         <Eye className="h-4 w-4" />
//                       )}
//                     </Button>
//                   </div>
//                   {passwordForm.formState.errors.password && (
//                     <p className="text-sm text-destructive">
//                       {passwordForm.formState.errors.password.message}
//                     </p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="confirmPassword">Confirm New Password</Label>
//                   <div className="relative">
//                     <Input
//                       id="confirmPassword"
//                       type={showConfirmPassword ? "text" : "password"}
//                       placeholder="Confirm new password"
//                       {...passwordForm.register("confirmPassword")}
//                     />
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="sm"
//                       className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                       onClick={() =>
//                         setShowConfirmPassword(!showConfirmPassword)
//                       }
//                     >
//                       {showConfirmPassword ? (
//                         <EyeOff className="h-4 w-4" />
//                       ) : (
//                         <Eye className="h-4 w-4" />
//                       )}
//                     </Button>
//                   </div>
//                   {passwordForm.formState.errors.confirmPassword && (
//                     <p className="text-sm text-destructive">
//                       {passwordForm.formState.errors.confirmPassword.message}
//                     </p>
//                   )}
//                 </div>

//                 {passwordForm.formState.errors.root && (
//                   <div className="text-sm text-destructive text-center">
//                     {passwordForm.formState.errors.root.message}
//                   </div>
//                 )}

//                 <div className="flex gap-2">
//                   <Button
//                     type="button"
//                     variant="outline"
//                     className="flex-1"
//                     onClick={() => setStep("otp")}
//                   >
//                     Back
//                   </Button>
//                   <Button type="submit" className="flex-1" disabled={isLoading}>
//                     {isResettingPassword ? "Resetting..." : "Reset Password"}
//                   </Button>
//                 </div>
//               </form>
//             </motion.div>
//           )}

//           {step === "success" && (
//             <motion.div
//               key="success"
//               initial={{ opacity: 0, scale: 0.8 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.8 }}
//               className="space-y-4 text-center"
//             >
//               <div className="space-y-2">
//                 <p className="text-sm text-muted-foreground">
//                   You can now sign in with your new password
//                 </p>
//               </div>

//               <Button onClick={handleClose} className="w-full">
//                 Continue to Sign In
//               </Button>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </DialogContent>
//     </Dialog>
//   );
// }

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import {
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useVerifyResetPasswordOtpMutation,
} from "@/redux/features/auth/authApi";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, Lock, Mail, Shield } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface ForgotPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = "email" | "otp" | "password" | "success";

export default function ForgotPasswordModal({
  open,
  onOpenChange,
}: ForgotPasswordModalProps) {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // API mutations
  const [forgotPassword, { isLoading: isSendingEmail }] =
    useForgotPasswordMutation();
  const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyOtpMutation();
  const [resetPassword, { isLoading: isResettingPassword }] =
    useVerifyResetPasswordOtpMutation();

  const isLoading = isSendingEmail || isVerifyingOtp || isResettingPassword;

  // Forms
  const emailForm = useForm<{ email: string }>();
  const otpForm = useForm<{ otp: string }>();
  const passwordForm = useForm<{ password: string; confirmPassword: string }>();

  const handleEmailSubmit = async (data: { email: string }) => {
    try {
      setEmail(data.email);
      await forgotPassword({ email: data.email }).unwrap();
      setStep("otp");
      toast.success("Reset code sent to your email");
    } catch (error: any) {
      console.error("Failed to send reset email:", error);
      emailForm.setError("email", {
        message: error?.data?.message || "Failed to send reset email",
      });
    }
  };

  const handleOtpSubmit = async (data: { otp: string }) => {
    try {
      await verifyOtp({ email, otp: data.otp }).unwrap();
      setStep("password");
      toast.success("Code verified successfully");
    } catch (error: any) {
      console.error("Failed to verify OTP:", error);
      otpForm.setError("otp", {
        message: error?.data?.message || "Invalid verification code",
      });
    }
  };

  const handlePasswordSubmit = async (data: {
    password: string;
    confirmPassword: string;
  }) => {
    try {
      await resetPassword({
        email,
        newPassword: data.password,
        confirmPassword: data.confirmPassword,
      }).unwrap();
      setStep("success");
      toast.success("Password reset successfully");
    } catch (error: any) {
      console.error("Failed to reset password:", error);
      passwordForm.setError("password", {
        message: error?.data?.message || "Failed to reset password",
      });
    }
  };

  const handleClose = () => {
    setStep("email");
    setEmail("");
    emailForm.reset();
    otpForm.reset();
    passwordForm.reset();
    onOpenChange(false);
  };

  const getStepIcon = () => {
    switch (step) {
      case "email":
        return <Mail className="h-6 w-6 text-primary" />;
      case "otp":
        return <Shield className="h-6 w-6 text-primary" />;
      case "password":
        return <Lock className="h-6 w-6 text-primary" />;
      case "success":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case "email":
        return "Forgot Password";
      case "otp":
        return "Verify Code";
      case "password":
        return "Reset Password";
      case "success":
        return "Password Reset";
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case "email":
        return "Enter your email address to receive a verification code";
      case "otp":
        return `Enter the 6-digit code sent to ${email}`;
      case "password":
        return "Enter a new password for your account";
      case "success":
        return "Your password has been reset successfully";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <motion.div
              key={step}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="p-3 rounded-full bg-primary/10"
            >
              {getStepIcon()}
            </motion.div>
          </div>
          <DialogTitle className="text-center">{getStepTitle()}</DialogTitle>
          <DialogDescription className="text-center">
            {getStepDescription()}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === "email" && (
            <motion.div
              key="email"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <form
                onSubmit={emailForm.handleSubmit(handleEmailSubmit)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input
                    placeholder="Enter your email"
                    {...emailForm.register("email", { required: true })}
                  />
                  {emailForm.formState.errors.email && (
                    <p className="text-sm text-destructive">
                      {emailForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={handleClose}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isSendingEmail ? "Sending..." : "Send Code"}
                  </Button>
                </div>
              </form>
            </motion.div>
          )}

          {step === "otp" && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <form
                onSubmit={otpForm.handleSubmit(handleOtpSubmit)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label>Verification Code</Label>
                  <Input
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className="text-center text-lg tracking-widest"
                    {...otpForm.register("otp", { required: true })}
                  />
                  {otpForm.formState.errors.otp && (
                    <p className="text-sm text-destructive">
                      {otpForm.formState.errors.otp.message}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep("email")}
                  >
                    Back
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isVerifyingOtp ? "Verifying..." : "Verify Code"}
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
          {step === "password" && (
            <motion.div
              key="password"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <form
                onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      {...passwordForm.register("password", { required: true })}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Confirm Password</Label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      {...passwordForm.register("confirmPassword", {
                        required: true,
                      })}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep("otp")}
                  >
                    Back
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isResettingPassword ? "Resetting..." : "Reset Password"}
                  </Button>
                </div>
              </form>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="space-y-4 text-center"
            >
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Your password has been reset successfully. You can now sign in
                  with your new password.
                </p>
              </div>
              <Button onClick={handleClose} className="w-full">
                Continue to Sign In
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
