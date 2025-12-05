import { z } from "zod";
import { validateBody } from "../../core/middleware/validateRequest";

export const sendReceiptSchema = z.object({
    channel: z.enum([
        "EMAIL",
        "WHATSAPP_TEXT",
        "WHATSAPP_PDF",
        "TELEGRAM_PDF",
        "SMS",
    ]),
    recipient: z.string().min(1, "Recipient is required")
})

export type SendReceiptInput = z.infer<typeof sendReceiptSchema>;

export const validateSendReceipt = validateBody(sendReceiptSchema);

