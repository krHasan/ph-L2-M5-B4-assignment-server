import { Types } from "mongoose";
import { httpStatus } from "../../config/httpStatus";
import { USER_ROLE } from "../../constants/constants.global";
import AppError from "../../errors/appError";
import { TJwtPayload } from "../auth/auth.interface";
import User from "../user/user.model";
import { Listing } from "../listing/listing.model";
import { RequestModel } from "../request/request.model";

const getDashboardStatesFromDB = async (authUser: TJwtPayload) => {
    const user = await User.isUserExistsByEmail(authUser.email);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    if (user.role === USER_ROLE.tenant) {
        //tenant
        const tenantId = new Types.ObjectId(user._id as string);
        const [totalRequests] = await Promise.all([
            RequestModel.countDocuments({ tenantId: tenantId }),
        ]);

        return {
            result: { totalRequests },
        };
    } else if (user.role === USER_ROLE.landlord) {
        //landlord
        const landlordId = new Types.ObjectId(user._id as string);
        const [totalListings, totalRequests] = await Promise.all([
            Listing.countDocuments({
                isDeleted: false,
                landlordId: landlordId,
            }),
            RequestModel.countDocuments({ landlordId: landlordId }),
        ]);

        return {
            result: { totalListings, totalRequests },
        };
    } else {
        //admin
        const [totalListings, totalRequests, totalUsers] = await Promise.all([
            Listing.countDocuments({ isDeleted: false }),
            RequestModel.countDocuments(),
            User.countDocuments({ isDeleted: false }),
        ]);

        return {
            result: { totalListings, totalRequests, totalUsers },
        };
    }
};

export const DashboardServices = {
    getDashboardStatesFromDB,
};
