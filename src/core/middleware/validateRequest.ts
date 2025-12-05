import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
import { AppError } from "../errors/AppError";

export function validateBody(schema: ZodType) {
    return (req: Request, _res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const message = result.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ");
            return next(AppError.badRequest(message));
        }

        req.body = result.data;
        next();
    }
}