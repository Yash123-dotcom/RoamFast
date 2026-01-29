import hotelService from '@/services/hotel.service';
import { asyncHandler } from '@/utils/asyncHandler';
import { HTTP_STATUS } from '@/config/constants';
/**
 * Hotel Controller - Handles hotel-related requests
 */
export class HotelController {
    constructor() {
        /**
         * Search hotels
         * GET /api/v1/hotels?city=Mumbai&page=1&limit=20
         */
        this.searchHotels = asyncHandler(async (req, res) => {
            const { city, page, limit, minPrice, maxPrice, amenities, sortBy } = req.query;
            // Handle amenities array (might come as string or array)
            const amenitiesArray = amenities
                ? (Array.isArray(amenities) ? amenities : [amenities])
                : undefined;
            const result = await hotelService.searchHotels(city, {
                page: page ? parseInt(page) : undefined,
                limit: limit ? parseInt(limit) : undefined,
                minPrice: minPrice ? parseInt(minPrice) : undefined,
                maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
                amenities: amenitiesArray,
                sortBy: sortBy
            });
            res.status(HTTP_STATUS.OK).json(result);
        });
        /**
         * Get hotel by ID
         * GET /api/v1/hotels/:id
         */
        this.getHotelById = asyncHandler(async (req, res) => {
            const { id } = req.params;
            const hotel = await hotelService.getHotelById(id);
            res.status(HTTP_STATUS.OK).json(hotel);
        });
        /**
         * Create a new hotel
         * POST /api/v1/hotels
         */
        this.createHotel = asyncHandler(async (req, res) => {
            const hotel = await hotelService.createHotel(req.body);
            res.status(HTTP_STATUS.CREATED).json(hotel);
        });
        /**
         * Update a hotel
         * PUT /api/v1/hotels/:id
         */
        this.updateHotel = asyncHandler(async (req, res) => {
            const { id } = req.params;
            const hotel = await hotelService.updateHotel(id, req.body);
            res.status(HTTP_STATUS.OK).json(hotel);
        });
    }
}
export default new HotelController();
