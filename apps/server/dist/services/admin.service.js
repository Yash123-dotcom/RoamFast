import { prisma } from '@repo/database';
import { HotelStatus } from '@/constants/enums';
import emailService from './email.service';
import { logger } from '@/utils/logger';
export class AdminService {
    /**
     * Get all hotels requiring approval
     */
    async getPendingHotels() {
        return prisma.hotel.findMany({
            where: {
                status: HotelStatus.PENDING
            },
            include: {
                owner: {
                    select: { name: true, email: true }
                },
                subscriptions: {
                    where: { active: true },
                    take: 1
                }
            },
            orderBy: { createdAt: 'asc' }
        });
    }
    /**
     * Approve a hotel listing
     */
    async approveHotel(hotelId) {
        const hotel = await prisma.hotel.update({
            where: { id: hotelId },
            data: { status: HotelStatus.APPROVED },
            include: { owner: true }
        });
        if (hotel.owner && hotel.owner.email) {
            await emailService.sendHotelApprovalNotification(hotel.owner.email, hotel.owner.name || 'Partner', hotel.name);
        }
        return hotel;
    }
    /**
     * Reject a hotel listing
     */
    async rejectHotel(hotelId) {
        return prisma.hotel.update({
            where: { id: hotelId },
            data: { status: HotelStatus.REJECTED }
        });
    }
    async getPlatformStats() {
        const [totalUsers, totalHotels, totalBookings, totalRevenue] = await Promise.all([
            prisma.user.count(),
            prisma.hotel.count({ where: { status: HotelStatus.APPROVED } }),
            prisma.booking.count(),
            prisma.commission.aggregate({
                _sum: { commissionAmount: true, platformFee: true }
            })
        ]);
        return {
            totalUsers,
            totalHotels,
            totalBookings,
            totalRevenue: (totalRevenue._sum.commissionAmount || 0) + (totalRevenue._sum.platformFee || 0)
        };
    }
    /**
     * Get all commission payouts
     */
    async getPayouts() {
        return prisma.commission.findMany({
            include: {
                booking: {
                    select: {
                        id: true,
                        totalPrice: true,
                        hotel: {
                            select: { name: true }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    /**
     * Get detailed revenue analytics
     */
    async getRevenueAnalytics() {
        try {
            const [commissionData, payoutsByStatus, recentTransactions, monthlyRevenue] = await Promise.all([
                // Total commissions and fees
                prisma.commission.aggregate({
                    _sum: {
                        commissionAmount: true,
                        platformFee: true,
                        hotelPayout: true
                    },
                    _count: true
                }),
                // Group by payout status
                prisma.commission.groupBy({
                    by: ['status'],
                    _sum: {
                        commissionAmount: true,
                        platformFee: true
                    },
                    _count: true
                }),
                // Recent transactions (last 10)
                prisma.commission.findMany({
                    take: 10,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        booking: {
                            select: {
                                id: true,
                                checkIn: true,
                                checkOut: true,
                                totalPrice: true,
                                user: {
                                    select: { name: true, email: true }
                                },
                                hotel: {
                                    select: { name: true, city: true }
                                }
                            }
                        }
                    }
                }),
                // Revenue from current month
                prisma.commission.aggregate({
                    where: {
                        createdAt: {
                            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                        }
                    },
                    _sum: {
                        commissionAmount: true,
                        platformFee: true
                    }
                })
            ]);
            return {
                totalRevenue: (commissionData?._sum?.commissionAmount || 0) + (commissionData?._sum?.platformFee || 0),
                totalCommissions: commissionData?._sum?.commissionAmount || 0,
                totalPlatformFees: commissionData?._sum?.platformFee || 0,
                totalHotelPayouts: commissionData?._sum?.hotelPayout || 0,
                transactionCount: commissionData?._count || 0,
                payoutsByStatus: payoutsByStatus || [],
                recentTransactions: recentTransactions || [],
                monthlyRevenue: (monthlyRevenue?._sum?.commissionAmount || 0) + (monthlyRevenue?._sum?.platformFee || 0)
            };
        }
        catch (error) {
            // If there's any error (e.g., no commission data), return empty/zero values
            logger.error('Error fetching revenue analytics:', error);
            return {
                totalRevenue: 0,
                totalCommissions: 0,
                totalPlatformFees: 0,
                totalHotelPayouts: 0,
                transactionCount: 0,
                payoutsByStatus: [],
                recentTransactions: [],
                monthlyRevenue: 0
            };
        }
    }
}
export default new AdminService();
