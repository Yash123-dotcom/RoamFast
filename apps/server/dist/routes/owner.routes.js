import { Router } from 'express';
import ownerController from '@/controllers/owner.controller';
// import { requireAuth, requireRole } from '@/middleware/auth'; // Assuming these exist
const router = Router();
// Retrieve hotels owned by the current user
// router.get('/hotels', requireAuth, requireRole('OWNER'), ownerController.getMyHotels);
// For now, allow logged in users to check if they have hotels (simplified)
// We'll rely on the controller to check req.user
router.get('/hotels', ownerController.getMyHotels);
// Dashboard analytics
router.get('/analytics', ownerController.getDashboardAnalytics);
export default router;
