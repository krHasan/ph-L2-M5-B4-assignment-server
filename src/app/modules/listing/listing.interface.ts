import { Types } from "mongoose";
import { LISTING_STATUS, RENT_AREA, RENT_TYPE } from "./listing.constants";

type TRentType = keyof typeof RENT_TYPE;
type TRentArea = keyof typeof RENT_AREA;
type TListingStatus = keyof typeof LISTING_STATUS;

export type TListing = {
    landlordId: Types.ObjectId;
    rentArea: TRentArea;
    location: string;
    description?: string;
    rentType: TRentType;
    rentAmount: number;
    numberOfBedrooms: number;
    imageUrls: string[];
    amenities: string[];
    isActive: boolean;
    status: TListingStatus;
};
