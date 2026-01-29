import { prisma } from '@repo/database';
import { BookingStatus } from '@/constants/enums';
import { ValidationError } from '@/utils/errors';
import { BOOKING_STATUS } from '@/config/constants';
import { logger } from '@/utils/logger';
/**
 * Booking Service - Data access layer for bookings
 */
export class BookingService {
    /**
     * Create a new booking with transaction support
     */
    async createBooking(data) {
        // Validate dates
        if (data.checkOut <= data.checkIn) {
            throw new ValidationError('Check-out date must be after check-in date');
        }
        // Use transaction to ensure data consistency
        return prisma.$transaction(async (tx) => {
            // Verify hotel exists
            const hotel = await tx.hotel.findUnique({
                where: { id: data.hotelId },
            });
            if (!hotel) {
                throw new ValidationError('Hotel not found');
            }
            // Create booking
            const booking = await tx.booking.create({
                data: {
                    userId: data.userId,
                    hotelId: data.hotelId,
                    checkIn: data.checkIn,
                    checkOut: data.checkOut,
                    totalPrice: data.totalPrice,
                    paymentId: data.paymentId,
                    status: BOOKING_STATUS.CONFIRMED,
                },
                include: {
                    hotel: {
                        select: {
                            name: true,
                            address: true,
                            city: true,
                        },
                    },
                },
            });
            return booking;
        });
    }
    /**
     * Create booking from successful payment (webhook handler)
     */
    async createBookingFromPayment(data) {
        // Use transaction to ensure data consistency
        return prisma.$transaction(async (tx) => {
            // Verify hotel exists
            const hotel = await tx.hotel.findUnique({
                where: { id: data.hotelId },
            });
            if (!hotel) {
                throw new ValidationError('Hotel not found');
            }
            // Check if booking already exists with this payment intent
            const existingBooking = await tx.booking.findUnique({
                where: { paymentIntentId: data.paymentIntentId },
            });
            if (existingBooking) {
                logger.info('Booking already exists for payment intent', {
                    paymentIntentId: data.paymentIntentId,
                    bookingId: existingBooking.id,
                });
                return existingBooking;
            }
            // Create booking
            const booking = await tx.booking.create({
                data: {
                    userId: data.userId,
                    hotelId: data.hotelId,
                    checkIn: data.checkIn,
                    checkOut: data.checkOut,
                    totalPrice: data.totalPrice,
                    status: BOOKING_STATUS.CONFIRMED,
                    paymentIntentId: data.paymentIntentId,
                    paymentStatus: 'succeeded',
                    stripeCustomerId: data.stripeCustomerId,
                },
                include: {
                    hotel: {
                        select: {
                            name: true,
                            address: true,
                            city: true,
                            owner: {
                                select: {
                                    email: true,
                                }
                            }
                        },
                    },
                },
            });
            return booking;
        });
    }
    /**
     * Get all bookings for a user
     */
    async getUserBookings(userId) {
        return prisma.booking.findMany({
            where: { userId },
            include: {
                hotel: {
                    select: {
                        name: true,
                        address: true,
                        city: true,
                        images: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    /**
     * Get booking by ID
     */
    async getBookingById(id) {
        return prisma.booking.findUnique({
            where: { id },
            include: {
                hotel: true,
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }
    /**
     * Update booking status
     */
    async updateBookingStatus(id, status) {
        return prisma.booking.update({
            where: { id },
            data: { status },
        });
    }
    /**
     * Cancel a booking
     */
    async cancelBooking(id, userId) {
        // Verify booking belongs to user
        const booking = await prisma.booking.findUnique({
            where: { id },
        });
        if (!booking) {
            throw new ValidationError('Booking not found');
        }
        if (booking.userId !== userId) {
            throw new ValidationError('Unauthorized to cancel this booking');
        }
        return this.updateBookingStatus(id, BookingStatus.CANCELLED);
    }
}
export default new BookingService();
