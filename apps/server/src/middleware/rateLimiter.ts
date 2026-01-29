import rateLimit from 'express-rate-limit';
import {
    RATE_LIMIT_WINDOW_MS,
    RATE_LIMIT_MAX_REQUESTS,
    PAYMENT_RATE_LIMIT_MAX_REQUESTS,
    HTTP_STATUS
} from '@/config/constants';

/**
 * General API rate limiter
 */
export const apiLimiter = rateLimit({
    windowMs: RATE_LIMIT_WINDOW_MS,
    max: RATE_LIMIT_MAX_REQUESTS,
    message: {
        error: 'Too many requests from this IP, please try again later.',
    },
    statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Strict rate limiter for payment endpoints
 */
export const paymentLimiter = rateLimit({
    windowMs: RATE_LIMIT_WINDOW_MS,
    max: PAYMENT_RATE_LIMIT_MAX_REQUESTS,
    message: {
        error: 'Too many payment requests, please try again later.',
    },
    statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Strict rate limiter for authentication endpoints
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts
    message: {
        error: 'Too many authentication attempts, please try again later.',
    },
    statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
    skipSuccessfulRequests: true,
});

export default apiLimiter;
