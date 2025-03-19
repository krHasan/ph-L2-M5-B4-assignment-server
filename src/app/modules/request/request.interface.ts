import { Types } from "mongoose";
import {
    PAYMENT_STATUS,
    REQUEST_STATUS,
} from "../../constants/constants.global";

type TRequestStatus = keyof typeof REQUEST_STATUS;
type TPaymentStatus = keyof typeof PAYMENT_STATUS;

export type TRequest = {
    listingId: Types.ObjectId;
    tenantId: Types.ObjectId;
    landlordId: Types.ObjectId;
    status: TRequestStatus;
    landlordPhoneNumber: string;
    paymentStatus: TPaymentStatus;
    moveInDate: Date;
    specialRequirements: string;
    isCanceled: boolean;
};
