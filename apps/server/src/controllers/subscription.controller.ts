import { Request, Response } from 'express';
import { subscriptionService } from '@/services/subscription.service';
import { asyncHandler } from '@/utils/asyncHandler';
import { HTTP_STATUS } from '@/config/constants';
import { SubscriptionTier } from '@/constants/enums';

export class SubscriptionController {
    /**
     * Create a new subscription
     * POST /api/v1/subscriptions
     */
    createSubscription = asyncHandler(async (req: Request, res: Response) => {
        const { hotelId, tier, durationMonths } = req.body;

        // Validate tier
        if (!Object.values(SubscriptionTier).includes(tier)) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Invalid subscription tier' });
            return;
        }

        const subscription = await subscriptionService.createSubscription(
            hotelId,
            tier as SubscriptionTier,
            durationMonths
        );

        res.status(HTTP_STATUS.CREATED).json(subscription);
    });

    /**
     * Get active subscription for a hotel
     * GET /api/v1/subscriptions/:hotelId
     */
    getSubscription = asyncHandler(async (req: Request, res: Response) => {
        const { hotelId } = req.params;
        const subscription = await subscriptionService.getActiveSubscription(hotelId as string);

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
    upgradeSubscription = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const { tier } = req.body;

        const updated = await subscriptionService.upgradeSubscription(id as string, tier as SubscriptionTier);
        res.status(HTTP_STATUS.OK).json(updated);
    });
}

export default new SubscriptionController();
