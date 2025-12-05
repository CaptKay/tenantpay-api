import path from "path";

import { NextFunction, Response } from "express";
import { PaymentsService } from "./payments.service";
import { CreatePaymentDto } from "./payments.dtos";
import { AuthenticatedRequest } from "../../core/middleware/authMiddleware";
import { ReceiptsService } from "../receipts/receipts.service";
import { NotificationsService } from "../notifications/notifications.service";
import { SendReceiptNotificationDto } from "../notifications/notifications.dtos";

const paymentsService = new PaymentsService();
const receiptsService = new ReceiptsService();
const notificationService = new NotificationsService();

export class PaymentsController {
    async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const { memberId, amount, currency, method } = req.body as CreatePaymentDto;

            if (!memberId || !amount || !currency || !method) {
                return next(new Error("memberId, amount, currency and method are required"))
            }

            const orgId = req.user.orgId;
            const userId = req.user.userId;
            const role = req.user.role;

            const payment = await paymentsService.createPayment(orgId, userId, role, { memberId, amount, currency, method });

            return res.status(201).json(payment);

        } catch (error) {
            console.error("Create payment error:", error)
            return next(error)
        }

    }

    async getById(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ message: "Payment ID is required" })
            }

            const orgId = req.user.orgId;

            const payment = await paymentsService.getPaymentById(orgId, id);

            return res.status(200).json(payment);
        } catch (error) {
            console.error("Get payment error:", error)
            return res.status(404).json({
                message: "Payment not found"
            })
        }
    }

    async downloadReceipt(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "payment id is required" });
            }

            const orgId = req.user.orgId;

            const pdfPath = await receiptsService.getReceiptPath(orgId, id);
            const absolutePath = path.resolve(pdfPath);

            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `inline; filename="receipt-${id}.pdf"`)

            return res.sendFile(absolutePath, (err) => {
                if (err) {
                    console.error("Error sending PDF file:", err)
                    if (!res.headersSent) {
                        res.status(500).json({
                            message: "Could not send receipt PDF"
                        })
                    }
                }
            });



        } catch (error) {
            console.error("Download receipt error: ", error)
            return res.status(404).json({
                message: "Receipt not found"
            })
        }
    }

    async sendReceipt(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            if (!id) {
                return next(new Error("Payment ID is required"))
            }

            const { channel, recipient } = req.body as SendReceiptNotificationDto;
            if (!channel || !recipient) {
                return next(new Error("Channel and recipient are required"))
            }

            const orgId = req.user.orgId;

            await notificationService.sendReceiptForPayment({
                orgId,
                paymentId: id,
                channel,
                recipient
            })

            return res.status(200).json({
                message: `Receipt sent via ${channel}`
            })


        } catch (error) {
            console.error("Send receipt notification error", error)
            return next(error)

        }

    }

}