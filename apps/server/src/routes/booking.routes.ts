import { Router } from 'express';
import bookingController from '@/controllers/booking.controller';
import { validate } from '@/middleware/validator';
import { createBookingSchema, getUserBookingsSchema } from '@/schemas/booking.schema';
import { requireAuth } from '@/middleware/auth';

const router = Router();

/**
 * POST /api/v1/bookings - Create booking (Auth required)
 */
router.post('/', requireAuth, validate(createBookingSchema), bookingController.createBooking);

/**
 * GET /api/v1/bookings/my - Get authenticated user's bookings
 */
router.get('/my', requireAuth, bookingController.getMyBookings);

/**
 * GET /api/v1/bookings/user/:userId - Get user bookings (Auth + own only)
 */
router.get('/user/:userId', requireAuth, validate(getUserBookingsSchema), bookingController.getUserBookings);

/**
 * GET /api/v1/bookings/:id - Get booking by ID (Auth required)
 */
router.get('/:id', requireAuth, bookingController.getBookingById);

/**
 * POST /api/v1/bookings/:id/cancel - Cancel booking (Auth + own only)
 */
router.post('/:id/cancel', requireAuth, bookingController.cancelBooking);

export default router;
