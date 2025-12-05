import { prisma } from "../../prisma";
import { PaymentsRepository } from "./payments.repository";
import { CreatePaymentDto, PaymentResponseDto } from "./payments.dtos";
import {ReceiptsService} from "../receipts/receipts.service";



export class PaymentsService {
    constructor(private repo = new PaymentsRepository(), private receiptsService = new ReceiptsService()) {}

    // async createPayment(
    //     orgId: string, 
    //     createdByUserId: string, 
    //     role:"ADMIN" | "STAFF", 
    //     dto: CreatePaymentDto): Promise<PaymentResponseDto> {
        
    //     if(role !== "ADMIN"){
    //         throw new Error("Only admins can record payments")
    //     }
        
    //     const member = await this.repo.ensureMemberBelongToOrg(dto.memberId, orgId)

    //     if (!member) {
    //         throw new Error("Member does not belong to your organization");
    //     }

    //     const approvalLimit = 1000;
    //     let status: string;
    //     let paidAt: Date | null;

    //     if(dto.amount > approvalLimit){
    //         status = "PENDING_APPROVAL"
    //         paidAt = null
    //     }else{
    //         status = "PAID"
    //         paidAt = new Date()
    //     }

    //     const payment = await this.repo.createPayment(orgId, createdByUserId, dto, status, paidAt);

    //     if(payment.status === "PAID"){
    //         try {
    //            await this.receiptsService.generateForPayment(payment.id, orgId) 
    //         } catch (error) {
    //             console.error("Failed to generate receipt PDF:", error);
    //         }
    //     }

    //     return {
    //         id: payment.id,
    //         memberId: payment.memberId,
    //         orgId: payment.orgId,
    //         amount: Number(payment.amount),
    //         currency: payment.currency,
    //         method: payment.method as any,
    //         status: payment.status,
    //         paidAt: payment.paidAt ? payment.paidAt.toISOString() : null,
    //         createdAt: payment.createdAt.toISOString(),
    //     }
    // }

async createPayment(
    orgId: string,
    createdByUserId: string,
    role: "ADMIN" | "STAFF",
    dto: CreatePaymentDto
  ): Promise<PaymentResponseDto> {
    if (role !== "ADMIN") {
      throw new Error("Only admins can record payments");
    }

    const member = await this.repo.ensureMemberBelongToOrg(dto.memberId, orgId);
    if (!member) {
      throw new Error("Member does not belong to your organization");
    }

    const approvalLimit = 1000;
    let status: "PAID" |"PENDING_APPROVAL";
    let paidAt: Date | null;

    if (dto.amount > approvalLimit) {
      status = "PENDING_APPROVAL";
      paidAt = null;
    } else {
      status = "PAID";
      paidAt = new Date();
    }

    // 👉 Use transaction, but only for creating the payment for now
    const payment = await prisma.$transaction(async (tx) => {
      const createdPayment = await tx.payment.create({
        data: {
          orgId,
          memberId: dto.memberId,
          userId: createdByUserId,
          amount: dto.amount,
          currency: dto.currency,
          method: dto.method,
          status,
          paidAt,
        },
      });

      return createdPayment;
    });

    // Outside the tx: generate receipt (PDF + DB row)
    if (payment.status === "PAID") {
      try {
        await this.receiptsService.generateForPayment(payment.id, orgId);
      } catch (error) {
        console.error("Failed to generate receipt PDF after tx:", error);
      }
    }

    return {
      id: payment.id,
      memberId: payment.memberId,
      orgId: payment.orgId,
      amount: Number(payment.amount),
      currency: payment.currency,
      method: payment.method as any,
      status: payment.status,
      paidAt: payment.paidAt ? payment.paidAt.toISOString() : "",
      createdAt: payment.createdAt.toISOString(),
    };
  }



    async getPaymentById(orgId: string, paymentId: string): Promise<PaymentResponseDto>{
        const payment = await this.repo.findById(orgId, paymentId);

        if(!payment) throw new Error("Payment not found");

        return {
            id: payment.id,
            memberId: payment.memberId,
            orgId: payment.orgId,
            amount: Number(payment.amount),
            currency: payment.currency,
            method: payment.method as any,
            status: payment.status,
            paidAt: payment.paidAt ? payment.paidAt.toISOString() : "",
            createdAt: payment.createdAt.toISOString(),
        }
    }




}