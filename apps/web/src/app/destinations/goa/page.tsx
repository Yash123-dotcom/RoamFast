'use client';

import { motion } from 'framer-motion';
import { MapPin, Clock, Star, Camera, Palmtree, Church, Shield, Waves, ArrowLeft, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';
import Link from 'next/link';

const goaAttractions = [
    {
        id: 1,
        name: 'Baga Beach',
        description: 'Famous for water sports, nightlife, and stunning sunset views. One of the most popular beaches in North Goa with vibrant shacks and music.',
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070',
        type: 'Beach',
        rating: 4.5,
        duration: '2-3 hours',
        bestTime: 'November to February',
        distance: '16 km from Panaji',
        highlights: ['Water Sports', 'Beach Shacks', 'Nightlife', 'Parasailing']
    },
    {
        id: 2,
        name: 'Fort Aguada',
        description: 'A 17th-century Portuguese fort with a historic lighthouse offering panoramic views of the Arabian Sea. A perfect blend of history and scenic beauty.',
        image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?q=80&w=2070',
        type: 'Historical',
        rating: 4.6,
        duration: '1-2 hours',
        bestTime: 'All Year',
        distance: '18 km from Panaji',
        highlights: ['Portuguese Fort', 'Lighthouse', 'Sea Views', 'Photography']
    },
    {
        id: 3,
        name: 'Basilica of Bom Jesus',
        description: 'UNESCO World Heritage Site housing the remains of St. Francis Xavier. A masterpiece of baroque architecture and important pilgrimage site.',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070',
        type: 'Religious',
        rating: 4.8,
        duration: '1 hour',
        bestTime: 'All Year',
        distance: '10 km from Panaji',
        highlights: ['UNESCO Site', 'Baroque Architecture', 'Religious History', 'Museums']
    },
    {
        id: 4,
        name: 'Dudhsagar Falls',
        description: 'Majestic four-tiered waterfall cascading from 310m height. A breathtaking natural wonder located in the Western Ghats, perfect for adventure seekers.',
        image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?q=80&w=2070',
        type: 'Nature',
        rating: 4.7,
        duration: 'Full Day (6-8 hours)',
        bestTime: 'October to January',
        distance: '60 km from Panaji',
        highlights: ['Waterfall Trek', 'Jeep Safari', 'Wildlife', 'Photography']
    },
    {
        id: 5,
        name: 'Palolem Beach',
        description: 'Crescent-shaped beach perfect for swimming, kayaking, and dolphin watching. Known for its calm waters and laid-back vibe.',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070',
        type: 'Beach',
        rating: 4.6,
        duration: '3-4 hours',
        bestTime: 'November to March',
        distance: '67 km from Panaji',
        highlights: ['Dolphin Watching', 'Kayaking', 'Calm Waters', 'Beach Huts']
    },
    {
        id: 6,
        name: 'Spice Plantations',
        description: 'Tour aromatic spice farms, learn about cultivation of cardamom, pepper, nutmeg and enjoy traditional Goan lunch with cultural performances.',
        image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2070',
        type: 'Experience',
        rating: 4.4,
        duration: '3-4 hours',
        bestTime: 'All Year',
        distance: '25-40 km from Panaji',
        highlights: ['Spice Tour', 'Traditional Lunch', 'Elephant Rides', 'Cultural Shows']
    },
    {
        id: 7,
        name: 'Anjuna Flea Market',
        description: 'Vibrant weekly market offering handicrafts, jewelry, clothes, and local food. A shopper\'s paradise with bohemian vibes.',
        image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=2070',
        type: 'Shopping',
        rating: 4.3,
        duration: '2-3 hours',
        bestTime: 'November to March (Wednesdays)',
        distance: '18 km from Panaji',
        highlights: ['Shopping', 'Handicrafts', 'Street Food', 'Live Music']
    },
    {
        id: 8,
        name: 'Chapora Fort',
        description: 'Famous from Bollywood movie "Dil Chahta Hai", offers stunning sunset views over Vagator Beach. Historic Portuguese fort ruins.',
        image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=2070',
        type: 'Historical',
        rating: 4.4,
        duration: '1-2 hours',
        bestTime: 'Evening for Sunset',
        distance: '20 km from Panaji',
        highlights: ['Sunset Views', 'Fort Ruins', 'Photography', 'Beach Views']
    },
    {
        id: 9,
        name: 'Old Goa Churches',
        description: 'Cluster of magnificent churches including Se Cathedral, Church of St. Francis of Assisi, showcasing Portuguese colonial architecture.',
        image: 'https://images.unsplash.com/photo-1605883705077-8d3d3cebe78c?q=80&w=2070',
        type: 'Religious',
        rating: 4.7,
        duration: '2-3 hours',
        bestTime: 'All Year',
        distance: '9 km from Panaji',
        highlights: ['Colonial Architecture', 'Se Cathedral', 'Museums', 'History']
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
        case 'Shopping':
            return Camera;
        default:
            return Compass;
    }
};

export default function GoaAttractionsPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-amber-500/30">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-16 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-void-grid opacity-20" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-radial from-amber-500/10 via-transparent to-transparent blur-3xl" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <Link href="/destinations">
                        <Button variant="ghost" className="mb-6 text-slate-400 hover:text-white">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Destinations
                        </Button>
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <div className="inline-block px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full mb-6">
                            <span className="text-accent-gold text-sm font-bold uppercase tracking-wider">Tourist Attractions</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold font-heading mb-6 leading-tight">
                            Explore <span className="text-premium-gold">Goa</span>
                        </h1>
                        <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                            Discover pristine beaches, historic Portuguese forts, vibrant markets, and cascading waterfalls in India's beach capital.
                        </p>
                    </motion.div>

                    {/* Stats */}
                    <div className="flex justify-center gap-12 mb-12">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-accent-gold mb-1">{goaAttractions.length}+</div>
                            <div className="text-sm text-slate-400">Top Attractions</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-accent-gold mb-1">4.6</div>
                            <div className="text-sm text-slate-400">Avg. Rating</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-accent-gold mb-1">All Year</div>
                            <div className="text-sm text-slate-400">Visit Season</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Attractions Grid */}
            <section className="py-12 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {goaAttractions.map((place, index) => {
                            const IconComponent = getIconForType(place.type);

                            return (
                                <motion.div
                                    key={place.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group bg-[#0f172a] border border-white/10 rounded-[24px] overflow-hidden hover:border-accent-gold/50 transition-all hover:shadow-[0_0_30px_-10px_rgba(245,158,11,0.3)] card-premium"
                                >
                                    {/* Image */}
                                    <div className="relative h-56 overflow-hidden">
                                        <Image
                                            src={place.image}
                                            alt={place.name}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-black/20 to-transparent" />

                                        {/* Type Badge */}
                                        <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-white border border-white/10 flex items-center gap-2">
                                            <IconComponent className="w-4 h-4 text-accent-gold" />
                                            {place.type}
                                        </div>

                                        {/* Rating */}
                                        <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-white border border-white/10 flex items-center gap-1">
                                            <Star className="w-4 h-4 text-accent-gold fill-accent-gold" />
                                            {place.rating}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <h3 className="text-2xl font-bold text-white font-heading mb-3 group-hover:text-accent-gold transition-colors">
                                            {place.name}
                                        </h3>
                                        <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">
                                            {place.description}
                                        </p>

                                        {/* Highlights */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {place.highlights.slice(0, 3).map((highlight, idx) => (
                                                <span
                                                    key={idx}
                                                    className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded-md text-slate-300 uppercase tracking-wider"
                                                >
                                                    {highlight}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Info Grid */}
                                        <div className="space-y-2 pb-4 border-b border-white/5">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Clock className="w-4 h-4 text-slate-500" />
                                                <span className="text-slate-400">{place.duration}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <MapPin className="w-4 h-4 text-slate-500" />
                                                <span className="text-slate-400">{place.distance}</span>
                                            </div>
                                        </div>

                                        {/* Best Time */}
                                        <div className="pt-4">
                                            <span className="text-xs text-slate-500 uppercase tracking-wider">Best Time to Visit</span>
                                            <div className="text-sm font-bold text-accent-gold mt-1">{place.bestTime}</div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-[#0f172a] border border-white/10 rounded-[32px] p-12 text-center"
                    >
                        <h2 className="text-3xl font-bold font-heading mb-4">
                            Ready to Book Your <span className="text-premium-gold">Goa Stay</span>?
                        </h2>
                        <p className="text-slate-400 mb-8 text-lg">
                            Find the perfect hotel near your favorite attractions
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Link href="/search?city=Goa">
                                <Button className="bg-accent-gold text-black hover:bg-amber-400 font-bold h-12 px-8 rounded-full btn-magnetic-enhanced">
                                    Search Hotels in Goa
                                </Button>
                            </Link>
                            <Link href="/concierge">
                                <Button variant="outline" className="border-white/20 hover:bg-white/10 h-12 px-8 rounded-full">
                                    Plan with AI Concierge
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
