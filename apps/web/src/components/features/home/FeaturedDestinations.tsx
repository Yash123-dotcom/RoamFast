'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const featuredHotels = [
    {
        id: '1',
        name: 'The Ritz-Carlton',
        city: 'Dubai, UAE',
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80',
        description: 'Experience unparalleled luxury with breathtaking ocean views and world-class dining.',
        price: 45000
    },
    {
        id: '2',
        name: 'Taj Mahal Palace',
        city: 'Mumbai, India',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80',
        description: 'An iconic heritage hotel offering legendary hospitality and majestic harbor views.',
        price: 32000
    },
    {
        id: '3',
        name: 'Aman Tokyo',
        city: 'Tokyo, Japan',
        image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80',
        description: 'A serene sanctuary high above the vibrant Japanese capital.',
        price: 85000
    }
];

const destinations = [
    { name: 'Maldives', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80', properties: 124, region: 'South Asia' },
    { name: 'Swiss Alps', image: 'https://images.unsplash.com/photo-1531366936336-62fc67463b1f?q=80', properties: 86, region: 'Europe' },
    { name: 'Santorini', image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80', properties: 215, region: 'Mediterranean' },
    { name: 'Bali', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80', properties: 342, region: 'Southeast Asia' },
];

export default function FeaturedDestinations() {
    const [hoveredDest, setHoveredDest] = useState<string | null>(null);

    return (
        <section className="py-32 bg-slate-50 border-y border-slate-200">
            <div className="max-w-7xl mx-auto px-6">

                {/* --- HOTELS SECTION --- */}
                <div className="mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
                    >
                        <div className="max-w-2xl">
                            <span className="text-indigo-600 font-bold tracking-[0.2em] uppercase text-sm mb-3 block">Exclusive Access</span>
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-heading leading-tight">
                                Featured <span className="text-slate-400">Collections</span>
                            </h2>
                            <p className="text-slate-600 text-lg font-light leading-relaxed">
                                Hand-picked properties that define the pinnacle of hospitality. Reserved for those who appreciate the extraordinary.
                            </p>
                        </div>
                        <Link href="/collections">
                            <Button variant="outline" className="rounded-full border-slate-300 text-slate-900 hover:bg-slate-100 font-bold px-8 h-12">
                                View All Properties
                            </Button>
                        </Link>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredHotels.map((item, i) => (
                            <Link href={`/hotels/${item.id}`} key={item.id}>
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group relative h-[500px] rounded-[32px] overflow-hidden cursor-pointer bg-white border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-500"
                                >
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent transition-opacity duration-500"></div>

                                    <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold text-slate-900 shadow-lg border border-slate-200">
                                        ₹{item.price.toLocaleString()}<span className="text-slate-500 font-normal text-xs">/night</span>
                                    </div>

                                    <div className="absolute bottom-0 left-0 p-8 w-full">
                                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 block opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-2 group-hover:translate-y-0">
                                            {item.city}
                                        </span>
                                        <h3 className="text-2xl font-bold text-white font-heading mb-2 transition-all">
                                            {item.name}
                                        </h3>
                                        <p className="text-sm text-slate-300 line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                            {item.description}
                                        </p>
                                        <div className="h-px w-12 bg-white/30 group-hover:w-full group-hover:bg-indigo-500 transition-all duration-700"></div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* --- DESTINATIONS SECTION --- */}
                <div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
                    >
                        <div className="max-w-2xl">
                            <span className="text-indigo-600 font-bold tracking-[0.2em] uppercase text-sm mb-3 block">Curated Locations</span>
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-heading leading-tight">
                                Iconic <span className="text-slate-400">Destinations</span>
                            </h2>
                            <p className="text-slate-600 text-lg font-light leading-relaxed">
                                Discover regions renowned for their culture, beauty, and uncompromising luxury standards.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <Button variant="outline" className="rounded-full w-12 h-12 p-0 border-slate-300 text-slate-900 hover:bg-slate-100">
                                <ArrowRight className="w-5 h-5 rotate-180" />
                            </Button>
                            <Button variant="outline" className="rounded-full w-12 h-12 p-0 border-slate-300 text-slate-900 hover:bg-slate-100">
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {destinations.map((dest, i) => (
                            <Link href={`/destinations/${dest.name.toLowerCase()}`} key={dest.name}>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    onMouseEnter={() => setHoveredDest(dest.name)}
                                    onMouseLeave={() => setHoveredDest(null)}
                                    className="group relative h-[400px] rounded-[32px] overflow-hidden cursor-pointer shadow-sm border border-slate-200"
                                >
                                    <Image
                                        src={dest.image}
                                        alt={dest.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                        className={`object-cover transition-all duration-1000 ${hoveredDest === dest.name ? 'scale-110 blur-[2px] brightness-75' : 'scale-100'}`}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>

                                    <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-slate-900 border border-slate-200 shadow-lg">
                                        {dest.properties} Stays
                                    </div>

                                    <div className="absolute bottom-0 left-0 p-8 w-full">
                                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 block opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-2 group-hover:translate-y-0">
                                            {dest.region}
                                        </span>
                                        <h3 className="text-3xl font-bold text-white font-heading mb-4 transition-all">
                                            {dest.name}
                                        </h3>
                                        <div className="h-px w-12 bg-white/30 group-hover:w-full group-hover:bg-indigo-500 transition-all duration-700"></div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
