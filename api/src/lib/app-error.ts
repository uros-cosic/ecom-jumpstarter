export class AppError extends Error {
    public isOperational: boolean

    constructor(
        message: string,
        public statusCode = 500
    ) {
        super(message)

        this.statusCode = statusCode
        this.isOperational = true

        Error.captureStackTrace(this, this.constructor)
    }
}
