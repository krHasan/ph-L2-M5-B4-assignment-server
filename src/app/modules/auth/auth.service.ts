import config from "../../config";
import { httpStatus } from "../../config/httpStatus";
import { USER_STATUS } from "../../constants/constants.global";
import AppError from "../../errors/appError";
import { EmailHelper } from "../../utils/emailHelper";
import User from "../user/user.model";
import { TJwtPayload, TLoginUser } from "./auth.interface";
import { createToken, verifyToken } from "./auth.utils";
import bcrypt from "bcrypt";

const loginUser = async (payload: TLoginUser) => {
    const user = await User.isUserExistsByEmail(payload?.email);
    if (!user || user?.isDeleted || user?.status === USER_STATUS.blocked) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    const isPasswordMatched = await User.isPasswordMatched(
        payload?.password,
        user.password,
    );

    if (!isPasswordMatched) {
        throw new AppError(403, "Password didn't not matched");
    }

    const jwtPayload: TJwtPayload = {
        email: user.email,
        name: user.name,
        role: user.role,
    };

    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as string,
    );

    const refreshToken = createToken(
        jwtPayload,
        config.jwt_refresh_secret as string,
        config.jwt_refresh_expires_in as string,
    );

    return {
        accessToken,
        refreshToken,
        needsPasswordChange: user?.needsPasswordChange,
    };
};

const changePassword = async (
    userData: TJwtPayload,
    payload: { oldPassword: string; newPassword: string },
) => {
    const user = await User.isUserExistsByEmail(userData?.email);
    if (!user || user?.isDeleted || user?.status === USER_STATUS.blocked) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    const isPasswordMatched = await User.isPasswordMatched(
        payload?.oldPassword,
        user?.password,
    );

    if (!isPasswordMatched) {
        throw new AppError(httpStatus.FORBIDDEN, "Password did not matched");
    }

    const newHashedPassword = await bcrypt.hash(
        payload?.newPassword,
        Number(config.bcrypt_salt_rounds),
    );

    await User.findOneAndUpdate(
        {
            email: userData.email,
            role: userData.role,
        },
        {
            password: newHashedPassword,
            needsPasswordChange: false,
            passwordChangedAt: new Date(),
        },
    );

    return null;
};

const refreshToken = async (token: string) => {
    const decoded = verifyToken(token, config.jwt_refresh_secret as string);

    const { email, iat } = decoded;

    console.log(decoded);
    const user = await User.isUserExistsByEmail(email);
    if (!user || user?.isDeleted || user?.status === USER_STATUS.blocked) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    if (
        user?.passwordChangedAt &&
        User.isJWTIssuedBeforePasswordChanged(
            user?.passwordChangedAt,
            iat as number,
        )
    ) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized");
    }

    const jwtPayload: TJwtPayload = {
        email: user.email,
        name: user.name,
        role: user.role,
    };

    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as string,
    );

    return {
        accessToken,
    };
};

const forgetPassword = async (email: string) => {
    const user = await User.isUserExistsByEmail(email);
    if (!user || user?.isDeleted || user?.status === USER_STATUS.blocked) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    console.log(user.email);

    const jwtPayload: TJwtPayload = {
        email: user.email,
        name: user.name,
        role: user.role,
    };

    const resetToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        "10m",
    );

    const resetUILink = `${config.frontend_link}?email=${user.email}&token=${resetToken}`;

    EmailHelper.sendEmail(user.email, resetUILink, "Forgot Password");
};

const resetPassword = async (
    payload: { email: string; newPassword: string },
    token: string,
) => {
    const user = await User.isUserExistsByEmail(payload.email);
    if (!user || user?.isDeleted || user?.status === USER_STATUS.blocked) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    const decoded = verifyToken(token, config.jwt_access_secret as string);

    if (payload.email !== decoded.email) {
        throw new AppError(httpStatus.FORBIDDEN, "You are forbidden");
    }

    const newHashedPassword = await bcrypt.hash(
        payload?.newPassword,
        Number(config.bcrypt_salt_rounds),
    );

    await User.findOneAndUpdate(
        {
            email: decoded.email,
            role: decoded.role,
        },
        {
            password: newHashedPassword,
            needsPasswordChange: false,
            passwordChangedAt: new Date(),
        },
    );
};

export const AuthServices = {
    loginUser,
    refreshToken,
    changePassword,
    forgetPassword,
    resetPassword,
};
