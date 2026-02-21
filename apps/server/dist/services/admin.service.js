import { db } from '@/config/firebase';
import { HotelStatus } from '@/constants/enums';
import emailService from './email.service';
import { logger } from '@/utils/logger';
export class AdminService {
    /**
     * Get all hotels requiring approval
     */
    async getPendingHotels() {
        const hotelsSnapshot = await db.collection('hotels')
            .where('status', '==', HotelStatus.PENDING)
            .orderBy('createdAt', 'asc')
            .get();
        const hotels = await Promise.all(hotelsSnapshot.docs.map(async (doc) => {
            const hotelData = doc.data();
            // Fetch owner data
            let owner = null;
            if (hotelData.ownerId) {
                const ownerDoc = await db.collection('users').doc(hotelData.ownerId).get();
                if (ownerDoc.exists) {
                    const ownerData = ownerDoc.data();
                    owner = { name: ownerData?.name, email: ownerData?.email };
                }
            }
            // Fetch active subscription
            const subscriptionSnapshot = await db.collection('subscriptions')
                .where('hotelId', '==', doc.id)
                .where('active', '==', true)
                .limit(1)
                .get();
            const subscriptions = subscriptionSnapshot.docs.map(subDoc => ({
                id: subDoc.id,
                ...subDoc.data(),
            }));
            return {
                id: doc.id,
                ...hotelData,
                owner,
                subscriptions,
            };
        }));
        return hotels;
    }
    /**
     * Approve a hotel listing
     */
    async approveHotel(hotelId) {
        const hotelDoc = await db.collection('hotels').doc(hotelId).get();
        if (!hotelDoc.exists) {
            throw new Error('Hotel not found');
        }
        await db.collection('hotels').doc(hotelId).update({
            status: HotelStatus.APPROVED,
            updatedAt: new Date(),
        });
        const hotelData = hotelDoc.data();
        // Fetch owner data
        let owner = null;
        if (hotelData?.ownerId) {
            const ownerDoc = await db.collection('users').doc(hotelData.ownerId).get();
            if (ownerDoc.exists) {
                owner = ownerDoc.data();
            }
        }
        if (owner && owner.email) {
            await emailService.sendHotelApprovalNotification(owner.email, owner.name || 'Partner', hotelData?.name || 'Hotel');
        }
        return {
            id: hotelId,
            ...hotelData,
            status: HotelStatus.APPROVED,
            owner,
        };
    }
    /**
     * Reject a hotel listing
     */
    async rejectHotel(hotelId) {
        await db.collection('hotels').doc(hotelId).update({
            status: HotelStatus.REJECTED,
            updatedAt: new Date(),
        });
        const updated = await db.collection('hotels').doc(hotelId).get();
        return {
            id: updated.id,
            ...updated.data(),
        };
    }
    async getPlatformStats() {
        const [usersSnapshot, hotelsSnapshot, bookingsSnapshot, commissionsSnapshot] = await Promise.all([
            db.collection('users').get(),
            db.collection('hotels').where('status', '==', HotelStatus.APPROVED).get(),
            db.collection('bookings').get(),
            db.collection('commissions').get(),
        ]);
        let totalRevenue = 0;
        commissionsSnapshot.docs.forEach(doc => {
            const data = doc.data();
            totalRevenue += (data.commissionAmount || 0) + (data.platformFee || 0);
        });
        return {
            totalUsers: usersSnapshot.size,
            totalHotels: hotelsSnapshot.size,
            totalBookings: bookingsSnapshot.size,
            totalRevenue,
        };
    }
    /**
     * Get all commission payouts
     */
    async getPayouts() {
        const commissionsSnapshot = await db.collection('commissions')
            .orderBy('createdAt', 'desc')
            .get();
        const payouts = await Promise.all(commissionsSnapshot.docs.map(async (doc) => {
            const commissionData = doc.data();
            const bookingDoc = await db.collection('bookings').doc(commissionData.bookingId).get();
            const bookingData = bookingDoc.exists ? bookingDoc.data() : null;
            let hotelName = null;
            if (bookingData?.hotelId) {
                const hotelDoc = await db.collection('hotels').doc(bookingData.hotelId).get();
                hotelName = hotelDoc.exists ? hotelDoc.data()?.name : null;
            }
            return {
                id: doc.id,
                ...commissionData,
                booking: bookingData ? {
                    id: bookingDoc.id,
                    totalPrice: bookingData.totalPrice,
                    hotel: { name: hotelName },
                } : null,
            };
        }));
        return payouts;
    }
    /**
     * Get detailed revenue analytics
     */
    async getRevenueAnalytics() {
        try {
            const commissionsSnapshot = await db.collection('commissions').get();
            let totalCommissions = 0;
            let totalPlatformFees = 0;
            let totalHotelPayouts = 0;
            const payoutsByStatus = {};
            commissionsSnapshot.docs.forEach(doc => {
                const data = doc.data();
                totalCommissions += data.commissionAmount || 0;
                totalPlatformFees += data.platformFee || 0;
                totalHotelPayouts += data.hotelPayout || 0;
                const status = data.status || 'PENDING';
                if (!payoutsByStatus[status]) {
                    payoutsByStatus[status] = {
                        status,
                        _sum: { commissionAmount: 0, platformFee: 0 },
                        _count: 0,
                    };
                }
                payoutsByStatus[status]._sum.commissionAmount += data.commissionAmount || 0;
                payoutsByStatus[status]._sum.platformFee += data.platformFee || 0;
                payoutsByStatus[status]._count++;
            });
            // Recent transactions (last 10)
            const recentCommissionsSnapshot = await db.collection('commissions')
                .orderBy('createdAt', 'desc')
                .limit(10)
                .get();
            const recentTransactions = await Promise.all(recentCommissionsSnapshot.docs.map(async (doc) => {
                const commData = doc.data();
                const bookingDoc = await db.collection('bookings').doc(commData.bookingId).get();
                const bookingData = bookingDoc.exists ? bookingDoc.data() : null;
                // Fetch related data
                let user = null, hotel = null;
                if (bookingData) {
                    const [userDoc, hotelDoc] = await Promise.all([
                        db.collection('users').doc(bookingData.userId).get(),
                        db.collection('hotels').doc(bookingData.hotelId).get(),
                    ]);
                    user = userDoc.exists ? { name: userDoc.data()?.name, email: userDoc.data()?.email } : null;
                    hotel = hotelDoc.exists ? { name: hotelDoc.data()?.name, city: hotelDoc.data()?.city } : null;
                }
                return {
                    id: doc.id,
                    ...commData,
                    booking: bookingData ? {
                        id: bookingDoc.id,
                        checkIn: bookingData.checkIn,
                        checkOut: bookingData.checkOut,
                        totalPrice: bookingData.totalPrice,
                        user,
                        hotel,
                    } : null,
                };
            }));
            // Monthly revenue
            const startOfMonth = new Date();
            startOfMonth.setDate(1);
            startOfMonth.setHours(0, 0, 0, 0);
            const monthlyCommissionsSnapshot = await db.collection('commissions')
                .where('createdAt', '>=', startOfMonth)
                .get();
            let monthlyRevenue = 0;
            monthlyCommissionsSnapshot.docs.forEach(doc => {
                const data = doc.data();
                monthlyRevenue += (data.commissionAmount || 0) + (data.platformFee || 0);
            });
            return {
                totalRevenue: totalCommissions + totalPlatformFees,
                totalCommissions,
                totalPlatformFees,
                totalHotelPayouts,
                transactionCount: commissionsSnapshot.size,
                payoutsByStatus: Object.values(payoutsByStatus),
                recentTransactions,
                monthlyRevenue,
            };
        }
        catch (error) {
            logger.error('Error fetching revenue analytics:', error);
            return {
                totalRevenue: 0,
                totalCommissions: 0,
                totalPlatformFees: 0,
                totalHotelPayouts: 0,
                transactionCount: 0,
                payoutsByStatus: [],
                recentTransactions: [],
                monthlyRevenue: 0,
            };
        }
    }
}
export default new AdminService();
