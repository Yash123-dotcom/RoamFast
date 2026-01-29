'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FloatingHotelCTA() {
    const [isVisible, setIsVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        // Show after 3 seconds of scrolling
        const handleScroll = () => {
            if (window.scrollY > 800 && !isDismissed) {
                setIsVisible(true);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isDismissed]);

    const handleDismiss = () => {
        setIsDismissed(true);
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    className="fixed bottom-8 right-8 z-50"
                >
                    <div className="bg-[#0f172a] border border-accent-gold/30 rounded-2xl p-6 shadow-2xl max-w-sm relative overflow-hidden">
                        {/* Background Glow */}
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent-gold/20 rounded-full blur-3xl" />

                        {/* Close Button */}
                        <button
                            onClick={handleDismiss}
                            className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                        >
                            <X className="w-4 h-4 text-slate-400" />
                        </button>

                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-full bg-accent-gold/20 flex items-center justify-center mb-4">
                                <Building2 className="w-6 h-6 text-accent-gold" />
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2">
                                Are You a Hotel Manager?
                            </h3>
                            <p className="text-slate-400 text-sm mb-4">
                                Join 500+ properties earning 3X more revenue with NeonStay
                            </p>

                            <Link href="/for-hotels">
                                <Button className="w-full bg-accent-gold text-black hover:bg-amber-400 font-bold rounded-full glow-pulse-strong">
                                    Learn More
                                </Button>
                            </Link>

                            <p className="text-xs text-slate-500 text-center mt-3">
                                Free to list • 24hr payouts • 8-15% commission
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
