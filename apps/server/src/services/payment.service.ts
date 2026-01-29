import Stripe from 'stripe';
import { config } from '@/config';
import { PaymentError } from '@/utils/errors';
import { logger } from '@/utils/logger';

export interface CreatePaymentIntentParams {
    amount: number;
    userId: string;
    hotelId: string;
    checkIn: Date;
    checkOut: Date;
    customerEmail?: string;
}

/**
 * Payment Service - Handles Stripe payment processing
 */
export class PaymentService {
    private stripe: Stripe;

    constructor() {
        this.stripe = new Stripe(config.stripe.secretKey, {
            apiVersion: '2025-01-27.acacia' as any,
            typescript: true,
        });
    }

    /**
     * Create a payment intent with booking metadata
     */
    async createPaymentIntent(params: CreatePaymentIntentParams): Promise<{
        clientSecret: string;
        paymentIntentId: string
    }> {
        try {
            // Convert to smallest currency unit (paise for INR)
            const amountInPaise = Math.round(params.amount * 100);

            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: amountInPaise,
                currency: 'inr',
                automatic_payment_methods: { enabled: true },
                metadata: {
                    userId: params.userId,
                    hotelId: params.hotelId,
                    checkIn: params.checkIn.toISOString(),
                    checkOut: params.checkOut.toISOString(),
                    originalAmount: params.amount.toString(),
                },
                description: `Hotel booking for ${params.hotelId}`,
                receipt_email: params.customerEmail,
            });

            if (!paymentIntent.client_secret) {
                throw new PaymentError('Failed to create payment intent');
            }

            logger.info('Payment intent created', {
                paymentIntentId: paymentIntent.id,
                amount: amountInPaise,
                userId: params.userId,
                hotelId: params.hotelId,
            });

            return {
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id,
            };
        } catch (error) {
            logger.error('Error creating payment intent:', error);

            if (error instanceof Stripe.errors.StripeError) {
                throw new PaymentError(`Stripe error: ${error.message}`);
            }

            throw new PaymentError('Failed to create payment intent');
        }
    }

    /**
     * Verify payment status
     */
    async verifyPayment(paymentIntentId: string): Promise<boolean> {
        try {
            const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
            return paymentIntent.status === 'succeeded';
        } catch (error) {
            logger.error('Error verifying payment:', error);
            return false;
        }
    }

    /**
     * Retrieve payment intent details
     */
    async getPaymentIntent(paymentIntentId: string) {
        try {
            return await this.stripe.paymentIntents.retrieve(paymentIntentId);
        } catch (error) {
            logger.error('Error retrieving payment intent:', error);
            throw new PaymentError('Failed to retrieve payment details');
        }
    }

    /**
     * Construct and verify webhook event
     */
    constructEvent(payload: string | Buffer, signature: string, webhookSecret: string): Stripe.Event {
        try {
            return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
        } catch (error) {
            logger.error('Webhook signature verification failed:', error);
            throw new PaymentError('Invalid webhook signature');
        }
    }
}

export default new PaymentService();
