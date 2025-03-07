import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import config from "../config";
import AppError from "../errors/appError";
import catchAsync from "../utils/catchAsync";
import User from "../modules/user/user.model";
import { TUserRole } from "../modules/user/user.interface";
import { httpStatus } from "../config/httpStatus";
import { USER_STATUS } from "../constants/constants.global";

const auth = (...requiredRoles: TUserRole[]) => {
    return catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            const token = req.headers.authorization;

            if (!token) {
                throw new AppError(
                    httpStatus.UNAUTHORIZED,
                    "You are not authorized!",
                );
            }

            try {
                const decoded = jwt.verify(
                    token,
                    config.jwt_access_secret as string,
                ) as JwtPayload;

                const { role, email, iat } = decoded;

                const user = await User.isUserExistsByEmail(email);
                if (
                    !user ||
                    user?.isDeleted ||
                    user?.status === USER_STATUS.blocked
                ) {
                    throw new AppError(httpStatus.NOT_FOUND, "User not found");
                }

                if (
                    user?.passwordChangedAt &&
                    User.isJWTIssuedBeforePasswordChanged(
                        user?.passwordChangedAt,
                        iat as number,
                    )
                ) {
                    throw new AppError(
                        httpStatus.UNAUTHORIZED,
                        "You are not authorized",
                    );
                }

                if (requiredRoles && !requiredRoles.includes(role)) {
                    throw new AppError(
                        httpStatus.UNAUTHORIZED,
                        "You are not authorized!",
                    );
                }

                req.user = decoded as JwtPayload & { role: string };
                next();
            } catch (error) {
                if (error instanceof TokenExpiredError) {
                    return next(
                        new AppError(
                            httpStatus.UNAUTHORIZED,
                            "Token has expired! Please login again.",
                        ),
                    );
                }
                return next(
                    new AppError(httpStatus.UNAUTHORIZED, "Invalid token!"),
                );
            }
        },
    );
};

export default auth;
