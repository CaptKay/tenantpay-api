import { prisma } from "../../prisma";
import { ReceiptsService } from "../receipts/receipts.service";
import { NotificationChannel } from "./notifications.dtos";

interface SendReceiptOptions {
    orgId: string;
    paymentId: string;
    channel: NotificationChannel;
    recipient: string;
}

export class NotificationsService {
    constructor(private receiptsService: ReceiptsService = new ReceiptsService()) { }

    async sendReceiptForPayment(opts: SendReceiptOptions): Promise<void> {
        const { orgId, paymentId, channel, recipient } = opts;

        const payment = await prisma.payment.findFirst({
            where: { id: paymentId, orgId, },
            include: { member: true, org: true }
        })

        if (!payment) {
            throw new Error("Payment not found for this organization");
        }

        if (payment.status !== "PAID" && channel !== "EMAIL") {
            console.warn(`Sending receipt for non-PAID payment (status=${payment.status}) via ${channel}`)
        }

        const textBody = this.buildReceiptText(payment);

        let pdfPath: string | null = null;

        if (channel === "WHATSAPP_PDF" || channel === "TELEGRAM_PDF") {
            try {
                pdfPath = await this.receiptsService.getReceiptPath(orgId, paymentId);
            } catch (error) {
                const receipt = await this.receiptsService.generateForPayment(paymentId, orgId);
                pdfPath = receipt.pdfPath;
            }
        }


        switch (channel) {
            case "EMAIL":
                await this.sendEmail(recipient, "Your payment receipt", textBody);
                break;
            case "WHATSAPP_TEXT":
                await this.sendWhatsAppText(recipient, textBody);
                break;
            case "WHATSAPP_PDF":
                // Optional: more expensive route, so you might restrict usage
                if (!pdfPath) {
                    throw new Error("Receipt PDF not available");
                }
                await this.sendWhatsAppPdf(recipient, pdfPath);
                break;

            case "TELEGRAM_PDF":
                // Your preferred PDF channel
                if (!pdfPath) {
                    throw new Error("Receipt PDF not available");
                }
                await this.sendTelegramPdf(recipient, pdfPath);
                break;

            case "SMS":
                await this.sendSms(recipient, textBody);
                break;
        }
    }


    /**
   * Build a structured text receipt from payment data.
   */
    private buildReceiptText(payment: any): string {
        const lines = [
            `Receipt from ${payment.org.name}`,
            `--------------------------------`,
            `Member: ${payment.member.name}`,
            `Amount: ${payment.amount} ${payment.currency}`,
            `Method: ${payment.method}`,
            `Status: ${payment.status}`,
        ];

        if (payment.paidAt) {
            lines.push(`Paid At: ${payment.paidAt.toISOString()}`);
        }

        lines.push(`Payment ID: ${payment.id}`);
        lines.push(`Thank you for your payment.`);

        return lines.join("\n");

    }


    // ------- Channel handlers (stubs for now) -------
    private async sendEmail(to: string, subject: string, body: string): Promise<void> {
        // TODO: integrate with real email provider (SendGrid, SES, etc.)
        console.log("[EMAIL] To:", to);
        console.log("Subject:", subject);
        console.log("Body:\n", body);
    }

    private async sendWhatsAppText(to: string, body: string): Promise<void> {
        // TODO: integrate with WhatsApp API provider
        console.log("[WHATSAPP_TEXT] To:", to);
        console.log("Message:\n", body);
    }

    private async sendWhatsAppPdf(to: string, pdfPath: string): Promise<void> {
        // TODO: integrate with WhatsApp Business API (media message)
        console.log("[WHATSAPP_PDF] To:", to);
        console.log("PDF Path:", pdfPath);
    }

    private async sendTelegramPdf(to: string, pdfPath: string): Promise<void> {
        // `to` could be a chat ID or username
        // TODO: call Telegram Bot API to sendDocument
        console.log("[TELEGRAM_PDF] To:", to);
        console.log("PDF Path:", pdfPath);
    }

    private async sendSms(to: string, body: string): Promise<void> {
        // TODO: integrate with SMS provider (Twilio, etc.)
        console.log("[SMS] To:", to);
        console.log("Message:\n", body);
    }





}