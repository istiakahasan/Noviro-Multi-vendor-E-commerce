// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import React, { useEffect, useState, useCallback } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
// import { REGEXP_ONLY_DIGITS } from "input-otp";
// import { toast } from "sonner";
// import { RefreshCw, Shield, X } from "lucide-react";
// import { useResendOtpMutation, useSellerVerifyOtpMutation } from "@/redux/api/authApi";

// interface SignupVerifyModalProps {
//   isOpen: boolean;
//   onClose: (open: boolean) => void;
//   email: string;
//   userData?: {
//     firstName: string;
//     lastName: string;
//     email: string;
//     password: string;
//   };
//   onVerificationSuccess?: () => void;
// }

// export default function SignupVerifyModal({
//   isOpen,
//   onClose,
//   email,
//   userData,
//   onVerificationSuccess,
// }: SignupVerifyModalProps) {
//   const [resendComedown, setResendComedown] = useState(0);
//   const [otpValue, setOtpValue] = useState("");

//   // RTK Query mutations
//   const [verifyOtp, { isLoading: isVerifying }] = useSellerVerifyOtpMutation();
//   const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

//   // Handle resend countdown timer
//   useEffect(() => {
//     let interval: NodeJS.Timeout;
    
//     if (resendComedown > 0) {
//       interval = setInterval(() => {
//         setResendComedown((prev) => prev - 1);
//       }, 1000);
//     }
    
//     return () => {
//       if (interval) clearInterval(interval);
//     };
//   }, [resendComedown]);

//   const handleOTPComplete = useCallback(async (value: string) => {
//     console.log("Verification code entered:", value);
//     console.log("User data received:", userData);
    
//     if (!userData) {
//       toast.error("User data is missing. Please try registering again.");
//       return;
//     }
    
//     try {
//       // Combine OTP and user data in the required structure
//       const verificationData = {
//         otpCode: value,
//         data: userData
//       };

//       console.log("Sending combined data to backend:", verificationData);
      
//       // Call the verify OTP API with the combined data
//       const response = await verifyOtp(verificationData).unwrap();

//       console.log("Verification response:", response);
      
//       toast.success(response.message || "Email verified successfully! Welcome aboard! 🎉");
      
//       // Call the success callback
//       if (onVerificationSuccess) {
//         onVerificationSuccess();
//       }
//     } catch (error: any) {
//       console.error("Verification error:", error);
      
//       // Handle API errors
//       if (error?.data) {
//         const errorData = error.data as { 
//           message?: string;
//           errorMessages?: Array<{ path: string; message: string }>;
//         };
        
//         // Show specific error message if available
//         if (errorData.errorMessages && errorData.errorMessages.length > 0) {
//           toast.error(errorData.errorMessages[0].message || "Verification failed.");
//         } else {
//           toast.error(errorData.message || "Invalid verification code. Please try again.");
//         }
//       } else {
//         toast.error("Network error. Please check your connection and try again.");
//       }
      
//       setOtpValue("");
//     }
//   }, [userData, verifyOtp, onVerificationSuccess]);

//   // Auto-submit when OTP is complete
//   useEffect(() => {
//     if (otpValue.length === 6 && !isVerifying && userData) {
//       handleOTPComplete(otpValue);
//     }
//   }, [otpValue, isVerifying, handleOTPComplete, userData]);

//   const handleResendVerification = async () => {
//     console.log("Resending verification code for:", email);
    
//     try {
//       // For resend, we only need email
//       const response = await resendOtp({ 
//         email: email
//       }).unwrap();
      
//       console.log("Resend OTP response:", response);
//       toast.success(response.message || "Verification code sent! Check your email. 📧");
//       setResendComedown(60);
//       setOtpValue("");
//     } catch (error: any) {
//       console.error("Resend verification error:", error);
      
//       // Handle API errors
//       if (error?.data) {
//         const errorData = error.data as { 
//           message?: string;
//           errorMessages?: Array<{ path: string; message: string }>;
//         };
        
//         if (errorData.errorMessages && errorData.errorMessages.length > 0) {
//           toast.error(errorData.errorMessages[0].message || "Failed to resend code.");
//         } else {
//           toast.error(errorData.message || "Failed to resend verification code. Please try again.");
//         }
//       } else {
//         toast.error("Failed to resend verification code. Please try again.");
//       }
//     }
//   };

//   const handleManualVerification = async () => {
//     if (otpValue.length !== 6) {
//       toast.error("Please enter a 6-digit verification code");
//       return;
//     }
    
//     if (!userData) {
//       toast.error("User data is missing. Please try registering again.");
//       return;
//     }
    
//     await handleOTPComplete(otpValue);
//   };

//   const handleClose = () => {
//     console.log("Modal closed by user");
//     setOtpValue("");
//     onClose(false);
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={handleClose}>
//       <DialogContent className="max-w-md space-y-6 p-6 w-full bg-white dark:bg-gray-400">
//         {/* Close Button */}
//         <button
//           onClick={handleClose}
//           className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
//         >
//           <X className="h-4 w-4" />
//           <span className="sr-only">Close</span>
//         </button>

//         <DialogHeader className="flex flex-col items-center space-y-4">
//           <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full">
//             <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
//           </div>
//           <DialogTitle className="text-center text-xl font-semibold">
//             Verify Your Email
//           </DialogTitle>
//           <DialogDescription className="text-center text-sm text-gray-600 dark:text-gray-400">
//             We sent a 6-digit verification code to
//             <br />
//             <span className="font-medium text-gray-900 dark:text-white">
//               {email}
//             </span>
//           </DialogDescription>
//         </DialogHeader>

//         <div className="flex flex-col items-center space-y-6">
//           {/* OTP Input */}
//           <div className="flex flex-col items-center space-y-4 w-full">
//             <InputOTP
//               maxLength={6}
//               value={otpValue}
//               onChange={setOtpValue}
//               pattern={REGEXP_ONLY_DIGITS}
//               disabled={isVerifying}
//               autoFocus
//             >
//               <InputOTPGroup className="gap-2 *:rounded-lg *:border *:h-12 *:w-12 *:text-lg *:font-semibold">
//                 <InputOTPSlot index={0} />
//                 <InputOTPSlot index={1} />
//                 <InputOTPSlot index={2} />
//                 <InputOTPSlot index={3} />
//                 <InputOTPSlot index={4} />
//                 <InputOTPSlot index={5} />
//               </InputOTPGroup>
//             </InputOTP>

//             {otpValue.length === 6 && !isVerifying && (
//               <Button
//                 onClick={handleManualVerification}
//                 className="w-full mt-2"
//                 size="sm"
//               >
//                 Verify Email
//               </Button>
//             )}
//           </div>

//           {/* Verification Status */}
//           {isVerifying && (
//             <div className="flex items-center justify-center space-x-2 text-sm text-blue-600 dark:text-blue-400">
//               <RefreshCw className="w-4 h-4 animate-spin" />
//               <span>Verifying your code...</span>
//             </div>
//           )}

//           {/* Resend Section */}
//           <div className="text-center space-y-3 w-full">
//             <div className="text-sm text-gray-500 dark:text-gray-400">
//               Didn&apos;t receive the code?
//             </div>

//             <Button
//               onClick={handleResendVerification}
//               disabled={isResending || resendComedown > 0}
//               variant="outline"
//               className="w-full"
//               size="sm"
//             >
//               {isResending ? (
//                 <>
//                   <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
//                   Sending...
//                 </>
//               ) : resendComedown > 0 ? (
//                 `Resend in ${resendComedown}s`
//               ) : (
//                 <>
//                   <RefreshCw className="w-4 h-4 mr-2" />
//                   Resend Verification Code
//                 </>
//               )}
//             </Button>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }