'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const collections = [
    {
        title: "Urban Opulence",
        description: "Penthouses and architectural marvels in the world's most vibrant capitals.",
        image: "https://images.unsplash.com/photo-1512918760383-5658abf4ff4e?q=80&w=1000",
        count: 42
    },
    {
        title: "Seaside Sanctuaries",
        description: "Private villas where the ocean is your only neighbor.",
        image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1000",
        count: 28
    },
    {
        title: "Alpine Retreats",
        description: "Modern chalets with ski-in/ski-out access and roaring fireplaces.",
        image: "https://images.unsplash.com/photo-1518730518541-d0843268cacf?q=80&w=1000",
        count: 15
    },
    {
        title: "Eco-Luxe",
        description: "Sustainable havens that blend seamlessly with nature.",
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1000",
        count: 31
    },
    {
        title: "Historic Manors",
        description: "Castles and estates that have stood the test of time.",
        image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1000",
        count: 12
    },
    {
        title: "Desert Mirage",
        description: "Oases of luxury in the heart of the dunes.",
        image: "https://images.unsplash.com/photo-1545622966-2679c23568c3?q=80&w=1000",
        count: 9
    }
];

export default function CollectionsPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-amber-500/30 font-sans">
            <Navbar />

            <section className="pt-40 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-bold font-heading mb-6"
                    >
                        Curated <span className="text-gradient-neo">Collections</span>
                    </motion.h1>
                    <p className="text-xl text-slate-400 max-w-2xl mb-12">
                        Explore our hand-picked selections of the world's most extraordinary properties, grouped by style and experience.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {collections.map((collection, i) => (
                            <motion.div
                                key={collection.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group relative h-[400px] rounded-[32px] overflow-hidden cursor-pointer"
                            >
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10" />
                                <img
                                    src={collection.image}
                                    alt={collection.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />

                                <div className="absolute bottom-0 left-0 p-8 z-20 w-full bg-gradient-to-t from-black/90 to-transparent">
                                    <div className="flex justify-between items-end mb-2">
                                        <h3 className="text-2xl font-bold font-heading text-white">{collection.title}</h3>
                                        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-accent-gold group-hover:text-black transition-all">
                                            <ArrowUpRight className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-300 line-clamp-2 mb-4 group-hover:text-white transition-colors">{collection.description}</p>
                                    <span className="text-xs font-bold uppercase tracking-wider text-accent-gold">{collection.count} Properties</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
