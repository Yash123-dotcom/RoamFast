'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Search, ArrowRight } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';

export default function BookPage() {
    const [date, setDate] = useState<Date | undefined>(new Date());

    return (
        <div className="min-h-screen bg-black text-white selection:bg-amber-500/30 font-sans">
            <Navbar />

            <section className="pt-32 pb-20 px-6 relative min-h-screen flex items-center">
                {/* Background Video/Image */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black z-10" />
                    <Image
                        src="https://images.unsplash.com/photo-1571896349842-6e53ce41e887?q=80&w=2000"
                        alt="Background"
                        fill
                        sizes="100vw"
                        priority
                        className="object-cover opacity-60"
                    />
                </div>

                <div className="max-w-4xl mx-auto w-full relative z-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <h1 className="text-5xl md:text-7xl font-bold font-heading mb-6">
                            Where to <span className="text-gradient-neo">Next?</span>
                        </h1>
                        <p className="text-xl text-slate-300">
                            Start your reservation. The world is waiting.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[32px] p-4 md:p-6 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                            {/* Destination */}
                            <div className="md:col-span-4 bg-black/40 rounded-2xl p-4 border border-white/5 hover:border-white/20 transition-colors group cursor-text">
                                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 group-hover:text-accent-gold transition-colors">
                                    <MapPin className="w-4 h-4" /> Destination
                                </label>
                                <Input
                                    placeholder="Try 'Santorini' or 'Kyoto'"
                                    className="bg-transparent border-none text-xl font-bold placeholder:text-slate-600 p-0 h-auto focus-visible:ring-0 text-white"
                                />
                            </div>

                            {/* Dates */}
                            <div className="md:col-span-3 bg-black/40 rounded-2xl p-4 border border-white/5 hover:border-white/20 transition-colors group cursor-pointer">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <div className="w-full h-full flex flex-col justify-center">
                                            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 group-hover:text-accent-gold transition-colors">
                                                <Calendar className="w-4 h-4" /> Dates
                                            </label>
                                            <div className="text-xl font-bold text-white">
                                                {date ? format(date, "MMM dd") : "Select Date"}
                                            </div>
                                        </div>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 bg-[#0f172a] border-white/10 text-white" align="start">
                                        <CalendarComponent
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            initialFocus
                                            className="bg-[#0f172a] text-white"
                                            classNames={{
                                                day_selected: "bg-accent-gold text-black hover:bg-amber-400 focus:bg-amber-400",
                                                day_today: "bg-white/10 text-white",
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {/* Guests */}
                            <div className="md:col-span-3 bg-black/40 rounded-2xl p-4 border border-white/5 hover:border-white/20 transition-colors group">
                                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 group-hover:text-accent-gold transition-colors">
                                    <Users className="w-4 h-4" /> Guests
                                </label>
                                <Select defaultValue="2">
                                    <SelectTrigger className="w-full bg-transparent border-none p-0 h-auto text-xl font-bold text-white focus:ring-0 ring-offset-0">
                                        <SelectValue placeholder="Guests" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#0f172a] border-white/10 text-white">
                                        <SelectItem value="1">1 Guest</SelectItem>
                                        <SelectItem value="2">2 Guests</SelectItem>
                                        <SelectItem value="3">3 Guests</SelectItem>
                                        <SelectItem value="4">4+ Guests</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Search Button */}
                            <div className="md:col-span-2">
                                <Button className="w-full h-full bg-accent-gold text-black hover:bg-white hover:text-black font-bold text-lg rounded-2xl shadow-lg transition-all transform hover:scale-[1.02]">
                                    <Search className="w-6 h-6" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick Suggestions */}
                    <div className="mt-12 flex flex-wrap justify-center gap-4 text-sm text-slate-400">
                        <span className="opacity-50">Developing Trends:</span>
                        {['Private Islands', 'Ski Chalets', 'Desert Domes', 'Eco-Lodges'].map(trend => (
                            <button key={trend} className="hover:text-white hover:underline decoration-accent-gold underline-offset-4 transition-all">
                                {trend}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
