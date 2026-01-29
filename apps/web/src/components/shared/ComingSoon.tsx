'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ComingSoonProps {
    title: string;
    subtitle?: string;
    backLink?: string;
    backText?: string;
}

export default function ComingSoon({
    title,
    subtitle = "We're crafting something exceptional for you. Join the waitlist to be notified when we launch.",
    backLink = "/",
    backText = "Return Home"
}: ComingSoonProps) {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-amber-500/30 font-sans flex flex-col">
            <Navbar />

            <main className="flex-grow flex items-center justify-center px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80')] bg-cover bg-center opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl mx-auto text-center relative z-10"
                >
                    <span className="text-accent-gold font-bold tracking-[0.3em] uppercase text-sm mb-6 block">Coming Soon</span>
                    <h1 className="text-5xl md:text-7xl font-bold font-heading mb-6 tracking-tight">
                        {title}
                    </h1>
                    <p className="text-xl text-slate-400 mb-10 leading-relaxed">
                        {subtitle}
                    </p>

                    <div className="max-w-md mx-auto flex gap-4 mb-12">
                        <Input
                            placeholder="Enter your email"
                            className="bg-white/10 border-white/10 text-white placeholder:text-slate-500 h-12 rounded-full px-6 backdrop-blur-md"
                        />
                        <Button className="bg-accent-gold text-black hover:bg-white rounded-full px-8 h-12 font-bold">
                            Notify Me
                        </Button>
                    </div>

                    <Link href={backLink}>
                        <Button variant="link" className="text-slate-400 hover:text-white">
                            {backText} <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
}
