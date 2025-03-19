import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { RequestServices } from "./request.service";
import sendResponse from "../../utils/sendResponse";
import { httpStatus } from "../../config/httpStatus";
import { TJwtPayload } from "../auth/auth.interface";

const createRequest = catchAsync(async (req: Request, res: Response) => {
    const result = await RequestServices.createRequestIntoDB(
        req.body,
        req.user as TJwtPayload,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Request is created successfully",
        data: result,
    });
});

const getAllRequests = catchAsync(async (req: Request, res: Response) => {
    const result = await RequestServices.getAllRequestsFromDB(
        req.query,
        req.user as TJwtPayload,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "List are retrieved successfully",
        meta: result.meta,
        data: result.result,
    });
});

const cancelRequest = catchAsync(async (req: Request, res: Response) => {
    const result = await RequestServices.cancelRequestIntoDB(
        req.params.requestId,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Request is canceled successfully",
        data: result,
    });
});

export const RequestControllers = {
    createRequest,
    getAllRequests,
    cancelRequest,
};
