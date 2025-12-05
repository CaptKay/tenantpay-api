// import { NextFunction, Response } from "express";
// import { MembersService } from "./members.service";
// import { CreateMemberDto } from "./members.dtos";
// import { AuthenticatedRequest } from "../../core/middleware/authMiddleware";

// const membersService = new MembersService();

// export class MembersController{
//     async create(req: AuthenticatedRequest, res: Response, next: NextFunction){
//         const {name, phone, whatsapp} = req.body as CreateMemberDto;
        
//         if(!name || !phone || !whatsapp){
//             return res.status(400).json({message: 'All fields are required'});
//         }

//         const orgId = req.user.orgId;
//         const member = await membersService.createMember(orgId, {name, phone, whatsapp});

//         return res.status(201).json(member);
//     }

//     async list(req: AuthenticatedRequest, res: Response){
//         const orgId = req.user.orgId;

//         const members = await membersService.listMembers(orgId);

//         return res.status(200).json(members);
//     }
// }

// src/modules/members/members.controller.ts
import { NextFunction, Response } from "express";
import { MembersService } from "./members.service";
import { CreateMemberDto } from "./members.dtos";
import { AuthenticatedRequest } from "../../core/middleware/authMiddleware";

export class MembersController {
  constructor(private service = new MembersService()) {}

  async create(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const orgId = req.user.orgId;

      // Body is already validated by Zod in validateBody(createMemberSchema)
      const dto = req.body as CreateMemberDto;

      const member = await this.service.createMember(orgId, dto);

      return res.status(201).json(member);
    } catch (err) {
      next(err);
    }
  }

  async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const orgId = req.user.orgId;
      const members = await this.service.listMembers(orgId);
      return res.status(200).json(members);
    } catch (err) {
      next(err);
    }
  }
}
