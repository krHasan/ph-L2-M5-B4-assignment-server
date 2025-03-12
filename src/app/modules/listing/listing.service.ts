/* eslint-disable @typescript-eslint/no-explicit-any */
import QueryBuilder from "../../builder/QueryBuilder";
import { httpStatus } from "../../config/httpStatus";
import AppError from "../../errors/appError";
import { IImageFiles } from "../../interface/IImageFile";
import { TJwtPayload } from "../auth/auth.interface";
import User from "../user/user.model";
import { TListing } from "./listing.interface";
import { Listing } from "./listing.model";

const createListingIntoDB = async (
    listingData: Partial<TListing>,
    listingImages: IImageFiles,
) => {
    const { images } = listingImages;
    if (!images || images.length === 0) {
        throw new AppError(httpStatus.BAD_REQUEST, "House images are required");
    }

    listingData.imageUrls = images.map((image) => image.path);

    const isUserExists = await User.checkUserExist(
        String(listingData.landlordId),
    );
    if (!isUserExists) {
        throw new AppError(httpStatus.NOT_FOUND, "Landlord user not found");
    }

    const result = await Listing.create(listingData);
    return result;
};

const getAllListingsFromDB = async (query: Record<string, unknown>) => {
    const { minAmount, maxAmount, rentType, rentArea, ...pQuery } = query;

    // Build the filter object
    const filter: Record<string, any> = { isActive: true };

    // Filter by rentType
    console.log(query);
    if (rentType) {
        const rentTypeArray =
            typeof rentType === "string"
                ? rentType.split(",")
                : Array.isArray(rentType)
                  ? rentType
                  : [rentType];
        filter.rentType = { $in: rentTypeArray };
        console.log(filter);
    }

    // Filter by rentArea
    if (rentArea) {
        const rentAreaArray =
            typeof rentArea === "string"
                ? rentArea.split(",")
                : Array.isArray(rentArea)
                  ? rentArea
                  : [rentArea];
        filter.rentArea = { $in: rentAreaArray };
    }

    const listingQuery = new QueryBuilder(
        Listing.find(filter).populate({
            path: "landlordId",
        }),
        pQuery,
    )
        .search(["location", "description"])
        .filter()
        .sort()
        .paginate()
        .fields()
        .priceRange(Number(minAmount) || 0, Number(maxAmount) || Infinity);

    const listings = await listingQuery.modelQuery.lean();

    const meta = await listingQuery.countTotal();

    return {
        meta,
        result: listings,
    };
};

const getListingByIdFromDB = async (listingId: string) => {
    const listing = await Listing.findById(listingId).populate({
        path: "landlordId",
    });

    if (!listing) {
        throw new AppError(httpStatus.NOT_FOUND, "Listing not found");
    }

    if (!listing.isActive) {
        throw new AppError(httpStatus.BAD_REQUEST, "Listing is not active");
    }

    return listing;
};

const getMyListingsFromDB = async (
    query: Record<string, unknown>,
    authUser: TJwtPayload,
) => {
    const user = await User.isUserExistsByEmail(authUser.email);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    const { minPrice, maxPrice, ...pQuery } = query;

    const listingQuery = new QueryBuilder(
        Listing.find({ landlordId: user._id }).populate({
            path: "landlordId",
        }),
        pQuery,
    )
        .search(["location", "description"])
        .filter()
        .sort()
        .paginate()
        .fields()
        .priceRange(Number(minPrice) || 0, Number(maxPrice) || Infinity);

    const listings = await listingQuery.modelQuery.lean();

    const meta = await listingQuery.countTotal();

    return {
        meta,
        result: listings,
    };
};

const updateListing = async (
    listingId: string,
    payload: Partial<TListing>,
    listingImages: IImageFiles,
    authUser: TJwtPayload,
) => {
    const { images } = listingImages;

    const user = await User.isUserExistsByEmail(authUser.email);
    const listing = await Listing.findOne({
        landlordId: user?._id,
        _id: listingId,
    });

    if (!user?.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is not active");
    }
    if (!listing) {
        throw new AppError(httpStatus.NOT_FOUND, "Listing not found");
    }

    if (images && images.length > 0) {
        payload.imageUrls = images.map((image) => image.path);
    }

    return await Listing.findByIdAndUpdate(listingId, payload, { new: true });
};

const deleteListingFromDB = async (listingId: string) => {
    const listing = await Listing.findById(listingId);

    if (!listing || !listing.isActive) {
        throw new AppError(httpStatus.NOT_FOUND, "Listing not found");
    }

    return await Listing.findByIdAndUpdate(
        listingId,
        {
            isActive: false,
        },
        {
            new: true,
        },
    );
};

export const ListingServices = {
    createListingIntoDB,
    getAllListingsFromDB,
    getListingByIdFromDB,
    getMyListingsFromDB,
    updateListing,
    deleteListingFromDB,
};
