import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { ListingServices } from "./listing.service";
import { IImageFiles } from "../../interface/IImageFile";
import sendResponse from "../../utils/sendResponse";
import { httpStatus } from "../../config/httpStatus";

const createListing = catchAsync(async (req: Request, res: Response) => {
    const result = await ListingServices.createListingIntoDB(
        req.body,
        req.files as IImageFiles,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "List is created successfully",
        data: result,
    });
});

export const ListingControllers = {
    createListing,
};
