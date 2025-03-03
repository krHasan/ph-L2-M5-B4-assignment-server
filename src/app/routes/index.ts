import { Router } from "express";
import { UserRoutes } from "../modules/user/user.routes";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { SSLRoutes } from "../modules/sslcommerz/sslcommerz.routes";
const router = Router();

const moduleRoutes = [
    {
        path: "/user",
        route: UserRoutes,
    },
    {
        path: "/auth",
        route: AuthRoutes,
    },

    {
        path: "/ssl",
        route: SSLRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
