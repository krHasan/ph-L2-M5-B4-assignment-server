import { z } from "zod";
import {
    userRoleArray,
    userStatusArray,
} from "../../constants/constants.global";

const createUserValidationSchema = z.object({
    body: z.object({
        name: z
            .string()
            .min(2)
            .max(30)
            .refine((value) => /^[A-Z]/.test(value), {
                message: "Name must start with a capital letter",
            }),
        email: z.string().email("Invalid email address"),
        phoneNumber: z
            .string()
            .regex(/^\d{11}$/, "Phone number must be exactly 11 digits long")
            .optional(),
        password: z
            .string()
            .min(6, "Password must be at least 6 characters long"),
        role: z.enum([...userRoleArray] as [string, ...string[]]),
    }),
});

const changeStatusValidationSchema = z.object({
    body: z.object({
        status: z.enum([...userStatusArray] as [string, ...string[]]),
    }),
});

export const UserValidation = {
    createUserValidationSchema,
    changeStatusValidationSchema,
};
