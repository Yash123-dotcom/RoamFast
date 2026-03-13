import { Hotel } from '@/models/Hotel';
import { User } from '@/models/User';
import { Booking } from '@/models/Booking';
import { Commission } from '@/models/Commission';
import { Subscription } from '@/models/Subscription';
import { HotelStatus } from '@/constants/enums';
import emailService from './email.service';
import { logger } from '@/utils/logger';

export class AdminService {
    /**
     * Get all hotels requiring approval
     */
    async getPendingHotels() {
        const hotels = await Hotel.find({ status: HotelStatus.PENDING }).sort({ createdAt: 1 }).lean();

        const result = await Promise.all(
            hotels.map(async (hotel) => {
                let owner = null;
                if (hotel.ownerId) {
                    const ownerDoc = await User.findById(hotel.ownerId).lean();
                    if (ownerDoc) owner = { name: ownerDoc.name, email: ownerDoc.email };
                }

                const subscriptions = await Subscription.find({
                    hotelId: hotel._id.toString(),
                    active: true,
                }).limit(1).lean();

                return {
                    ...hotel,
                    id: hotel._id.toString(),
                    owner,
                    subscriptions: subscriptions.map(s => ({ ...s, id: s._id.toString() })),
                };
            })
        );

        return result;
    }

    /**
     * Approve a hotel listing
     */
    async approveHotel(hotelId: string) {
        const hotel = await Hotel.findByIdAndUpdate(
            hotelId,
            { status: HotelStatus.APPROVED },
            { new: false }
        ).lean();

        if (!hotel) throw new Error('Hotel not found');

        let owner = null;
        if (hotel.ownerId) {
            const ownerDoc = await User.findById(hotel.ownerId).lean();
            if (ownerDoc) owner = ownerDoc;
        }

        if (owner && (owner as any).email) {
            await emailService.sendHotelApprovalNotification(
                (owner as any).email,
                (owner as any).name || 'Partner',
                hotel.name
            );
        }

        return {
            ...hotel,
            id: hotel._id.toString(),
            status: HotelStatus.APPROVED,
            owner,
        };
    }

    /**
     * Reject a hotel listing
     */
    async rejectHotel(hotelId: string) {
        const updated = await Hotel.findByIdAndUpdate(
            hotelId,
            { status: HotelStatus.REJECTED },
            { new: true }
        ).lean();

        return { ...updated, id: updated?._id.toString() };
    }

    async getPlatformStats() {
        const [totalUsers, totalHotels, totalBookings, commissions] = await Promise.all([
            User.countDocuments(),
            Hotel.countDocuments({ status: HotelStatus.APPROVED }),
            Booking.countDocuments(),
            Commission.find().lean(),
        ]);

        const totalRevenue = commissions.reduce(
            (sum, c) => sum + (c.commissionAmount || 0) + (c.platformFee || 0),
            0
        );

        return { totalUsers, totalHotels, totalBookings, totalRevenue };
    }

    /**
     * Get all commission payouts
     */
    async getPayouts() {
        const commissions = await Commission.find().sort({ createdAt: -1 }).lean();

        const payouts = await Promise.all(
            commissions.map(async (comm) => {
                const booking = await Booking.findById(comm.bookingId).lean();
                let hotelName = null;

                if (booking?.hotelId) {
                    const hotel = await Hotel.findById(booking.hotelId).lean();
                    hotelName = hotel?.name ?? null;
                }

                return {
                    ...comm,
                    id: comm._id.toString(),
                    booking: booking ? {
                        id: booking._id.toString(),
                        totalPrice: booking.totalPrice,
                        hotel: { name: hotelName },
                    } : null,
                };
            })
        );

        return payouts;
    }

    /**
     * Get detailed revenue analytics
     */
    async getRevenueAnalytics() {
        try {
            const allCommissions = await Commission.find().lean();

            let totalCommissions = 0;
            let totalPlatformFees = 0;
            let totalHotelPayouts = 0;
            const payoutsByStatus: any = {};

            allCommissions.forEach(c => {
                totalCommissions += c.commissionAmount || 0;
                totalPlatformFees += c.platformFee || 0;
                totalHotelPayouts += c.hotelPayout || 0;

                const status = c.status || 'PENDING';
                if (!payoutsByStatus[status]) {
                    payoutsByStatus[status] = {
                        status,
                        _sum: { commissionAmount: 0, platformFee: 0 },
                        _count: 0,
                    };
                }
                payoutsByStatus[status]._sum.commissionAmount += c.commissionAmount || 0;
                payoutsByStatus[status]._sum.platformFee += c.platformFee || 0;
                payoutsByStatus[status]._count++;
            });

            // Recent transactions (last 10)
            const recentCommissions = await Commission.find()
                .sort({ createdAt: -1 })
                .limit(10)
                .lean();

            const recentTransactions = await Promise.all(
                recentCommissions.map(async (comm) => {
                    const booking = await Booking.findById(comm.bookingId).lean();
                    let user = null, hotel = null;

                    if (booking) {
                        const [userDoc, hotelDoc] = await Promise.all([
                            User.findById(booking.userId).lean(),
                            Hotel.findById(booking.hotelId).lean(),
                        ]);
                        user = userDoc ? { name: userDoc.name, email: userDoc.email } : null;
                        hotel = hotelDoc ? { name: hotelDoc.name, city: hotelDoc.city } : null;
                    }

                    return {
                        ...comm,
                        id: comm._id.toString(),
                        booking: booking ? {
                            id: booking._id.toString(),
                            checkIn: booking.checkIn,
                            checkOut: booking.checkOut,
                            totalPrice: booking.totalPrice,
                            user,
                            hotel,
                        } : null,
                    };
                })
            );

            // Monthly revenue
            const startOfMonth = new Date();
            startOfMonth.setDate(1);
            startOfMonth.setHours(0, 0, 0, 0);

            const monthlyCommissions = await Commission.find({
                createdAt: { $gte: startOfMonth },
            }).lean();

            const monthlyRevenue = monthlyCommissions.reduce(
                (sum, c) => sum + (c.commissionAmount || 0) + (c.platformFee || 0),
                0
            );

            return {
                totalRevenue: totalCommissions + totalPlatformFees,
                totalCommissions,
                totalPlatformFees,
                totalHotelPayouts,
                transactionCount: allCommissions.length,
                payoutsByStatus: Object.values(payoutsByStatus),
                recentTransactions,
                monthlyRevenue,
            };
        } catch (error) {
            logger.error('Error fetching revenue analytics:', error);
            return {
                totalRevenue: 0,
                totalCommissions: 0,
                totalPlatformFees: 0,
                totalHotelPayouts: 0,
                transactionCount: 0,
                payoutsByStatus: [],
                recentTransactions: [],
                monthlyRevenue: 0,
            };
        }
    }
}

export default new AdminService();
