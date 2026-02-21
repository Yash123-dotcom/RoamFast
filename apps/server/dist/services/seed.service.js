import { db, auth } from '@/config/firebase';
import { logger } from '@/utils/logger';
/**
 * Seed Service - Database seeding operations
 */
export class SeedService {
    /**
     * Seed the database with initial data
     */
    async seedDatabase() {
        logger.info('🌱 Starting database seed...');
        try {
            // Create demo user
            // Note: Firebase Admin Auth createUser might fail if user exists, so we handle that
            let demoUserId;
            try {
                const userRecord = await auth.createUser({
                    email: 'demo@neonstay.com',
                    emailVerified: true,
                    password: 'password123',
                    displayName: 'Demo User',
                });
                demoUserId = userRecord.uid;
            }
            catch (error) {
                if (error.code === 'auth/email-already-exists') {
                    const userRecord = await auth.getUserByEmail('demo@neonstay.com');
                    demoUserId = userRecord.uid;
                }
                else {
                    throw error;
                }
            }
            // Create/Update user doc in Firestore
            await db.collection('users').doc(demoUserId).set({
                email: 'demo@neonstay.com',
                name: 'Demo User',
                role: 'ADMIN',
                createdAt: new Date(),
            }, { merge: true });
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
            for (const hotel of realHotels) {
                // Check if hotel exists by name
                const snapshot = await db.collection('hotels').where('name', '==', hotel.name).get();
                if (snapshot.empty) {
                    const hotelData = {
                        ...hotel,
                        ownerId: demoUserId,
                        status: 'APPROVED',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    };
                    const docRef = await db.collection('hotels').add(hotelData);
                    // Create rooms
                    await db.collection('rooms').add({
                        type: "Deluxe King",
                        price: hotel.price,
                        capacity: 2,
                        hotelId: docRef.id,
                        createdAt: new Date(),
                    });
                    await db.collection('rooms').add({
                        type: "Luxury Suite",
                        price: Math.round(hotel.price * 1.5),
                        capacity: 3,
                        hotelId: docRef.id,
                        createdAt: new Date(),
                    });
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
        }
        catch (error) {
            logger.error('Seed failed:', error);
            logger.error('Error details:', {
                message: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined
            });
            throw error;
        }
    }
    /**
     * Seed commission data for revenue analytics demo
     */
    async seedCommissionData() {
        logger.info('💰 Starting commission data seed...');
        try {
            // Get demo user ID
            const demoUserUser = await db.collection('users').where('email', '==', 'demo@neonstay.com').get();
            const demoUserId = !demoUserUser.empty ? demoUserUser.docs[0].id : null;
            if (!demoUserId)
                return;
            // Create sample users (or just get IDs if we want to be real lazy, we can make fake IDs)
            const guestEmails = ['guest1@example.com', 'guest2@example.com', 'guest3@example.com'];
            const guestIds = [];
            for (const email of guestEmails) {
                // Simplified: assume they exist or just generate ID
                // For realistic data, we should probably create them in Auth/Firestore
                guestIds.push(email.replace('@example.com', '_id'));
            }
            // Get hotels
            const hotelsSnapshot = await db.collection('hotels').where('status', '==', 'APPROVED').limit(5).get();
            const hotels = hotelsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            if (hotels.length === 0) {
                return;
            }
            let bookingsCreated = 0;
            let commissionsCreated = 0;
            const bookingData = [
                { userId: guestIds[0], hotelId: hotels[0].id, price: 25000, status: 'PAID', daysAgo: 5 },
                { userId: guestIds[1], hotelId: hotels[1]?.id || hotels[0].id, price: 45000, status: 'PAID', daysAgo: 3 },
                { userId: guestIds[2], hotelId: hotels[2]?.id || hotels[0].id, price: 38000, status: 'PENDING', daysAgo: 1 },
                { userId: guestIds[0], hotelId: hotels[3]?.id || hotels[0].id, price: 85000, status: 'PAID', daysAgo: 10 },
                { userId: guestIds[1], hotelId: hotels[4]?.id || hotels[0].id, price: 95000, status: 'PENDING', daysAgo: 2 },
                { userId: guestIds[2], hotelId: hotels[0].id, price: 32000, status: 'FAILED', daysAgo: 7 },
            ];
            for (const data of bookingData) {
                const checkInDate = new Date();
                checkInDate.setDate(checkInDate.getDate() + 10 - data.daysAgo);
                const checkOutDate = new Date(checkInDate);
                checkOutDate.setDate(checkOutDate.getDate() + 3);
                // Create Booking
                const bookingRef = await db.collection('bookings').add({
                    userId: data.userId,
                    hotelId: data.hotelId,
                    checkIn: checkInDate,
                    checkOut: checkOutDate,
                    totalPrice: data.price,
                    status: 'CONFIRMED',
                    paymentStatus: 'succeeded',
                    paymentIntentId: `pi_demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    createdAt: new Date(),
                });
                bookingsCreated++;
                // Create commission record
                const commissionRate = 12.5;
                const platformFee = 500;
                const commissionAmount = Math.round(data.price * (commissionRate / 100));
                const hotelPayout = data.price - commissionAmount - platformFee;
                await db.collection('commissions').add({
                    bookingId: bookingRef.id,
                    commissionRate,
                    commissionAmount,
                    platformFee,
                    hotelPayout,
                    status: data.status,
                    paidAt: data.status === 'PAID' ? new Date() : null,
                    createdAt: new Date(),
                });
                commissionsCreated++;
            }
            logger.info(`✅ Commission seed completed. Created ${bookingsCreated} bookings and ${commissionsCreated} commission records.`);
            return {
                success: true,
                message: `Created ${bookingsCreated} bookings with ${commissionsCreated} commission records`,
                bookingsCreated,
                commissionsCreated
            };
        }
        catch (error) {
            logger.error('Commission seed failed:', error);
            throw error;
        }
    }
}
export default new SeedService();
