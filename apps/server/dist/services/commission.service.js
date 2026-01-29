import { prisma } from '@repo/database';
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
    /**
     * Calculate commission based on booking amount and hotel's subscription tier
     */
    async calculateCommission(bookingAmount, hotelId) {
        // Get hotel's active subscription
        const subscription = await prisma.subscription.findFirst({
            where: {
                hotelId,
                active: true,
                endDate: {
                    gte: new Date(), // Still active
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        // Default to FREE tier if no subscription
        // Default to FREE tier if no subscription
        const tier = subscription?.tier || SubscriptionTier.FREE;
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
        await prisma.commission.create({
            data: {
                bookingId,
                commissionRate: calculation.commissionRate,
                commissionAmount: calculation.commissionAmount,
                platformFee: calculation.platformFee,
                hotelPayout: calculation.hotelPayout,
                status: PayoutStatus.PENDING,
            },
        });
    }
    /**
     * Get total pending commissions for a date range
     */
    async getPendingCommissions(startDate, endDate) {
        const where = { status: PayoutStatus.PENDING };
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate)
                where.createdAt.gte = startDate;
            if (endDate)
                where.createdAt.lte = endDate;
        }
        const result = await prisma.commission.aggregate({
            where,
            _sum: {
                commissionAmount: true,
                platformFee: true,
            },
        });
        return ((result._sum.commissionAmount || 0) + (result._sum.platformFee || 0));
    }
    /**
     * Generate payout report for a hotel
     */
    async generatePayoutReport(hotelId, startDate, endDate) {
        const commissions = await prisma.commission.findMany({
            where: {
                booking: {
                    hotelId,
                },
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: {
                booking: {
                    select: {
                        id: true,
                        totalPrice: true,
                        checkIn: true,
                        checkOut: true,
                        user: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        });
        const totalBookings = commissions.length;
        const totalRevenue = commissions.reduce((sum, c) => sum + c.booking.totalPrice, 0);
        const totalCommission = commissions.reduce((sum, c) => sum + c.commissionAmount + c.platformFee, 0);
        const totalPayout = commissions.reduce((sum, c) => sum + c.hotelPayout, 0);
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
        await prisma.commission.update({
            where: { id: commissionId },
            data: {
                status: PayoutStatus.PAID,
                paidAt: new Date(),
            },
        });
    }
}
export const commissionService = new CommissionService();
