import { httpStatus } from "../../config/httpStatus";
import AppError from "../../errors/appError";
import { IImageFiles } from "../../interface/IImageFile";
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

export const ListingServices = {
    createListingIntoDB,
};
