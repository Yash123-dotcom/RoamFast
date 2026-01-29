import express from 'express';
import webhookController from '@/controllers/webhook.controller';

const router = express.Router();

/**
 * Stripe Webhook Routes
 * Note: Webhook route needs raw body for signature verification
 */

// POST /api/v1/webhooks/stripe
router.post('/stripe', webhookController.handleStripeWebhook);

export default router;
