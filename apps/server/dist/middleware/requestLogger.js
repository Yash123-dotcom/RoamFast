import { logger } from '@/utils/logger';
/**
 * HTTP request/response logger middleware
 */
export const requestLogger = (req, res, next) => {
    const startTime = Date.now();
    // Log request
    logger.info(`→ ${req.method} ${req.path}`, {
        method: req.method,
        path: req.path,
        query: req.query,
        ip: req.ip,
    });
    // Log response when finished
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const logLevel = res.statusCode >= 400 ? 'error' : 'info';
        logger[logLevel](`← ${req.method} ${req.path} ${res.statusCode} ${duration}ms`, {
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
        });
    });
    next();
};
export default requestLogger;
