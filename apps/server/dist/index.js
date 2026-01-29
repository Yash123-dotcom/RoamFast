import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from '@/config';
import { logger } from '@/utils/logger';
import { requestLogger } from '@/middleware/requestLogger';
import { errorHandler } from '@/middleware/errorHandler';
import { apiLimiter } from '@/middleware/rateLimiter';
import routes from '@/routes';
const app = express();
// Security middleware
app.use(helmet());
app.use(cors({
    origin: config.cors.origin,
    credentials: true,
}));
// Body parsing middleware
// Webhook routes need raw body for signature verification
app.use('/api/v1/webhooks/stripe', express.raw({ type: 'application/json' }));
app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }));
// Regular JSON parsing for all other routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Logging middleware
app.use(requestLogger);
// Rate limiting
app.use(apiLimiter);
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'NeonStay API is running',
        version: 'v1',
        timestamp: new Date().toISOString(),
    });
});
// API routes
app.use(routes);
// Error handling middleware (must be last)
app.use(errorHandler);
// Start server
const server = app.listen(config.port, () => {
    logger.info(`🚀 Server running on http://localhost:${config.port}`);
    logger.info(`Environment: ${config.env}`);
    logger.info(`API Version: v1`);
});
// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
    });
});
export default app;
