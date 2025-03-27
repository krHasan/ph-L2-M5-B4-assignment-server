import { Request, Response } from "express";
import config from "../../config";
import { httpStatus } from "../../config/httpStatus";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import { TJwtPayload } from "./auth.interface";

const loginUser = catchAsync(async (req, res) => {
    const result = await AuthServices.loginUser(req.body);
    const { refreshToken, accessToken } = result;

    res.cookie("refreshToken", refreshToken, {
        secure: config.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 365,
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User logged in successfully!",
        data: {
            accessToken,
            refreshToken,
        },
    });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
    const { authorization } = req.headers;

    const result = await AuthServices.refreshToken(authorization as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User logged in successfully!",
        data: result,
    });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as TJwtPayload;
    const payload = req.body;

    await AuthServices.changePassword(user, payload);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Password changed successfully!",
        data: null,
    });
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
    await AuthServices.forgetPassword(req.body.email);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message:
            "Check your email, a link has been sent with 10 minutes duration",
        data: null,
    });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
    const token = req.headers.authorization;

    const result = await AuthServices.resetPassword(req.body, token as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Password reset successfully!",
        data: result,
    });
});

export const AuthControllers = {
    loginUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword,
};
