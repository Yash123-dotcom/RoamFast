import paymentService from '@/services/payment.service';
import { asyncHandler } from '@/utils/asyncHandler';
import { HTTP_STATUS } from '@/config/constants';
/**
 * Payment Controller - Handles payment-related requests
 */
export class PaymentController {
    constructor() {
        /**
         * Create payment intent
         * POST /api/v1/payment/create-intent
         */
        this.createPaymentIntent = asyncHandler(async (req, res) => {
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
        this.verifyPayment = asyncHandler(async (req, res) => {
            const paymentIntentId = req.params.paymentIntentId;
            const isValid = await paymentService.verifyPayment(paymentIntentId);
            res.status(HTTP_STATUS.OK).json({
                valid: isValid,
                paymentIntentId,
            });
        });
    }
}
export default new PaymentController();
