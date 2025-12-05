import { NextFunction, Request, Response } from "express";

export function notFoundHandler(req: Request, res: Response, _next: NextFunction){
    return res.status(404).json({
        message: `Route ${req.originalUrl} not found`,
    })
}
