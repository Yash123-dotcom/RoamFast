import { db } from '@/config/firebase';
export class OwnerService {
    /**
     * Get all hotels owned by a specific user
     */
    async getMyHotels(ownerId) {
        try {
            const hotelsSnapshot = await db.collection('hotels')
                .where('ownerId', '==', ownerId)
                .orderBy('createdAt', 'desc')
                .get();
            const hotels = await Promise.all(hotelsSnapshot.docs.map(async (doc) => {
                const hotelData = doc.data();
                // Count bookings and reviews
                const [bookingsSnapshot, reviewsSnapshot, subscriptionsSnapshot] = await Promise.all([
                    db.collection('bookings').where('hotelId', '==', doc.id).get(),
                    db.collection('reviews').where('hotelId', '==', doc.id).get(),
                    db.collection('subscriptions')
                        .where('hotelId', '==', doc.id)
                        .where('active', '==', true)
                        .orderBy('createdAt', 'desc')
                        .limit(1)
                        .get(),
                ]);
                const subscriptions = subscriptionsSnapshot.docs.map(subDoc => ({
                    id: subDoc.id,
                    ...subDoc.data(),
                }));
                return {
                    id: doc.id,
                    ...hotelData,
                    _count: {
                        bookings: bookingsSnapshot.size,
                        reviews: reviewsSnapshot.size,
                    },
                    subscriptions,
                };
            }));
            return hotels;
        }
        catch (error) {
            console.error('Error fetching owner hotels:', error);
            return [];
        }
    }
    /**
     * Get dashboard analytics for an owner
     */
    async getOwnerAnalytics(ownerId) {
        try {
            // Get all hotels
            const hotelsSnapshot = await db.collection('hotels')
                .where('ownerId', '==', ownerId)
                .get();
            const hotelIds = hotelsSnapshot.docs.map(doc => doc.id);
            if (hotelIds.length === 0) {
                return {
                    totalRevenue: 0,
                    totalBookings: 0,
                    averageRating: 0,
                    activeProperties: 0,
                    recentBookings: [],
                };
            }
            // Aggregate Revenue from commissions
            const commissionsSnapshot = await db.collection('commissions').get();
            let totalRevenue = 0;
            for (const commDoc of commissionsSnapshot.docs) {
                const commData = commDoc.data();
                const bookingDoc = await db.collection('bookings').doc(commData.bookingId).get();
                const bookingData = bookingDoc.exists ? bookingDoc.data() : null;
                if (bookingData && hotelIds.includes(bookingData.hotelId) && bookingData.status === 'COMPLETED') {
                    totalRevenue += commData.hotelPayout || 0;
                }
            }
            // Count bookings
            const allBookingsSnapshot = await db.collection('bookings').get();
            let bookingsCount = 0;
            for (const bookingDoc of allBookingsSnapshot.docs) {
                const bookingData = bookingDoc.data();
                if (hotelIds.includes(bookingData.hotelId) &&
                    ['CONFIRMED', 'COMPLETED'].includes(bookingData.status)) {
                    bookingsCount++;
                }
            }
            // Get Recent Bookings
            const recentBookingsSnapshot = await db.collection('bookings')
                .orderBy('createdAt', 'desc')
                .limit(50)
                .get();
            const recentBookings = [];
            for (const doc of recentBookingsSnapshot.docs) {
                const bookingData = doc.data();
                if (hotelIds.includes(bookingData.hotelId) && recentBookings.length < 5) {
                    const [hotelDoc, userDoc] = await Promise.all([
                        db.collection('hotels').doc(bookingData.hotelId).get(),
                        db.collection('users').doc(bookingData.userId).get(),
                    ]);
                    recentBookings.push({
                        id: doc.id,
                        ...bookingData,
                        hotel: hotelDoc.exists ? { name: hotelDoc.data()?.name } : null,
                        user: userDoc.exists ? {
                            name: userDoc.data()?.name,
                            email: userDoc.data()?.email,
                        } : null,
                    });
                }
            }
            return {
                totalRevenue,
                totalBookings: bookingsCount,
                activeProperties: hotelIds.length,
                recentBookings,
            };
        }
        catch (error) {
            console.error('Error fetching owner analytics:', error);
            return {
                totalRevenue: 0,
                totalBookings: 0,
                averageRating: 0,
                activeProperties: 0,
                recentBookings: [],
            };
        }
    }
}
export default new OwnerService();
