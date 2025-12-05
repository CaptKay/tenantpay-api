import {prisma} from "../../prisma";
import {CreatePaymentDto} from "./payments.dtos";

export class PaymentsRepository {
    async ensureMemberBelongToOrg(memberId: string, orgId: string){
        const member = await prisma.member.findFirst({
            where:{id: memberId, orgId}
        })

        return member
    }

    async createPayment(
        orgId: string, 
        createdByUserId: string, 
        dto: CreatePaymentDto, 
        status: "PAID" | "PENDING_APPROVAL", 
        paidAt: Date | null){

        const {memberId, amount, currency, method} = dto;

        return prisma.payment.create({
            data: {
                orgId,
                memberId,
                userId: createdByUserId,
                amount,
                currency,
                method,
                status,
                paidAt,
            }
        })
    }




    async findById(orgId: string, paymentId: string){
        return prisma.payment.findFirst({
            where: {id: paymentId, orgId}
        })
    }





}