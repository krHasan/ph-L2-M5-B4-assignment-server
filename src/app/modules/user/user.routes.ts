import { Router } from "express";
import validateRequest from "../../middleware/validateRequest";
import { UserValidation } from "./user.validation";
import { UserControllers } from "./user.controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../../constants/constants.global";

const router = Router();

router.post(
    "/create-user",
    validateRequest(UserValidation.createUserValidationSchema),
    UserControllers.registerUser,
);

router.get("/", auth(USER_ROLE.admin), UserControllers.getAllUser);

router.get(
    "/me",
    auth(USER_ROLE.tenant, USER_ROLE.admin, USER_ROLE.landlord),
    UserControllers.myProfile,
);

router.post(
    "/change-status/:id",
    auth(USER_ROLE.admin),
    UserControllers.updateUserStatus,
);

export const UserRoutes = router;
