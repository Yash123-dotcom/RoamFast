import { auth } from '@/config/firebase';
import { UnauthorizedError } from '@/utils/errors';
import { logger } from '@/utils/logger';
/**
 * Authentication middleware
 * Verifies Firebase ID Token
 */
export const requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedError('Authentication required');
        }
        const token = authHeader.split('Bearer ')[1];
        try {
            const decodedToken = await auth.verifyIdToken(token);
            // Attach user info to request
            // We map Firebase UID to id, and custom claims to role if present
            req.user = {
                id: decodedToken.uid,
                email: decodedToken.email || '',
                role: decodedToken.role || 'USER',
            };
            next();
        }
        catch (error) {
            logger.error('Token verification failed:', error);
            throw new UnauthorizedError('Invalid or expired token');
        }
    }
    catch (error) {
        next(error);
    }
};
/**
 * Role-based access control middleware
 */
export const requireRole = (...roles) => {
    return (req, res, next) => {
        const authReq = req;
        if (!authReq.user) {
            throw new UnauthorizedError('Authentication required');
        }
        if (!roles.includes(authReq.user.role)) {
            throw new UnauthorizedError('Insufficient permissions');
        }
        next();
    };
};
export default requireAuth;
