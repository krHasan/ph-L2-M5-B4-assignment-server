import { z } from "zod";

const createRequestValidationSchema = z.object({
    body: z.object({
        listingId: z.string({
            required_error: "listingId is required",
        }),
        moveInDate: z.string().datetime(),
        specialRequirements: z.string().optional(),
    }),
});

export const RequestValidations = {
    createRequestValidationSchema,
};
