import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { ListingServices } from "./listing.service";
import { IImageFiles } from "../../interface/IImageFile";
import sendResponse from "../../utils/sendResponse";
import { httpStatus } from "../../config/httpStatus";
import { TJwtPayload } from "../auth/auth.interface";

const createListing = catchAsync(async (req: Request, res: Response) => {
    const result = await ListingServices.createListingIntoDB(
        req.body,
        req.body.landlordEmail,
        req.files as IImageFiles,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "List is created successfully",
        data: result,
    });
});

const getAllListings = catchAsync(async (req: Request, res: Response) => {
    const result = await ListingServices.getAllListingsFromDB(req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "List are retrieved successfully",
        meta: result.meta,
        data: result.result,
    });
});

const getListingById = catchAsync(async (req: Request, res: Response) => {
    const result = await ListingServices.getListingByIdFromDB(
        req.params.listingId,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "List is retrieved successfully",
        data: result,
    });
});

const getMyListings = catchAsync(async (req: Request, res: Response) => {
    console.log(req.user);
    const result = await ListingServices.getMyListingsFromDB(
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

const updateListing = catchAsync(async (req, res) => {
    const {
        user,
        body: payload,
        params: { listingId },
    } = req;

    const result = await ListingServices.updateListing(
        listingId,
        payload,
        req.files as IImageFiles,
        user as TJwtPayload,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "List is updated successfully",
        data: result,
    });
});

const deleteListing = catchAsync(async (req: Request, res: Response) => {
    const result = await ListingServices.deleteListingFromDB(
        req.params.listingId,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "List is deleted successfully",
        data: result,
    });
});

const updateListingStatus = catchAsync(async (req: Request, res: Response) => {
    const result = await ListingServices.updateListingStatusIntoDB(
        req.params.listingId,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "List is updated successfully",
        data: result,
    });
});

export const ListingControllers = {
    createListing,
    getAllListings,
    getListingById,
    getMyListings,
    updateListing,
    deleteListing,
    updateListingStatus,
};
