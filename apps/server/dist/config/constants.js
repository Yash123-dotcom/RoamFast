// API Configuration
export const API_VERSION = 'v1';
export const API_PREFIX = `/api/${API_VERSION}`;
// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
// Rate Limiting
export const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
export const RATE_LIMIT_MAX_REQUESTS = 100;
export const PAYMENT_RATE_LIMIT_MAX_REQUESTS = 10; // Stricter for payments
// HTTP Status Codes
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
};
// Error Messages
export const ERROR_MESSAGES = {
    HOTEL_NOT_FOUND: 'Hotel not found',
    BOOKING_FAILED: 'Failed to create booking',
    PAYMENT_FAILED: 'Payment processing failed',
    INVALID_INPUT: 'Invalid input data',
    UNAUTHORIZED: 'Unauthorized access',
    SERVER_ERROR: 'Internal server error',
};
// Booking Status
export const BOOKING_STATUS = {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    CANCELLED: 'CANCELLED',
    COMPLETED: 'COMPLETED',
};
