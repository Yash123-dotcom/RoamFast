import { db } from '@/config/firebase';
import { NotFoundError } from '@/utils/errors';
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '@/config/constants';
/**
 * Hotel Service - Data access layer for hotels using Firestore
 */
export class HotelService {
    constructor() {
        this.collection = db.collection('hotels');
    }
    /**
     * Search hotels by city or name with pagination
     */
    async searchHotels(query, options = {}) {
        const page = options.page || 1;
        const limit = Math.min(options.limit || DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);
        const skip = (page - 1) * limit;
        let hotelQuery = this.collection.where('status', '==', 'APPROVED');
        // City or name search
        if (query) {
            // Firestore doesn't support OR queries directly, so we'll do client-side filtering
            // Or create separate queries for city and name
            hotelQuery = hotelQuery.where('city', '>=', query).where('city', '<=', query + '\uf8ff');
        }
        // Price filters
        if (options.minPrice !== undefined) {
            hotelQuery = hotelQuery.where('price', '>=', options.minPrice);
        }
        if (options.maxPrice !== undefined) {
            hotelQuery = hotelQuery.where('price', '<=', options.maxPrice);
        }
        // Sorting
        if (options.sortBy === 'price_asc') {
            hotelQuery = hotelQuery.orderBy('price', 'asc');
        }
        else if (options.sortBy === 'price_desc') {
            hotelQuery = hotelQuery.orderBy('price', 'desc');
        }
        else if (options.sortBy === 'rating') {
            hotelQuery = hotelQuery.orderBy('rating', 'desc');
        }
        else {
            hotelQuery = hotelQuery.orderBy('price', 'asc');
        }
        // Get all matching documents first (for total count)
        const snapshot = await hotelQuery.get();
        const total = snapshot.size;
        // Apply pagination manually
        const hotels = snapshot.docs
            .slice(skip, skip + limit)
            .map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        // Fetch rooms for each hotel
        const hotelsWithRooms = await Promise.all(hotels.map(async (hotel) => {
            const roomsSnapshot = await db.collection('rooms').where('hotelId', '==', hotel.id).get();
            const rooms = roomsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return { ...hotel, rooms };
        }));
        return {
            data: hotelsWithRooms,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    /**
     * Get hotel by ID with relations
     */
    async getHotelById(id) {
        const hotelDoc = await this.collection.doc(id).get();
        if (!hotelDoc.exists) {
            throw new NotFoundError('Hotel not found');
        }
        const hotel = { id: hotelDoc.id, ...hotelDoc.data() };
        // Fetch rooms
        const roomsSnapshot = await db.collection('rooms').where('hotelId', '==', id).get();
        const rooms = roomsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Fetch reviews with user data
        const reviewsSnapshot = await db.collection('reviews')
            .where('hotelId', '==', id)
            .orderBy('createdAt', 'desc')
            .get();
        const reviews = await Promise.all(reviewsSnapshot.docs.map(async (doc) => {
            const reviewData = doc.data();
            const userDoc = await db.collection('users').doc(reviewData.userId).get();
            const userData = userDoc.exists ? userDoc.data() : null;
            return {
                id: doc.id,
                ...reviewData,
                user: userData ? { name: userData.name, image: userData.image } : null,
            };
        }));
        return {
            ...hotel,
            rooms,
            reviews,
        };
    }
    /**
     * Create a new hotel
     */
    async createHotel(data) {
        const hotelData = {
            ...data,
            rating: 0,
            qualityScore: 0,
            status: 'PENDING',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const docRef = await this.collection.add(hotelData);
        const created = await docRef.get();
        return {
            id: created.id,
            ...created.data(),
            rooms: [],
        };
    }
    /**
     * Update hotel
     */
    async updateHotel(id, data) {
        const hotelDoc = await this.collection.doc(id).get();
        if (!hotelDoc.exists) {
            throw new NotFoundError('Hotel not found');
        }
        await this.collection.doc(id).update({
            ...data,
            updatedAt: new Date(),
        });
        const updated = await this.collection.doc(id).get();
        // Fetch rooms for consistency
        const roomsSnapshot = await db.collection('rooms').where('hotelId', '==', id).get();
        const rooms = roomsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return {
            id: updated.id,
            ...updated.data(),
            rooms,
        };
    }
    /**
     * Get featured listings by city
     */
    async getFeaturedListings(city) {
        let query = db.collection('featuredListings')
            .where('active', '==', true)
            .where('endDate', '>', new Date());
        if (city) {
            query = query.where('city', '==', city);
        }
        const snapshot = await query.orderBy('position', 'asc').limit(5).get();
        const listings = await Promise.all(snapshot.docs.map(async (doc) => {
            const listingData = doc.data();
            const hotelDoc = await this.collection.doc(listingData.hotelId).get();
            const hotelData = hotelDoc.exists ? hotelDoc.data() : null;
            // Fetch rooms for the hotel
            const roomsSnapshot = await db.collection('rooms').where('hotelId', '==', listingData.hotelId).get();
            const rooms = roomsSnapshot.docs.map(roomDoc => ({ id: roomDoc.id, ...roomDoc.data() }));
            return {
                id: doc.id,
                ...listingData,
                hotel: hotelData ? {
                    id: hotelDoc.id,
                    ...hotelData,
                    rooms,
                } : null,
            };
        }));
        return listings;
    }
}
export default new HotelService();
