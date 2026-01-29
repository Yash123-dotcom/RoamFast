import { describe, it, expect, beforeEach, vi } from 'vitest';
import { prisma } from '@repo/database';
import hotelService from '@/services/hotel.service';
// Mock Prisma
vi.mock('@repo/database', () => ({
    prisma: {
        hotel: {
            findMany: vi.fn(),
            findUnique: vi.fn(),
            count: vi.fn(),
        },
    },
}));
describe('HotelService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    describe('searchHotels', () => {
        it('should return hotels with pagination', async () => {
            const mockHotels = [
                {
                    id: '1',
                    name: 'Test Hotel',
                    city: 'Mumbai',
                    price: 5000,
                    rooms: [],
                },
            ];
            vi.mocked(prisma.hotel.findMany).mockResolvedValue(mockHotels);
            vi.mocked(prisma.hotel.count).mockResolvedValue(1);
            const result = await hotelService.searchHotels('Mumbai', { page: 1, limit: 20 });
            expect(result.data).toEqual(mockHotels);
            expect(result.pagination.total).toBe(1);
            expect(result.pagination.page).toBe(1);
            expect(result.pagination.limit).toBe(20);
        });
        it('should search by city (case insensitive)', async () => {
            vi.mocked(prisma.hotel.findMany).mockResolvedValue([]);
            vi.mocked(prisma.hotel.count).mockResolvedValue(0);
            await hotelService.searchHotels('mumbai');
            expect(prisma.hotel.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: {
                    OR: [
                        { city: { contains: 'mumbai', mode: 'insensitive' } },
                        { name: { contains: 'mumbai', mode: 'insensitive' } },
                    ],
                },
            }));
        });
    });
    describe('getHotelById', () => {
        it('should return hotel with relations', async () => {
            const mockHotel = {
                id: '1',
                name: 'Test Hotel',
                rooms: [],
                reviews: [],
            };
            vi.mocked(prisma.hotel.findUnique).mockResolvedValue(mockHotel);
            const result = await hotelService.getHotelById('1');
            expect(result).toEqual(mockHotel);
            expect(prisma.hotel.findUnique).toHaveBeenCalledWith(expect.objectContaining({
                where: { id: '1' },
                include: expect.objectContaining({
                    rooms: true,
                    reviews: expect.any(Object),
                }),
            }));
        });
        it('should throw NotFoundError if hotel does not exist', async () => {
            vi.mocked(prisma.hotel.findUnique).mockResolvedValue(null);
            await expect(hotelService.getHotelById('999')).rejects.toThrow('Hotel not found');
        });
    });
});
