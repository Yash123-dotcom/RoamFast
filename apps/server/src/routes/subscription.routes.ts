import { Router } from 'express';
import subscriptionController from '@/controllers/subscription.controller';

const router = Router();

// Create subscription
router.post('/', subscriptionController.createSubscription);

// Get hotel subscription
router.get('/:hotelId', subscriptionController.getSubscription);

// Upgrade subscription
router.post('/:id/upgrade', subscriptionController.upgradeSubscription);

export default router;
