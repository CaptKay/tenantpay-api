import {prisma} from "../../prisma";

export class AuthRepository {
    async findUserByEmail(email: string){
        return prisma.user.findUnique({
            where:{
                email
            },
            include: {
                org: true
            }
        })
    }
}