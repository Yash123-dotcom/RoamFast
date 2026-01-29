import { prisma } from '@repo/database';
const WEIGHTS = {
    cleanliness: 0.20,
    service: 0.25,
    amenities: 0.15,
    feedback: 0.30,
    responsiveness: 0.10,
};
export class QualityScoreService {
    /**
     * Calculate Quality Score for a hotel
     */
    async calculateQualityScore(hotelId) {
        const hotel = await prisma.hotel.findUnique({
            where: { id: hotelId },
            include: {
                reviews: {
                    where: { verified: true },
                    orderBy: { createdAt: 'desc' },
                    take: 50, // Consider last 50 verified reviews
                },
            },
        });
        if (!hotel) {
            throw new Error('Hotel not found');
        }
        const breakdown = await this.calculateBreakdown(hotel);
        const score = this.computeWeightedScore(breakdown);
        // Update hotel with new score
        await prisma.hotel.update({
            where: { id: hotelId },
            data: {
                qualityScore: score,
                scoreBreakdown: JSON.stringify(breakdown),
                lastScoreUpdate: new Date(),
            },
        });
        return score;
    }
    /**
     * Calculate category scores
     */
    async calculateBreakdown(hotel) {
        const reviews = hotel.reviews || [];
        // Cleanliness: Average of cleanliness ratings (scaled to 100)
        const cleanliness = reviews.length > 0
            ? (reviews.reduce((sum, r) => sum + r.cleanliness, 0) / reviews.length / 5) * 100
            : 80; // Default for new properties
        // Service: Average of staff experience ratings
        const service = reviews.length > 0
            ? (reviews.reduce((sum, r) => sum + r.staffExperience, 0) / reviews.length / 5) * 100
            : 80;
        // Amenities: Based on number and quality of amenities
        const amenitiesCount = hotel.amenities ? JSON.parse(hotel.amenities).length : 0;
        const amenities = Math.min(100, (amenitiesCount / 15) * 100); // 15+ amenities = 100
        // Feedback: Average overall ratings from verified reviews
        const feedback = reviews.length > 0
            ? (reviews.reduce((sum, r) => sum + r.overallRating, 0) / reviews.length / 5) * 100
            : 75;
        // Responsiveness: Mock calculation (in production, track owner response times)
        // For now, use a baseline score that degrades if reviews are negative
        const responsiveness = reviews.length > 0 && feedback > 80 ? 90 : 70;
        return {
            cleanliness: Math.round(cleanliness),
            service: Math.round(service),
            amenities: Math.round(amenities),
            feedback: Math.round(feedback),
            responsiveness: Math.round(responsiveness),
        };
    }
    /**
     * Compute weighted final score
     */
    computeWeightedScore(breakdown) {
        const score = breakdown.cleanliness * WEIGHTS.cleanliness +
            breakdown.service * WEIGHTS.service +
            breakdown.amenities * WEIGHTS.amenities +
            breakdown.feedback * WEIGHTS.feedback +
            breakdown.responsiveness * WEIGHTS.responsiveness;
        return Math.round(score);
    }
    /**
     * Get score tier (Gold/Silver/Bronze)
     */
    getScoreTier(score) {
        if (score >= 90)
            return 'gold';
        if (score >= 75)
            return 'silver';
        return 'bronze';
    }
    /**
     * Recalculate scores for all hotels
     */
    async recalculateAllScores() {
        const hotels = await prisma.hotel.findMany({
            where: { status: 'APPROVED' },
            select: { id: true },
        });
        for (const hotel of hotels) {
            await this.calculateQualityScore(hotel.id);
        }
    }
}
export const qualityScoreService = new QualityScoreService();
