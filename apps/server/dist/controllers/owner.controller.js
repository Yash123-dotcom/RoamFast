import ownerService from '@/services/owner.service';
import { asyncHandler } from '@/utils/asyncHandler';
import { HTTP_STATUS } from '@/config/constants';
class OwnerController {
    constructor() {
        /**
         * Get all hotels for the authenticated owner
         * GET /api/v1/owner/hotels
         */
        this.getMyHotels = asyncHandler(async (req, res) => {
            // In a real app, get userId from req.user
            // For demo/prototype, we might trust a header or query param if auth isn't fully set up for owners
            // But since we have auth middleware, let's try to use it.
            // @ts-ignore - Assuming auth middleware populates req.user
            const userId = req.user?.id;
            // Temporarily disabled for UI testing
            // if (!userId) {
            //     res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Unauthorized' });
            //     return;
            // }
            // Use mock userId for testing
            const testUserId = userId || 'demo-user-id';
            const hotels = await ownerService.getMyHotels(testUserId);
            res.status(HTTP_STATUS.OK).json(hotels);
        });
        /**
         * Get analytics for the dashboard
         * GET /api/v1/owner/analytics
         */
        this.getDashboardAnalytics = asyncHandler(async (req, res) => {
            // @ts-ignore
            const userId = req.user?.id;
            // Temporarily disabled for UI testing
            // if (!userId) {
            //     res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Unauthorized' });
            //     return;
            // }
            // Use mock userId for testing
            const testUserId = userId || 'demo-user-id';
            const analytics = await ownerService.getOwnerAnalytics(testUserId);
            res.status(HTTP_STATUS.OK).json(analytics);
        });
    }
}
export default new OwnerController();
