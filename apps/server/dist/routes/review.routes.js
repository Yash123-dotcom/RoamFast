import { Router } from 'express';
import reviewController from '@/controllers/review.controller';
import { requireAuth } from '@/middleware/auth';
const router = Router();
// Create review (protected)
router.post('/', requireAuth, reviewController.createReview);
// Get reviews (public)
router.get('/:hotelId', reviewController.getHotelReviews);
export default router;
