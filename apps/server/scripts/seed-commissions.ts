// Simple script to manually seed commission data
// Run this with: npx tsx scripts/seed-commissions.ts

import { prisma } from '@repo/database';

async function main() {
    console.log('🌱 Seeding commission data...');

    try {
        // Create test users
        const user1 = await prisma.user.create({
            data: {
                email: 'guest1@test.com',
                name: 'Sarah Johnson',
                role: 'USER'
            }
        });

        const user2 = await prisma.user.create({
            data: {
                email: 'guest2@test.com',
                name: 'Michael Chen',
                role: 'USER'
            }
        });

        // Get first hotel
        const hotel = await prisma.hotel.findFirst({
            where: { status: 'APPROVED' }
        });

        if (!hotel) {
            console.log('❌ No approved hotels found. Please create hotels first.');
            return;
        }

        console.log(`✅ Found hotel: ${hotel.name}`);

        // Create sample bookings with commissions
        const bookings = [
            { userId: user1.id, price: 25000, status: 'PAID' },
            { userId: user2.id, price: 45000, status: 'PAID' },
            { userId: user1.id, price: 38000, status: 'PENDING' },
            { userId: user2.id, price: 85000, status: 'PAID' },
            { userId: user1.id, price: 32000, status: 'FAILED' },
        ];

        for (const bookingData of bookings) {
            const checkIn = new Date();
            checkIn.setDate(checkIn.getDate() + 10);
            const checkOut = new Date(checkIn);
            checkOut.setDate(checkOut.getDate() + 3);

            const booking = await prisma.booking.create({
                data: {
                    userId: bookingData.userId,
                    hotelId: hotel.id,
                    checkIn,
                    checkOut,
                    totalPrice: bookingData.price,
                    status: 'CONFIRMED',
                    paymentStatus: 'succeeded',
                    paymentIntentId: `pi_test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
                }
            });

            // Create commission
            const commissionRate = 12.5;
            const platformFee = 500;
            const commissionAmount = Math.round(bookingData.price * (commissionRate / 100));
            const hotelPayout = bookingData.price - commissionAmount - platformFee;

            await prisma.commission.create({
                data: {
                    bookingId: booking.id,
                    commissionRate,
                    commissionAmount,
                    platformFee,
                    hotelPayout,
                    status: bookingData.status as any,
                    paidAt: bookingData.status === 'PAID' ? new Date() : null
                }
            });

            console.log(`✅ Created booking with ${bookingData.status} commission: ₹${bookingData.price}`);
        }

        console.log('✅ Seeding complete!');
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

main();
