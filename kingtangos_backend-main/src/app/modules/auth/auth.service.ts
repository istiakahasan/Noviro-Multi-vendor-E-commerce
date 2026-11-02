
import status from "http-status"
import prisma from "../../lib/prisma";
import ApiError from "../../errors/ApiError";
import { passwordCompare } from "../../utils/comparePasswords";
import config from "../../../config";
import { createToken } from "./auth.utils";
import { sendMail } from "../../utils/sendEmail";
import bcrypt from "bcrypt";
import { generateOTP } from "../../utils/generateOTP";

const verifyOtp = async (email: string, otp: number) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || user.otp === null || user.otp === undefined) {
    throw new ApiError(status.BAD_REQUEST, "OTP Not found!");
  }

  if (user.otpExpiresAt! < new Date()) {
    throw new ApiError(status.BAD_REQUEST, "OTP has expired!");
  }

  if (Number(user.otp) !== otp) {
    throw new ApiError(status.BAD_REQUEST, "OTP not matched!");
  }

  await prisma.user.update({
    where: { email },
    data: {
      otp: null,
      otpExpiresAt: null,
      isResetPassword: false,
      canResetPassword: true,
    },
  });

  return null;
};

const verifyOtpSignUp = async (email: string, otp: number) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || user.otp === null || user.otp === undefined) {
    throw new ApiError(status.BAD_REQUEST, "OTP Not found!");
  }

  if (user.otpExpiresAt! < new Date()) {
    throw new ApiError(status.BAD_REQUEST, "OTP has expired!");
  }

  if (Number(user.otp) !== otp) {
    throw new ApiError(status.BAD_REQUEST, "OTP not matched!");
  }

  await prisma.user.update({
    where: { email },
    data: {
      isVerified: true,
      otp: null,
      otpExpiresAt: null,
    },
  });

  const jwtPayload = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    isVerified: true,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt.access_secret as string,
    config.jwt.access_token_expires_in as string
  );

  return {
    accessToken,
  };
};

const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(status.NOT_FOUND, "User not found!");
  }

  const isPasswordMatched = await passwordCompare(password, user.password ?? "");

  if (!isPasswordMatched) {
    throw new ApiError(status.UNAUTHORIZED, "Password is incorrect!");
  }

  // Check if user is not active
  if (!user.isVerified) {
    const otp = generateOTP().toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: { email },
      data: {
        otp,
        otpExpiresAt,
      },
    });

    await sendMail(email, otp);

    throw new ApiError(
      status.FORBIDDEN,
      "Account is not verified. A new OTP has been sent to your email."
    );
  }

  const jwtPayload = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    isVerified: true,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt.access_secret as string,
    config.jwt.access_token_expires_in as string
  );

  return {
    accessToken,
  };
};

const changePassword = async (
  email: string,
  currentPassword: string,
  newPassword: string
) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(status.NOT_FOUND, "User not found!");
  }

  const isPasswordMatch = await passwordCompare(currentPassword, user.password ?? "");

  if (!isPasswordMatch) {
    throw new ApiError(status.UNAUTHORIZED, "Current password is incorrect!");
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { email },
    data: {
      password: hashedNewPassword
    },
  });

  return null;
};

const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new ApiError(status.NOT_FOUND, "User not found!");
  }

  if (!user.isVerified) {
    throw new ApiError(status.UNAUTHORIZED, "User account is not verified!");
  }

  // Step 1: Generate OTP
  const otp = generateOTP().toString();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // expires in 10 minutes

  // Step 2: Save OTP in DB
  await prisma.user.update({
    where: { email },
    data: {
      otp,
      otpExpiresAt,
      isResetPassword: true,
      canResetPassword: false,
    },
  });

  // Step 3: Send OTP via email
  await sendMail(email, otp);

  // Step 4: Return response
  return {
    message: "OTP has been sent to your email for password reset.",
  };
};

const resetPassword = async (
  email: string,
  newPassword: string,
  confirmPassword: string
) => {
  if (newPassword !== confirmPassword) {
    throw new ApiError(status.BAD_REQUEST, "Passwords do not match!");
  }

  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!user) {
    throw new ApiError(status.NOT_FOUND, "User not found!");
  }

  if (!user.canResetPassword) {
    throw new ApiError(
      status.BAD_REQUEST,
      "User is not eligible for password reset!"
    );
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { email: email },
    data: {
      password: hashedPassword,
      isResetPassword: false,
      canResetPassword: false,
    },
  });

  return {
    message: "Password reset successfully!",
  };
};

const resendOtp = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new ApiError(status.NOT_FOUND, "User not found!");
  }

  // Generate new OTP
  const otp = generateOTP().toString();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.user.update({
    where: { email },
    data: {
      otp,
      otpExpiresAt,
      isResentOtp: true,
      isResetPassword: true,
      canResetPassword: false,
    },
  });

  await sendMail(email, otp);

  return {
    message: "New OTP has been sent to your email for reset password.",
  };
};

const resendOtpSignUp = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new ApiError(status.NOT_FOUND, "User not found!");
  }

  if (user.isVerified) {
    throw new ApiError(status.BAD_REQUEST, "User account already verified!");
  }

  // Generate new OTP
  const otp = generateOTP().toString();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.user.update({
    where: { email },
    data: {
      otp,
      otpExpiresAt,
      isResentOtp: true,
    },
  });

  await sendMail(email, otp);

  return {
    message: "New OTP has been sent to your email. Please verify your account.",
  };
};

const getMe = async (email: string) => {
  const result = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      profileImage: true,
      role: true,
      isVerified: true,
    },
  });

  return result;
};

export const AuthService = {
  getMe,
  verifyOtp,
  loginUser,
  resendOtp,
  resetPassword,
  changePassword,
  forgotPassword,
  resendOtpSignUp,
  verifyOtpSignUp,
};
