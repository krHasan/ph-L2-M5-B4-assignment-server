import { Router } from "express";
import { UserRoutes } from "../modules/user/user.routes";
import { SSLRoutes } from "../modules/sslcommerz/sslcommerz.routes";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { ListingRoutes } from "../modules/listing/listing.routes";
import { RequestRoutes } from "../modules/request/request.routes";
import { PaymentRoutes } from "../modules/payment/payment.routes";
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
    {
        path: "/payments",
        route: PaymentRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
