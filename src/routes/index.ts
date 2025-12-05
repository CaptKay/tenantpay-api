import { Router } from "express";
import { authRoutes } from '../modules/auth/auth.routes';
import { membersRoutes } from '../modules/members/members.routes';
import { paymentsRoutes } from "../modules/payments/payments.routes";

const router = Router();

router.get("/health", (req, res) => {
    res.json({
        status: "ok",
        service: "TenantPay API",
        timestamp: new Date().toISOString(),
    })
})


// Auth Routes
router.use("/auth", authRoutes);

//member Routes
router.use("/members", membersRoutes);

//payment Routes
router.use("/payments", paymentsRoutes);

// //receipt Routes
// router.use("/receipt", receiptRoutes);

export { router as rootRouter }
