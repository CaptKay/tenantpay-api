export type PaymentMethod = "CASH" | "CARD" | "BANK_TRANSFER"

export interface CreatePaymentDto {
    memberId: string;
    amount: number;
    currency: string;
    method: PaymentMethod;

}

export interface PaymentResponseDto {
    id: string;
    memberId: string;
    orgId: string;
    amount: number;
    currency: string;
    method: PaymentMethod;
    status: string;
    paidAt: string;
    createdAt: string;
}

