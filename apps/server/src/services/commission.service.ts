import { Commission } from '@/models/Commission';
import { Subscription } from '@/models/Subscription';
import { Booking } from '@/models/Booking';
import { User } from '@/models/User';
import { PayoutStatus, SubscriptionTier } from '@/constants/enums';

// Commission rates based on subscription tier
const COMMISSION_RATES: Record<SubscriptionTier, number> = {
    FREE: 15,   // 15% commission
    SILVER: 12, // 12% commission
    GOLD: 10,   // 10% commission
    PLATINUM: 8, // 8% commission
};

// Platform convenience fee
const PLATFORM_FEE = 299; // ₹299 per booking

export class CommissionService {
    /**
     * Calculate commission based on booking amount and hotel's subscription tier
     */
    async calculateCommission(
        bookingAmount: number,
        hotelId: string
    ): Promise<{
        commissionRate: number;
        commissionAmount: number;
        platformFee: number;
        hotelPayout: number;
        totalChargeToCustomer: number;
    }> {
        // Get hotel's active subscription
        const subscription = await Subscription.findOne({
            hotelId,
            active: true,
            endDate: { $gte: new Date() },
        }).sort({ createdAt: -1 }).lean();

        const tier: SubscriptionTier = (subscription?.tier as SubscriptionTier) ?? SubscriptionTier.FREE;
        const commissionRate = COMMISSION_RATES[tier];

        const commissionAmount = Math.round((bookingAmount * commissionRate) / 100);
        const platformFee = PLATFORM_FEE;
        const hotelPayout = bookingAmount - commissionAmount;
        const totalChargeToCustomer = bookingAmount + platformFee;

        return { commissionRate, commissionAmount, platformFee, hotelPayout, totalChargeToCustomer };
    }

    /**
     * Record commission for a booking
     */
    async recordCommission(
        bookingId: string,
        hotelId: string,
        bookingAmount: number
    ): Promise<void> {
        const calculation = await this.calculateCommission(bookingAmount, hotelId);

        await new Commission({
            bookingId,
            commissionRate: calculation.commissionRate,
            commissionAmount: calculation.commissionAmount,
            platformFee: calculation.platformFee,
            hotelPayout: calculation.hotelPayout,
            status: PayoutStatus.PENDING,
        }).save();
    }

    /**
     * Get total pending commissions for a date range
     */
    async getPendingCommissions(startDate?: Date, endDate?: Date): Promise<number> {
        const filter: Record<string, any> = { status: PayoutStatus.PENDING };

        if (startDate) filter.createdAt = { ...filter.createdAt, $gte: startDate };
        if (endDate) filter.createdAt = { ...filter.createdAt, $lte: endDate };

        const commissions = await Commission.find(filter).lean();

        return commissions.reduce((total, c) => total + (c.commissionAmount || 0) + (c.platformFee || 0), 0);
    }

    /**
     * Generate payout report for a hotel
     */
    async generatePayoutReport(
        hotelId: string,
        startDate: Date,
        endDate: Date
    ): Promise<{
        totalBookings: number;
        totalRevenue: number;
        totalCommission: number;
        totalPayout: number;
        commissions: any[];
    }> {
        const bookings = await Booking.find({
            hotelId,
            createdAt: { $gte: startDate, $lte: endDate },
        }).lean();

        const bookingIds = bookings.map(b => b._id.toString());

        if (bookingIds.length === 0) {
            return { totalBookings: 0, totalRevenue: 0, totalCommission: 0, totalPayout: 0, commissions: [] };
        }

        const commissionDocs = await Commission.find({ bookingId: { $in: bookingIds } }).lean();

        const commissions = await Promise.all(
            commissionDocs.map(async (comm) => {
                const booking = bookings.find(b => b._id.toString() === comm.bookingId);
                let user = null;

                if (booking?.userId) {
                    const userDoc = await User.findById(booking.userId).lean();
                    if (userDoc) user = { name: userDoc.name, email: userDoc.email };
                }

                return {
                    ...comm,
                    id: comm._id.toString(),
                    booking: booking ? {
                        id: booking._id.toString(),
                        totalPrice: booking.totalPrice,
                        checkIn: booking.checkIn,
                        checkOut: booking.checkOut,
                        user,
                    } : null,
                };
            })
        );

        const totalBookings = commissions.length;
        const totalRevenue = commissions.reduce((sum, c: any) => sum + (c.booking?.totalPrice || 0), 0);
        const totalCommission = commissions.reduce((sum, c: any) => sum + (c.commissionAmount || 0) + (c.platformFee || 0), 0);
        const totalPayout = commissions.reduce((sum, c: any) => sum + (c.hotelPayout || 0), 0);

        return { totalBookings, totalRevenue, totalCommission, totalPayout, commissions };
    }

    /**
     * Mark commission as paid
     */
    async markAsPaid(commissionId: string): Promise<void> {
        await Commission.findByIdAndUpdate(commissionId, {
            status: PayoutStatus.PAID,
            paidAt: new Date(),
        });
    }
}

export const commissionService = new CommissionService();
