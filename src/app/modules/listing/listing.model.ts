import { model, Schema } from "mongoose";
import { TListing } from "./listing.interface";
import {
    LISTING_STATUS,
    listingStatusArray,
    RENT_TYPE,
    rentAreaArray,
    rentTypeArray,
} from "./listing.constants";

const listingSchema = new Schema<TListing>(
    {
        landlordId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Landlord id is required"],
        },
        rentArea: {
            type: String,
            enum: rentAreaArray,
            required: [true, "Rent Area is required"],
        },
        location: {
            type: String,
            required: [true, "Location is required"],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        rentType: {
            type: String,
            enum: rentTypeArray,
            default: RENT_TYPE.family,
        },
        rentAmount: {
            type: Number,
            required: [true, "Rent amount is required"],
            min: 0,
        },
        numberOfBedrooms: {
            type: Number,
            required: [true, "Number of bedrooms is required"],
            min: 0,
        },
        imageUrls: {
            type: [String],
            required: [true, "Image is required"],
        },
        amenities: {
            type: [String],
            default: [],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        status: {
            type: String,
            enum: listingStatusArray,
            default: LISTING_STATUS.Available,
        },
    },
    {
        timestamps: true,
    },
);

export const Listing = model<TListing>("Listing", listingSchema);
