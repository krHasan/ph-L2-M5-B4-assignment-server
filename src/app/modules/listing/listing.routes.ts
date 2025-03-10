import { Router } from "express";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../../constants/constants.global";
import { multerUpload } from "../../config/multer.config";
import { parseBody } from "../../middleware/bodyParser";
import validateRequest from "../../middleware/validateRequest";
import { ListingValidations } from "./listing.validation";
import { ListingControllers } from "./listing.controller";

const router = Router();

router.post(
    "/create-list",
    auth(USER_ROLE.landlord),
    multerUpload.fields([{ name: "images" }]),
    parseBody,
    validateRequest(ListingValidations.createListingValidationSchema),
    ListingControllers.createListing,
);

export const ListingRoutes = router;
