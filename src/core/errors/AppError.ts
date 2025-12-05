export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode = 400, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;

        Object.setPrototypeOf(this, AppError.prototype)
    }

    static badRequest(message: string) {
        return new AppError(message, 400, true)
    }

    static unauthorized(message: string) {
        return new AppError(message, 401, true)
    }

    static forbidden(message: string) {
        return new AppError(message, 403, true)
    }

    static notFound(message: string) {
        return new AppError(message, 404, true)
    }

    static internal(message: string) {
        return new AppError(message, 500, true)
    }
    
}