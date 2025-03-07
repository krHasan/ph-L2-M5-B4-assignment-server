import mongoose, { Schema } from "mongoose";
import { TUser, UserModel } from "./user.interface";
import {
    USER_STATUS,
    userRoleArray,
    userStatusArray,
} from "../../constants/constants.global";
import config from "../../config";
import bcrypt from "bcrypt";
import AppError from "../../errors/appError";
import { httpStatus } from "../../config/httpStatus";

// Create the User schema based on the interface
const userSchema = new Schema<TUser, UserModel>(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        phoneNumber: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            select: 0,
        },
        needsPasswordChange: {
            type: Boolean,
            default: true,
        },
        passwordChangedAt: {
            type: Date,
        },
        role: {
            type: String,
            enum: userRoleArray,
        },
        status: {
            type: String,
            enum: userStatusArray,
            default: USER_STATUS.active,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

userSchema.pre("save", async function (next) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const user = this;
    user.password = await bcrypt.hash(
        user.password,
        Number(config.bcrypt_salt_rounds),
    );
    next();
});

userSchema.post("save", function (doc, next) {
    doc.password = "";
    next();
});

userSchema.set("toJSON", {
    transform: (_doc, ret) => {
        delete ret.password;
        return ret;
    },
});

userSchema.statics.isPasswordMatched = async function (
    plainTextPassword: string,
    hashedPassword: string,
) {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
};

userSchema.statics.isUserExistsByEmail = async function (email: string) {
    return await User.findOne({ email }).select("+password");
};

userSchema.statics.checkUserExist = async function (userId: string) {
    const existingUser = await this.findById(userId);

    if (!existingUser) {
        throw new AppError(httpStatus.NOT_ACCEPTABLE, "User does not exist!");
    }

    if (existingUser.isDeleted || existingUser.status === USER_STATUS.blocked) {
        throw new AppError(httpStatus.NOT_ACCEPTABLE, "User is not active!");
    }

    return existingUser;
};

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
    passwordChangedTimestamp,
    jwtIssuedTimestamp,
) {
    const passwordChangedTime =
        new Date(passwordChangedTimestamp).getTime() / 1000;
    return passwordChangedTime > jwtIssuedTimestamp;
};

userSchema.pre("find", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});

userSchema.pre("aggregate", function (next) {
    this.pipeline().unshift({
        $match: { isDeleted: { $ne: true } },
    });
    next();
});

userSchema.pre("findOne", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});

const User = mongoose.model<TUser, UserModel>("User", userSchema);
export default User;
