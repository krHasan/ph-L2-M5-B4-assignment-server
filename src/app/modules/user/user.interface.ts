/* eslint-disable no-unused-vars */
import { Model } from "mongoose";
import { USER_ROLE, USER_STATUS } from "../../constants/constants.global";

export type TUserRole = keyof typeof USER_ROLE;
export type TUserStatus = keyof typeof USER_STATUS;

export interface TUser {
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    needsPasswordChange: boolean;
    passwordChangedAt?: Date;
    role: TUserRole;
    status: TUserStatus;
    isDeleted: boolean;
}

export interface UserModel extends Model<TUser> {
    isUserExistsByEmail(email: string): Promise<TUser>;
    checkUserExist(id: string): Promise<TUser>;
    isPasswordMatched(
        plainTextPassword: string,
        hashedPassword: string,
    ): Promise<boolean>;
    isJWTIssuedBeforePasswordChanged(
        passwordChangedTimestamp: Date,
        jwtIssuedTimestamp: number,
    ): boolean;
}
