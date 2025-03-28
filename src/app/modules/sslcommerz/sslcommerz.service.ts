// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import SSLCommerzPayment from "sslcommerz-lts";
import config from "../../config";
import AppError from "../../errors/appError";
import { Payment } from "../payment/payment.model";
import mongoose from "mongoose";
import { httpStatus } from "../../config/httpStatus";
import { RequestModel } from "../request/request.model";

const store_id = config.ssl.store_id as string;
const store_passwd = config.ssl.store_pass as string;
const is_live = false; // true for live, false for sandbox

// SSLCommerz init
const initPayment = async (paymentData: {
    total_amount: number;
    tran_id: string;
}) => {
    const { total_amount, tran_id } = paymentData;

    const data = {
        total_amount,
        currency: "BDT",
        tran_id, // Use unique tran_id for each API call
        success_url: `${config.ssl.validation_url}?tran_id=${tran_id}`,
        fail_url: config.ssl.failed_url as string,
        cancel_url: config.ssl.cancel_url as string,
        ipn_url: `${config.backend_link}/api/v1/ssl/ipn`,
        shipping_method: "Courier",
        product_name: "N/A.",
        product_category: "N/A",
        product_profile: "general",
        cus_name: "N/A",
        cus_email: "N/A",
        cus_add1: "Dhaka",
        cus_add2: "Dhaka",
        cus_city: "Dhaka",
        cus_state: "Dhaka",
        cus_postcode: "1000",
        cus_country: "Bangladesh",
        cus_phone: "01711111111",
        cus_fax: "01711111111",
        ship_name: "N/A",
        ship_add1: "Dhaka",
        ship_add2: "Dhaka",
        ship_city: "Dhaka",
        ship_state: "Dhaka",
        ship_postcode: 1000,
        ship_country: "Bangladesh",
    };

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

    try {
        const apiResponse = await sslcz.init(data);

        // Redirect the user to the payment gateway
        const GatewayPageURL = apiResponse.GatewayPageURL;

        if (GatewayPageURL) {
            return GatewayPageURL;
        } else {
            throw new AppError(
                httpStatus.BAD_GATEWAY,
                "Failed to generate payment gateway URL.",
            );
        }
    } catch (error) {
        console.log(error);
        throw new AppError(
            httpStatus.INTERNAL_SERVER_ERROR,
            "An error occurred while processing payment.",
        );
    }
};

const validatePaymentService = async (tran_id: string): Promise<boolean> => {
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        const validationResponse = await sslcz.transactionQueryByTransactionId({
            tran_id,
        });

        let data;
        if (
            validationResponse.element[0].status === "VALID" ||
            validationResponse.element[0].status === "VALIDATED"
        ) {
            data = {
                status: "paid",
                gatewayResponse: validationResponse.element[0],
            };
        } else if (
            validationResponse.element[0].status === "INVALID_TRANSACTION"
        ) {
            data = {
                status: "failed",
                gatewayResponse: validationResponse.element[0],
            };
        } else {
            data = {
                status: "failed",
                gatewayResponse: validationResponse.element[0],
            };
        }
        const updatedPayment = await Payment.findOneAndUpdate(
            { transactionId: validationResponse.element[0].tran_id },
            data,
            { new: true, session },
        );
        if (!updatedPayment) {
            throw new Error("Payment not updated");
        }

        const updatedListing = await RequestModel.findByIdAndUpdate(
            updatedPayment?.requestId,
            {
                paymentStatus: data.status,
            },
            { new: true, session },
        );

        if (!updatedListing) {
            throw new Error("Listing not updated");
        }

        if (data.status === "failed") {
            throw new Error("Payment failed");
        }
        // Commit transaction only if no errors occurred
        await session.commitTransaction();
        session.endSession();
        return true;
    } catch (error) {
        // Only abort the transaction if an error occurred
        await session.abortTransaction();
        session.endSession();
        console.error(error); // Log the error for debugging
        return false;
    }
};

export const sslService = {
    initPayment,
    validatePaymentService,
};
