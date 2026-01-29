import adminService from '@/services/admin.service';
import { asyncHandler } from '@/utils/asyncHandler';
import { HTTP_STATUS } from '@/config/constants';
class AdminController {
    constructor() {
        /**
         * Get pending hotels
         * GET /api/v1/admin/hotels/pending
         */
        this.getPendingHotels = asyncHandler(async (req, res) => {
            // In production, add requireAdmin middleware here
            const hotels = await adminService.getPendingHotels();
            res.status(HTTP_STATUS.OK).json(hotels);
        });
        /**
         * Approve a hotel
         * POST /api/v1/admin/hotels/:id/approve
         */
        this.approveHotel = asyncHandler(async (req, res) => {
            const { id } = req.params;
            const hotel = await adminService.approveHotel(id);
            res.status(HTTP_STATUS.OK).json(hotel);
        });
        /**
         * Reject a hotel
         * POST /api/v1/admin/hotels/:id/reject
         */
        this.rejectHotel = asyncHandler(async (req, res) => {
            const { id } = req.params;
            const hotel = await adminService.rejectHotel(id);
            res.status(HTTP_STATUS.OK).json(hotel);
        });
        /**
         * Get dashboard stats
         * GET /api/v1/admin/stats
         */
        this.getDashboardStats = asyncHandler(async (req, res) => {
            const stats = await adminService.getPlatformStats();
            res.status(HTTP_STATUS.OK).json(stats);
        });
        /**
         * Get payouts
         * GET /api/v1/admin/payouts
         */
        this.getPayouts = asyncHandler(async (req, res) => {
            const payouts = await adminService.getPayouts();
            res.status(HTTP_STATUS.OK).json(payouts);
        });
        /**
         * Get revenue analytics
         * GET /api/v1/admin/revenue
         */
        this.getRevenueAnalytics = asyncHandler(async (req, res) => {
            const analytics = await adminService.getRevenueAnalytics();
            res.status(HTTP_STATUS.OK).json(analytics);
        });
    }
}
export default new AdminController();
