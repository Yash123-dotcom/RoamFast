'use client';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function AIConcierge() {
    return (
        <section className="py-24 bg-[#020617] relative overflow-hidden">
            {/* Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>

            <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold uppercase tracking-wider mb-6">
                        <Sparkles className="w-4 h-4" /> AI Powered
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-heading">
                        Your Personal AI Concierge
                    </h2>
                    <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
                        Have a complex trip in mind? Describe your ideal journey, and our advanced AI will craft a bespoke itinerary just for you.
                    </p>

                    <div className="bg-[#0f172a] p-2 rounded-[24px] border border-white/10 shadow-2xl shadow-blue-900/10 max-w-2xl mx-auto">
                        <textarea
                            className="w-full bg-transparent text-white p-6 min-h-[160px] focus:outline-none resize-none placeholder:text-slate-600 font-medium"
                            placeholder="e.g., Plan a 10-day luxury honeymoon in Italy, focusing on food, wine, ancient history, and excluding typical tourist traps..."
                        />
                        <div className="flex justify-between items-center px-6 pb-4 pt-2 border-t border-white/5 mt-2">
                            <div className="flex items-center gap-3">
                                <Switch id="advanced-mode" className="data-[state=checked]:bg-blue-600" />
                                <label htmlFor="advanced-mode" className="text-slate-400 text-sm font-medium cursor-pointer">Advanced Detail Mode</label>
                            </div>
                            <Link href="/search">
                                <Button className="bg-gradient-to-r from-blue-700 to-slate-800 hover:from-blue-600 hover:to-slate-700 text-white font-bold px-8 rounded-xl shadow-lg shadow-blue-900/20">
                                    Create Itinerary
                                </Button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
