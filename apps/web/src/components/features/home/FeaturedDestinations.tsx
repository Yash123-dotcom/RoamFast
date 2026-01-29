'use client';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

import FeaturedCountdown from './FeaturedCountdown';

export default function FeaturedDestinations() {
    const [listings, setListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/featured')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setListings(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    // Fallback to static if no featured data
    if (loading || listings.length === 0) return <StaticDestinations />;

    return (
        <section className="py-24 bg-black relative overflow-hidden" id="destinations">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
                >
                    <div className="max-w-2xl">
                        <span className="text-accent-gold font-bold tracking-[0.2em] uppercase text-sm mb-3 block">Exclusive Access</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-heading leading-tight">
                            Featured <span className="text-white/50">Collections</span>
                        </h2>
                        <p className="text-slate-400 text-lg leading-relaxed">
                            Limited-time opportunities at our most coveted properties. Verified excellence, guaranteed.
                        </p>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {listings.map((item, i) => (
                        <Link href={`/hotels/${item.hotel.id}`} key={item.id}>
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.6 }}
                                className="group relative h-[480px] rounded-[32px] overflow-hidden cursor-pointer border border-white/5"
                            >
                                <Image
                                    src={item.hotel.images[0] || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb'}
                                    alt={item.hotel.name}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110 brightness-[0.8] group-hover:brightness-100"
                                />

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />

                                <div className="absolute top-6 right-6 z-20">
                                    <FeaturedCountdown endDate={item.endDate} />
                                </div>

                                <div className="absolute top-6 left-6 z-20 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                                        {item.reason || 'Editor Choice'}
                                    </span>
                                </div>

                                <div className="absolute bottom-0 left-0 p-8 w-full">
                                    <span className="text-xs font-bold text-accent-gold uppercase tracking-wider mb-2 block opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-2 group-hover:translate-y-0">
                                        {item.hotel.city}
                                    </span>
                                    <h3 className="text-2xl font-bold text-white font-heading mb-2 group-hover:text-glow transition-all">
                                        {item.hotel.name}
                                    </h3>
                                    <p className="text-sm text-slate-300 line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                        {item.hotel.description}
                                    </p>
                                    <div className="h-px w-12 bg-white/30 group-hover:w-full group-hover:bg-accent-gold transition-all duration-700"></div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

function StaticDestinations() {
    const destinations = [
        {
            id: 1,
            name: 'Kyoto, Japan',
            image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=800&auto=format&fit=crop',
            region: 'Asia',
            properties: 124
        },
        // ... keep existing static data if active listings fetch fails or is empty
        {
            id: 2,
            name: 'Santorini, Greece',
            image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=800&auto=format&fit=crop',
            region: 'Europe',
            properties: 85
        },
        {
            id: 3,
            name: 'New York, USA',
            image: 'https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?q=80&w=800&auto=format&fit=crop',
            region: 'North America',
            properties: 210
        },
        {
            id: 4,
            name: 'Dubai, UAE',
            image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb',
            region: 'Middle East',
            properties: 94
        }
    ];
    return (
        <section className="py-32 bg-black relative overflow-hidden" id="destinations">
            {/* Reuse existing static JSX here */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
                >
                    <div className="max-w-2xl">
                        <span className="text-accent-gold font-bold tracking-[0.2em] uppercase text-sm mb-3 block">Curated Locations</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-heading leading-tight">
                            Iconic <span className="text-white/50">Destinations</span>
                        </h2>
                        <p className="text-slate-400 text-lg leading-relaxed">
                            From secluded islands to vibrant metropolises, explore our handpicked selection of the world's most breathtaking locations.
                        </p>
                    </div>
                    <Link href="/search">
                        <Button variant="outline" className="rounded-full border-white/10 text-white hover:bg-white hover:text-black transition-all  px-8 py-6 font-bold uppercase tracking-widest text-xs">
                            View All Locations
                        </Button>
                    </Link>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {destinations.map((dest, i) => (
                        <Link href={`/search?city=${encodeURIComponent(dest.name.split(',')[0])}`} key={dest.id}>
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.6 }}
                                className="group relative h-[480px] rounded-[32px] overflow-hidden cursor-pointer border border-white/5"
                            >
                                <Image
                                    src={dest.image}
                                    alt={dest.name}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110 brightness-[0.8] group-hover:brightness-100"
                                />

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />

                                <div className="absolute top-6 right-6 z-20">
                                    <div className="w-12 h-12 bg-white/5 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                        <ArrowUpRight className="w-5 h-5 text-white" />
                                    </div>
                                </div>

                                <div className="absolute top-6 left-6 z-20 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">{dest.properties} Properties</span>
                                </div>

                                <div className="absolute bottom-0 left-0 p-8 w-full">
                                    <span className="text-xs font-bold text-accent-gold uppercase tracking-wider mb-2 block opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-2 group-hover:translate-y-0">
                                        {dest.region}
                                    </span>
                                    <h3 className="text-3xl font-bold text-white font-heading mb-4 group-hover:text-glow transition-all">
                                        {dest.name}
                                    </h3>
                                    <div className="h-px w-12 bg-white/30 group-hover:w-full group-hover:bg-accent-gold transition-all duration-700"></div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
