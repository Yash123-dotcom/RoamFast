import { db } from '@/config/firebase';
import { PayoutStatus, SubscriptionTier } from '@/constants/enums';
// Commission rates based on subscription tier
const COMMISSION_RATES = {
    FREE: 15, // 15% commission
    SILVER: 12, // 12% commission
    GOLD: 10, // 10% commission
    PLATINUM: 8, // 8% commission
};
// Platform convenience fee
const PLATFORM_FEE = 299; // ₹299 per booking
export class CommissionService {
    constructor() {
        this.collection = db.collection('commissions');
    }
    /**
     * Calculate commission based on booking amount and hotel's subscription tier
     */
    async calculateCommission(bookingAmount, hotelId) {
        // Get hotel's active subscription
        const subscriptionSnapshot = await db.collection('subscriptions')
            .where('hotelId', '==', hotelId)
            .where('active', '==', true)
            .where('endDate', '>=', new Date())
            .orderBy('createdAt', 'desc')
            .limit(1)
            .get();
        // Default to FREE tier if no subscription
        const tier = subscriptionSnapshot.empty
            ? SubscriptionTier.FREE
            : subscriptionSnapshot.docs[0].data().tier;
        const commissionRate = COMMISSION_RATES[tier];
        // Calculate amounts
        const commissionAmount = Math.round((bookingAmount * commissionRate) / 100);
        const platformFee = PLATFORM_FEE;
        const hotelPayout = bookingAmount - commissionAmount;
        const totalChargeToCustomer = bookingAmount + platformFee;
        return {
            commissionRate,
            commissionAmount,
            platformFee,
            hotelPayout,
            totalChargeToCustomer,
        };
    }
    /**
     * Record commission for a booking
     */
    async recordCommission(bookingId, hotelId, bookingAmount) {
        const calculation = await this.calculateCommission(bookingAmount, hotelId);
        await this.collection.add({
            bookingId,
            commissionRate: calculation.commissionRate,
            commissionAmount: calculation.commissionAmount,
            platformFee: calculation.platformFee,
            hotelPayout: calculation.hotelPayout,
            status: PayoutStatus.PENDING,
            createdAt: new Date(),
        });
    }
    /**
     * Get total pending commissions for a date range
     */
    async getPendingCommissions(startDate, endDate) {
        let query = this.collection.where('status', '==', PayoutStatus.PENDING);
        if (startDate) {
            query = query.where('createdAt', '>=', startDate);
        }
        if (endDate) {
            query = query.where('createdAt', '<=', endDate);
        }
        const snapshot = await query.get();
        let total = 0;
        snapshot.docs.forEach(doc => {
            const data = doc.data();
            total += (data.commissionAmount || 0) + (data.platformFee || 0);
        });
        return total;
    }
    /**
     * Generate payout report for a hotel
     */
    async generatePayoutReport(hotelId, startDate, endDate) {
        // Get all bookings for the hotel in the date range
        const bookingsSnapshot = await db.collection('bookings')
            .where('hotelId', '==', hotelId)
            .where('createdAt', '>=', startDate)
            .where('createdAt', '<=', endDate)
            .get();
        const bookingIds = bookingsSnapshot.docs.map(doc => doc.id);
        if (bookingIds.length === 0) {
            return {
                totalBookings: 0,
                totalRevenue: 0,
                totalCommission: 0,
                totalPayout: 0,
                commissions: [],
            };
        }
        // Get commissions for these bookings
        const allCommissionsSnapshot = await this.collection.get();
        const commissions = [];
        for (const commDoc of allCommissionsSnapshot.docs) {
            const commData = commDoc.data();
            if (bookingIds.includes(commData.bookingId)) {
                const bookingDoc = await db.collection('bookings').doc(commData.bookingId).get();
                const bookingData = bookingDoc.exists ? bookingDoc.data() : null;
                let user = null;
                if (bookingData?.userId) {
                    const userDoc = await db.collection('users').doc(bookingData.userId).get();
                    if (userDoc.exists) {
                        const userData = userDoc.data();
                        user = { name: userData?.name, email: userData?.email };
                    }
                }
                commissions.push({
                    id: commDoc.id,
                    ...commData,
                    booking: bookingData ? {
                        id: bookingDoc.id,
                        totalPrice: bookingData.totalPrice,
                        checkIn: bookingData.checkIn,
                        checkOut: bookingData.checkOut,
                        user,
                    } : null,
                });
            }
        }
        const totalBookings = commissions.length;
        const totalRevenue = commissions.reduce((sum, c) => sum + (c.booking?.totalPrice || 0), 0);
        const totalCommission = commissions.reduce((sum, c) => sum + (c.commissionAmount || 0) + (c.platformFee || 0), 0);
        const totalPayout = commissions.reduce((sum, c) => sum + (c.hotelPayout || 0), 0);
        return {
            totalBookings,
            totalRevenue,
            totalCommission,
            totalPayout,
            commissions,
        };
    }
    /**
     * Mark commission as paid
     */
    async markAsPaid(commissionId) {
        await this.collection.doc(commissionId).update({
            status: PayoutStatus.PAID,
            paidAt: new Date(),
        });
    }
}
export const commissionService = new CommissionService();
