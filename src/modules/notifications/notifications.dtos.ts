export type NotificationChannel =
| "EMAIL"
| "WHATSAPP_TEXT"
| "WHATSAPP_PDF"
| "TELEGRAM_PDF"
| "SMS";


export interface SendReceiptNotificationDto {
    channel: NotificationChannel;
    recipient: string;
}

