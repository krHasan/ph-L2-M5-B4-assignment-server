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
        isDeleted: {
            type: Boolean,
            default: false,
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

listingSchema.pre("find", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});

listingSchema.pre("aggregate", function (next) {
    this.pipeline().unshift({
        $match: { isDeleted: { $ne: true } },
    });
    next();
});

listingSchema.pre("findOne", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});

export const Listing = model<TListing>("Listing", listingSchema);
