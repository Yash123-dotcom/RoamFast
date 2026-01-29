import { Router } from 'express';
import paymentController from '@/controllers/payment.controller';
import { validate } from '@/middleware/validator';
import { createPaymentIntentSchema } from '@/schemas/payment.schema';
import { paymentLimiter } from '@/middleware/rateLimiter';
const router = Router();
/**
 * POST /api/v1/payment/create-intent - Create payment intent
 */
router.post('/create-intent', paymentLimiter, validate(createPaymentIntentSchema), paymentController.createPaymentIntent);
/**
 * GET /api/v1/payment/verify/:paymentIntentId - Verify payment
 */
router.get('/verify/:paymentIntentId', paymentController.verifyPayment);
export default router;
