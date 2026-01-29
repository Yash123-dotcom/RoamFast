import { prisma } from '@repo/database';
export class OwnerService {
    /**
     * Get all hotels owned by a specific user
     */
    async getMyHotels(ownerId) {
        try {
            return await prisma.hotel.findMany({
                where: { ownerId },
                include: {
                    _count: {
                        select: { bookings: true, reviews: true }
                    },
                    subscriptions: {
                        where: { active: true },
                        orderBy: { createdAt: 'desc' },
                        take: 1
                    }
                },
                orderBy: { createdAt: 'desc' }
            });
        }
        catch (error) {
            console.error('Error fetching owner hotels:', error);
            // Return empty array if database fails
            return [];
        }
    }
    /**
     * Get dashboard analytics for an owner
     */
    async getOwnerAnalytics(ownerId) {
        try {
            // 1. Get all hotels
            const hotels = await prisma.hotel.findMany({
                where: { ownerId },
                select: { id: true, name: true }
            });
            const hotelIds = hotels.map(h => h.id);
            if (hotelIds.length === 0) {
                return {
                    totalRevenue: 0,
                    totalBookings: 0,
                    averageRating: 0,
                    activeProperties: 0,
                    recentBookings: []
                };
            }
            // 2. Aggregate Revenue & Bookings
            const commissionStats = await prisma.commission.aggregate({
                where: {
                    booking: {
                        hotelId: { in: hotelIds },
                        status: 'COMPLETED'
                    }
                },
                _sum: {
                    hotelPayout: true
                }
            });
            const bookingsCount = await prisma.booking.count({
                where: {
                    hotelId: { in: hotelIds },
                    status: { in: ['CONFIRMED', 'COMPLETED'] }
                }
            });
            // 3. Get Recent Bookings
            const recentBookings = await prisma.booking.findMany({
                where: {
                    hotelId: { in: hotelIds }
                },
                include: {
                    hotel: { select: { name: true } },
                    user: { select: { name: true, email: true } }
                },
                orderBy: { createdAt: 'desc' },
                take: 5
            });
            return {
                totalRevenue: commissionStats._sum.hotelPayout || 0,
                totalBookings: bookingsCount,
                activeProperties: hotelIds.length,
                recentBookings
            };
        }
        catch (error) {
            console.error('Error fetching owner analytics:', error);
            // Return empty stats if database fails
            return {
                totalRevenue: 0,
                totalBookings: 0,
                averageRating: 0,
                activeProperties: 0,
                recentBookings: []
            };
        }
    }
}
export default new OwnerService();
