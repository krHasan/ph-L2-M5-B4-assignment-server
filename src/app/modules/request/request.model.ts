import { model, Schema } from "mongoose";
import { TRequest } from "./request.interface";
import {
    PAYMENT_STATUS,
    paymentStatusArray,
    REQUEST_STATUS,
    requestStatusArray,
} from "../../constants/constants.global";

const requestSchema = new Schema<TRequest>(
    {
        listingId: {
            type: Schema.Types.ObjectId,
            ref: "Listing",
            required: [true, "Listing id is required"],
        },
        tenantId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User id is required"],
        },
        landlordId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Landlord id is required"],
        },
        status: {
            type: String,
            enum: requestStatusArray,
            required: [true, "Request status is required"],
            default: REQUEST_STATUS.pending,
        },
        landlordPhoneNumber: {
            type: String,
            required: [true, "Landlord Phone Number is required"],
            trim: true,
        },
        paymentStatus: {
            type: String,
            enum: paymentStatusArray,
            default: PAYMENT_STATUS.pending,
        },
        moveInDate: {
            type: Date,
            required: [true, "Move In Date is required"],
        },
        specialRequirements: {
            type: String,
        },
        isCanceled: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

export const RequestModel = model<TRequest>("Request", requestSchema);
