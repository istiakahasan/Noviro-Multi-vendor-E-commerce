import status from "http-status";
import { Request, Response } from "express";
import catchAsync from "../../helpers/catchAsync";
import { UserService } from "./user.service";
import sendResponse from "../../helpers/sendResponse";
import config from "../../../config";

const createUser = catchAsync(async (req: Request, res: Response) => {
  await UserService.createUserIntoDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: status.CREATED,
    message: "OTP sent to your email!",
  });
});

const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getAllUserFromDB(req.query);
  sendResponse(res, {
    statusCode: status.OK,
    message: "Users are retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user;
  if (req.file) {
    req.body.profilePic = `${config.imageUrl}/uploads/${req.file.filename}`;
  }
  const result = await UserService.updateProfile(id, req.body);
  sendResponse(res, {
    statusCode: status.OK,
    message: "User updated successfully!",
    data: result,
  });
});

const getSingleUserById = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const result = await UserService.getSingleUserByIdFromDB(userId);

  sendResponse(res, {
    statusCode: status.OK,
    message: "User retrieved successfully!",
    data: result,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;

  await UserService.deleteUserFromDB(userId);

  sendResponse(res, {
    statusCode: status.OK,
    message: "User deleted successfully!",
  });
});

const blockUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await UserService.blockUser(id);

  sendResponse(res, {
    statusCode: status.OK,
    message: "User blocked successfully!",
  });
});

const unblockUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await UserService.unblockUser(id);

  sendResponse(res, {
    statusCode: status.OK,
    message: "User unblocked successfully!",
  });
});


export const UserController = {
  createUser,
  getAllUser,
  updateProfile,
  deleteUser,
  blockUser,
  unblockUser,
  getSingleUserById
};
