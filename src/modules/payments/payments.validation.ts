import { z } from "zod";

export const createPaymentSchema = z.object({
  memberId: z.string().min(1, "member id is required."),
  amount: z.number().positive("amount must be > 0"),
  currency: z.string().min(1, "currency is required"),

  // Accept TRANSFER and map it to BANK_TRANSFER for Prisma
  method: z
    .enum(["CASH", "CARD", "TRANSFER", "BANK_TRANSFER"])
    .transform((value) => (value === "TRANSFER" ? "BANK_TRANSFER" : value)),
});

export type CreatePaymentDto = z.infer<typeof createPaymentSchema>;
