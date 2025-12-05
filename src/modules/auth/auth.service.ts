import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../../core/config/env";
import { AuthUserPayload, LoginDto } from "./auth.dtos";
import { AuthRepository } from "./auth.repository";
import bcrypt from "bcryptjs";
import { AppError } from "../../core/errors/AppError";


export class AuthService {
    constructor(private repo = new AuthRepository()) { }

    async login(dto: LoginDto) {
        const { email, password } = dto;

        const user = await this.repo.findUserByEmail(email);

        if (!user) throw AppError.unauthorized("Invalid email or password");

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) throw AppError.unauthorized("Invalid email or password");

        const payload: AuthUserPayload = {
            userId: user.id,
            orgId: user.orgId,
            role: user.role as "ADMIN" | "STAFF",
            fullName: user.fullName,
            staffId: user.staffId
        }

        const token = jwt.sign(payload, env.JWT_SECRET, {
            expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
        })

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                staffId: user.staffId,
                role: payload.role,
                orgId: payload.orgId
            }
        }
    }
}