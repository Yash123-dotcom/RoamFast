import { Hotel } from '@/models/Hotel';
import { Review } from '@/models/Review';

/**
 * RoamFast Quality Score Service
 * Calculates 0-100 score based on 5 weighted categories
 */

interface QualityScoreBreakdown {
    cleanliness: number;      // 20% weight
    service: number;          // 25% weight
    amenities: number;        // 15% weight
    feedback: number;         // 30% weight - guest reviews
    responsiveness: number;   // 10% weight - owner response time
}

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
    async calculateQualityScore(hotelId: string): Promise<number> {
        const hotel = await Hotel.findById(hotelId).lean();

        if (!hotel) {
            throw new Error('Hotel not found');
        }

        const reviews = await Review.find({
            hotelId,
            verified: true,
        }).sort({ createdAt: -1 }).limit(50).lean();

        const breakdown = await this.calculateBreakdown({ ...hotel, reviews });
        const score = this.computeWeightedScore(breakdown);

        // Update hotel with new score
        await Hotel.findByIdAndUpdate(hotelId, {
            qualityScore: score,
            scoreBreakdown: JSON.stringify(breakdown),
            lastScoreUpdate: new Date(),
        });

        return score;
    }

    /**
     * Calculate category scores
     */
    private async calculateBreakdown(hotel: any): Promise<QualityScoreBreakdown> {
        const reviews = hotel.reviews || [];

        // Cleanliness: Average of cleanliness ratings (scaled to 100)
        const cleanliness = reviews.length > 0
            ? (reviews.reduce((sum: number, r: any) => sum + r.cleanliness, 0) / reviews.length / 5) * 100
            : 80;

        // Service: Average of staff experience ratings
        const service = reviews.length > 0
            ? (reviews.reduce((sum: number, r: any) => sum + r.staffExperience, 0) / reviews.length / 5) * 100
            : 80;

        // Amenities: Based on count
        const amenitiesCount = Array.isArray(hotel.amenities) ? hotel.amenities.length : 0;
        const amenities = Math.min(100, (amenitiesCount / 15) * 100);

        // Feedback: Average overall ratings from verified reviews
        const feedback = reviews.length > 0
            ? (reviews.reduce((sum: number, r: any) => sum + r.overallRating, 0) / reviews.length / 5) * 100
            : 75;

        // Responsiveness: Baseline calculation
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
    private computeWeightedScore(breakdown: QualityScoreBreakdown): number {
        const score =
            breakdown.cleanliness * WEIGHTS.cleanliness +
            breakdown.service * WEIGHTS.service +
            breakdown.amenities * WEIGHTS.amenities +
            breakdown.feedback * WEIGHTS.feedback +
            breakdown.responsiveness * WEIGHTS.responsiveness;

        return Math.round(score);
    }

    /**
     * Get score tier (Gold/Silver/Bronze)
     */
    getScoreTier(score: number): 'gold' | 'silver' | 'bronze' {
        if (score >= 90) return 'gold';
        if (score >= 75) return 'silver';
        return 'bronze';
    }

    /**
     * Recalculate scores for all hotels
     */
    async recalculateAllScores(): Promise<void> {
        const hotels = await Hotel.find({ status: 'APPROVED' }).lean();

        for (const hotel of hotels) {
            await this.calculateQualityScore(hotel._id.toString());
        }
    }
}

export const qualityScoreService = new QualityScoreService();
