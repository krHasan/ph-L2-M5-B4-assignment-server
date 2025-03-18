import mongoose from "mongoose";
import { TUser } from "./user.interface";
import { USER_ROLE, USER_STATUS } from "../../constants/constants.global";
import AppError from "../../errors/appError";
import { httpStatus } from "../../config/httpStatus";
import User from "./user.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { UserSearchableFields } from "./user.constant";
import { TJwtPayload } from "../auth/auth.interface";

const registerUserIntoDB = async (userData: TUser) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        if (userData.role === USER_ROLE.admin) {
            throw new AppError(
                httpStatus.NOT_ACCEPTABLE,
                "Invalid role. Only Tenant or Landlord is allowed.",
            );
        }
        // Check if the user already exists by email
        const emailExists = await User.findOne({
            email: userData.email,
        }).session(session);

        if (emailExists) {
            throw new AppError(
                httpStatus.NOT_ACCEPTABLE,
                "Email is already registered",
            );
        }

        // Check if the user already exists by email
        const numberExists = await User.findOne({
            phoneNumber: userData.phoneNumber,
        }).session(session);

        if (numberExists) {
            throw new AppError(
                httpStatus.NOT_ACCEPTABLE,
                "Phone number is already registered",
            );
        }

        // Create the user
        const newUser = await User.create([userData], { session });
        if (!newUser) {
            throw new AppError(httpStatus.BAD_REQUEST, "Failed to create user");
        }
        await session.commitTransaction();

        return newUser;
    } catch (error) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        throw error;
    } finally {
        session.endSession();
    }
};

const getAllUserFromDB = async (query: Record<string, unknown>) => {
    const UserQuery = new QueryBuilder(User.find(), query)
        .search(UserSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await UserQuery.modelQuery;
    const meta = await UserQuery.countTotal();
    return {
        result,
        meta,
    };
};

const myProfile = async (authUser: TJwtPayload) => {
    const isUserExists = await User.isUserExistsByEmail(authUser.email);
    if (!isUserExists) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found!");
    }
    if (isUserExists.isDeleted || isUserExists.status === USER_STATUS.blocked) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is not active!");
    }
    return isUserExists;
};

const updateUserStatus = async (id: string) => {
    const user = await User.findById(id);

    if (!user || user.isDeleted) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    if (user.status === USER_STATUS.active) {
        return await User.findByIdAndUpdate(
            id,
            {
                status: USER_STATUS.blocked,
            },
            {
                new: true,
            },
        );
    } else {
        return await User.findByIdAndUpdate(
            id,
            {
                status: USER_STATUS.active,
            },
            {
                new: true,
            },
        );
    }
};

export const UserServices = {
    registerUserIntoDB,
    getAllUserFromDB,
    myProfile,
    updateUserStatus,
};
