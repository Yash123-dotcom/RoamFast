import { Request, Response } from 'express';
import paymentService from '@/services/payment.service';
import { asyncHandler } from '@/utils/asyncHandler';
import { HTTP_STATUS } from '@/config/constants';

/**
 * Payment Controller - Handles payment-related requests
 */
export class PaymentController {
    /**
     * Create payment intent
     * POST /api/v1/payment/create-intent
     */
    createPaymentIntent = asyncHandler(async (req: Request, res: Response) => {
        const { amount, userId, hotelId, checkIn, checkOut, customerEmail } = req.body;

        const result = await paymentService.createPaymentIntent({
            amount,
            userId,
            hotelId,
            checkIn: new Date(checkIn),
            checkOut: new Date(checkOut),
            customerEmail,
        });

        res.status(HTTP_STATUS.OK).json(result);
    });

    /**
     * Verify payment
     * GET /api/v1/payment/verify/:paymentIntentId
     */
    verifyPayment = asyncHandler(async (req: Request, res: Response) => {
        const paymentIntentId = req.params.paymentIntentId as string;

        const isValid = await paymentService.verifyPayment(paymentIntentId);

        res.status(HTTP_STATUS.OK).json({
            valid: isValid,
            paymentIntentId,
        });
    });
}

export default new PaymentController();
