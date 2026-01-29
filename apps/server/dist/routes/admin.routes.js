import { Router } from 'express';
import adminController from '@/controllers/admin.controller';
const router = Router();
// Get pending hotels
router.get('/hotels/pending', adminController.getPendingHotels);
// Approve/Reject hotels
router.post('/hotels/:id/approve', adminController.approveHotel);
router.post('/hotels/:id/reject', adminController.rejectHotel);
// Stats
router.get('/stats', adminController.getDashboardStats);
// Payouts
router.get('/payouts', adminController.getPayouts);
// Revenue Analytics
router.get('/revenue', adminController.getRevenueAnalytics);
export default router;
