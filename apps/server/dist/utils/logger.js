import winston from 'winston';
import { config } from '@/config';
// Define log format
const logFormat = winston.format.combine(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston.format.errors({ stack: true }), winston.format.splat(), winston.format.json());
// Console format for development
const consoleFormat = winston.format.combine(winston.format.colorize(), winston.format.timestamp({ format: 'HH:mm:ss' }), winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
        msg += ` ${JSON.stringify(meta)}`;
    }
    return msg;
}));
// Create logger instance
export const logger = winston.createLogger({
    level: config.isDevelopment ? 'debug' : 'info',
    format: logFormat,
    transports: [
        // Console transport
        new winston.transports.Console({
            format: consoleFormat,
        }),
        // Error log file
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
        }),
        // Combined log file
        new winston.transports.File({
            filename: 'logs/combined.log',
        }),
    ],
});
// If we're not in production, log to the console with colorization
if (!config.isProduction) {
    logger.debug('Logger initialized in development mode');
}
export default logger;
