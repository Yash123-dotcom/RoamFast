import { Request, Response } from 'express';
import Stripe from 'stripe';
import paymentService from '@/services/payment.service';
import bookingService from '@/services/booking.service';
import emailService from '@/services/email.service';
import { logger } from '@/utils/logger';
import { config } from '@/config';
import { asyncHandler } from '@/utils/asyncHandler';
import { HTTP_STATUS } from '@/config/constants';

/**
 * Webhook Controller - Handles Stripe webhook events
 */
export class WebhookController {
    /**
     * Handle Stripe webhook events
     * POST /api/v1/webhooks/stripe
     */
    handleStripeWebhook = asyncHandler(async (req: Request, res: Response) => {
        const signature = req.headers['stripe-signature'];

        if (!signature) {
            logger.error('Missing stripe-signature header');
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                error: 'Missing stripe-signature header',
            });
        }

        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

        if (!webhookSecret) {
            logger.error('STRIPE_WEBHOOK_SECRET not configured');
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                error: 'Webhook secret not configured',
            });
        }

        try {
            // Verify webhook signature
            const event = paymentService.constructEvent(
                req.body,
                signature as string,
                webhookSecret
            );

            logger.info('Webhook event received', {
                type: event.type,
                id: event.id,
            });

            // Handle the event
            switch (event.type) {
                case 'payment_intent.succeeded':
                    await this.handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
                    break;

                case 'payment_intent.payment_failed':
                    await this.handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
                    break;

                case 'payment_intent.canceled':
                    await this.handlePaymentCanceled(event.data.object as Stripe.PaymentIntent);
                    break;

                default:
                    logger.info(`Unhandled event type: ${event.type}`);
            }

            // Return a 200 response to acknowledge receipt of the event
            res.status(HTTP_STATUS.OK).json({ received: true });
        } catch (error) {
            logger.error('Webhook processing error:', error);
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                error: error instanceof Error ? error.message : 'Webhook processing failed',
            });
        }
    });

    /**
     * Handle successful payment
     */
    private async handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
        logger.info('Payment succeeded', {
            paymentIntentId: paymentIntent.id,
            amount: paymentIntent.amount,
        });

        const metadata = paymentIntent.metadata;

        if (!metadata.userId || !metadata.hotelId || !metadata.checkIn || !metadata.checkOut) {
            logger.error('Missing metadata in payment intent', { paymentIntentId: paymentIntent.id });
            return;
        }

        try {
            // Create booking from payment metadata
            const booking = await bookingService.createBookingFromPayment({
                userId: metadata.userId,
                hotelId: metadata.hotelId,
                checkIn: new Date(metadata.checkIn),
                checkOut: new Date(metadata.checkOut),
                totalPrice: parseFloat(metadata.originalAmount),
                paymentIntentId: paymentIntent.id,
                stripeCustomerId: paymentIntent.customer as string | undefined,
            });

            logger.info('Booking created from successful payment', {
                bookingId: booking.id,
                paymentIntentId: paymentIntent.id,
            });

            // Send confirmation email
            await emailService.sendBookingConfirmation(
                metadata.userEmail || 'user@example.com', // Fallback as metadata might not have email, ideally pass it
                metadata.userName || 'Valued Guest',
                {
                    id: booking.id,
                    hotelName: (booking as any).hotel?.name || 'Hotel',
                    checkIn: booking.checkIn,
                    checkOut: booking.checkOut,
                    totalPrice: booking.totalPrice
                }
            );

            // Notify Owner
            if ((booking as any).hotel?.owner?.email) {
                await emailService.sendNewBookingNotification(
                    (booking as any).hotel.owner.email,
                    (booking as any).hotel.name || 'Your Property',
                    booking.totalPrice
                );
            }
        } catch (error) {
            logger.error('Error creating booking from payment:', error);
            throw error;
        }
    }

    /**
     * Handle failed payment
     */
    private async handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
        logger.warn('Payment failed', {
            paymentIntentId: paymentIntent.id,
            error: paymentIntent.last_payment_error?.message,
        });

        // TODO: Update existing booking status if it exists
        // TODO: Send notification to user about failed payment
    }

    /**
     * Handle canceled payment
     */
    private async handlePaymentCanceled(paymentIntent: Stripe.PaymentIntent) {
        logger.info('Payment canceled', {
            paymentIntentId: paymentIntent.id,
        });

        // TODO: Update booking status to canceled
        // TODO: Notify user
    }
}

export default new WebhookController();
