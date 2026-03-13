import { Request, Response } from 'express';
import reviewService from '@/services/review.service';
import { asyncHandler } from '@/utils/asyncHandler';
import { HTTP_STATUS } from '@/config/constants';
import { AuthRequest } from '@/middleware/auth';

class ReviewController {
    /**
     * Create a review
     * POST /api/v1/reviews
     */
    createReview = asyncHandler(async (req: Request, res: Response) => {
        const {
            hotelId,
            overallRating,
            cleanliness,
            sleepQuality,
            staffExperience,
            luxuryValue,
            travelerType,
            comment
        } = req.body;
        const authReq = req as AuthRequest;
        const userId = authReq.user?.id;

        if (!userId) {
            res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Unauthorized' });
            return;
        }

        const review = await reviewService.createReview(
            userId,
            hotelId,
            overallRating,
            cleanliness,
            sleepQuality,
            staffExperience,
            luxuryValue,
            travelerType,
            comment
        );
        res.status(HTTP_STATUS.CREATED).json(review);
    });

    /**
     * Get reviews for a hotel
     * GET /api/v1/reviews/:hotelId
     */
    getHotelReviews = asyncHandler(async (req: Request, res: Response) => {
        const { hotelId } = req.params;
        const reviews = await reviewService.getHotelReviews(hotelId as string);
        res.status(HTTP_STATUS.OK).json(reviews);
    });
}

export default new ReviewController();
