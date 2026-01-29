import bookingService from '@/services/booking.service';
import { asyncHandler } from '@/utils/asyncHandler';
import { HTTP_STATUS } from '@/config/constants';
/**
 * Booking Controller - Handles booking-related requests
 */
export class BookingController {
    constructor() {
        /**
         * Create a new booking
         * POST /api/v1/bookings
         */
        this.createBooking = asyncHandler(async (req, res) => {
            const { userId, hotelId, checkIn, checkOut, totalPrice, paymentId } = req.body;
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
         * Get user bookings
         * GET /api/v1/bookings/user/:userId
         */
        this.getUserBookings = asyncHandler(async (req, res) => {
            const userId = req.params.userId;
            const bookings = await bookingService.getUserBookings(userId);
            res.status(HTTP_STATUS.OK).json(bookings);
        });
        /**
         * Get booking by ID
         * GET /api/v1/bookings/:id
         */
        this.getBookingById = asyncHandler(async (req, res) => {
            const id = req.params.id;
            const booking = await bookingService.getBookingById(id);
            if (!booking) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({
                    error: 'Booking not found',
                });
            }
            res.status(HTTP_STATUS.OK).json(booking);
        });
        /**
         * Cancel a booking
         * POST /api/v1/bookings/:id/cancel
         */
        this.cancelBooking = asyncHandler(async (req, res) => {
            const id = req.params.id;
            const { userId } = req.body;
            const booking = await bookingService.cancelBooking(id, userId);
            res.status(HTTP_STATUS.OK).json(booking);
        });
    }
}
export default new BookingController();
