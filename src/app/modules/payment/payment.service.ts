import { httpStatus } from "../../config/httpStatus";
import AppError from "../../errors/appError";
import { Listing } from "../listing/listing.model";
import { RequestModel } from "../request/request.model";
import { sslService } from "../sslcommerz/sslcommerz.service";
import User from "../user/user.model";
import { Payment } from "./payment.model";
import { generateTransactionId } from "./payment.utils";

const createPaymentIntoDB = async (payload: Record<string, string>) => {
    const isRequestExists = await RequestModel.findById(payload.requestId);
    if (!isRequestExists) {
        throw new AppError(httpStatus.NOT_FOUND, "Request not found");
    }
    const isTenantExists = await User.findById(isRequestExists.tenantId);
    if (!isTenantExists) {
        throw new AppError(httpStatus.NOT_FOUND, "Tenant user not found");
    }
    const isListingExists = await Listing.findById(isRequestExists.listingId);
    if (!isListingExists) {
        throw new AppError(httpStatus.NOT_FOUND, "Listing user not found");
    }

    const transactionId = generateTransactionId();

    const payment = new Payment({
        requestId: isRequestExists._id,
        tenantId: isTenantExists._id,
        listingId: isListingExists._id,
        transactionId,
        amount: isListingExists.rentAmount,
    });

    const res = await payment.save();

    if (res) {
        let result = await sslService.initPayment({
            total_amount: isListingExists.rentAmount,
            tran_id: transactionId,
        });
        return (result = { paymentUrl: result });
    }
};

const getAllPayments = async () => {
    return [{ message: "Service logic here" }];
};

export const PaymentServices = {
    createPaymentIntoDB,
    getAllPayments,
};
