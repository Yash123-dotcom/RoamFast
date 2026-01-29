import { Request, Response, NextFunction } from 'express';
import { auth } from '@/config/firebase';
import { UnauthorizedError } from '@/utils/errors';
import { logger } from '@/utils/logger';

/**
 * Extended Request type with user information
 */
export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
    };
}

/**
 * Authentication middleware
 * Verifies Firebase ID Token
 */
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
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
            (req as AuthRequest).user = {
                id: decodedToken.uid,
                email: decodedToken.email || '',
                role: (decodedToken.role as string) || 'USER',
            };

            next();
        } catch (error) {
            logger.error('Token verification failed:', error);
            throw new UnauthorizedError('Invalid or expired token');
        }
    } catch (error) {
        next(error);
    }
};

/**
 * Role-based access control middleware
 */
export const requireRole = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const authReq = req as AuthRequest;

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
