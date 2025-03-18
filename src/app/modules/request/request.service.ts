/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from "mongoose";
import { httpStatus } from "../../config/httpStatus";
import AppError from "../../errors/appError";
import { TJwtPayload } from "../auth/auth.interface";
import User from "../user/user.model";
import { TRequest } from "./request.interface";
import { Listing } from "../listing/listing.model";
import { RequestModel } from "./request.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { USER_ROLE } from "../../constants/constants.global";

const createRequestIntoDB = async (
    requestData: Partial<TRequest>,
    authUser: TJwtPayload,
) => {
    const isUserExists = (await User.isUserExistsByEmail(
        String(authUser.email),
    )) as {
        _id: Types.ObjectId;
    };
    if (!isUserExists) {
        throw new AppError(httpStatus.NOT_FOUND, "Tenant user not found");
    }

    const isListingExists = await Listing.findById(requestData.listingId);
    if (!isListingExists) {
        throw new AppError(httpStatus.NOT_FOUND, "Listing not found");
    }

    const landlord = await User.findById(isListingExists.landlordId);

    if (!landlord || landlord.isDeleted) {
        throw new AppError(httpStatus.NOT_FOUND, "Landlord not found");
    }

    const saveData = {
        ...requestData,
        tenantId: isUserExists._id,
        landlordPhoneNumber: landlord?.phoneNumber,
        landlordId: landlord._id,
    };

    const result = await RequestModel.create(saveData);
    return result;
};

// const getAllListingsFromDB = async (query: Record<string, unknown>) => {
//     const { minAmount, maxAmount, rentType, rentArea, ...pQuery } = query;

//     // Build the filter object
//     const filter: Record<string, any> = { isActive: true };

//     // Filter by rentType
//     if (rentType) {
//         const rentTypeArray =
//             typeof rentType === "string"
//                 ? rentType.split(",")
//                 : Array.isArray(rentType)
//                   ? rentType
//                   : [rentType];
//         filter.rentType = { $in: rentTypeArray };
//     }

//     // Filter by rentArea
//     if (rentArea) {
//         const rentAreaArray =
//             typeof rentArea === "string"
//                 ? rentArea.split(",")
//                 : Array.isArray(rentArea)
//                   ? rentArea
//                   : [rentArea];
//         filter.rentArea = { $in: rentAreaArray };
//     }

//     const listingQuery = new QueryBuilder(
//         Listing.find(filter).populate({
//             path: "landlordId",
//         }),
//         pQuery,
//     )
//         .search(["location", "description"])
//         .filter()
//         .sort()
//         .paginate()
//         .fields()
//         .priceRange(Number(minAmount) || 0, Number(maxAmount) || Infinity);

//     const listings = await listingQuery.modelQuery.lean();

//     const meta = await listingQuery.countTotal();

//     return {
//         meta,
//         result: listings,
//     };
// };

// const getListingByIdFromDB = async (listingId: string) => {
//     const listing = await Listing.findById(listingId).populate({
//         path: "landlordId",
//     });

//     if (!listing) {
//         throw new AppError(httpStatus.NOT_FOUND, "Listing not found");
//     }

//     if (!listing.isActive) {
//         throw new AppError(httpStatus.BAD_REQUEST, "Listing is not active");
//     }

//     return listing;
// };

const getAllRequestsFromDB = async (
    query: Record<string, unknown>,
    authUser: TJwtPayload,
) => {
    const user = await User.isUserExistsByEmail(authUser.email);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    if (user.role === USER_ROLE.tenant) {
        const tenantId = new Types.ObjectId(user._id as string);
        const requestQuery = new QueryBuilder(
            RequestModel.find({ tenantId: tenantId })
                .populate({
                    path: "listingId",
                })
                .populate({ path: "tenantId" })
                .populate({ path: "landlordId" }),
            query,
        )
            .filter()
            .sort()
            .paginate()
            .fields();

        const listings = await requestQuery.modelQuery.lean();

        const meta = await requestQuery.countTotal();

        return {
            meta,
            result: listings,
        };
    } else if (user.role === USER_ROLE.landlord) {
        const landlordId = new Types.ObjectId(user._id as string);
        const requestQuery = new QueryBuilder(
            RequestModel.find({ landlordId: landlordId })
                .populate({
                    path: "listingId",
                })
                .populate({ path: "tenantId" })
                .populate({ path: "landlordId" }),
            query,
        )
            .filter()
            .sort()
            .paginate()
            .fields();

        const listings = await requestQuery.modelQuery.lean();

        const meta = await requestQuery.countTotal();

        return {
            meta,
            result: listings,
        };
    } else {
        const requestQuery = new QueryBuilder(
            RequestModel.find()
                .populate({
                    path: "listingId",
                })
                .populate({ path: "tenantId" })
                .populate({ path: "landlordId" }),
            query,
        )
            .filter()
            .sort()
            .paginate()
            .fields();

        const listings = await requestQuery.modelQuery.lean();

        const meta = await requestQuery.countTotal();

        return {
            meta,
            result: listings,
        };
    }
};

// const updateListing = async (
//     listingId: string,
//     payload: Partial<TListing>,
//     listingImages: IImageFiles,
//     authUser: TJwtPayload,
// ) => {
//     const { images } = listingImages;

//     const user = await User.isUserExistsByEmail(authUser.email);
//     const listing = await Listing.findOne({
//         landlordId: user?._id,
//         _id: listingId,
//     });

//     if (user?.isDeleted) {
//         throw new AppError(httpStatus.BAD_REQUEST, "User is not active");
//     }
//     if (!listing) {
//         throw new AppError(httpStatus.NOT_FOUND, "Listing not found");
//     }

//     if (images && images.length > 0) {
//         payload.imageUrls = images.map((image) => image.path);
//     }

//     return await Listing.findByIdAndUpdate(listingId, payload, { new: true });
// };

// const deleteListingFromDB = async (listingId: string) => {
//     const listing = await Listing.findById(listingId);

//     if (!listing || listing.isDeleted) {
//         throw new AppError(httpStatus.NOT_FOUND, "Listing not found");
//     }

//     return await Listing.findByIdAndUpdate(
//         listingId,
//         {
//             isDeleted: true,
//             isActive: false,
//         },
//         {
//             new: true,
//         },
//     );
// };

// const updateListingStatusIntoDB = async (listingId: string) => {
//     const listing = await Listing.findById(listingId);

//     if (!listing || listing.isDeleted) {
//         throw new AppError(httpStatus.NOT_FOUND, "Listing not found");
//     }

//     return await Listing.findByIdAndUpdate(
//         listingId,
//         {
//             isActive: !listing.isActive,
//         },
//         {
//             new: true,
//         },
//     );
// };

export const RequestServices = {
    createRequestIntoDB,
    getAllRequestsFromDB,
};
