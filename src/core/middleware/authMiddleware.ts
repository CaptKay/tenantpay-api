import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AuthUserPayload } from "../../modules/auth/auth.dtos";

export interface AuthenticatedRequest extends Request {
    user: AuthUserPayload
}

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Missing or invalid Authorization header" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as AuthUserPayload;

        (req as AuthenticatedRequest).user = decoded;

        next();
    } catch (error) {
        console.error("authMiddleware error:", error);
        return res.status(401).json({ message: "Invalid or expired token" });
    }






}