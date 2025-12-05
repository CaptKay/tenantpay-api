// src/modules/members/members.repository.ts
import { prisma } from "../../prisma";
import { CreateMemberDto } from "./members.dtos";

export class MembersRepository {
  async create(orgId: string, dto: CreateMemberDto) {
    return prisma.member.create({
      data: {
        orgId,
        name: dto.name,
        phone: dto.phone ?? null,
        whatsapp: dto.whatsapp ?? null,
      },
      select: {
        id: true,
        orgId: true,
        name: true,
        phone: true,
        whatsapp: true,
        createdAt: true,
      },
    });
  }

  async findAllByOrg(orgId: string) {
    return prisma.member.findMany({
      where: { orgId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        orgId: true,
        name: true,
        phone: true,
        whatsapp: true,
        createdAt: true,
      },
    });
  }

  async findById(orgId: string, memberId: string) {
    return prisma.member.findFirst({
      where: { id: memberId, orgId },
      select: {
        id: true,
        orgId: true,
        name: true,
        phone: true,
        whatsapp: true,
        createdAt: true,
      },
    });
  }
}
