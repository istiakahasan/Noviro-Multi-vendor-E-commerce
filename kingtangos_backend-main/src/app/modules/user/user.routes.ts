import { NextFunction, Request, Response, Router } from "express";
import { UserValidation } from "./user.validation";
import validateRequest from "../../middlewares/validateRequest";
import { UserController } from "./user.controller";
import ApiError from "../../errors/ApiError";
import status from "http-status";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.get("/get-all-users", auth(UserRole.ADMIN), UserController.getAllUser);

router.get(
  "/get-user/:userId",
  auth(UserRole.ADMIN, UserRole.USER),
  UserController.getSingleUserById
);

router.post(
  "/register",
  validateRequest(UserValidation.createUserValidationSchema),
  UserController.createUser
); // ✅

// router.patch(
//   "/update-profile",
//   upload.single("file"),
//   (req: Request, res: Response, next: NextFunction) => {
//     try {
//       if (req.body?.data) {
//         req.body = JSON.parse(req.body.data);
//       }
//       next();
//     } catch {
//       next(new ApiError(status.BAD_REQUEST, "Invalid JSON in 'data' field"));
//     }
//   },
//   validateRequest(UserValidation.updateUserValidationSchema),
//   auth(UserRole.ADMIN, UserRole.USER),
//   UserController.updateProfile
// );

router.delete(
  "/delete-user/:userId",
  auth(UserRole.ADMIN, UserRole.USER),
  UserController.deleteUser
);

router.patch(
  "/block/:id",
  auth(UserRole.ADMIN), // only admins can block
  UserController.blockUser
);

router.patch(
  "/unblock/:id",
  auth(UserRole.ADMIN), // only admins can unblock
  UserController.unblockUser
);

export const UserRoutes = router;
