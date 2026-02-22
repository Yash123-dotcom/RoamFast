import bookingService from '@/services/booking.service';
import { asyncHandler } from '@/utils/asyncHandler';
import { HTTP_STATUS } from '@/config/constants';
import { UnauthorizedError } from '@/utils/errors';
/**
 * Booking Controller - Handles booking-related requests
 * All routes require authentication. userId is extracted from the verified JWT, not from request body.
 */
export class BookingController {
    constructor() {
        /**
         * Create a new booking
         * POST /api/v1/bookings
         * Auth: required — userId taken from JWT
         */
        this.createBooking = asyncHandler(async (req, res) => {
            const authReq = req;
            // Taken from JWT — not from body (prevents user ID spoofing)
            const userId = authReq.user.id;
            const { hotelId, checkIn, checkOut, totalPrice, paymentId } = req.body;
            const booking = await bookingService.createBooking({
                userId,
                hotelId,
                checkIn: new Date(checkIn),
                checkOut: new Date(checkOut),
                totalPrice,
                paymentId,
            });
            res.status(HTTP_STATUS.CREATED).json(booking);
        });
        /**
         * Get the authenticated user's own bookings
         * GET /api/v1/bookings/my
         * Auth: required
         */
        this.getMyBookings = asyncHandler(async (req, res) => {
            const authReq = req;
            const userId = authReq.user.id;
            const bookings = await bookingService.getUserBookings(userId);
            res.status(HTTP_STATUS.OK).json(bookings);
        });
        /**
         * Get user bookings (admin or own)
         * GET /api/v1/bookings/user/:userId
         * Auth: required — can only access own bookings unless admin
         */
        this.getUserBookings = asyncHandler(async (req, res) => {
            const authReq = req;
            const requestedUserId = req.params.userId;
            const authenticatedUserId = authReq.user.id;
            const userRole = authReq.user.role;
            // Enforce own-data policy: users can only see their own bookings
            if (requestedUserId !== authenticatedUserId && userRole !== 'ADMIN') {
                throw new UnauthorizedError('You can only access your own bookings');
            }
            const bookings = await bookingService.getUserBookings(requestedUserId);
            res.status(HTTP_STATUS.OK).json(bookings);
        });
        /**
         * Get booking by ID
         * GET /api/v1/bookings/:id
         * Auth: required
         */
        this.getBookingById = asyncHandler(async (req, res) => {
            const authReq = req;
            const id = req.params.id;
            const booking = await bookingService.getBookingById(id);
            if (!booking) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({
                    error: 'Booking not found',
                });
            }
            // Ensure users can only see their own booking (admins can see all)
            const b = booking;
            if (b.userId !== authReq.user.id && authReq.user.role !== 'ADMIN') {
                throw new UnauthorizedError('You do not have access to this booking');
            }
            res.status(HTTP_STATUS.OK).json(booking);
        });
        /**
         * Cancel a booking
         * POST /api/v1/bookings/:id/cancel
         * Auth: required — can only cancel own booking
         */
        this.cancelBooking = asyncHandler(async (req, res) => {
            const authReq = req;
            const id = req.params.id;
            // userId from JWT — ignore any userId in body
            const userId = authReq.user.id;
            const booking = await bookingService.cancelBooking(id, userId);
            res.status(HTTP_STATUS.OK).json(booking);
        });
    }
}
export default new BookingController();
