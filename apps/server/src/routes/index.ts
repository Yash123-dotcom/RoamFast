import { Router } from 'express';
import hotelRoutes from './hotel.routes';
import bookingRoutes from './booking.routes';
import paymentRoutes from './payment.routes';
import subscriptionRoutes from './subscription.routes';
import ownerRoutes from './owner.routes';
import adminRoutes from './admin.routes';
import reviewRoutes from './review.routes';
import seedRoutes from './seed.routes';
import webhookRoutes from './webhook.routes';
import { API_PREFIX } from '@/config/constants';

const router = Router();

// Mount routes
router.use(`${API_PREFIX}/hotels`, hotelRoutes);
router.use(`${API_PREFIX}/bookings`, bookingRoutes);
router.use(`${API_PREFIX}/payment`, paymentRoutes);
router.use(`${API_PREFIX}/subscriptions`, subscriptionRoutes);
router.use(`${API_PREFIX}/owner`, ownerRoutes);
router.use(`${API_PREFIX}/admin`, adminRoutes);
router.use(`${API_PREFIX}/reviews`, reviewRoutes);
router.use(`${API_PREFIX}/seed`, seedRoutes);
router.use(`${API_PREFIX}/webhooks`, webhookRoutes);

// Legacy routes for backward compatibility
router.use('/api/hotels', hotelRoutes);
router.use('/api/bookings', bookingRoutes);
router.use('/api/payment', paymentRoutes);
router.use('/api/subscriptions', subscriptionRoutes);
router.use('/api/seed', seedRoutes);

export default router;
