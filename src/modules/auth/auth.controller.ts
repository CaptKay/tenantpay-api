import { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service";
import { LoginDto } from "./auth.dtos";
import { AppError } from "../../core/errors/AppError";


const authService = new AuthService();

export class AuthController {
    async login(req: Request, res: Response, next: NextFunction){
        try {
            const dto = req.body as LoginDto;

            if(!dto.email || !dto.password){
                // return res.status(400).json({
                //     message: "email and password are required"
                // })
                throw AppError.badRequest("email and password are required")
            }

            const result = await authService.login(dto);

            return res.status(200).json(result);
        } catch (error: any) {
            // console.error("Login error", error);
            // return res.status(401).json({
            //     message: "Invalid credentials"
            // })
            next(error);
        }
    }    
}