import { Hotel } from '@/models/Hotel';
import { Room } from '@/models/Room';
import { User } from '@/models/User';
import { Booking } from '@/models/Booking';
import { Commission } from '@/models/Commission';
import { logger } from '@/utils/logger';

/**
 * Seed Service - Database seeding operations using Mongoose
 */
export class SeedService {
    /**
     * Seed the database with initial data
     */
    async seedDatabase() {
        logger.info('🌱 Starting database seed...');

        try {
            // Create or find demo user
            let demoUser = await User.findOne({ email: 'demo@neonstay.com' }).lean();

            if (!demoUser) {
                const created = await new User({
                    email: 'demo@neonstay.com',
                    name: 'Demo User',
                    role: 'ADMIN',
                }).save();
                demoUser = created.toObject();
            }

            const demoUserId = (demoUser as any)._id.toString();

            const realHotels = [
                {
                    name: "The Taj Mahal Palace",
                    description: "Built in 1903, The Taj Mahal Palace is India's first luxury hotel. Overlooking the Arabian Sea and the Gateway of India, this legendary hotel is a landmark of Mumbai city.",
                    address: "Apollo Bunder, Colaba, Mumbai, Maharashtra 400001",
                    city: "Mumbai",
                    price: 25000,
                    images: [
                        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=2649&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=3540&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=3540&auto=format&fit=crop"
                    ],
                    amenities: ["Sea View", "Butler Service", "Jiva Spa", "Historic Landmark", "9 Restaurants"],
                    rating: 4.9,
                },
                {
                    name: "The Oberoi Amarvilas",
                    description: "Located just 600 meters from the Taj Mahal, The Oberoi Amarvilas offers uninterrupted views of this ancient monument from every room and suite.",
                    address: "Taj East Gate Road, Agra, Uttar Pradesh 282001",
                    city: "Agra",
                    price: 45000,
                    images: [
                        "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=3540&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=3425&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=3540&auto=format&fit=crop"
                    ],
                    amenities: ["Taj Mahal View", "Mughal Architecture", "Private Pools", "Fine Dining"],
                    rating: 5.0,
                },
                {
                    name: "Rambagh Palace",
                    description: "Once the residence of the Maharaja of Jaipur, the Rambagh Palace offers a royal experience with peacocks roaming the lush gardens and suites fit for kings.",
                    address: "Bhawani Singh Rd, Jaipur, Rajasthan 302005",
                    city: "Jaipur",
                    price: 38000,
                    images: [
                        "https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=3540&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=3540&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=3540&auto=format&fit=crop"
                    ],
                    amenities: ["Royal Heritage", "Polo Bar", "Jiva Spa", "Vintage Cars"],
                    rating: 4.9,
                },
                {
                    name: "The Ritz London",
                    description: "A symbol of high society and luxury, The Ritz London offers Louis XVI style interiors, a world-famous Afternoon Tea, and Michelin-starred dining.",
                    address: "150 Piccadilly, St. James's, London W1J 9BR, UK",
                    city: "London",
                    price: 85000,
                    images: [
                        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=3474&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=3540&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=3540&auto=format&fit=crop"
                    ],
                    amenities: ["Michelin Star Dining", "Afternoon Tea", "Concierge", "Historic"],
                    rating: 4.8,
                },
                {
                    name: "The Plaza",
                    description: "Experience the ultimate in New York luxury. The Plaza is a cultural icon hosting world leaders, dignitaries, and celebrities for over a century.",
                    address: "768 5th Ave, New York, NY 10019, USA",
                    city: "New York",
                    price: 95000,
                    images: [
                        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=3540&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=3540&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1554647286-f365d7defc2d?q=80&w=3388&auto=format&fit=crop"
                    ],
                    amenities: ["Central Park View", "Champagne Bar", "Guerlain Spa", "Iconic"],
                    rating: 4.8,
                }
            ];

            let createdCount = 0;

            for (const hotelData of realHotels) {
                const existing = await Hotel.findOne({ name: hotelData.name }).lean();

                if (!existing) {
                    const hotel = await new Hotel({
                        ...hotelData,
                        ownerId: demoUserId,
                        status: 'APPROVED',
                    }).save();

                    // Create rooms
                    await Promise.all([
                        new Room({
                            type: "Deluxe King",
                            price: hotelData.price,
                            capacity: 2,
                            hotelId: hotel._id.toString(),
                        }).save(),
                        new Room({
                            type: "Luxury Suite",
                            price: Math.round(hotelData.price * 1.5),
                            capacity: 3,
                            hotelId: hotel._id.toString(),
                        }).save(),
                    ]);

                    createdCount++;
                }
            }

            logger.info(`✅ Seed completed. Created ${createdCount} hotels.`);

            return {
                success: true,
                message: `Seed successful. Created ${createdCount} new hotels.`,
                totalHotels: realHotels.length,
                createdHotels: createdCount,
            };
        } catch (error) {
            logger.error('Seed failed:', error);
            throw error;
        }
    }

    /**
     * Seed commission data for revenue analytics demo
     */
    async seedCommissionData() {
        logger.info('💰 Starting commission data seed...');

        try {
            const demoUser = await User.findOne({ email: 'demo@neonstay.com' }).lean();
            if (!demoUser) return;
            const demoUserId = (demoUser as any)._id.toString();

            const hotels = await Hotel.find({ status: 'APPROVED' }).limit(5).lean();

            if (hotels.length === 0) return;

            let bookingsCreated = 0;
            let commissionsCreated = 0;

            const bookingData = [
                { userId: demoUserId, hotelIdx: 0, price: 25000, status: 'PAID', daysAgo: 5 },
                { userId: demoUserId, hotelIdx: 1, price: 45000, status: 'PAID', daysAgo: 3 },
                { userId: demoUserId, hotelIdx: 2, price: 38000, status: 'PENDING', daysAgo: 1 },
                { userId: demoUserId, hotelIdx: 3, price: 85000, status: 'PAID', daysAgo: 10 },
                { userId: demoUserId, hotelIdx: 4, price: 95000, status: 'PENDING', daysAgo: 2 },
                { userId: demoUserId, hotelIdx: 0, price: 32000, status: 'FAILED', daysAgo: 7 },
            ];

            for (const data of bookingData) {
                const checkInDate = new Date();
                checkInDate.setDate(checkInDate.getDate() + 10 - data.daysAgo);
                const checkOutDate = new Date(checkInDate);
                checkOutDate.setDate(checkOutDate.getDate() + 3);

                const hotel = hotels[data.hotelIdx] || hotels[0];
                const hotelId = hotel._id.toString();

                const booking = await new Booking({
                    userId: data.userId,
                    hotelId,
                    checkIn: checkInDate,
                    checkOut: checkOutDate,
                    totalPrice: data.price,
                    status: 'CONFIRMED',
                    paymentStatus: 'succeeded',
                    paymentIntentId: `pi_demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                }).save();

                bookingsCreated++;

                const commissionRate = 12.5;
                const platformFee = 500;
                const commissionAmount = Math.round(data.price * (commissionRate / 100));
                const hotelPayout = data.price - commissionAmount - platformFee;

                await new Commission({
                    bookingId: booking._id.toString(),
                    commissionRate,
                    commissionAmount,
                    platformFee,
                    hotelPayout,
                    status: data.status,
                    paidAt: data.status === 'PAID' ? new Date() : null,
                }).save();

                commissionsCreated++;
            }

            logger.info(`✅ Commission seed completed. Created ${bookingsCreated} bookings and ${commissionsCreated} commission records.`);

            return {
                success: true,
                message: `Created ${bookingsCreated} bookings with ${commissionsCreated} commission records`,
                bookingsCreated,
                commissionsCreated,
            };
        } catch (error) {
            logger.error('Commission seed failed:', error);
            throw error;
        }
    }
}

export default new SeedService();
