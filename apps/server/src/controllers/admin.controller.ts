import { Request, Response } from 'express';
import adminService from '@/services/admin.service';
import { asyncHandler } from '@/utils/asyncHandler';
import { HTTP_STATUS } from '@/config/constants';

class AdminController {
    /**
     * Get pending hotels
     * GET /api/v1/admin/hotels/pending
     */
    getPendingHotels = asyncHandler(async (req: Request, res: Response) => {
        // In production, add requireAdmin middleware here
        const hotels = await adminService.getPendingHotels();
        res.status(HTTP_STATUS.OK).json(hotels);
    });

    /**
     * Approve a hotel
     * POST /api/v1/admin/hotels/:id/approve
     */
    approveHotel = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const hotel = await adminService.approveHotel(id as string);
        res.status(HTTP_STATUS.OK).json(hotel);
    });

    /**
     * Reject a hotel
     * POST /api/v1/admin/hotels/:id/reject
     */
    rejectHotel = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const hotel = await adminService.rejectHotel(id as string);
        res.status(HTTP_STATUS.OK).json(hotel);
    });

    /**
     * Get dashboard stats
     * GET /api/v1/admin/stats
     */
    getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
        const stats = await adminService.getPlatformStats();
        res.status(HTTP_STATUS.OK).json(stats);
    });

    /**
     * Get payouts
     * GET /api/v1/admin/payouts
     */
    getPayouts = asyncHandler(async (req: Request, res: Response) => {
        const payouts = await adminService.getPayouts();
        res.status(HTTP_STATUS.OK).json(payouts);
    });

    /**
     * Get revenue analytics
     * GET /api/v1/admin/revenue
     */
    getRevenueAnalytics = asyncHandler(async (req: Request, res: Response) => {
        const analytics = await adminService.getRevenueAnalytics();
        res.status(HTTP_STATUS.OK).json(analytics);
    });
}

export default new AdminController();
