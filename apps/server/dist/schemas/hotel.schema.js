import { z } from 'zod';
/**
 * Schema for hotel search query
 */
export const searchHotelsSchema = z.object({
    query: z.object({
        city: z.string().optional(),
        minPrice: z.coerce.number().min(0).optional(),
        maxPrice: z.coerce.number().positive().optional(),
        amenities: z.union([z.string(), z.array(z.string())]).optional(),
        sortBy: z.enum(['price_asc', 'price_desc', 'rating']).optional(),
        page: z.coerce.number().int().positive().optional(),
        limit: z.coerce.number().int().positive().max(100).optional(),
    }),
});
/**
 * Schema for getting hotel by ID
 */
export const getHotelByIdSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'Hotel ID is required'),
    }),
});
/**
 * Schema for creating a new hotel
 */
export const createHotelSchema = z.object({
    body: z.object({
        name: z.string().min(3, 'Name must be at least 3 characters'),
        description: z.string().min(10, 'Description must be at least 10 characters'),
        address: z.string().min(5, 'Address is required'),
        city: z.string().min(2, 'City is required'),
        price: z.number().positive('Price must be positive'),
        images: z.array(z.string().url()).min(1, 'At least one image is required'),
        amenities: z.array(z.string()).min(1, 'At least one amenity is required'),
        ownerId: z.string().optional(),
    }),
});
