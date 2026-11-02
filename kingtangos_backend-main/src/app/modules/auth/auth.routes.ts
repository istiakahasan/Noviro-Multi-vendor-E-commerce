import { UserRole } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { AuthController } from "./auth.controller";
import { AuthValidation } from "./auth.validation";

const router = Router();

router.post("/verify-otp", AuthController.verifyOtp);

router.post("/verify-otp-signup", AuthController.verifyOtpSignUp);

router.post(
  "/login",
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.login
);

router.put(
  "/change-password",
  auth(UserRole.USER, UserRole.ADMIN),
  validateRequest(AuthValidation.changePasswordValidationSchema),
  AuthController.changePassword
);

router.post(
  "/forgot-password",
  validateRequest(AuthValidation.forgotPasswordValidationSchema),
  AuthController.forgotPassword
);

router.post("/reset-password", AuthController.resetPassword);

router.post(
  "/resend-otp",
  validateRequest(AuthValidation.resendOtpValidationSchema),
  AuthController.resendOtp
);

router.post(
  "/resend-otp-signup",
  validateRequest(AuthValidation.resendOtpValidationSchema),
  AuthController.resendOtpSignUp
);

router.get("/my-profile", auth(UserRole.USER, UserRole.ADMIN), AuthController.getMe);


export const AuthRoutes = router;
