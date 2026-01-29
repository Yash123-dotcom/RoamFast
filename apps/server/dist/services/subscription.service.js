import { prisma } from '@repo/database';
import { SubscriptionTier } from '@/constants/enums';
// Subscription pricing (monthly in ₹)
const SUBSCRIPTION_PRICES = {
    FREE: 0,
    SILVER: 3000,
    GOLD: 8000,
    PLATINUM: 15000,
};
export class SubscriptionService {
    /**
     * Create a new subscription for a hotel
     */
    async createSubscription(hotelId, tier, durationMonths = 1) {
        const price = SUBSCRIPTION_PRICES[tier];
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + durationMonths);
        // Deactivate any existing subscriptions
        await prisma.subscription.updateMany({
            where: { hotelId, active: true },
            data: { active: false },
        });
        return await prisma.subscription.create({
            data: {
                hotelId,
                tier,
                startDate,
                endDate,
                price: price * durationMonths,
                active: true,
            },
        });
    }
    /**
     * Upgrade subscription to a higher tier
     */
    async upgradeSubscription(subscriptionId, newTier) {
        const subscription = await prisma.subscription.findUnique({
            where: { id: subscriptionId },
        });
        if (!subscription) {
            throw new Error('Subscription not found');
        }
        // Calculate prorated price difference
        // Calculate prorated price difference
        const oldPrice = SUBSCRIPTION_PRICES[subscription.tier];
        const newPrice = SUBSCRIPTION_PRICES[newTier];
        const priceDifference = newPrice - oldPrice;
        // Update the subscription
        return await prisma.subscription.update({
            where: { id: subscriptionId },
            data: {
                tier: newTier,
                price: subscription.price + priceDifference,
            },
        });
    }
    /**
     * Check if a hotel has an active subscription
     */
    async getActiveSubscription(hotelId) {
        return await prisma.subscription.findFirst({
            where: {
                hotelId,
                active: true,
                endDate: {
                    gte: new Date(),
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    /**
     * Get subscription tier for a hotel (defaults to FREE)
     */
    async getHotelTier(hotelId) {
        const subscription = await this.getActiveSubscription(hotelId);
        return subscription?.tier || SubscriptionTier.FREE;
    }
    /**
     * Apply subscription benefits to hotel data
     */
    applySubscriptionBenefits(hotel, tier) {
        const benefits = {
            hasVerifiedBadge: tier !== SubscriptionTier.FREE,
            isFeatured: [SubscriptionTier.GOLD, SubscriptionTier.PLATINUM].includes(tier),
            hasPrioritySupport: tier === SubscriptionTier.PLATINUM,
            hasAnalyticsDashboard: [SubscriptionTier.GOLD, SubscriptionTier.PLATINUM].includes(tier),
            commissionRate: this.getCommissionRate(tier),
        };
        return {
            ...hotel,
            subscriptionBenefits: benefits,
        };
    }
    /**
     * Get commission rate for a tier
     */
    getCommissionRate(tier) {
        const rates = {
            FREE: 15,
            SILVER: 12,
            GOLD: 10,
            PLATINUM: 8,
        };
        return rates[tier];
    }
    /**
     * Check for expiring subscriptions and send notifications
     */
    async checkExpiringSubscriptions() {
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        return await prisma.subscription.findMany({
            where: {
                active: true,
                endDate: {
                    lte: thirtyDaysFromNow,
                    gte: new Date(),
                },
            },
            include: {
                hotel: {
                    include: {
                        owner: true,
                    },
                },
            },
        });
    }
    /**
     * Renew subscription
     */
    async renewSubscription(subscriptionId, durationMonths = 1) {
        const subscription = await prisma.subscription.findUnique({
            where: { id: subscriptionId },
        });
        if (!subscription) {
            throw new Error('Subscription not found');
        }
        const newEndDate = new Date(subscription.endDate);
        newEndDate.setMonth(newEndDate.getMonth() + durationMonths);
        const price = SUBSCRIPTION_PRICES[subscription.tier];
        return await prisma.subscription.update({
            where: { id: subscriptionId },
            data: {
                endDate: newEndDate,
                price: subscription.price + price * durationMonths,
            },
        });
    }
    /**
     * Get subscription analytics for platform
     */
    async getSubscriptionAnalytics() {
        const subscriptions = await prisma.subscription.findMany({
            where: {
                active: true,
                endDate: {
                    gte: new Date(),
                },
            },
        });
        const totalRevenue = subscriptions.reduce((sum, sub) => sum + sub.price, 0);
        const tierDistribution = subscriptions.reduce((acc, sub) => {
            const tier = sub.tier;
            acc[tier] = (acc[tier] || 0) + 1;
            return acc;
        }, {});
        return {
            totalRevenue,
            tierDistribution,
            activeSubscriptions: subscriptions.length,
        };
    }
}
export const subscriptionService = new SubscriptionService();
