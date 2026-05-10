'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { format, differenceInCalendarDays } from 'date-fns';
import { Calendar as CalendarIcon, Users, ShieldCheck, Star, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Separator } from '@/components/ui/separator';
import { DateRange } from 'react-day-picker';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

interface BookingPanelProps {
    hotel: {
        id: string;
        name: string;
        price?: number;
    };
}

export default function BookingPanel({ hotel }: BookingPanelProps) {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();

    const pricePerNight = hotel.price || 5000;
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [guests, setGuests] = useState(2);
    const [showAuthPrompt, setShowAuthPrompt] = useState(false);

    const nights = dateRange?.from && dateRange?.to
        ? differenceInCalendarDays(dateRange.to, dateRange.from)
        : 0;

    const basePrice = pricePerNight * (nights || 1);
    const tax = Math.round(basePrice * 0.18);
    const serviceFee = 299;
    const total = basePrice + tax + serviceFee;

    const handleReserve = async () => {
        if (!user) {
            setShowAuthPrompt(true);
            return;
        }

        if (!dateRange?.from || !dateRange?.to) {
            // No dates, still let them proceed to checkout with today's date
        }

        const params = new URLSearchParams({
            hotel: hotel.name,
            hotelId: hotel.id,
            price: String(pricePerNight * (nights || 1)),
            nights: String(nights || 1),
            guests: String(guests),
            ...(dateRange?.from && { checkIn: dateRange.from.toISOString() }),
            ...(dateRange?.to && { checkOut: dateRange.to.toISOString() }),
        });

        router.push(`/checkout?${params.toString()}`);
    };

    const handleSignIn = () => {
        router.push('/login');
    };

    return (
        <div className="sticky top-32 bg-white rounded-[28px] border border-slate-200 shadow-xl overflow-hidden animate-enter [animation-delay:400ms]">
            {/* Header */}
            <div className="p-8 border-b border-slate-100">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Starting from</p>
                        <div className="text-4xl font-black text-slate-900">
                            ₹{pricePerNight.toLocaleString()}
                            <span className="text-sm text-slate-400 font-normal ml-1">/night</span>
                        </div>
                    </div>
                    {nights > 0 && (
                        <div className="text-right">
                            <p className="text-xs text-slate-500">{nights} night{nights > 1 ? 's' : ''}</p>
                            <p className="text-lg font-bold text-indigo-600">₹{total.toLocaleString()}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-6 space-y-3">
                {/* Date Range Picker */}
                <Popover>
                    <PopoverTrigger asChild>
                        <button className="w-full text-left bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-200 hover:border-indigo-300 rounded-2xl p-4 group">
                            <p className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-widest font-bold mb-2 group-hover:text-indigo-600 transition-colors">
                                <CalendarIcon className="w-3.5 h-3.5" />
                                Dates
                            </p>
                            <p className="text-base font-semibold text-slate-900">
                                {dateRange?.from && dateRange?.to
                                    ? `${format(dateRange.from, 'MMM d')} → ${format(dateRange.to, 'MMM d')}`
                                    : 'Select check-in & out'}
                            </p>
                        </button>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-auto p-0 bg-white border-slate-200 text-slate-900 shadow-xl rounded-[24px] overflow-hidden"
                        align="start"
                    >
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={dateRange?.from}
                            selected={dateRange}
                            onSelect={setDateRange}
                            numberOfMonths={2}
                            disabled={{ before: new Date() }}
                            className="bg-white text-slate-900 p-4"
                            classNames={{
                                day_selected: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:bg-indigo-700',
                                day_range_middle: 'bg-indigo-50 text-indigo-900',
                                day_today: 'bg-slate-100 text-slate-900 rounded-md',
                                head_cell: 'text-slate-500 font-bold',
                                day: 'h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-slate-100 rounded-md transition-colors',
                            }}
                        />
                    </PopoverContent>
                </Popover>

                {/* Guests Selector */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <p className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-widest font-bold mb-2">
                        <Users className="w-3.5 h-3.5" />
                        Guests
                    </p>
                    <div className="flex items-center justify-between">
                        <span className="text-base font-semibold text-slate-900">{guests} Guest{guests > 1 ? 's' : ''}</span>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setGuests(g => Math.max(1, g - 1))}
                                className="w-8 h-8 rounded-full bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold flex items-center justify-center transition-colors text-lg leading-none shadow-sm"
                            >−</button>
                            <span className="w-4 text-center font-bold text-slate-900">{guests}</span>
                            <button
                                onClick={() => setGuests(g => Math.min(10, g + 1))}
                                className="w-8 h-8 rounded-full bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold flex items-center justify-center transition-colors text-lg leading-none shadow-sm"
                            >+</button>
                        </div>
                    </div>
                </div>

                {/* Price Breakdown */}
                <AnimatePresence>
                    {nights > 0 && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2.5 text-sm overflow-hidden"
                        >
                            <div className="flex justify-between text-slate-500">
                                <span>₹{pricePerNight.toLocaleString()} × {nights} night{nights > 1 ? 's' : ''}</span>
                                <span className="text-slate-900 font-medium">₹{basePrice.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-slate-500">
                                <span>Taxes (18% GST)</span>
                                <span className="text-slate-900 font-medium">₹{tax.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-slate-500">
                                <span>Service fee</span>
                                <span className="text-slate-900 font-medium">₹{serviceFee.toLocaleString()}</span>
                            </div>
                            <Separator className="bg-slate-200 my-1" />
                            <div className="flex justify-between font-bold text-slate-900 text-base">
                                <span>Total</span>
                                <span className="text-indigo-600">₹{total.toLocaleString()}</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Auth Prompt */}
                <AnimatePresence>
                    {showAuthPrompt && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-center"
                        >
                            <LogIn className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                            <p className="text-indigo-900 font-semibold text-sm mb-3">Sign in to Reserve</p>
                            <p className="text-indigo-700/70 text-xs mb-4">You need an account to make a reservation. It only takes a second.</p>
                            <Button
                                onClick={handleSignIn}
                                className="w-full bg-indigo-600 text-white font-bold hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20"
                            >
                                Sign In
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Reserve Button */}
                <Button
                    onClick={handleReserve}
                    size="lg"
                    disabled={authLoading}
                    className="w-full h-14 text-lg font-bold rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all hover:shadow-lg hover:shadow-indigo-600/30 hover:scale-[1.01]"
                >
                    {user ? 'Reserve Now' : 'Sign in to Reserve'}
                </Button>

                <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Free cancellation · SSL Encrypted Payment</span>
                </div>
            </div>
        </div>
    );
}
