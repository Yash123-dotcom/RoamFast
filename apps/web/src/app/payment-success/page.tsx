'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, Download, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const paymentIntentId = searchParams.get('payment_intent');
    const amount = searchParams.get('amount') || '50,000';
    const hotelName = searchParams.get('hotel') || 'The Ritz-Carlton';
    const guests = searchParams.get('guests') || '2';
    const checkIn = searchParams.get('checkIn') ? new Date(searchParams.get('checkIn')!).toLocaleDateString() : 'Nov 24, 2024';
    const checkOut = searchParams.get('checkOut') ? new Date(searchParams.get('checkOut')!).toLocaleDateString() : 'Nov 26, 2024';

    const [booking, setBooking] = useState<any>(null);

    useEffect(() => {
        // In a real app, fetch booking details using paymentIntentId
        setBooking({
            confirmationNumber: Math.random().toString(36).substring(2, 10).toUpperCase(),
            hotelName,
            checkIn,
            checkOut,
            totalAmount: amount,
        });
    }, [paymentIntentId, searchParams, amount, hotelName, checkIn, checkOut]);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
            <div className="max-w-xl w-full bg-white border border-slate-200 rounded-[32px] p-8 md:p-12 shadow-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-10"
                >
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-emerald-100">
                        <CheckCircle className="w-10 h-10 text-emerald-600" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 font-heading mb-4">Booking Confirmed!</h1>
                    <p className="text-slate-600 text-base leading-relaxed max-w-md mx-auto">
                        Your reservation at <span className="font-bold text-slate-900">{booking?.hotelName}</span> is complete. We've sent a confirmation email with all the details to your inbox.
                    </p>
                </motion.div>

                {booking && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-slate-50 rounded-[24px] p-6 mb-10 border border-slate-200"
                    >
                        <div className="flex justify-between items-start mb-6 pb-6 border-b border-slate-200">
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Confirmation No.</p>
                                <p className="text-2xl font-bold text-indigo-600 font-mono tracking-widest">{booking.confirmationNumber}</p>
                            </div>
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-indigo-600 rounded-full">
                                <Download className="w-5 h-5" />
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <p className="text-sm font-medium text-slate-500">Guests</p>
                                <p className="text-sm font-bold text-slate-900">{guests} Guests</p>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-sm font-medium text-slate-500">Dates</p>
                                <p className="text-sm font-bold text-slate-900">{booking.checkIn} — {booking.checkOut}</p>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-sm font-medium text-slate-500">Total Paid</p>
                                <p className="text-sm font-bold text-slate-900">₹{booking.totalAmount}</p>
                            </div>
                        </div>
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col sm:flex-row gap-4"
                >
                    <Button 
                        onClick={() => router.push('/dashboard')}
                        className="flex-1 rounded-xl h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-md shadow-indigo-600/20"
                    >
                        View Bookings
                    </Button>
                    <Button 
                        onClick={() => router.push('/')}
                        variant="outline" 
                        className="flex-1 rounded-xl h-14 border-slate-200 text-slate-900 hover:bg-slate-50 font-bold text-base"
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
        <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>}>
            <PaymentSuccessContent />
        </Suspense>
    );
}
