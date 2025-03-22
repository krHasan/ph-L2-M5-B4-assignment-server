/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from "mongoose";
import { httpStatus } from "../../config/httpStatus";
import AppError from "../../errors/appError";
import { TJwtPayload } from "../auth/auth.interface";
import User from "../user/user.model";
import { TRequest } from "./request.interface";
import { Listing } from "../listing/listing.model";
import { RequestModel } from "./request.model";
import QueryBuilder from "../../builder/QueryBuilder";
import {
    PAYMENT_STATUS,
    REQUEST_STATUS,
    USER_ROLE,
} from "../../constants/constants.global";

const createRequestIntoDB = async (
    requestData: Partial<TRequest>,
    authUser: TJwtPayload,
) => {
    const isUserExists = (await User.isUserExistsByEmail(
        String(authUser.email),
    )) as {
        _id: Types.ObjectId;
    };
    if (!isUserExists) {
        throw new AppError(httpStatus.NOT_FOUND, "Tenant user not found");
    }

    const isListingExists = await Listing.findById(requestData.listingId);
    if (!isListingExists) {
        throw new AppError(httpStatus.NOT_FOUND, "Listing not found");
    }

    const landlord = await User.findById(isListingExists.landlordId);

    if (!landlord || landlord.isDeleted) {
        throw new AppError(httpStatus.NOT_FOUND, "Landlord not found");
    }

    const saveData = {
        ...requestData,
        tenantId: isUserExists._id,
        landlordPhoneNumber: landlord?.phoneNumber,
        landlordId: landlord._id,
    };

    const result = await RequestModel.create(saveData);
    return result;
};

const getAllRequestsFromDB = async (
    query: Record<string, unknown>,
    authUser: TJwtPayload,
) => {
    const user = await User.isUserExistsByEmail(authUser.email);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    if (user.role === USER_ROLE.tenant) {
        const tenantId = new Types.ObjectId(user._id as string);
        const requestQuery = new QueryBuilder(
            RequestModel.find({ tenantId: tenantId })
                .populate({
                    path: "listingId",
                })
                .populate({ path: "tenantId" })
                .populate({ path: "landlordId" }),
            query,
        )
            .filter()
            .sort()
            .paginate()
            .fields();

        const listings = await requestQuery.modelQuery.lean();

        const meta = await requestQuery.countTotal();

        return {
            meta,
            result: listings,
        };
    } else if (user.role === USER_ROLE.landlord) {
        const landlordId = new Types.ObjectId(user._id as string);
        const requestQuery = new QueryBuilder(
            RequestModel.find({ landlordId: landlordId })
                .populate({
                    path: "listingId",
                })
                .populate({ path: "tenantId" })
                .populate({ path: "landlordId" }),
            query,
        )
            .filter()
            .sort()
            .paginate()
            .fields();

        const listings = await requestQuery.modelQuery.lean();

        const meta = await requestQuery.countTotal();

        return {
            meta,
            result: listings,
        };
    } else {
        const requestQuery = new QueryBuilder(
            RequestModel.find()
                .populate({
                    path: "listingId",
                })
                .populate({ path: "tenantId" })
                .populate({ path: "landlordId" }),
            query,
        )
            .filter()
            .sort()
            .paginate()
            .fields();

        const listings = await requestQuery.modelQuery.lean();

        const meta = await requestQuery.countTotal();

        return {
            meta,
            result: listings,
        };
    }
};

const cancelRequestIntoDB = async (requestId: string) => {
    const request = await RequestModel.findById(requestId);

    if (
        !request ||
        request.isCanceled ||
        request.status !== REQUEST_STATUS.pending ||
        request.paymentStatus === PAYMENT_STATUS.paid
    ) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            "You can not cancel this request",
        );
    }

    return await RequestModel.findByIdAndUpdate(
        requestId,
        {
            isCanceled: true,
            status: REQUEST_STATUS.canceled,
        },
        {
            new: true,
        },
    );
};

const updateRequestStatusIntoDB = async (
    requestId: string,
    payload: { status: string },
) => {
    const request = await RequestModel.findById(requestId);

    if (
        !request ||
        request.isCanceled ||
        request.status !== REQUEST_STATUS.pending ||
        request.paymentStatus === PAYMENT_STATUS.paid
    ) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            `You can not ${payload.status} this request`,
        );
    }

    return await RequestModel.findByIdAndUpdate(
        requestId,
        {
            status: payload.status,
        },
        {
            new: true,
        },
    );
};

export const RequestServices = {
    createRequestIntoDB,
    getAllRequestsFromDB,
    cancelRequestIntoDB,
    updateRequestStatusIntoDB,
};
