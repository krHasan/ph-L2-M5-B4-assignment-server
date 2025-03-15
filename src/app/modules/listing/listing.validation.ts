import { z } from "zod";
import { rentAreaArray, rentTypeArray } from "./listing.constants";

const createListingValidationSchema = z.object({
    body: z.object({
        landlordEmail: z.string({
            required_error: "Landlord info is required",
        }),
        rentArea: z.enum(rentAreaArray as [string, ...string[]]),
        location: z.string({
            required_error: "Rent area is required",
        }),
        description: z
            .string()
            .min(1, "Description cannot be empty")
            .optional(),
        rentType: z.enum(rentTypeArray as [string, ...string[]]),
        rentAmount: z
            .number({
                required_error: "Rent amount is required",
            })
            .min(0, "Rent amount cannot be less than 0"),
        numberOfBedrooms: z
            .number({
                required_error: "Number of bedrooms is required",
            })
            .min(0, "Number of bedrooms cannot be less than 0"),
        amenities: z
            .array(
                z.string({
                    required_error: "Amenities is required",
                }),
            )
            .min(1, "Amenities cannot be empty"),
    }),
});

const updateListingValidationSchema = z.object({
    body: z.object({
        landlordEmail: z
            .string({
                required_error: "Landlord info is required",
            })
            .optional(),
        location: z
            .string({
                required_error: "Location is required",
            })
            .optional(),
        description: z
            .string()
            .min(1, "Description cannot be empty")
            .optional(),
        rentType: z.enum(rentTypeArray as [string, ...string[]]).optional(),
        rentAmount: z
            .number({
                required_error: "Rent amount is required",
            })
            .min(0, "Rent amount cannot be less than 0")
            .optional(),
        numberOfBedrooms: z
            .number({
                required_error: "Number of bedrooms is required",
            })
            .min(0, "Number of bedrooms cannot be less than 0")
            .optional(),
        amenities: z
            .array(
                z.string({
                    required_error: "Amenities is required",
                }),
            )
            .min(1, "Amenities cannot be empty")
            .optional(),
    }),
});

export const ListingValidations = {
    createListingValidationSchema,
    updateListingValidationSchema,
};
