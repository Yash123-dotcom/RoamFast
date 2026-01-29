'use client';
import { motion } from 'framer-motion';
import { Search, CalendarDays, Key } from 'lucide-react';

const steps = [
    {
        icon: Search,
        title: "1. Find Your Sanctuary",
        desc: "Search our curated collection of luxury residences and hotels."
    },
    {
        icon: CalendarDays,
        title: "2. Customize Your Stay",
        desc: "Add concierge services, airport transfers, and bespoke amenities."
    },
    {
        icon: Key,
        title: "3. Seamless Arrival",
        desc: "Instant digital check-in and 24/7 support throughout your journey."
    }
];

export default function HowItWorks() {
    return (
        <section className="py-24 bg-[#020617] border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 font-heading">
                        How RoamFast Works
                    </h2>
                    <p className="text-slate-400">
                        Effortless luxury in three simple steps.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-[28%] left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900 z-0 opacity-50" />

                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2 }}
                            className="relative z-10 flex flex-col items-center text-center group"
                        >
                            <div className="w-20 h-20 rounded-2xl bg-[#0f172a] border border-white/10 flex items-center justify-center text-blue-400 mb-8 shadow-lg shadow-blue-500/10 group-hover:scale-110 transition-transform duration-500 group-hover:border-blue-500/50">
                                <step.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3 font-heading">{step.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
