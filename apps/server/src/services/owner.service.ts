import { Hotel } from '@/models/Hotel';
import { Booking } from '@/models/Booking';
import { Review } from '@/models/Review';
import { Subscription } from '@/models/Subscription';
import { Commission } from '@/models/Commission';
import { User } from '@/models/User';

export class OwnerService {
    /**
     * Get all hotels owned by a specific user
     */
    async getMyHotels(ownerId: string) {
        try {
            const hotels = await Hotel.find({ ownerId }).sort({ createdAt: -1 }).lean();

            const result = await Promise.all(
                hotels.map(async (hotel) => {
                    const hotelId = hotel._id.toString();

                    const [bookingsCount, reviewsCount, subscriptions] = await Promise.all([
                        Booking.countDocuments({ hotelId }),
                        Review.countDocuments({ hotelId }),
                        Subscription.find({ hotelId, active: true })
                            .sort({ createdAt: -1 })
                            .limit(1)
                            .lean(),
                    ]);

                    return {
                        ...hotel,
                        id: hotelId,
                        _count: {
                            bookings: bookingsCount,
                            reviews: reviewsCount,
                        },
                        subscriptions: subscriptions.map(s => ({ ...s, id: s._id.toString() })),
                    };
                })
            );

            return result;
        } catch (error) {
            console.error('Error fetching owner hotels:', error);
            return [];
        }
    }

    /**
     * Get dashboard analytics for an owner
     */
    async getOwnerAnalytics(ownerId: string) {
        try {
            const hotels = await Hotel.find({ ownerId }).lean();
            const hotelIds = hotels.map(h => h._id.toString());

            if (hotelIds.length === 0) {
                return {
                    totalRevenue: 0,
                    totalBookings: 0,
                    averageRating: 0,
                    activeProperties: 0,
                    recentBookings: [],
                };
            }

            // Aggregate Revenue from commissions
            const allCommissions = await Commission.find().lean();
            let totalRevenue = 0;

            for (const comm of allCommissions) {
                const booking = await Booking.findById(comm.bookingId).lean();
                if (booking && hotelIds.includes(booking.hotelId) && booking.status === 'COMPLETED') {
                    totalRevenue += comm.hotelPayout || 0;
                }
            }

            // Count bookings
            const bookingsCount = await Booking.countDocuments({
                hotelId: { $in: hotelIds },
                status: { $in: ['CONFIRMED', 'COMPLETED'] },
            });

            // Get recent bookings
            const recentBookingDocs = await Booking.find({ hotelId: { $in: hotelIds } })
                .sort({ createdAt: -1 })
                .limit(5)
                .lean();

            const recentBookings = await Promise.all(
                recentBookingDocs.map(async (booking) => {
                    const [hotel, user] = await Promise.all([
                        Hotel.findById(booking.hotelId).lean(),
                        User.findById(booking.userId).lean(),
                    ]);

                    return {
                        ...booking,
                        id: booking._id.toString(),
                        hotel: hotel ? { name: hotel.name } : null,
                        user: user ? { name: user.name, email: user.email } : null,
                    };
                })
            );

            return {
                totalRevenue,
                totalBookings: bookingsCount,
                activeProperties: hotelIds.length,
                recentBookings,
            };
        } catch (error) {
            console.error('Error fetching owner analytics:', error);
            return {
                totalRevenue: 0,
                totalBookings: 0,
                averageRating: 0,
                activeProperties: 0,
                recentBookings: [],
            };
        }
    }
}

export default new OwnerService();
