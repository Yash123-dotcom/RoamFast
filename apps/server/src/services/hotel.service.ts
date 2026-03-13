import { Hotel } from '@/models/Hotel';
import { Room } from '@/models/Room';
import { Review } from '@/models/Review';
import { User } from '@/models/User';
import { FeaturedListing } from '@/models/FeaturedListing';
import { NotFoundError } from '@/utils/errors';
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '@/config/constants';

export interface SearchOptions {
    page?: number;
    limit?: number;
    minPrice?: number;
    maxPrice?: number;
    amenities?: string[];
    sortBy?: 'price_asc' | 'price_desc' | 'rating';
}

/**
 * Hotel Service - Data access layer for hotels using Mongoose
 */
export class HotelService {
    /**
     * Search hotels by city or name with pagination
     */
    async searchHotels(query?: string, options: SearchOptions = {}) {
        const page = options.page || 1;
        const limit = Math.min(options.limit || DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);
        const skip = (page - 1) * limit;

        const filter: Record<string, any> = { status: 'APPROVED' };

        if (query) {
            filter.$or = [
                { city: { $regex: query, $options: 'i' } },
                { name: { $regex: query, $options: 'i' } },
            ];
        }

        if (options.minPrice !== undefined) filter.price = { ...filter.price, $gte: options.minPrice };
        if (options.maxPrice !== undefined) filter.price = { ...filter.price, $lte: options.maxPrice };

        let sortOption: Record<string, 1 | -1> = { price: 1 };
        if (options.sortBy === 'price_asc') sortOption = { price: 1 };
        else if (options.sortBy === 'price_desc') sortOption = { price: -1 };
        else if (options.sortBy === 'rating') sortOption = { rating: -1 };

        const [hotels, total] = await Promise.all([
            Hotel.find(filter).sort(sortOption).skip(skip).limit(limit).lean(),
            Hotel.countDocuments(filter),
        ]);

        // Fetch rooms for each hotel
        const hotelsWithRooms = await Promise.all(
            hotels.map(async (hotel) => {
                const rooms = await Room.find({ hotelId: hotel._id.toString() }).lean();
                return { ...hotel, id: hotel._id.toString(), rooms: rooms.map(r => ({ ...r, id: r._id.toString() })) };
            })
        );

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
    async getHotelById(id: string) {
        const hotel = await Hotel.findById(id).lean();

        if (!hotel) {
            throw new NotFoundError('Hotel not found');
        }

        const [rooms, reviews] = await Promise.all([
            Room.find({ hotelId: id }).lean(),
            Review.find({ hotelId: id }).sort({ createdAt: -1 }).lean(),
        ]);

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

        return {
            ...hotel,
            id: hotel._id.toString(),
            rooms: rooms.map(r => ({ ...r, id: r._id.toString() })),
            reviews: reviewsWithUsers,
        };
    }

    /**
     * Create a new hotel
     */
    async createHotel(data: {
        name: string;
        description: string;
        address: string;
        city: string;
        price: number;
        images: string[];
        amenities: string[];
        ownerId?: string;
    }) {
        const hotel = await new Hotel({
            ...data,
            rating: 0,
            qualityScore: 0,
            status: 'PENDING',
        }).save();

        return {
            ...hotel.toObject(),
            id: hotel._id.toString(),
            rooms: [],
        };
    }

    /**
     * Update hotel
     */
    async updateHotel(id: string, data: Partial<{
        name: string;
        description: string;
        address: string;
        city: string;
        price: number;
        images: string[];
        amenities: string[];
    }>) {
        const hotel = await Hotel.findByIdAndUpdate(id, data, { new: true }).lean();

        if (!hotel) {
            throw new NotFoundError('Hotel not found');
        }

        const rooms = await Room.find({ hotelId: id }).lean();

        return {
            ...hotel,
            id: hotel._id.toString(),
            rooms: rooms.map(r => ({ ...r, id: r._id.toString() })),
        };
    }

    /**
     * Get featured listings by city
     */
    async getFeaturedListings(city?: string) {
        const filter: Record<string, any> = {
            active: true,
            endDate: { $gt: new Date() },
        };

        if (city) filter.city = city;

        const listings = await FeaturedListing.find(filter)
            .sort({ position: 1 })
            .limit(5)
            .lean();

        const listingsWithHotels = await Promise.all(
            listings.map(async (listing) => {
                const hotel = await Hotel.findById(listing.hotelId).lean();
                if (!hotel) return { ...listing, id: listing._id.toString(), hotel: null };

                const rooms = await Room.find({ hotelId: listing.hotelId }).lean();

                return {
                    ...listing,
                    id: listing._id.toString(),
                    hotel: {
                        ...hotel,
                        id: hotel._id.toString(),
                        rooms: rooms.map(r => ({ ...r, id: r._id.toString() })),
                    },
                };
            })
        );

        return listingsWithHotels;
    }
}

export default new HotelService();
