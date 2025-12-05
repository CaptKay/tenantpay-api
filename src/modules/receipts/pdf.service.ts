import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import {prisma} from "../../prisma";

export class PdfService {
    private receiptsDir: string;

    constructor(){
        this.receiptsDir = path.join(__dirname, "../../../receipts")
    }

    private async ensureReceiptsDir(){
        await fs.promises.mkdir(this.receiptsDir, {recursive: true})
    }

     /**
   * Generate a PDF receipt for a given payment (by id) and return the file path.
   */

     async generateReceiptPdf(paymentId: string, orgId: string): Promise<string>{
        await this.ensureReceiptsDir();

        const payment = await prisma.payment.findFirst({
            where: {id: paymentId, orgId},
            include: {
                member: true,
                org: true,
            }
        })

        if(!payment){
            throw new Error("Payment not found for this organization");
        }

        const filePath = path.join(this.receiptsDir, `${payment.id}`)

        const doc = new PDFDocument({margin: 50});

        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        doc.fontSize(18).text(payment.org.name, {underline: true});
        doc.moveDown();

        doc.fontSize(14).text("Payment Receipt", {align: "left"});
        doc.moveDown();

        doc.fontSize(12).text(`Receipt ID: ${payment.id}`);
        doc.text(`Organization: ${payment.org.name}`);
        doc.text(`Member: ${payment.member.name}`);
        doc.text(`Amount: ${payment.amount} ${payment.currency}`);
        doc.text(`Payment Method: ${payment.method}`);
        doc.text(`Status: ${payment.status}`);
        if(payment.paidAt){
            doc.text(`Paid At: ${payment.paidAt.toISOString()}`)
        }
        doc.text(`Created At: ${payment.createdAt.toISOString()}`);

        doc.moveDown();
        doc.text("Thank you for your payment.", {oblique: true})

        doc.end();

        await new Promise<void>((resolve, reject)=>{
            stream.on("finish", ()=> resolve());
            stream.on("error", reject)
        })

        return filePath;
     }







}
