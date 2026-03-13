import { Subscription } from '@/models/Subscription';
import { Hotel } from '@/models/Hotel';
import { User } from '@/models/User';
import { SubscriptionTier } from '@/constants/enums';

// Subscription pricing (monthly in ₹)
const SUBSCRIPTION_PRICES: Record<SubscriptionTier, number> = {
    FREE: 0,
    SILVER: 3000,
    GOLD: 8000,
    PLATINUM: 15000,
};

export class SubscriptionService {
    /**
     * Create a new subscription for a hotel
     */
    async createSubscription(
        hotelId: string,
        tier: SubscriptionTier,
        durationMonths: number = 1
    ): Promise<any> {
        const price = SUBSCRIPTION_PRICES[tier];
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + durationMonths);

        // Deactivate any existing active subscriptions
        await Subscription.updateMany({ hotelId, active: true }, { active: false });

        const subscription = await new Subscription({
            hotelId,
            tier,
            startDate,
            endDate,
            price: price * durationMonths,
            active: true,
        }).save();

        return { ...subscription.toObject(), id: subscription._id.toString() };
    }

    /**
     * Upgrade subscription to a higher tier
     */
    async upgradeSubscription(subscriptionId: string, newTier: SubscriptionTier): Promise<any> {
        const subscription = await Subscription.findById(subscriptionId);
        if (!subscription) throw new Error('Subscription not found');

        const oldPrice = SUBSCRIPTION_PRICES[subscription.tier as SubscriptionTier];
        const newPrice = SUBSCRIPTION_PRICES[newTier];
        const priceDifference = newPrice - oldPrice;

        subscription.tier = newTier;
        subscription.price = subscription.price + priceDifference;
        await subscription.save();

        return { ...subscription.toObject(), id: subscription._id.toString() };
    }

    /**
     * Check if a hotel has an active subscription
     */
    async getActiveSubscription(hotelId: string): Promise<any | null> {
        const subscription = await Subscription.findOne({
            hotelId,
            active: true,
            endDate: { $gte: new Date() },
        }).sort({ createdAt: -1 }).lean();

        if (!subscription) return null;
        return { ...subscription, id: subscription._id.toString() };
    }

    /**
     * Get subscription tier for a hotel (defaults to FREE)
     */
    async getHotelTier(hotelId: string): Promise<SubscriptionTier> {
        const subscription = await this.getActiveSubscription(hotelId);
        return (subscription?.tier as SubscriptionTier) || SubscriptionTier.FREE;
    }

    /**
     * Apply subscription benefits to hotel data
     */
    applySubscriptionBenefits(hotel: any, tier: SubscriptionTier): any {
        const benefits = {
            hasVerifiedBadge: tier !== SubscriptionTier.FREE,
            isFeatured: ([SubscriptionTier.GOLD, SubscriptionTier.PLATINUM] as SubscriptionTier[]).includes(tier),
            hasPrioritySupport: tier === SubscriptionTier.PLATINUM,
            hasAnalyticsDashboard: ([SubscriptionTier.GOLD, SubscriptionTier.PLATINUM] as SubscriptionTier[]).includes(tier),
            commissionRate: this.getCommissionRate(tier),
        };

        return { ...hotel, subscriptionBenefits: benefits };
    }

    /**
     * Get commission rate for a tier
     */
    getCommissionRate(tier: SubscriptionTier): number {
        const rates: Record<SubscriptionTier, number> = {
            FREE: 15,
            SILVER: 12,
            GOLD: 10,
            PLATINUM: 8,
        };
        return rates[tier];
    }

    /**
     * Check for expiring subscriptions
     */
    async checkExpiringSubscriptions(): Promise<any[]> {
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        const subscriptions = await Subscription.find({
            active: true,
            endDate: { $lte: thirtyDaysFromNow, $gte: new Date() },
        }).lean();

        const result = await Promise.all(
            subscriptions.map(async (sub) => {
                const hotel = await Hotel.findById(sub.hotelId).lean();
                let owner = null;

                if (hotel?.ownerId) {
                    const ownerDoc = await User.findById(hotel.ownerId).lean();
                    owner = ownerDoc ?? null;
                }

                return {
                    ...sub,
                    id: sub._id.toString(),
                    hotel: hotel ? {
                        ...hotel,
                        id: hotel._id.toString(),
                        owner,
                    } : null,
                };
            })
        );

        return result;
    }

    /**
     * Renew subscription
     */
    async renewSubscription(subscriptionId: string, durationMonths: number = 1): Promise<any> {
        const subscription = await Subscription.findById(subscriptionId);
        if (!subscription) throw new Error('Subscription not found');

        const newEndDate = new Date(subscription.endDate);
        newEndDate.setMonth(newEndDate.getMonth() + durationMonths);

        const price = SUBSCRIPTION_PRICES[subscription.tier as SubscriptionTier];
        subscription.endDate = newEndDate;
        subscription.price = subscription.price + price * durationMonths;
        await subscription.save();

        return { ...subscription.toObject(), id: subscription._id.toString() };
    }

    /**
     * Get subscription analytics for platform
     */
    async getSubscriptionAnalytics(): Promise<{
        totalRevenue: number;
        tierDistribution: Record<SubscriptionTier, number>;
        activeSubscriptions: number;
    }> {
        const subscriptions = await Subscription.find({
            active: true,
            endDate: { $gte: new Date() },
        }).lean();

        let totalRevenue = 0;
        const tierDistribution: Record<SubscriptionTier, number> = {
            FREE: 0,
            SILVER: 0,
            GOLD: 0,
            PLATINUM: 0,
        };

        subscriptions.forEach(sub => {
            totalRevenue += sub.price || 0;
            const tier = sub.tier as SubscriptionTier;
            if (tier in tierDistribution) tierDistribution[tier]++;
        });

        return {
            totalRevenue,
            tierDistribution,
            activeSubscriptions: subscriptions.length,
        };
    }
}

export const subscriptionService = new SubscriptionService();
