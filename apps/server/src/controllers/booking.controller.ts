import { Request, Response } from 'express';
import bookingService from '@/services/booking.service';
import { asyncHandler } from '@/utils/asyncHandler';
import { HTTP_STATUS } from '@/config/constants';

/**
 * Booking Controller - Handles booking-related requests
 */
export class BookingController {
    /**
     * Create a new booking
     * POST /api/v1/bookings
     */
    createBooking = asyncHandler(async (req: Request, res: Response) => {
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
    getUserBookings = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.params.userId as string;

        const bookings = await bookingService.getUserBookings(userId);

        res.status(HTTP_STATUS.OK).json(bookings);
    });

    /**
     * Get booking by ID
     * GET /api/v1/bookings/:id
     */
    getBookingById = asyncHandler(async (req: Request, res: Response) => {
        const id = req.params.id as string;

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
    cancelBooking = asyncHandler(async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const { userId } = req.body;

        const booking = await bookingService.cancelBooking(id, userId);

        res.status(HTTP_STATUS.OK).json(booking);
    });
}

export default new BookingController();
