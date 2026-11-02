import status from "http-status";
import { User, UserRole, UserStatus } from "@prisma/client";
import ApiError from "../../errors/ApiError";
import { generateOTP } from "../../utils/generateOTP";
import prisma from "../../lib/prisma";
import { sendMail } from "../../utils/sendEmail";
import QueryBuilder from "../../builder/QueryBuilder";
import bcrypt from "bcrypt";

const createUserIntoDB = async (payload: User) => {
  const isUserExist = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (isUserExist) {
    throw new ApiError(status.BAD_REQUEST, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(payload.password ?? "", 10);
  const otp = generateOTP();
  const otpExpiresAt = new Date(Date.now() + 1 * 60 * 1000);

  const userData = {
    ...payload,
    password: hashedPassword,
    otpExpiresAt,
    isVerified: false,
  };

  await prisma.user.create({ data: userData });

  const res = await sendMail(payload.email, otp);
  return res;
};

const getAllUserFromDB = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(prisma.user, {
    ...query,
    role: { not: UserRole.ADMIN },
  })
    .search(["fullName", "email"])
    .filter()
    .paginate();

  const [result, meta] = await Promise.all([
    userQuery.execute(),
    userQuery.countTotal(),
  ]);

  if (!result.length) {
    throw new ApiError(status.NOT_FOUND, "No users found!");
  }

  // Remove password from each user
  const data = result.map((user: User) => {
    const { password, ...rest } = user;
    return rest;
  });

  return {
    meta,
    data,
  };
};

const updateProfile = async (userId: string, payload: Partial<User>) => {
  const isUserExist = await prisma.user.findUnique({
    where: { id: userId, isVerified: true },
  });

  if (!isUserExist) {
    throw new ApiError(status.NOT_FOUND, "User not found!");
  }
  if (isUserExist.status === UserStatus.BLOCKED) {
    throw new ApiError(status.NOT_FOUND, "User is Blocked!");
  }

  if (!payload.profileImage) {
    payload.profileImage = isUserExist.profileImage;
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId, isVerified: true },
    data: {
      firstName: payload.firstName,
      lastName: payload.lastName,
      profileImage: payload.profileImage || "",
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      profileImage: true,
      role: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

const getSingleUserByIdFromDB = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId, isVerified: true },
  });

  if (!user) {
    throw new ApiError(status.NOT_FOUND, "User not found!");
  }

  if (user.status === UserStatus.BLOCKED) {
    throw new ApiError(status.NOT_FOUND, "User is Blocked!");
  }

  const { password, ...rest } = user;

  return rest;
};

const deleteUserFromDB = async (userId: string) => {
  const isUserExist = await prisma.user.findUnique({
    where: { id: userId, isVerified: true },
  });


  if (!isUserExist) {
    throw new ApiError(status.NOT_FOUND, "User not found!");
  }
  if (isUserExist.status === UserStatus.BLOCKED) {
    throw new ApiError(status.NOT_FOUND, "User is Blocked!");
  }

  await prisma.user.delete({
    where: { id: userId },
  });

  return null;
};

const blockUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId, isVerified: true },
  });

  if (!user) {
    throw new ApiError(status.NOT_FOUND, "User not found!");
  }
  if (user.status === UserStatus.BLOCKED) {
    throw new ApiError(status.NOT_FOUND, "User is Blocked!");
  }
  if (user.role === UserRole.ADMIN) {
    throw new ApiError(status.FORBIDDEN, "You cannot block an admin!");
  }

  const result = await prisma.user.update({
    where: { id: userId },
    data: { status: UserStatus.BLOCKED },
  });

  return result;
};
const unblockUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId, isVerified: true },
  });

  if (!user) {
    throw new ApiError(status.NOT_FOUND, "User not found!");
  }

  const result = await prisma.user.update({
    where: { id: userId },
    data: { status: UserStatus.ACTIVE },
  });

  return result;
};


export const UserService = {
  createUserIntoDB,
  getAllUserFromDB,
  updateProfile,
  deleteUserFromDB,
  getSingleUserByIdFromDB,
  blockUser,
  unblockUser,
};
