/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { httpStatus } from "../../config/httpStatus";
import AppError from "../../errors/appError";
import { TJwtPayload } from "./auth.interface";

type StringValue = any;

export const createToken = (
    jwtPayload: TJwtPayload,
    secret: string,
    expiresIn: number | StringValue | undefined,
) => {
    if (!secret) throw new Error("JWT secret is required");

    const signOptions: SignOptions = {
        expiresIn: expiresIn, // Ensure this matches the correct type
    };

    return jwt.sign(jwtPayload, secret, {
        expiresIn,
    });
};

export const verifyToken = (token: string, secret: string) => {
    try {
        return jwt.verify(token, secret) as JwtPayload;
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    } catch (error) {
        console.log(error);
        throw new AppError(
            httpStatus.UNAUTHORIZED,
            "You are not authorized ..",
        );
    }
};
