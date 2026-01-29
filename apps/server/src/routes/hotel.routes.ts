import { Router } from 'express';
import hotelController from '@/controllers/hotel.controller';
import { validate } from '@/middleware/validator';
import { searchHotelsSchema, getHotelByIdSchema } from '@/schemas/hotel.schema';

const router = Router();

/**
 * GET /api/v1/hotels - Search hotels
 */
router.get('/', validate(searchHotelsSchema), hotelController.searchHotels);

/**
 * GET /api/v1/hotels/:id - Get hotel by ID
 */
router.get('/:id', validate(getHotelByIdSchema), hotelController.getHotelById);

/**
 * POST /api/v1/hotels - Create a new hotel
 */
import { createHotelSchema } from '@/schemas/hotel.schema';
router.post('/', validate(createHotelSchema), hotelController.createHotel);

/**
 * PUT /api/v1/hotels/:id - Update hotel
 */
router.put('/:id', validate(createHotelSchema), hotelController.updateHotel);

export default router;
