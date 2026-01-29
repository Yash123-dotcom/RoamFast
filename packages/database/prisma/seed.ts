import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const realHotels = [
  // --- INDIA ---
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
    reviews: [
      { rating: 5, comment: "An absolute dream. The hospitality is unmatched worldwide." },
      { rating: 5, comment: "Living history. The architecture is breathtaking." }
    ]
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
    reviews: [
      { rating: 5, comment: "Waking up to the view of the Taj Mahal was magical." }
    ]
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
    reviews: [
      { rating: 5, comment: "Felt like royalty. The service is impeccable." }
    ]
  },
  {
    name: "Goa Marriott Resort & Spa",
    description: "Situated on the edge of Miramar Beach, offering stunning views of the Arabian Sea and Mandovi River. A perfect blend of relaxation and luxury.",
    address: "Miramar, Panaji, Goa 403001",
    city: "Goa",
    price: 18000,
    images: [
      "https://images.unsplash.com/photo-1571896349842-6e542ef803bb?q=80&w=3388&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=3540&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=3540&auto=format&fit=crop"
    ],
    amenities: ["Beachfront", "Casino", "Infinity Pool", "Swim-up Bar"],
    rating: 4.6,
    reviews: [
      { rating: 4, comment: "Great location, right on the beach." },
      { rating: 5, comment: "The casino was fun, but the spa was the highlight." }
    ]
  },

  // --- UK ---
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
    reviews: [
      { rating: 5, comment: "Tea at the Ritz is a bucket list item checked." }
    ]
  },
  {
    name: "The Savoy",
    description: "Located on the Northbank of the River Thames, The Savoy is one of the most celebrated hotels in the world, blending Edwardian and Art Deco styles.",
    address: "Strand, London WC2R 0EU, UK",
    city: "London",
    price: 75000,
    images: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=3474&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=3388&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512918760383-5658fae4ce60?q=80&w=3540&auto=format&fit=crop"
    ],
    amenities: ["River View", "American Bar", "Savoy Grill", "Butler Service"],
    rating: 4.7,
    reviews: []
  },

  // --- USA ---
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
    reviews: [
      { rating: 5, comment: "Classic New York elegance. Nothing beats The Plaza." }
    ]
  },

  // --- UAE ---
  {
    name: "Atlantis, The Palm",
    description: "The crown of the world-famous Palm Island, Atlantis creates extraordinary memories with its water park, aquarium, and world-class dining.",
    address: "Crescent Rd, The Palm Jumeirah, Dubai, UAE",
    city: "Dubai",
    price: 40000,
    images: [
      "https://images.unsplash.com/photo-1518684079-3c830dcef6fb?q=80&w=2693&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=3540&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?fit=crop&w=800&q=80"
    ],
    amenities: ["Aquaventure Waterpark", "Unterwater Aquarium", "Nobu", "Private Beach"],
    rating: 4.7,
    reviews: []
  },

  // --- SPAIN ---
  {
    name: "Hotel Arts Barcelona",
    description: "Towering above the Mediterranean, Hotel Arts is a sanctuary of art and design, featuring Michelin-starred dining and a rooftop pool.",
    address: "Carrer de la Marina, 19-21, 08005 Barcelona, Spain",
    city: "Barcelona",
    price: 35000,
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=3540&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=3540&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=3540&auto=format&fit=crop"
    ],
    amenities: ["Sea View", "Frank Gehry Fish", "Terraced Gardens", "2 Michelin Stars"],
    rating: 4.6,
    reviews: []
  },

  // --- FRANCE ---
  {
    name: "Ritz Paris",
    description: "The Ritz Paris is not just a hotel, it's a legend. Located on Place Vendôme, it embodies French art de vivre and elegance.",
    address: "15 Pl. Vendôme, 75001 Paris, France",
    city: "Paris",
    price: 120000,
    images: [
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=3548&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=3542&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=3540&auto=format&fit=crop"
    ],
    amenities: ["Hemingway Bar", "Coco Chanel Suite", "Indoor Pool", "Haute Cuisine"],
    rating: 4.9,
    reviews: [
      { rating: 5, comment: "Perfection. The history here is palpable." }
    ]
  }
];

async function main() {
  console.log('🌱 Starting seed...');

  // Create Default User
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@neonstay.com' },
    update: {},
    create: {
      email: 'demo@neonstay.com',
      name: 'Demo User',
      role: 'ADMIN',
    },
  });

  for (const hotel of realHotels) {
    const createdHotel = await prisma.hotel.create({
      data: {
        name: hotel.name,
        description: hotel.description,
        address: hotel.address,
        city: hotel.city,
        price: hotel.price,
        images: hotel.images,
        amenities: hotel.amenities,
        rating: hotel.rating,
        ownerId: demoUser.id,
        rooms: {
          create: [
            { type: "Deluxe King", price: hotel.price, capacity: 2 },
            { type: "Luxury Suite", price: Math.round(hotel.price * 1.5), capacity: 3 },
            { type: "Presidential Suite", price: Math.round(hotel.price * 3), capacity: 4 }
          ]
        },
        reviews: {
          create: hotel.reviews.map(r => ({
            rating: r.rating,
            comment: r.comment,
            userId: demoUser.id
          }))
        }
      }
    });
    console.log(`Created hotel: ${createdHotel.name}`);
  }

  console.log('✅ Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });