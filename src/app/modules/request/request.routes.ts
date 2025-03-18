import { Router } from "express";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../../constants/constants.global";
import validateRequest from "../../middleware/validateRequest";
import { RequestValidations } from "./request.validation";
import { RequestControllers } from "./request.controller";

const router = Router();

router.post(
    "/create-request",
    auth(USER_ROLE.tenant),
    validateRequest(RequestValidations.createRequestValidationSchema),
    RequestControllers.createRequest,
);

router.get(
    "/",
    auth(USER_ROLE.landlord, USER_ROLE.tenant, USER_ROLE.admin),
    RequestControllers.getAllRequests,
);

// router.get(
//     "/my-listings",
//     auth(USER_ROLE.landlord),
//     ListingControllers.getMyListings,
// );

// router.get("/:listingId", ListingControllers.getListingById);

// router.patch(
//     "/:listingId",
//     auth(USER_ROLE.landlord),
//     multerUpload.fields([{ name: "images" }]),
//     parseBody,
//     validateRequest(ListingValidations.updateListingValidationSchema),
//     ListingControllers.updateListing,
// );

// router.patch(
//     "/update-status/:listingId",
//     auth(USER_ROLE.admin, USER_ROLE.landlord),
//     ListingControllers.updateListingStatus,
// );

export const RequestRoutes = router;
