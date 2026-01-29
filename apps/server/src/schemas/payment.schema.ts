import { z } from 'zod';

/**
 * Schema for creating payment intent with booking metadata
 */
export const createPaymentIntentSchema = z.object({
    body: z.object({
        amount: z.number().positive().max(10000000, 'Amount exceeds maximum allowed'),
        userId: z.string().min(1, 'User ID is required'),
        hotelId: z.string().min(1, 'Hotel ID is required'),
        checkIn: z.coerce.date(),
        checkOut: z.coerce.date(),
        customerEmail: z.string().email().optional(),
    }).refine(
        (data) => data.checkOut > data.checkIn,
        { message: 'Check-out date must be after check-in date', path: ['checkOut'] }
    ),
});

export type CreatePaymentIntentInput = z.infer<typeof createPaymentIntentSchema>;
