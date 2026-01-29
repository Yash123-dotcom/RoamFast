'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar, MapPin, Download, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [booking, setBooking] = useState<any>(null);

    const paymentIntentId = searchParams.get('payment_intent');

    useEffect(() => {
        // Trigger confetti animation
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });

        // Fetch booking details if payment intent exists
        if (paymentIntentId) {
            // TODO: Fetch actual booking from API
            setBooking({
                confirmationNumber: 'NS-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
                hotelName: searchParams.get('hotel') || 'Hotel',
                checkIn: new Date().toLocaleDateString(),
                checkOut: new Date(Date.now() + 86400000 * 3).toLocaleDateString(),
                totalAmount: parseFloat(searchParams.get('amount') || '0'),
            });
        }
    }, [paymentIntentId, searchParams]);

    return (
        <div className="min-h-screen bg-[#020617] text-white">
            <Navbar />

            <div className="max-w-4xl mx-auto px-6 py-32">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 ring-4 ring-emerald-500/30">
                        <CheckCircle className="w-12 h-12 text-emerald-500" />
                    </div>

                    <h1 className="text-5xl font-bold mb-4 font-heading">Payment Successful!</h1>
                    <p className="text-xl text-slate-400">
                        Your booking has been confirmed. We've sent a confirmation email with all the details.
                    </p>
                </motion.div>

                {booking && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-[#0f172a] rounded-[32px] p-8 md:p-12 border border-white/10 shadow-2xl mb-8"
                    >
                        <div className="flex justify-between items-start mb-8 pb-8 border-b border-white/10">
                            <div>
                                <p className="text-sm text-slate-500 uppercase tracking-wider mb-2">Confirmation Number</p>
                                <p className="text-3xl font-bold text-accent-gold font-mono">{booking.confirmationNumber}</p>
                            </div>
                            <Button variant="outline" className="rounded-full border-white/10 text-white hover:bg-white hover:text-black">
                                <Download className="w-4 h-4 mr-2" />
                                Download Receipt
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <p className="text-sm text-slate-500 uppercase tracking-wider mb-2">Property</p>
                                <p className="text-2xl font-bold text-white">{booking.hotelName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 uppercase tracking-wider mb-2">Total Paid</p>
                                <p className="text-2xl font-bold text-white">₹{booking.totalAmount.toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-accent-gold/10 rounded-full flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-accent-gold" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 mb-1">Check-in</p>
                                    <p className="text-lg font-bold text-white">{booking.checkIn}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-accent-gold/10 rounded-full flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-accent-gold" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 mb-1">Check-out</p>
                                    <p className="text-lg font-bold text-white">{booking.checkOut}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                    <Button
                        onClick={() => router.push('/dashboard')}
                        className="bg-accent-gold text-black hover:bg-amber-400 h-14 rounded-full font-bold"
                    >
                        View My Bookings
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button
                        onClick={() => router.push('/search')}
                        variant="outline"
                        className="border-white/10 text-white hover:bg-white hover:text-black h-14 rounded-full font-bold"
                    >
                        Book Another Stay
                    </Button>
                    <Button
                        onClick={() => router.push('/')}
                        variant="ghost"
                        className="text-slate-400 hover:text-white h-14 rounded-full"
                    >
                        Return Home
                    </Button>
                </motion.div>
            </div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense>
            <PaymentSuccessContent />
        </Suspense>
    );
}
