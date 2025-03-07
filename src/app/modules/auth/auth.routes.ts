import { Router } from "express";
import { AuthValidations } from "./auth.validation";
import validateRequest from "../../middleware/validateRequest";
import { AuthControllers } from "./auth.controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../../constants/constants.global";
// import { AuthController } from "./auth.controller";
// import auth from "../../middleware/auth";
// import { UserRole } from "../user/user.interface";
// import validateRequest from "../../middleware/validateRequest";

const router = Router();

router.post(
    "/login",
    validateRequest(AuthValidations.loginValidationSchema),
    AuthControllers.loginUser,
);

router.post(
    "/change-password",
    auth(USER_ROLE.admin, USER_ROLE.tenant, USER_ROLE.landlord),
    validateRequest(AuthValidations.changePasswordValidationSchema),
    AuthControllers.changePassword,
);

router.post(
    "/refresh-token",
    validateRequest(AuthValidations.refreshTokenValidationSchema),
    AuthControllers.refreshToken,
);

router.post(
    "/forget-password",
    validateRequest(AuthValidations.forgetPasswordValidationSchema),
    AuthControllers.forgotPassword,
);

router.post(
    "/reset-password",
    validateRequest(AuthValidations.resetPasswordValidationSchema),
    AuthControllers.resetPassword,
);

export const AuthRoutes = router;
