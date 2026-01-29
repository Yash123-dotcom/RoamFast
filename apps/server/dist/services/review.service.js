import { prisma } from '@repo/database';
export class ReviewService {
    /**
     * Create a new review and update hotel rating
     */
    async createReview(userId, hotelId, overallRating, cleanliness, sleepQuality, staffExperience, luxuryValue, travelerType, comment, verified = false) {
        // 1. Create the review
        const review = await prisma.review.create({
            data: {
                userId,
                hotelId,
                overallRating,
                cleanliness,
                sleepQuality,
                staffExperience,
                luxuryValue,
                travelerType,
                comment,
                verified
            },
            include: {
                user: {
                    select: { name: true, image: true }
                }
            }
        });
        // 2. Recalculate average rating for the hotel
        await this.updateHotelRating(hotelId);
        return review;
    }
    /**
     * Get reviews for a hotel
     */
    async getHotelReviews(hotelId) {
        return prisma.review.findMany({
            where: { hotelId },
            include: {
                user: {
                    select: { name: true, image: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    /**
     * Helper: Update hotel average rating
     */
    async updateHotelRating(hotelId) {
        const aggregations = await prisma.review.aggregate({
            where: { hotelId },
            _avg: { overallRating: true }
        });
        const averageRating = aggregations._avg.overallRating || 0;
        // Round to 1 decimal place
        const roundedRating = Math.round(averageRating * 10) / 10;
        await prisma.hotel.update({
            where: { id: hotelId },
            data: { rating: roundedRating }
        });
    }
}
export default new ReviewService();
