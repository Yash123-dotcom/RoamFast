'use client';

import { motion } from 'framer-motion';
import { MapPin, Clock, Star, Camera, Palmtree, Church, Shield, Waves } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TouristPlace {
    id: number;
    name: string;
    description: string;
    image: string;
    type: string;
    rating: number;
    duration: string;
    bestTime: string;
    distance: string;
}

const goaAttractions: TouristPlace[] = [
    {
        id: 1,
        name: 'Baga Beach',
        description: 'Famous for water sports, nightlife, and stunning sunset views. One of the most popular beaches in North Goa.',
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070',
        type: 'Beach',
        rating: 4.5,
        duration: '2-3 hours',
        bestTime: 'Nov-Feb',
        distance: '16 km from Panaji'
    },
    {
        id: 2,
        name: 'Fort Aguada',
        description: 'A 17th-century Portuguese fort with a lighthouse offering panoramic views of the Arabian Sea.',
        image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?q=80&w=2070',
        type: 'Historical',
        rating: 4.6,
        duration: '1-2 hours',
        bestTime: 'All Year',
        distance: '18 km from Panaji'
    },
    {
        id: 3,
        name: 'Basilica of Bom Jesus',
        description: 'UNESCO World Heritage Site housing the remains of St. Francis Xavier. A masterpiece of baroque architecture.',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070',
        type: 'Religious',
        rating: 4.8,
        duration: '1 hour',
        bestTime: 'All Year',
        distance: '10 km from Panaji'
    },
    {
        id: 4,
        name: 'Dudhsagar Falls',
        description: 'Majestic four-tiered waterfalls cascading from 310m. A breathtaking natural wonder in the Western Ghats.',
        image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?q=80&w=2070',
        type: 'Nature',
        rating: 4.7,
        duration: 'Full Day',
        bestTime: 'Oct-Jan',
        distance: '60 km from Panaji'
    },
    {
        id: 5,
        name: 'Palolem Beach',
        description: 'Crescent-shaped beach perfect for swimming, kayaking, and dolphin watching. Known for its calm waters.',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070',
        type: 'Beach',
        rating: 4.6,
        duration: '3-4 hours',
        bestTime: 'Nov-Mar',
        distance: '67 km from Panaji'
    },
    {
        id: 6,
        name: 'Spice Plantations',
        description: 'Tour aromatic spice farms, learn about cultivation, and enjoy traditional Goan lunch.',
        image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2070',
        type: 'Experience',
        rating: 4.4,
        duration: '3-4 hours',
        bestTime: 'All Year',
        distance: '25 km from Panaji'
    }
];

const getIconForType = (type: string) => {
    switch (type) {
        case 'Beach':
            return Waves;
        case 'Historical':
            return Shield;
        case 'Religious':
            return Church;
        case 'Nature':
            return Palmtree;
        default:
            return Camera;
    }
};

interface TouristAttractionsProps {
    city: string;
}

export default function TouristAttractions({ city }: TouristAttractionsProps) {
    // Only show for Goa for now (can be extended to other cities)
    if (city.toLowerCase() !== 'goa') return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
        >
            <div className="mb-8">
                <h2 className="text-3xl font-bold font-heading text-white mb-2">
                    Explore <span className="text-premium-gold">Goa</span>
                </h2>
                <p className="text-slate-400">
                    Discover the best tourist attractions and places to visit during your stay
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {goaAttractions.map((place, index) => {
                    const IconComponent = getIconForType(place.type);

                    return (
                        <motion.div
                            key={place.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group bg-[#0f172a] border border-white/10 rounded-[24px] overflow-hidden hover:border-accent-gold/50 transition-all hover:shadow-[0_0_30px_-10px_rgba(245,158,11,0.3)] cursor-pointer card-premium"
                        >
                            {/* Image */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={place.image}
                                    alt={place.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-black/20 to-transparent" />

                                {/* Type Badge */}
                                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-white border border-white/10 flex items-center gap-2">
                                    <IconComponent className="w-3.5 h-3.5 text-accent-gold" />
                                    {place.type}
                                </div>

                                {/* Rating */}
                                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-white border border-white/10 flex items-center gap-1">
                                    <Star className="w-3.5 h-3.5 text-accent-gold fill-accent-gold" />
                                    {place.rating}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <h3 className="text-xl font-bold text-white font-heading mb-2 group-hover:text-accent-gold transition-colors">
                                    {place.name}
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2">
                                    {place.description}
                                </p>

                                {/* Info Grid */}
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="flex items-center gap-2 text-xs">
                                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                                        <span className="text-slate-400">{place.duration}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                                        <span className="text-slate-400">{place.distance}</span>
                                    </div>
                                </div>

                                {/* Best Time */}
                                <div className="pt-3 border-t border-white/5">
                                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">Best Time</span>
                                    <div className="text-sm font-medium text-accent-gold">{place.bestTime}</div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* CTA for More */}
            <div className="mt-8 text-center">
                <p className="text-slate-400 text-sm">
                    Want a custom itinerary? <a href="/concierge" className="text-accent-gold hover:underline font-bold">Contact our AI Concierge</a>
                </p>
            </div>
        </motion.div>
    );
}
