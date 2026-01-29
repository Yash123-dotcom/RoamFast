'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { Check, Shield, Crown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const tiers = [
    {
        name: 'Free',
        price: 'Free',
        description: 'Essential access for the modern traveler.',
        features: ['Access to 1,200+ Verified Stays', 'Standard Booking Support', 'Digital Itineraries', 'Quality Score Insights'],
        cta: 'Join for Free',
        gradient: 'from-slate-500 to-slate-700',
        highlight: false,
        icon: Shield,
        locked: false,
    },
    {
        name: 'Gold',
        price: '₹29,999/yr',
        description: 'Priority access and exclusive perks.',
        features: ['Everything in Free', 'Room Upgrades (when available)', 'Late Check-out', 'Zero Service Fees', 'Priority Support'],
        cta: 'Coming Soon',
        gradient: 'from-amber-400 to-yellow-600',
        highlight: true,
        icon: Crown,
        locked: true,
        launchDate: 'Q2 2026',
    },
    {
        name: 'Platinum',
        price: 'Invite Only',
        description: 'The ultimate sanctuary for the elite.',
        features: ['Everything in Gold', 'Dedicated Lifestyle Manager', 'Private Experiences', 'Off-market Properties', 'Concierge Services'],
        cta: 'Invite Only',
        gradient: 'from-indigo-500 to-purple-800',
        highlight: false,
        icon: Sparkles,
        locked: true,
        launchDate: 'Invite Only',
    },
];

export default function MembershipPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-amber-500/30 font-sans">
            <Navbar />

            {/* Hero */}
            <section className="relative pt-40 pb-20 px-6 text-center overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none"></div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 max-w-4xl mx-auto"
                >
                    <span className="text-accent-gold font-bold tracking-[0.3em] uppercase text-sm mb-6 block">The Inner Circle</span>
                    <h1 className="text-5xl md:text-7xl font-bold font-heading mb-6 leading-tight">
                        Unlock the <span className="text-gradient-neo">Exceptional</span>
                    </h1>
                    <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">
                        Join a community of travelers who demand more than just a place to sleep. Experience hospitality without compromise.
                    </p>
                </motion.div>
            </section>

            {/* Tiers Grid */}
            <section className="py-20 px-6 relative z-10">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {tiers.map((tier, i) => (
                        <motion.div
                            key={tier.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.6 }}
                            className={`relative p-1 rounded-[32px] overflow-hidden group ${tier.highlight ? 'ring-1 ring-amber-500/50 shadow-[0_0_50px_rgba(245,158,11,0.2)]' : 'border border-white/10'}`}
                        >
                            {/* Gradient Border Effect */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${tier.gradient} opacity-20 group-hover:opacity-40 transition-opacity duration-500`}></div>
                            <div className="absolute inset-[1px] bg-[#030712] rounded-[31px]"></div>

                            <div className="relative z-10 p-8 h-full flex flex-col">
                                {/* Locked Overlay */}
                                {tier.locked && (
                                    <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm rounded-[31px] flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/40 rounded-full mb-4">
                                                <Sparkles className="w-4 h-4 text-amber-400" />
                                                <span className="text-sm font-bold text-amber-400 uppercase tracking-wide">
                                                    {tier.launchDate}
                                                </span>
                                            </div>
                                            <h4 className="text-2xl font-bold text-white mb-2">Coming Soon</h4>
                                            <p className="text-slate-400 text-sm max-w-xs mx-auto">
                                                Join the waitlist to be notified when {tier.name} tier launches
                                            </p>
                                            <Button className="mt-4 bg-white/10 text-white hover:bg-white/20 rounded-full disabled:opacity-50" disabled>
                                                Join Waitlist
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-6 bg-gradient-to-br ${tier.gradient} text-white shadow-lg`}>
                                    <tier.icon className="w-6 h-6" />
                                </div>

                                <h3 className="text-2xl font-bold text-white font-heading mb-2">{tier.name}</h3>
                                <div className="text-3xl font-bold text-white mb-4">{tier.price}</div>
                                <p className="text-slate-400 text-sm mb-8">{tier.description}</p>

                                <ul className="space-y-4 mb-8 flex-1">
                                    {tier.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-3 text-sm text-slate-300">
                                            <Check className={`w-5 h-5 ${tier.highlight ? 'text-amber-400' : 'text-slate-500'} shrink-0`} />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <Link href={tier.locked ? '#' : (tier.name === 'Platinum' ? '/contact' : '/api/auth/signin')}>
                                    <Button
                                        disabled={tier.locked}
                                        className={`w-full h-14 rounded-full font-bold text-lg transition-all ${tier.highlight
                                            ? 'bg-amber-500 text-black hover:bg-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] disabled:opacity-50 disabled:cursor-not-allowed'
                                            : 'bg-white/10 text-white hover:bg-white hover:text-black disabled:opacity-50 disabled:cursor-not-allowed'
                                            }`}
                                    >
                                        {tier.cta}
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* FAQ / Trust Section */}
            <section className="py-20 bg-white/5 border-t border-white/5">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 font-heading">Why Join?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
                        <div>
                            <h4 className="text-xl font-bold text-white mb-2">Global Access</h4>
                            <p className="text-slate-400">Your membership travels with you. Enjoy benefits at over 1,000 properties worldwide.</p>
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-white mb-2">No Hidden Fees</h4>
                            <p className="text-slate-400">Transparency is our core value. What you see is what you pay.</p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
