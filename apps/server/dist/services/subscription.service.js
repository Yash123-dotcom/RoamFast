import { db } from '@/config/firebase';
import { SubscriptionTier } from '@/constants/enums';
// Subscription pricing (monthly in ₹)
const SUBSCRIPTION_PRICES = {
    FREE: 0,
    SILVER: 3000,
    GOLD: 8000,
    PLATINUM: 15000,
};
export class SubscriptionService {
    constructor() {
        this.collection = db.collection('subscriptions');
    }
    /**
     * Create a new subscription for a hotel
     */
    async createSubscription(hotelId, tier, durationMonths = 1) {
        const price = SUBSCRIPTION_PRICES[tier];
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + durationMonths);
        // Deactivate any existing subscriptions
        const existingSubscriptions = await this.collection
            .where('hotelId', '==', hotelId)
            .where('active', '==', true)
            .get();
        const batch = db.batch();
        existingSubscriptions.docs.forEach(doc => {
            batch.update(doc.ref, { active: false });
        });
        await batch.commit();
        // Create new subscription
        const subscriptionData = {
            hotelId,
            tier,
            startDate,
            endDate,
            price: price * durationMonths,
            active: true,
            createdAt: new Date(),
        };
        const docRef = await this.collection.add(subscriptionData);
        const created = await docRef.get();
        return {
            id: created.id,
            ...created.data(),
        };
    }
    /**
     * Upgrade subscription to a higher tier
     */
    async upgradeSubscription(subscriptionId, newTier) {
        const subscriptionDoc = await this.collection.doc(subscriptionId).get();
        if (!subscriptionDoc.exists) {
            throw new Error('Subscription not found');
        }
        const subscriptionData = subscriptionDoc.data();
        const oldPrice = SUBSCRIPTION_PRICES[subscriptionData?.tier];
        const newPrice = SUBSCRIPTION_PRICES[newTier];
        const priceDifference = newPrice - oldPrice;
        await this.collection.doc(subscriptionId).update({
            tier: newTier,
            price: (subscriptionData?.price || 0) + priceDifference,
        });
        const updated = await this.collection.doc(subscriptionId).get();
        return {
            id: updated.id,
            ...updated.data(),
        };
    }
    /**
     * Check if a hotel has an active subscription
     */
    async getActiveSubscription(hotelId) {
        const snapshot = await this.collection
            .where('hotelId', '==', hotelId)
            .where('active', '==', true)
            .where('endDate', '>=', new Date())
            .orderBy('createdAt', 'desc')
            .limit(1)
            .get();
        if (snapshot.empty) {
            return null;
        }
        const doc = snapshot.docs[0];
        return {
            id: doc.id,
            ...doc.data(),
        };
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
        const snapshot = await this.collection
            .where('active', '==', true)
            .where('endDate', '<=', thirtyDaysFromNow)
            .where('endDate', '>=', new Date())
            .get();
        const subscriptions = await Promise.all(snapshot.docs.map(async (doc) => {
            const subData = doc.data();
            const hotelDoc = await db.collection('hotels').doc(subData.hotelId).get();
            const hotelData = hotelDoc.exists ? hotelDoc.data() : null;
            let owner = null;
            if (hotelData?.ownerId) {
                const ownerDoc = await db.collection('users').doc(hotelData.ownerId).get();
                owner = ownerDoc.exists ? ownerDoc.data() : null;
            }
            return {
                id: doc.id,
                ...subData,
                hotel: {
                    id: hotelDoc.id,
                    ...hotelData,
                    owner,
                },
            };
        }));
        return subscriptions;
    }
    /**
     * Renew subscription
     */
    async renewSubscription(subscriptionId, durationMonths = 1) {
        const subscriptionDoc = await this.collection.doc(subscriptionId).get();
        if (!subscriptionDoc.exists) {
            throw new Error('Subscription not found');
        }
        const subscriptionData = subscriptionDoc.data();
        const newEndDate = new Date(subscriptionData?.endDate);
        newEndDate.setMonth(newEndDate.getMonth() + durationMonths);
        const price = SUBSCRIPTION_PRICES[subscriptionData?.tier];
        await this.collection.doc(subscriptionId).update({
            endDate: newEndDate,
            price: (subscriptionData?.price || 0) + price * durationMonths,
        });
        const updated = await this.collection.doc(subscriptionId).get();
        return {
            id: updated.id,
            ...updated.data(),
        };
    }
    /**
     * Get subscription analytics for platform
     */
    async getSubscriptionAnalytics() {
        const snapshot = await this.collection
            .where('active', '==', true)
            .where('endDate', '>=', new Date())
            .get();
        let totalRevenue = 0;
        const tierDistribution = {
            FREE: 0,
            SILVER: 0,
            GOLD: 0,
            PLATINUM: 0,
        };
        snapshot.docs.forEach(doc => {
            const data = doc.data();
            totalRevenue += data.price || 0;
            const tier = data.tier;
            if (tier in tierDistribution) {
                tierDistribution[tier]++;
            }
        });
        return {
            totalRevenue,
            tierDistribution,
            activeSubscriptions: snapshot.size,
        };
    }
}
export const subscriptionService = new SubscriptionService();
