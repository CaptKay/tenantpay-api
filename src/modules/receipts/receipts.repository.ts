import {prisma} from "../../prisma";

export class ReceiptsRepository {
    async createReceipt(paymentId: string, pdfPath: string){
        return prisma.receipt.create({
            data: {
                paymentId,
                pdfPath
            }
        })
    }

    async findPaymentById(orgId: string, paymentId: string){
        return prisma.receipt.findFirst({
            where: {
                paymentId,
                payment: {
                    orgId
                },
            },
            include: {
                payment: true,
            }
        })
    }

}