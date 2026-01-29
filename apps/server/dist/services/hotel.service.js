import { prisma } from '@repo/database';
import { NotFoundError } from '@/utils/errors';
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '@/config/constants';
/**
 * Hotel Service - Data access layer for hotels
 */
export class HotelService {
    /**
     * Search hotels by city or name with pagination
     */
    async searchHotels(query, options = {}) {
        const page = options.page || 1;
        const limit = Math.min(options.limit || DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);
        const skip = (page - 1) * limit;
        const whereClause = {};
        if (query) {
            whereClause.OR = [
                { city: { contains: query } },
                { name: { contains: query } },
            ];
        }
        // Price Filter
        if (options.minPrice !== undefined || options.maxPrice !== undefined) {
            whereClause.price = {};
            if (options.minPrice !== undefined)
                whereClause.price.gte = options.minPrice;
            if (options.maxPrice !== undefined)
                whereClause.price.lte = options.maxPrice;
        }
        // Amenities Filter - Disabled for SQLite String compatibility
        // if (options.amenities && options.amenities.length > 0) {
        //     whereClause.amenities = {
        //         hasEvery: options.amenities
        //     };
        // }
        // Sorting
        let orderBy = { price: 'asc' };
        if (options.sortBy === 'price_desc')
            orderBy = { price: 'desc' };
        if (options.sortBy === 'rating')
            orderBy = { rating: 'desc' };
        const [hotels, total] = await Promise.all([
            prisma.hotel.findMany({
                where: whereClause,
                include: { rooms: true },
                orderBy: orderBy,
                skip,
                take: limit,
            }),
            prisma.hotel.count({ where: whereClause }),
        ]);
        // Parse JSON strings back to arrays
        const parsedHotels = hotels.map(hotel => ({
            ...hotel,
            images: JSON.parse(hotel.images),
            amenities: JSON.parse(hotel.amenities)
        }));
        return {
            data: parsedHotels,
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
        const hotel = await prisma.hotel.findUnique({
            where: { id },
            include: {
                rooms: true,
                reviews: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                image: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
        });
        if (!hotel) {
            throw new NotFoundError('Hotel not found');
        }
        return {
            ...hotel,
            images: JSON.parse(hotel.images),
            amenities: JSON.parse(hotel.amenities)
        };
    }
    /**
     * Create a new hotel
     */
    async createHotel(data) {
        const created = await prisma.hotel.create({
            data: {
                ...data,
                images: JSON.stringify(data.images),
                amenities: JSON.stringify(data.amenities)
            },
            include: { rooms: true },
        });
        return {
            ...created,
            images: JSON.parse(created.images),
            amenities: JSON.parse(created.amenities)
        };
    }
    async updateHotel(id, data) {
        // Verify hotel exists
        const hotel = await prisma.hotel.findUnique({
            where: { id }
        });
        if (!hotel) {
            throw new NotFoundError('Hotel not found');
        }
        const updateData = { ...data };
        if (data.images)
            updateData.images = JSON.stringify(data.images);
        if (data.amenities)
            updateData.amenities = JSON.stringify(data.amenities);
        const updated = await prisma.hotel.update({
            where: { id },
            data: updateData,
            include: { rooms: true } // Return with rooms for consistency
        });
        return {
            ...updated,
            images: JSON.parse(updated.images),
            amenities: JSON.parse(updated.amenities)
        };
    }
    /**
     * Get featured listings by city
     */
    async getFeaturedListings(city) {
        const listings = await prisma.featuredListing.findMany({
            where: {
                active: true,
                ...(city ? { city } : {}),
                endDate: { gt: new Date() }
            },
            include: {
                hotel: {
                    include: { rooms: true }
                }
            },
            orderBy: { position: 'asc' },
            take: 5 // Strict limit per city
        });
        return listings.map(listing => ({
            ...listing,
            hotel: {
                ...listing.hotel,
                images: JSON.parse(listing.hotel.images),
                amenities: JSON.parse(listing.hotel.amenities)
            }
        }));
    }
}
export default new HotelService();
