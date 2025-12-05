import { Router } from "express";
import { PaymentsController } from "./payments.controller";
import { authMiddleware } from "../../core/middleware/authMiddleware";
import { validateBody } from "../../core/middleware/validateRequest";
import { createPaymentSchema } from "./payments.validation";
import { validateSendReceipt } from "../notifications/notifications.validation";

const router = Router();
const paymentsController = new PaymentsController();

router.use(authMiddleware);

router.post("/", validateBody(createPaymentSchema), (req,res,next) => paymentsController.create(req as any,res,next));
router.get('/:id', (req,res) => paymentsController.getById(req as any,res));
router.get('/:id/receipt', (req,res) => paymentsController.downloadReceipt(req as any, res));
router.post('/:id/send-receipt', validateSendReceipt, (req,res,next) => paymentsController.sendReceipt(req as any, res, next))

export {router as paymentsRoutes}