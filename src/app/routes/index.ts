import { Router } from "express";
import { UserRoutes } from "../modules/user/user.routes";
// import { AuthRoutes } from "../modules/auth/auth.routes";
import { SSLRoutes } from "../modules/sslcommerz/sslcommerz.routes";
import { AuthRoutes } from "../modules/auth/auth.routes";
const router = Router();

const moduleRoutes = [
    {
        path: "/auth",
        route: AuthRoutes,
    },
    {
        path: "/user",
        route: UserRoutes,
    },
    {
        path: "/ssl",
        route: SSLRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
