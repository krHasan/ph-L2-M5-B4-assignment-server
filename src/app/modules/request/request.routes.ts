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

router.patch(
    "/cancel-request/:requestId",
    auth(USER_ROLE.tenant),
    RequestControllers.cancelRequest,
);

router.patch(
    "/change-request-status/:requestId",
    auth(USER_ROLE.landlord),
    validateRequest(RequestValidations.updateRequestStatusValidationSchema),
    RequestControllers.updateRequestStatus,
);

export const RequestRoutes = router;
