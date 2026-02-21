'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const destinations = [
    { city: "Goa", country: "India", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=2070", count: 94, hasAttractions: true },
    { city: "Paris", country: "France", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80", count: 124, hasAttractions: false },
    { city: "Kyoto", country: "Japan", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80", count: 85, hasAttractions: false },
    { city: "Santorini", country: "Greece", image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80", count: 62, hasAttractions: false },
    { city: "New York", country: "USA", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80", count: 204, hasAttractions: false },
    { city: "Bali", country: "Indonesia", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80", count: 156, hasAttractions: false },
    { city: "Dubai", country: "UAE", image: "https://images.unsplash.com/photo-1518684079-3c830dcef6fb?q=80", count: 98, hasAttractions: false },
    { city: "London", country: "UK", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80", count: 180, hasAttractions: false },
];

export default function DestinationsPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-amber-500/30 font-sans">
            <Navbar />

            <section className="pt-40 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-20"
                    >
                        <h1 className="text-5xl md:text-8xl font-bold font-heading mb-6 tracking-tight">
                            Global <span className="text-gradient-neo">Stay</span>
                        </h1>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                            Find your next home in the world's most iconic cities.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {destinations.map((dest, i) => {
                            const destLink = dest.hasAttractions
                                ? `/destinations/${dest.city.toLowerCase()}`
                                : `/search?city=${encodeURIComponent(dest.city)}`;

                            return (
                                <Link href={destLink} key={dest.city}>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.05 }}
                                        className={`group relative rounded-[24px] overflow-hidden cursor-pointer ${i === 0 ? 'col-span-2 row-span-2 h-[500px]' : 'col-span-1 h-[240px]'
                                            }`}
                                    >
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors z-10" />
                                        <Image
                                            src={dest.image}
                                            alt={dest.city}
                                            fill
                                            sizes={i === 0 ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
                                            className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0"
                                        />

                                        <div className="absolute inset-0 p-6 flex flex-col justify-end z-20 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90">
                                            {dest.hasAttractions && (
                                                <div className="absolute top-6 right-6 bg-accent-gold/20 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-accent-gold border border-accent-gold/30 shimmer">
                                                    Tourist Guide Available
                                                </div>
                                            )}
                                            <h3 className={`${i === 0 ? 'text-4xl' : 'text-2xl'} font-bold font-heading text-white mb-1 group-hover:text-accent-gold transition-colors`}>{dest.city}</h3>
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-300 text-sm font-medium">{dest.country}</span>
                                                <span className="text-accent-gold text-xs font-bold uppercase tracking-wider bg-black/50 px-2 py-1 rounded-full backdrop-blur-sm">{dest.count} Stays</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
