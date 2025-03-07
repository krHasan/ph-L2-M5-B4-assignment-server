import { TUserRole } from "../user/user.interface";

export type TLoginUser = {
    email: string;
    password: string;
};

export type TJwtPayload = {
    email: string;
    name: string;
    role: TUserRole;
};
