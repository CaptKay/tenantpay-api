// src/modules/members/members.dtos.ts
export interface CreateMemberDto {
  name: string;
  phone: string;
  whatsapp?: string;
}

export interface MemberResponseDto {
  id: string;
  orgId: string;
  name: string;
  phone?: string | null;      // allow null from DB
  whatsapp?: string | null;   // allow null from DB
  createdAt: string;          // ISO string sent over JSON
}
