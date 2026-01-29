import { AppError } from '@/utils/errors';
import { logger } from '@/utils/logger';
import { HTTP_STATUS } from '@/config/constants';
import { ZodError } from 'zod';
/**
 * Centralized error handling middleware
 */
export const errorHandler = (err, req, res, next) => {
    // Log the error
    logger.error('Error occurred:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
    });
    // Handle Zod validation errors
    if (err instanceof ZodError) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            error: 'Validation Error',
            details: err.issues.map((e) => ({
                field: e.path.join('.'),
                message: e.message,
            })),
        });
    }
    // Handle custom application errors
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            error: err.message,
        });
    }
    // Handle Prisma errors
    if (err.constructor.name === 'PrismaClientKnownRequestError') {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            error: 'Database error',
            message: 'Invalid request data',
        });
    }
    // Handle unknown errors
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        error: 'Internal Server Error',
        message: 'An unexpected error occurred',
    });
};
export default errorHandler;
