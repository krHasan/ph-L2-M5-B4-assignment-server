import { Request, Response } from "express";
import { UserServices } from "./user.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { httpStatus } from "../../config/httpStatus";
import { TJwtPayload } from "../auth/auth.interface";

const registerUser = catchAsync(async (req: Request, res: Response) => {
    const result = await UserServices.registerUserIntoDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User registration completed successfully!",
        data: result,
    });
});

const getAllUser = catchAsync(async (req, res) => {
    const result = await UserServices.getAllUserFromDB(req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Users are retrieved successfully",
        meta: result.meta,
        data: result.result,
    });
});

const myProfile = catchAsync(async (req, res) => {
    const result = await UserServices.myProfile(req.user as TJwtPayload);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Profile retrieved successfully",
        data: result,
    });
});

const updateUserStatus = catchAsync(async (req, res) => {
    const userId = req.params.id;
    const result = await UserServices.updateUserStatus(userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `User status updated`,
        data: result,
    });
});

export const UserControllers = {
    registerUser,
    getAllUser,
    myProfile,
    updateUserStatus,
};
