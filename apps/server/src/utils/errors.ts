import { HTTP_STATUS } from '@/config/constants';

/**
 * Base application error class
 */
export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    constructor(message: string, statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR, isOperational: boolean = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;

        Object.setPrototypeOf(this, AppError.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Validation error (400)
 */
export class ValidationError extends AppError {
    constructor(message: string = 'Validation failed') {
        super(message, HTTP_STATUS.BAD_REQUEST);
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}

/**
 * Not found error (404)
 */
export class NotFoundError extends AppError {
    constructor(message: string = 'Resource not found') {
        super(message, HTTP_STATUS.NOT_FOUND);
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}

/**
 * Unauthorized error (401)
 */
export class UnauthorizedError extends AppError {
    constructor(message: string = 'Unauthorized access') {
        super(message, HTTP_STATUS.UNAUTHORIZED);
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }
}

/**
 * Forbidden error (403)
 */
export class ForbiddenError extends AppError {
    constructor(message: string = 'Forbidden') {
        super(message, HTTP_STATUS.FORBIDDEN);
        Object.setPrototypeOf(this, ForbiddenError.prototype);
    }
}

/**
 * Payment error (422)
 */
export class PaymentError extends AppError {
    constructor(message: string = 'Payment processing failed') {
        super(message, HTTP_STATUS.UNPROCESSABLE_ENTITY);
        Object.setPrototypeOf(this, PaymentError.prototype);
    }
}

/**
 * Conflict error (409)
 */
export class ConflictError extends AppError {
    constructor(message: string = 'Resource conflict') {
        super(message, HTTP_STATUS.CONFLICT);
        Object.setPrototypeOf(this, ConflictError.prototype);
    }
}
