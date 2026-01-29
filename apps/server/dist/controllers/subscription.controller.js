import { subscriptionService } from '@/services/subscription.service';
import { asyncHandler } from '@/utils/asyncHandler';
import { HTTP_STATUS } from '@/config/constants';
import { SubscriptionTier } from '@/constants/enums';
export class SubscriptionController {
    constructor() {
        /**
         * Create a new subscription
         * POST /api/v1/subscriptions
         */
        this.createSubscription = asyncHandler(async (req, res) => {
            const { hotelId, tier, durationMonths } = req.body;
            // Validate tier
            if (!Object.values(SubscriptionTier).includes(tier)) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Invalid subscription tier' });
                return;
            }
            const subscription = await subscriptionService.createSubscription(hotelId, tier, durationMonths);
            res.status(HTTP_STATUS.CREATED).json(subscription);
        });
        /**
         * Get active subscription for a hotel
         * GET /api/v1/subscriptions/:hotelId
         */
        this.getSubscription = asyncHandler(async (req, res) => {
            const { hotelId } = req.params;
            const subscription = await subscriptionService.getActiveSubscription(hotelId);
            if (!subscription) {
                // Return 200 with null or specific message, or 404. 
                // For UI checking simpler to return 200 with { active: false } or similar 
                // but here we just return the null or object.
                res.status(HTTP_STATUS.OK).json({ active: false, tier: SubscriptionTier.FREE });
                return;
            }
            res.status(HTTP_STATUS.OK).json(subscription);
        });
        /**
         * Upgrade subscription
         * POST /api/v1/subscriptions/:id/upgrade
         */
        this.upgradeSubscription = asyncHandler(async (req, res) => {
            const { id } = req.params;
            const { tier } = req.body;
            const updated = await subscriptionService.upgradeSubscription(id, tier);
            res.status(HTTP_STATUS.OK).json(updated);
        });
    }
}
export default new SubscriptionController();
