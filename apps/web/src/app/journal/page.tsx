'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const articles = [
    {
        category: "Slow Travel",
        title: "The Last Train to Ella: Sri Lanka's Highland Renaissance",
        excerpt: "Why the nine-hour journey from Kandy reveals more about the island's soul than any luxury resort ever could.",
        author: "Sarah Khan",
        date: "Jan 12, 2026",
        image: "https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?q=80",
    },
    {
        category: "Culinary",
        title: "A Chef's Guide to Oaxaca: Where Tradition Meets Modernity",
        excerpt: "From street-side tlayudas to seven-course mole tastings, navigating the culinary capital of Mexico.",
        author: "Carlos Velasquez",
        date: "Dec 08, 2025",
        image: "https://images.unsplash.com/photo-1585544314275-92762024190c?q=80",
    },
    {
        category: "Expedition",
        title: "Beyond the Blue: Finding Solitude in Raja Ampat",
        excerpt: "Venturing into the world's most biodiverse archipelago, where the ocean is your only neighbor.",
        author: "James Mitchell",
        date: "Nov 30, 2025",
        image: "https://images.unsplash.com/photo-1516690561799-46d8f74f9dab?q=80",
    },
    {
        category: "Wellness",
        title: "Silence and Snow: The Rise of Arctic Wellness Retreats",
        excerpt: "Disconnecting from the digital world in the frozen forests of Finnish Lapland.",
        author: "Freya Nilsson",
        date: "Nov 15, 2025",
        image: "https://images.unsplash.com/photo-1518182170546-0766dac9fbb0?q=80",
    }
];

export default function JournalPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-amber-500/30 font-sans">
            <Navbar />

            <section className="pt-40 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-20"
                    >
                        <span className="text-accent-gold font-bold tracking-[0.3em] uppercase text-sm mb-4 block">The RoamFast Journal</span>
                        <h1 className="text-6xl md:text-8xl font-bold font-heading mb-8">
                            Stories from <br /><span className="text-gradient-neo">The Road</span>
                        </h1>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
                        {articles.map((article, i) => (
                            <motion.article
                                key={article.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group cursor-pointer"
                            >
                                <div className="rounded-[32px] overflow-hidden mb-8 relative aspect-[4/3]">
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors z-10" />
                                    <Image
                                        src={article.image}
                                        alt={article.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <span className="absolute top-6 left-6 z-20 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border border-white/10">
                                        {article.category}
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-6 text-sm text-slate-400">
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-accent-gold" />
                                            {article.author}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-accent-gold" />
                                            {article.date}
                                        </div>
                                    </div>

                                    <h2 className="text-3xl font-bold font-heading group-hover:text-accent-gold transition-colors leading-tight">
                                        {article.title}
                                    </h2>
                                    <p className="text-slate-400 text-lg leading-relaxed line-clamp-2">
                                        {article.excerpt}
                                    </p>

                                    <div className="pt-4">
                                        <Button variant="link" className="p-0 text-white group-hover:text-accent-gold text-lg font-bold">
                                            Read Story <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                                        </Button>
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
