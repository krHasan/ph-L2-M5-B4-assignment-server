import { Router } from "express";
import validateRequest from "../../middleware/validateRequest";
import { PaymentValidations } from "./payment.validation";
import { PaymentController } from "./payment.controller";

const router = Router();

router.post(
    "/initiate",
    validateRequest(PaymentValidations.createPaymentValidationSchema),
    PaymentController.createPayment,
);

export const PaymentRoutes = router;
