import { Review } from '@/models/Review';
import { Hotel } from '@/models/Hotel';
import { User } from '@/models/User';

export class ReviewService {
    /**
     * Create a new review and update hotel rating
     */
    async createReview(
        userId: string,
        hotelId: string,
        overallRating: number,
        cleanliness: number,
        sleepQuality: number,
        staffExperience: number,
        luxuryValue: number,
        travelerType: string,
        comment: string,
        verified: boolean = false
    ) {
        const review = await new Review({
            userId,
            hotelId,
            overallRating,
            cleanliness,
            sleepQuality,
            staffExperience,
            luxuryValue,
            travelerType,
            comment,
            verified,
        }).save();

        const user = await User.findById(userId).lean();

        // Recalculate average rating for the hotel
        await this.updateHotelRating(hotelId);

        return {
            ...review.toObject(),
            id: review._id.toString(),
            user: user ? { name: user.name, image: user.image } : null,
        };
    }

    /**
     * Get reviews for a hotel
     */
    async getHotelReviews(hotelId: string) {
        const reviews = await Review.find({ hotelId }).sort({ createdAt: -1 }).lean();

        const reviewsWithUsers = await Promise.all(
            reviews.map(async (review) => {
                const user = await User.findById(review.userId).lean();
                return {
                    ...review,
                    id: review._id.toString(),
                    user: user ? { name: user.name, image: user.image } : null,
                };
            })
        );

        return reviewsWithUsers;
    }

    /**
     * Helper: Update hotel average rating
     */
    private async updateHotelRating(hotelId: string) {
        const reviews = await Review.find({ hotelId }).lean();

        if (reviews.length === 0) {
            await Hotel.findByIdAndUpdate(hotelId, { rating: 0 });
            return;
        }

        const totalRating = reviews.reduce((sum, r) => sum + (r.overallRating || 0), 0);
        const averageRating = totalRating / reviews.length;
        const roundedRating = Math.round(averageRating * 10) / 10;

        await Hotel.findByIdAndUpdate(hotelId, { rating: roundedRating });
    }
}

export default new ReviewService();
