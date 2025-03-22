import { Schema, model } from "mongoose";
import { IPayment } from "./payment.interface";
import {
    PAYMENT_STATUS,
    PAYMENT_TYPE,
    paymentStatusArray,
    paymentTypeArray,
} from "../../constants/constants.global";

const paymentSchema = new Schema<IPayment>(
    {
        requestId: {
            type: Schema.Types.ObjectId,
            ref: "Request",
            required: true,
        },
        tenantId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        listingId: {
            type: Schema.Types.ObjectId,
            ref: "Listing",
            required: true,
        },
        method: {
            type: String,
            enum: paymentTypeArray,
            required: true,
            default: PAYMENT_TYPE.Online,
        },
        status: {
            type: String,
            enum: paymentStatusArray,
            required: true,
            default: PAYMENT_STATUS.pending,
        },
        transactionId: {
            type: String,
            default: null,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        gatewayResponse: {
            type: Schema.Types.Mixed,
            default: null,
        },
    },
    {
        timestamps: true,
    },
);

export const Payment = model<IPayment>("Payment", paymentSchema);
