import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { PaymentServices } from "./payment.service";
import sendResponse from "../../utils/sendResponse";
import { httpStatus } from "../../config/httpStatus";

const createPayment = catchAsync(async (req: Request, res: Response) => {
    const result = await PaymentServices.createPaymentIntoDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Payment created successfully",
        data: result,
    });
});

export const PaymentController = {
    createPayment,
};
