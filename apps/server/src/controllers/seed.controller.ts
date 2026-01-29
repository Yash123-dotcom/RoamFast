import { Request, Response } from 'express';
import seedService from '@/services/seed.service';
import { asyncHandler } from '@/utils/asyncHandler';
import { HTTP_STATUS } from '@/config/constants';

/**
 * Seed Controller - Handles database seeding
 */
export class SeedController {
    /**
     * Seed database
     * POST /api/v1/seed
     */
    seedDatabase = asyncHandler(async (req: Request, res: Response) => {
        const result = await seedService.seedDatabase();

        res.status(HTTP_STATUS.OK).json(result);
    });

    /**
     * Seed commission data
     * POST /api/v1/seed/commissions
     */
    seedCommissions = asyncHandler(async (req: Request, res: Response) => {
        const result = await seedService.seedCommissionData();

        res.status(HTTP_STATUS.OK).json(result);
    });
}

export default new SeedController();
