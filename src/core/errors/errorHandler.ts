import { NextFunction, Request, Response } from "express";
import { AppError } from "./AppError";

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
    console.error("Error handler caught: ", err)

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            message: err.message,
        })
    }

    return res.status(500).json({
        message: "Internal server error",
    })


}
