import { z } from "zod";

export const createMemberSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    phone: z.string().optional(),
    whatsapp: z.string().optional(),
})

export type CreateMemberInput = z.infer<typeof createMemberSchema>