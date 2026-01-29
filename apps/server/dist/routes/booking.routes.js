import { Router } from 'express';
import bookingController from '@/controllers/booking.controller';
import { validate } from '@/middleware/validator';
import { createBookingSchema, getUserBookingsSchema } from '@/schemas/booking.schema';
const router = Router();
/**
 * POST /api/v1/bookings - Create booking
 */
router.post('/', validate(createBookingSchema), bookingController.createBooking);
/**
 * GET /api/v1/bookings/user/:userId - Get user bookings
 */
router.get('/user/:userId', validate(getUserBookingsSchema), bookingController.getUserBookings);
/**
 * GET /api/v1/bookings/:id - Get booking by ID
 */
router.get('/:id', bookingController.getBookingById);
/**
 * POST /api/v1/bookings/:id/cancel - Cancel booking
 */
router.post('/:id/cancel', bookingController.cancelBooking);
export default router;
