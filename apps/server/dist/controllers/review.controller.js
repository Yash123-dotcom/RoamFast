import reviewService from '@/services/review.service';
import { asyncHandler } from '@/utils/asyncHandler';
import { HTTP_STATUS } from '@/config/constants';
class ReviewController {
    constructor() {
        /**
         * Create a review
         * POST /api/v1/reviews
         */
        this.createReview = asyncHandler(async (req, res) => {
            const { hotelId, overallRating, cleanliness, sleepQuality, staffExperience, luxuryValue, travelerType, comment } = req.body;
            // @ts-ignore
            const userId = req.user?.id;
            if (!userId) {
                res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Unauthorized' });
                return;
            }
            const review = await reviewService.createReview(userId, hotelId, overallRating, cleanliness, sleepQuality, staffExperience, luxuryValue, travelerType, comment);
            res.status(HTTP_STATUS.CREATED).json(review);
        });
        /**
         * Get reviews for a hotel
         * GET /api/v1/reviews/:hotelId
         */
        this.getHotelReviews = asyncHandler(async (req, res) => {
            const { hotelId } = req.params;
            const reviews = await reviewService.getHotelReviews(hotelId);
            res.status(HTTP_STATUS.OK).json(reviews);
        });
    }
}
export default new ReviewController();
