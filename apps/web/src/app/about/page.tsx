'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { Award, ShieldCheck, Clock, Users } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-amber-500/30 font-sans">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-60 pb-32 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80')] bg-cover bg-center opacity-30"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>

                <div className="max-w-4xl mx-auto relative z-10 text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-accent-gold font-bold tracking-[0.3em] uppercase text-sm mb-6 block"
                    >
                        Our Story
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold font-heading mb-8 leading-tight"
                    >
                        Moments, Not <span className="text-gradient-neo">Rooms</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-slate-300 leading-relaxed"
                    >
                        We founded RoamFast on a simple belief: Time is the ultimate luxury.
                        Modern travelers shouldn't have to scroll through thousands of average listings
                        to find the exceptional.
                    </motion.p>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-24 px-6 bg-slate-950">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {[
                        { icon: ShieldCheck, title: "Verified Trust", desc: "Every property is personally vetted by our team." },
                        { icon: Clock, title: "Time Regained", desc: "We curate, so you don't have to search." },
                        { icon: Award, title: "Uncompromising Quality", desc: "Only the top 1% of properties make the cut." },
                        { icon: Users, title: "Members First", desc: "Designed for a community of like-minded nomads." }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white/5 p-8 rounded-3xl border border-white/5"
                        >
                            <item.icon className="w-10 h-10 text-accent-gold mb-6" />
                            <h3 className="text-xl font-bold font-heading mb-4 text-white">{item.title}</h3>
                            <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    );
}
