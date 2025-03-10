import { Types } from "mongoose";
import { RENT_TYPE } from "./listing.constants";

type TRentType = keyof typeof RENT_TYPE;

export type TListing = {
    landlordId: Types.ObjectId;
    location: string;
    description?: string;
    rentType: TRentType;
    rentAmount: number;
    numberOfBedrooms: number;
    imageUrls: string[];
    amenities: string[];
};
