import { UnauthorizedError } from '@/utils/errors';
/**
 * Authentication middleware
 * TODO: Implement proper JWT or session-based authentication
 * For now, this is a placeholder that checks for a user ID in headers
 */
export const requireAuth = (req, res, next) => {
    const userId = req.headers['x-user-id'];
    if (!userId) {
        throw new UnauthorizedError('Authentication required');
    }
    // Attach user info to request
    req.user = {
        id: userId,
        email: 'user@example.com', // TODO: Fetch from database or session
        role: 'USER',
    };
    next();
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
