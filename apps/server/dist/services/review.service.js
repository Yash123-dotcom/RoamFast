import { db } from '@/config/firebase';
export class ReviewService {
    constructor() {
        this.collection = db.collection('reviews');
    }
    /**
     * Create a new review and update hotel rating
     */
    async createReview(userId, hotelId, overallRating, cleanliness, sleepQuality, staffExperience, luxuryValue, travelerType, comment, verified = false) {
        // 1. Create the review
        const reviewData = {
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
            createdAt: new Date(),
        };
        const docRef = await this.collection.add(reviewData);
        const reviewDoc = await docRef.get();
        // Fetch user data
        const userDoc = await db.collection('users').doc(userId).get();
        const userData = userDoc.exists ? userDoc.data() : null;
        // 2. Recalculate average rating for the hotel
        await this.updateHotelRating(hotelId);
        return {
            id: reviewDoc.id,
            ...reviewDoc.data(),
            user: userData ? {
                name: userData.name,
                image: userData.image,
            } : null,
        };
    }
    /**
     * Get reviews for a hotel
     */
    async getHotelReviews(hotelId) {
        const snapshot = await this.collection
            .where('hotelId', '==', hotelId)
            .orderBy('createdAt', 'desc')
            .get();
        const reviews = await Promise.all(snapshot.docs.map(async (doc) => {
            const reviewData = doc.data();
            const userDoc = await db.collection('users').doc(reviewData.userId).get();
            const userData = userDoc.exists ? userDoc.data() : null;
            return {
                id: doc.id,
                ...reviewData,
                user: userData ? {
                    name: userData.name,
                    image: userData.image,
                } : null,
            };
        }));
        return reviews;
    }
    /**
     * Helper: Update hotel average rating
     */
    async updateHotelRating(hotelId) {
        const reviewsSnapshot = await this.collection.where('hotelId', '==', hotelId).get();
        if (reviewsSnapshot.empty) {
            await db.collection('hotels').doc(hotelId).update({ rating: 0 });
            return;
        }
        let totalRating = 0;
        reviewsSnapshot.docs.forEach(doc => {
            const reviewData = doc.data();
            totalRating += reviewData.overallRating || 0;
        });
        const averageRating = totalRating / reviewsSnapshot.size;
        const roundedRating = Math.round(averageRating * 10) / 10;
        await db.collection('hotels').doc(hotelId).update({ rating: roundedRating });
    }
}
export default new ReviewService();
