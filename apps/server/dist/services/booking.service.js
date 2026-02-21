import { db } from '@/config/firebase';
import { BookingStatus } from '@/constants/enums';
import { ValidationError } from '@/utils/errors';
import { BOOKING_STATUS } from '@/config/constants';
import { logger } from '@/utils/logger';
/**
 * Booking Service - Data access layer for bookings using Firestore
 */
export class BookingService {
    constructor() {
        this.collection = db.collection('bookings');
    }
    /**
     * Create a new booking
     */
    async createBooking(data) {
        // Validate dates
        if (data.checkOut <= data.checkIn) {
            throw new ValidationError('Check-out date must be after check-in date');
        }
        // Verify hotel exists
        const hotelDoc = await db.collection('hotels').doc(data.hotelId).get();
        if (!hotelDoc.exists) {
            throw new ValidationError('Hotel not found');
        }
        const hotelData = hotelDoc.data();
        // Create booking
        const bookingData = {
            userId: data.userId,
            hotelId: data.hotelId,
            checkIn: data.checkIn,
            checkOut: data.checkOut,
            totalPrice: data.totalPrice,
            paymentId: data.paymentId,
            status: BOOKING_STATUS.CONFIRMED,
            createdAt: new Date(),
        };
        const docRef = await this.collection.add(bookingData);
        const booking = await docRef.get();
        return {
            id: booking.id,
            ...booking.data(),
            hotel: {
                name: hotelData?.name,
                address: hotelData?.address,
                city: hotelData?.city,
            },
        };
    }
    /**
     * Create booking from successful payment (webhook handler)
     */
    async createBookingFromPayment(data) {
        // Verify hotel exists
        const hotelDoc = await db.collection('hotels').doc(data.hotelId).get();
        if (!hotelDoc.exists) {
            throw new ValidationError('Hotel not found');
        }
        // Check if booking already exists with this payment intent
        const existingBookingSnapshot = await this.collection
            .where('paymentIntentId', '==', data.paymentIntentId)
            .limit(1)
            .get();
        if (!existingBookingSnapshot.empty) {
            const existingDoc = existingBookingSnapshot.docs[0];
            logger.info('Booking already exists for payment intent', {
                paymentIntentId: data.paymentIntentId,
                bookingId: existingDoc.id,
            });
            return {
                id: existingDoc.id,
                ...existingDoc.data(),
            };
        }
        const hotelData = hotelDoc.data();
        // Fetch owner email if exists
        let ownerEmail = null;
        if (hotelData?.ownerId) {
            const ownerDoc = await db.collection('users').doc(hotelData.ownerId).get();
            ownerEmail = ownerDoc.exists ? ownerDoc.data()?.email : null;
        }
        // Create booking
        const bookingData = {
            userId: data.userId,
            hotelId: data.hotelId,
            checkIn: data.checkIn,
            checkOut: data.checkOut,
            totalPrice: data.totalPrice,
            status: BOOKING_STATUS.CONFIRMED,
            paymentIntentId: data.paymentIntentId,
            paymentStatus: 'succeeded',
            stripeCustomerId: data.stripeCustomerId,
            createdAt: new Date(),
        };
        const docRef = await this.collection.add(bookingData);
        const booking = await docRef.get();
        return {
            id: booking.id,
            ...booking.data(),
            hotel: {
                name: hotelData?.name,
                address: hotelData?.address,
                city: hotelData?.city,
                owner: ownerEmail ? { email: ownerEmail } : null,
            },
        };
    }
    /**
     * Get all bookings for a user
     */
    async getUserBookings(userId) {
        const snapshot = await this.collection
            .where('userId', '==', userId)
            .orderBy('createdAt', 'desc')
            .get();
        const bookings = await Promise.all(snapshot.docs.map(async (doc) => {
            const bookingData = doc.data();
            const hotelDoc = await db.collection('hotels').doc(bookingData.hotelId).get();
            const hotelData = hotelDoc.exists ? hotelDoc.data() : null;
            return {
                id: doc.id,
                ...bookingData,
                hotel: hotelData ? {
                    name: hotelData.name,
                    address: hotelData.address,
                    city: hotelData.city,
                    images: hotelData.images,
                } : null,
            };
        }));
        return bookings;
    }
    /**
     * Get booking by ID
     */
    async getBookingById(id) {
        const bookingDoc = await this.collection.doc(id).get();
        if (!bookingDoc.exists) {
            return null;
        }
        const bookingData = bookingDoc.data();
        // Fetch hotel data
        const hotelDoc = await db.collection('hotels').doc(bookingData?.hotelId).get();
        const hotelData = hotelDoc.exists ? hotelDoc.data() : null;
        // Fetch user data
        const userDoc = await db.collection('users').doc(bookingData?.userId).get();
        const userData = userDoc.exists ? userDoc.data() : null;
        return {
            id: bookingDoc.id,
            ...bookingData,
            hotel: hotelData,
            user: userData ? {
                name: userData.name,
                email: userData.email,
            } : null,
        };
    }
    /**
     * Update booking status
     */
    async updateBookingStatus(id, status) {
        await this.collection.doc(id).update({ status });
        const updated = await this.collection.doc(id).get();
        return {
            id: updated.id,
            ...updated.data(),
        };
    }
    /**
     * Cancel a booking
     */
    async cancelBooking(id, userId) {
        const bookingDoc = await this.collection.doc(id).get();
        if (!bookingDoc.exists) {
            throw new ValidationError('Booking not found');
        }
        const bookingData = bookingDoc.data();
        if (bookingData?.userId !== userId) {
            throw new ValidationError('Unauthorized to cancel this booking');
        }
        return this.updateBookingStatus(id, BookingStatus.CANCELLED);
    }
}
export default new BookingService();
