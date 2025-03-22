/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from "mongoose";
import { PAYMENT_STATUS, PAYMENT_TYPE } from "../../constants/constants.global";

type TPaymentStatus = keyof typeof PAYMENT_STATUS;
type TPaymentType = keyof typeof PAYMENT_TYPE;

export interface IPayment {
    requestId: Types.ObjectId;
    tenantId: Types.ObjectId;
    listingId: Types.ObjectId;
    method: TPaymentType;
    status: TPaymentStatus;
    transactionId?: string;
    amount: number;
    gatewayResponse?: Record<string, any>;
    createdAt?: Date;
    updatedAt?: Date;
}
