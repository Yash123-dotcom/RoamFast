import { Booking } from '@/models/Booking';
import { Hotel } from '@/models/Hotel';
import { User } from '@/models/User';
import { BookingStatus } from '@/constants/enums';
import { ValidationError } from '@/utils/errors';
import { BOOKING_STATUS } from '@/config/constants';
import { logger } from '@/utils/logger';

export interface CreateBookingData {
    userId: string;
    hotelId: string;
    checkIn: Date;
    checkOut: Date;
    totalPrice: number;
    paymentId: string;
}

/**
 * Booking Service - Data access layer for bookings using Mongoose
 */
export class BookingService {
    /**
     * Create a new booking
     */
    async createBooking(data: CreateBookingData) {
        if (data.checkOut <= data.checkIn) {
            throw new ValidationError('Check-out date must be after check-in date');
        }

        const hotel = await Hotel.findById(data.hotelId).lean();
        if (!hotel) {
            throw new ValidationError('Hotel not found');
        }

        const booking = await new Booking({
            userId: data.userId,
            hotelId: data.hotelId,
            checkIn: data.checkIn,
            checkOut: data.checkOut,
            totalPrice: data.totalPrice,
            paymentId: data.paymentId,
            status: BOOKING_STATUS.CONFIRMED,
        }).save();

        return {
            ...booking.toObject(),
            id: booking._id.toString(),
            hotel: {
                name: hotel.name,
                address: hotel.address,
                city: hotel.city,
            },
        };
    }

    /**
     * Create booking from successful payment (webhook handler)
     */
    async createBookingFromPayment(data: {
        userId: string;
        hotelId: string;
        checkIn: Date;
        checkOut: Date;
        totalPrice: number;
        paymentIntentId: string;
        stripeCustomerId?: string;
    }) {
        const hotel = await Hotel.findById(data.hotelId).lean();
        if (!hotel) {
            throw new ValidationError('Hotel not found');
        }

        // Check if booking already exists with this payment intent
        const existingBooking = await Booking.findOne({ paymentIntentId: data.paymentIntentId }).lean();
        if (existingBooking) {
            logger.info('Booking already exists for payment intent', {
                paymentIntentId: data.paymentIntentId,
                bookingId: existingBooking._id.toString(),
            });
            return { ...existingBooking, id: existingBooking._id.toString() };
        }

        // Fetch owner email if exists
        let ownerEmail = null;
        if (hotel.ownerId) {
            const owner = await User.findById(hotel.ownerId).lean();
            ownerEmail = owner?.email ?? null;
        }

        const booking = await new Booking({
            userId: data.userId,
            hotelId: data.hotelId,
            checkIn: data.checkIn,
            checkOut: data.checkOut,
            totalPrice: data.totalPrice,
            status: BOOKING_STATUS.CONFIRMED,
            paymentIntentId: data.paymentIntentId,
            paymentStatus: 'succeeded',
            stripeCustomerId: data.stripeCustomerId,
        }).save();

        return {
            ...booking.toObject(),
            id: booking._id.toString(),
            hotel: {
                name: hotel.name,
                address: hotel.address,
                city: hotel.city,
                owner: ownerEmail ? { email: ownerEmail } : null,
            },
        };
    }

    /**
     * Get all bookings for a user
     */
    async getUserBookings(userId: string) {
        const bookings = await Booking.find({ userId }).sort({ createdAt: -1 }).lean();

        const bookingsWithHotels = await Promise.all(
            bookings.map(async (booking) => {
                const hotel = await Hotel.findById(booking.hotelId).lean();
                return {
                    ...booking,
                    id: booking._id.toString(),
                    hotel: hotel ? {
                        name: hotel.name,
                        address: hotel.address,
                        city: hotel.city,
                        images: hotel.images,
                    } : null,
                };
            })
        );

        return bookingsWithHotels;
    }

    /**
     * Get booking by ID
     */
    async getBookingById(id: string) {
        const booking = await Booking.findById(id).lean();
        if (!booking) return null;

        const [hotel, user] = await Promise.all([
            Hotel.findById(booking.hotelId).lean(),
            User.findById(booking.userId).lean(),
        ]);

        return {
            ...booking,
            id: booking._id.toString(),
            hotel: hotel ? { ...hotel, id: hotel._id.toString() } : null,
            user: user ? { name: user.name, email: user.email } : null,
        };
    }

    /**
     * Update booking status
     */
    async updateBookingStatus(id: string, status: BookingStatus) {
        const updated = await Booking.findByIdAndUpdate(id, { status }, { new: true }).lean();
        return { ...updated, id: updated?._id.toString() };
    }

    /**
     * Cancel a booking
     */
    async cancelBooking(id: string, userId: string) {
        const booking = await Booking.findById(id).lean();

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
