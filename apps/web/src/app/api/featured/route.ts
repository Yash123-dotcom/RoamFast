import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@repo/database';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const city = searchParams.get('city');

        const listings = await prisma.featuredListing.findMany({
            where: {
                active: true,
                endDate: { gt: new Date() },
                ...(city ? { city } : {})
            },
            include: {
                hotel: true
            },
            orderBy: { position: 'asc' },
            take: 5
        });

        const formattedListings = listings.map(listing => ({
            ...listing,
            hotel: {
                ...listing.hotel,
                images: JSON.parse(listing.hotel.images),
                amenities: JSON.parse(listing.hotel.amenities)
            }
        }));

        return NextResponse.json(formattedListings);
    } catch (error) {
        console.error('Failed to fetch featured listings:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
