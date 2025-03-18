import { Router } from "express";
import { UserRoutes } from "../modules/user/user.routes";
// import { AuthRoutes } from "../modules/auth/auth.routes";
import { SSLRoutes } from "../modules/sslcommerz/sslcommerz.routes";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { ListingRoutes } from "../modules/listing/listing.routes";
import { RequestRoutes } from "../modules/request/request.routes";
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
    {
        path: "/listings",
        route: ListingRoutes,
    },
    {
        path: "/requests",
        route: RequestRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
