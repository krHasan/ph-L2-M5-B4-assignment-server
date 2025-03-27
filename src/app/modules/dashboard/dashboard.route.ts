import { Router } from "express";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../../constants/constants.global";
import { DashboardController } from "./dashboard.controller";

const router = Router();

router.get(
    "/",
    auth(USER_ROLE.admin, USER_ROLE.landlord, USER_ROLE.tenant),
    DashboardController.getStates,
);

export const DashboardRoutes = router;
