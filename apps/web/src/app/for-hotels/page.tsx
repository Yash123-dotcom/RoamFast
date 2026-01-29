'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import RevenueCalculator from '@/components/features/hotels/RevenueCalculator';
import TestimonialCard from '@/components/features/hotels/TestimonialCard';
import {
    TrendingUp,
    Users,
    Globe,
    BarChart3,
    Shield,
    Zap,
    Award,
    Target,
    DollarSign,
    ChevronRight,
    CheckCircle2,
    Star,
    Lock,
    Smartphone
} from 'lucide-react';

export default function ForHotelsPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-amber-500/30">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-void-grid opacity-30" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[800px] bg-gradient-radial from-amber-500/20 via-transparent to-transparent blur-3xl" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left: Copy */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-block px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full mb-6">
                                <span className="text-accent-gold text-sm font-bold uppercase tracking-wider">For Hotel Partners</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-bold font-heading mb-6 leading-tight">
                                Grow Your Hotel Revenue by{' '}
                                <span className="text-premium-gold">3X</span>
                            </h1>

                            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                                Join India's fastest-growing luxury hotel aggregator. Reach premium travelers, maximize occupancy, and scale effortlessly with our AI-powered platform.
                            </p>

                            {/* Stats Row */}
                            <div className="grid grid-cols-3 gap-6 mb-10">
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-accent-gold mb-2">
                                        <AnimatedCounter value={500} suffix="+" />
                                    </div>
                                    <div className="text-sm text-slate-400">Partner Hotels</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-accent-gold mb-2">
                                        <AnimatedCounter value={85} suffix="%" />
                                    </div>
                                    <div className="text-sm text-slate-400">Avg Occupancy</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-accent-gold mb-2">
                                        ₹<AnimatedCounter value={12} suffix="Cr+" />
                                    </div>
                                    <div className="text-sm text-slate-400">Revenue Generated</div>
                                </div>
                            </div>

                            {/* CTAs */}
                            <div className="flex flex-wrap gap-4">
                                <Link href="/list-property">
                                    <Button className="bg-accent-gold text-black hover:bg-amber-400 font-bold h-14 px-8 rounded-full text-lg btn-magnetic-enhanced glow-pulse-strong">
                                        List Your Property
                                        <ChevronRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </Link>
                                <Button variant="outline" className="border-white/20 hover:bg-white/10 h-14 px-8 rounded-full text-lg">
                                    Watch Demo
                                </Button>
                            </div>
                        </motion.div>

                        {/* Right: Visual/Image */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="relative rounded-[32px] overflow-hidden border border-white/10 shadow-2xl">
                                <img
                                    src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070"
                                    alt="Luxury Hotel"
                                    className="w-full h-[500px] object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                                {/* Floating Stats Card */}
                                <div className="absolute bottom-6 left-6 right-6 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="text-sm text-slate-400 mb-1">This Month's Revenue</div>
                                            <div className="text-3xl font-bold text-accent-gold">
                                                ₹<AnimatedCounter value={24} decimals={1} suffix="L" />
                                            </div>
                                        </div>
                                        <TrendingUp className="w-12 h-12 text-emerald-400" />
                                    </div>
                                </div>
                            </div>

                            {/* Trust Badges */}
                            <div className="flex gap-4 mt-6 justify-center">
                                <div className="flex items-center gap-2 bg-[#0f172a] border border-white/10 rounded-full px-4 py-2 trust-badge">
                                    <Shield className="w-4 h-4 text-emerald-400" />
                                    <span className="text-xs font-bold text-slate-300">Verified Platform</span>
                                </div>
                                <div className="flex items-center gap-2 bg-[#0f172a] border border-white/10 rounded-full px-4 py-2 trust-badge">
                                    <Lock className="w-4 h-4 text-blue-400" />
                                    <span className="text-xs font-bold text-slate-300">Secure Payments</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Why Partner With Us */}
            <section className="py-24 px-6 bg-[#030712]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">
                            Why Top Hotels Choose <span className="text-premium-gold">NeonStay</span>
                        </h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            We provide everything you need to maximize revenue and deliver exceptional guest experiences.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                icon: Target,
                                title: 'Qualified Leads',
                                description: 'Get verified, high-intent travelers ready to book luxury stays.',
                                color: 'from-red-500 to-orange-500'
                            },
                            {
                                icon: BarChart3,
                                title: 'Real-Time Analytics',
                                description: 'Track bookings, revenue, and occupancy with intuitive dashboards.',
                                color: 'from-blue-500 to-cyan-500'
                            },
                            {
                                icon: DollarSign,
                                title: 'Low Commission',
                                description: 'Industry-best rates starting at just 8% for premium partners.',
                                color: 'from-green-500 to-emerald-500'
                            },
                            {
                                icon: Zap,
                                title: 'Instant Payouts',
                                description: 'Get paid within 24 hours of guest check-out. No delays.',
                                color: 'from-yellow-500 to-amber-500'
                            },
                            {
                                icon: Globe,
                                title: 'Global Reach',
                                description: 'Connect with travelers from 50+ countries worldwide.',
                                color: 'from-purple-500 to-pink-500'
                            },
                            {
                                icon: Award,
                                title: 'Premium Branding',
                                description: 'Showcase your property with professional photography and content.',
                                color: 'from-indigo-500 to-blue-500'
                            }
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-[#0f172a] border border-white/10 rounded-[24px] p-8 group card-premium spotlight"
                            >
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} p-[2px] mb-6 float-slow`}>
                                    <div className="w-full h-full bg-[#0f172a] rounded-2xl flex items-center justify-center">
                                        <feature.icon className="w-7 h-7 text-white" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold font-heading mb-3 text-white">{feature.title}</h3>
                                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Revenue Calculator Section */}
            <section className="py-24 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">
                            Calculate Your <span className="text-premium-gold">Potential Earnings</span>
                        </h2>
                        <p className="text-slate-400 text-lg">
                            See how much revenue you could generate with NeonStay
                        </p>
                    </div>

                    <RevenueCalculator />
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 px-6 bg-[#030712]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">
                            Trusted by <span className="text-premium-gold">Elite Properties</span>
                        </h2>
                        <p className="text-slate-400 text-lg">
                            Hear from hotel partners already scaling with NeonStay
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <TestimonialCard
                            name="Rajesh Malhotra"
                            role="General Manager"
                            hotel="The Oberoi, Goa"
                            image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
                            rating={5}
                            testimonial="NeonStay increased our occupancy by 40% in just 3 months. The quality of guests and seamless booking process is unmatched."
                            stats={{ label: 'Revenue Increase', value: '+127%' }}
                        />
                        <TestimonialCard
                            name="Priya Sharma"
                            role="Owner"
                            hotel="Villa Paradiso, Assagao"
                            image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
                            rating={5}
                            testimonial="The analytics dashboard helped us optimize pricing. We now earn 3X more per booking compared to other platforms."
                            stats={{ label: 'Monthly Bookings', value: '180+' }}
                        />
                        <TestimonialCard
                            name="Arjun Kapoor"
                            role="Director"
                            hotel="Azure Beach Resort, Kerala"
                            image="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"
                            rating={5}
                            testimonial="Switching to NeonStay was the best business decision. Premium travelers, instant payouts, and world-class support."
                            stats={{ label: 'Average Rating', value: '4.9/5' }}
                        />
                    </div>
                </div>
            </section>

            {/* Comparison Table */}
            <section className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">
                            How We <span className="text-premium-gold">Stack Up</span>
                        </h2>
                        <p className="text-slate-400 text-lg">
                            See why hoteliers are switching to NeonStay
                        </p>
                    </div>

                    <div className="bg-[#0f172a] border border-white/10 rounded-[32px] overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left p-6 text-slate-400 font-normal">Feature</th>
                                    <th className="text-center p-6">
                                        <div className="text-accent-gold font-bold text-lg">NeonStay</div>
                                    </th>
                                    <th className="text-center p-6 text-slate-500">Others</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { feature: 'Commission Rate', neonStay: '8-15%', others: '18-25%' },
                                    { feature: 'Payout Time', neonStay: '24 hours', others: '7-30 days' },
                                    { feature: 'Analytics Dashboard', neonStay: true, others: false },
                                    { feature: 'Dedicated Support', neonStay: true, others: false },
                                    { feature: 'Marketing Tools', neonStay: true, others: 'Limited' },
                                    { feature: 'Guest Quality', neonStay: 'Premium', others: 'Mixed' }
                                ].map((row, idx) => (
                                    <tr key={idx} className="border-b border-white/5">
                                        <td className="p-6 text-white">{row.feature}</td>
                                        <td className="p-6 text-center">
                                            {typeof row.neonStay === 'boolean' ? (
                                                row.neonStay ? (
                                                    <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                                                ) : (
                                                    <span className="text-slate-600">—</span>
                                                )
                                            ) : (
                                                <span className="text-accent-gold font-bold">{row.neonStay}</span>
                                            )}
                                        </td>
                                        <td className="p-6 text-center text-slate-500">
                                            {typeof row.others === 'boolean' ? (
                                                row.others ? (
                                                    <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                                                ) : (
                                                    <span className="text-slate-600">✕</span>
                                                )
                                            ) : (
                                                row.others
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent" />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-[#0f172a] border border-white/10 rounded-[48px] p-12 md:p-16 shadow-2xl"
                    >
                        <h2 className="text-4xl md:text-6xl font-bold font-heading mb-6">
                            Ready to <span className="text-premium-gold shimmer">10X</span> Your Revenue?
                        </h2>
                        <p className="text-slate-300 text-xl mb-10 max-w-2xl mx-auto">
                            Join 500+ hotels already growing with NeonStay. List your property in under 10 minutes.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/list-property">
                                <Button className="bg-accent-gold text-black hover:bg-amber-400 font-bold h-16 px-12 rounded-full text-xl btn-magnetic-enhanced glow-pulse-strong">
                                    Start Earning Now
                                    <ChevronRight className="ml-2 w-6 h-6" />
                                </Button>
                            </Link>
                            <Button variant="outline" className="border-white/20 hover:bg-white/10 h-16 px-12 rounded-full text-xl">
                                Schedule a Call
                            </Button>
                        </div>

                        <p className="text-sm text-slate-500 mt-6">
                            No setup fees • Cancel anytime • Premium support included
                        </p>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
