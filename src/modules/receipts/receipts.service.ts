import path from "path";
import { ReceiptsRepository } from "./receipts.repository";
import { PdfService } from "./pdf.service";

export class ReceiptsService {
    constructor(private repo = new ReceiptsRepository(), private pdfService = new PdfService()) { }

    /**
   * Generate a PDF receipt for a payment and store receipt row in DB.
   * Returns the stored receipt.
   */
    async generateForPayment(paymentId: string, orgId: string) {
        const pdfPath = await this.pdfService.generateReceiptPdf(paymentId, orgId);

        const receipt = await this.repo.createReceipt(paymentId, pdfPath);

        return receipt;
    }

    /**
    * Find a receipt for a payment (scoped by org) and return its pdfPath.
    */

    async getReceiptPath(orgId: string, paymentId: string): Promise<string> {
        const receipt = await this.repo.findPaymentById(orgId, paymentId);

        if (!receipt) {
            throw new Error("Receipt not found for this payment");
        }

        return receipt.pdfPath;
    }

}