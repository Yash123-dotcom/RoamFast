import { Request, Response } from 'express';
import hotelService from '@/services/hotel.service';
import { asyncHandler } from '@/utils/asyncHandler';
import { HTTP_STATUS } from '@/config/constants';

/**
 * Hotel Controller - Handles hotel-related requests
 */
export class HotelController {
    /**
     * Search hotels
     * GET /api/v1/hotels?city=Mumbai&page=1&limit=20
     */
    searchHotels = asyncHandler(async (req: Request, res: Response) => {
        const { city, page, limit, minPrice, maxPrice, amenities, sortBy } = req.query;

        // Handle amenities array (might come as string or array)
        const amenitiesArray = amenities
            ? (Array.isArray(amenities) ? amenities : [amenities as string])
            : undefined;

        const result = await hotelService.searchHotels(
            city as string | undefined,
            {
                page: page ? parseInt(page as string) : undefined,
                limit: limit ? parseInt(limit as string) : undefined,
                minPrice: minPrice ? parseInt(minPrice as string) : undefined,
                maxPrice: maxPrice ? parseInt(maxPrice as string) : undefined,
                amenities: amenitiesArray as string[],
                sortBy: sortBy as any
            }
        );

        res.status(HTTP_STATUS.OK).json(result);
    });

    /**
     * Get hotel by ID
     * GET /api/v1/hotels/:id
     */
    getHotelById = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;

        const hotel = await hotelService.getHotelById(id as string);

        res.status(HTTP_STATUS.OK).json(hotel);
    });

    /**
     * Create a new hotel
     * POST /api/v1/hotels
     */
    createHotel = asyncHandler(async (req: Request, res: Response) => {
        const hotel = await hotelService.createHotel(req.body);
        res.status(HTTP_STATUS.CREATED).json(hotel);
    });
    /**
     * Update a hotel
     * PUT /api/v1/hotels/:id
     */
    updateHotel = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const hotel = await hotelService.updateHotel(id as string, req.body);
        res.status(HTTP_STATUS.OK).json(hotel);
    });
}

export default new HotelController();
