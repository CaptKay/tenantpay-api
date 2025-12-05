import { MembersRepository } from "./members.repository";
import { CreateMemberDto, MemberResponseDto } from "./members.dtos";

export class MembersService {
  constructor(private repo = new MembersRepository()) {}

  async createMember(orgId: string, dto: CreateMemberDto): Promise<MemberResponseDto> {
    const member = await this.repo.create(orgId, dto);

    return {
      id: member.id,
      orgId: member.orgId,
      name: member.name,
      phone: member.phone ?? null,
      whatsapp: member.whatsapp ?? null,
      createdAt: member.createdAt.toISOString(),
    };
  }

  async listMembers(orgId: string): Promise<MemberResponseDto[]> {
    const members = await this.repo.findAllByOrg(orgId);

    return members.map((m) => ({
      id: m.id,
      orgId: m.orgId,
      name: m.name,
      phone: m.phone ?? null,
      whatsapp: m.whatsapp ?? null,
      createdAt: m.createdAt.toISOString(),
    }));
  }

  async getMember(orgId: string, memberId: string): Promise<MemberResponseDto | null> {
    const member = await this.repo.findById(orgId, memberId);
    if (!member) return null;

    return {
      id: member.id,
      orgId: member.orgId,
      name: member.name,
      phone: member.phone ?? null,
      whatsapp: member.whatsapp ?? null,
      createdAt: member.createdAt.toISOString(),
    };
  }
}
