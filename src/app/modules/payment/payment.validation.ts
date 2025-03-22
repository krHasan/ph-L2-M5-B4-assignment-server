import { z } from "zod";

const createPaymentValidationSchema = z.object({
    body: z.object({
        requestId: z.string({
            required_error: "requestId is required",
        }),
    }),
});

export const PaymentValidations = {
    createPaymentValidationSchema,
};
