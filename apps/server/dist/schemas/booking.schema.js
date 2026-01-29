import { z } from 'zod';
/**
 * Schema for creating a booking
 */
export const createBookingSchema = z.object({
    body: z.object({
        userId: z.string().min(1, 'User ID is required'),
        hotelId: z.string().min(1, 'Hotel ID is required'),
        checkIn: z.string().datetime('Invalid check-in date format'),
        checkOut: z.string().datetime('Invalid check-out date format'),
        totalPrice: z.number().int().positive('Total price must be positive'),
        paymentId: z.string().min(1, 'Payment ID is required'),
    }).refine((data) => new Date(data.checkOut) > new Date(data.checkIn), {
        message: 'Check-out date must be after check-in date',
        path: ['checkOut'],
    }),
});
/**
 * Schema for getting user bookings
 */
export const getUserBookingsSchema = z.object({
    params: z.object({
        userId: z.string().min(1, 'User ID is required'),
    }),
});
