import { db } from '@/config/firebase';

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
        const hotelDoc = await db.collection('hotels').doc(hotelId).get();

        if (!hotelDoc.exists) {
            throw new Error('Hotel not found');
        }

        const reviewsSnapshot = await db.collection('reviews')
            .where('hotelId', '==', hotelId)
            .where('verified', '==', true)
            .orderBy('createdAt', 'desc')
            .limit(50)
            .get();

        const reviews = reviewsSnapshot.docs.map(doc => doc.data());
        const hotelData = hotelDoc.data();

        const breakdown = await this.calculateBreakdown({ ...hotelData, reviews });
        const score = this.computeWeightedScore(breakdown);

        // Update hotel with new score
        await db.collection('hotels').doc(hotelId).update({
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
            : 80; // Default for new properties

        // Service: Average of staff experience ratings
        const service = reviews.length > 0
            ? (reviews.reduce((sum: number, r: any) => sum + r.staffExperience, 0) / reviews.length / 5) * 100
            : 80;

        // Amenities: Based on number and quality of amenities
        // Use amenities count directly from hotel data if available in array format
        const amenitiesList = Array.isArray(hotel.amenities) ? hotel.amenities : [];
        const amenitiesCount = amenitiesList.length;
        const amenities = Math.min(100, (amenitiesCount / 15) * 100); // 15+ amenities = 100

        // Feedback: Average overall ratings from verified reviews
        const feedback = reviews.length > 0
            ? (reviews.reduce((sum: number, r: any) => sum + r.overallRating, 0) / reviews.length / 5) * 100
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
        const hotelsSnapshot = await db.collection('hotels')
            .where('status', '==', 'APPROVED')
            .get();

        for (const doc of hotelsSnapshot.docs) {
            await this.calculateQualityScore(doc.id);
        }
    }
}

export const qualityScoreService = new QualityScoreService();
