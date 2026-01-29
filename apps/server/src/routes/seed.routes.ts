import { Router } from 'express';
import seedController from '@/controllers/seed.controller';

const router = Router();

/**
 * POST /api/v1/seed - Seed database
 */
router.post('/', seedController.seedDatabase);

/**
 * POST /api/v1/seed/commissions - Seed commission data
 */
router.post('/commissions', seedController.seedCommissions);

export default router;
