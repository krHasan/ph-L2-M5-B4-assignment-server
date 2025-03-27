import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { DashboardServices } from "./dashboard.service";
import { TJwtPayload } from "../auth/auth.interface";
import sendResponse from "../../utils/sendResponse";
import { httpStatus } from "../../config/httpStatus";

const getStates = catchAsync(async (req: Request, res: Response) => {
    const result = await DashboardServices.getDashboardStatesFromDB(
        req.user as TJwtPayload,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "States information retrieved successfully",
        data: result.result,
    });
});

export const DashboardController = {
    getStates,
};
