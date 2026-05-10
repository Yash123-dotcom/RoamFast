'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Lock, ShieldCheck, Calendar, Users, BedDouble } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import DummyCheckoutForm from '@/components/features/payment/DummyCheckoutForm';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const hotelName = searchParams.get('hotel') || 'Hotel';
  const hotelId = searchParams.get('hotelId') || '';
  const basePrice = parseInt(searchParams.get('price') || '0');
  const nights = parseInt(searchParams.get('nights') || '1');
  const guests = parseInt(searchParams.get('guests') || '2');
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');

  const tax = Math.round(basePrice * 0.18);
  const serviceFee = 299;
  const totalAmount = basePrice + tax + serviceFee;

  useEffect(() => {
    // If not authenticated and not loading, redirect to login
    if (!authLoading && !user) {
      const params = new URLSearchParams(searchParams.toString());
      router.push(`/login?redirect=/checkout?${params.toString()}`);
    }
  }, [user, authLoading, router, searchParams]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-6">
        <div className="bg-white border border-slate-200 rounded-[32px] p-8 max-w-md w-full text-center shadow-sm">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h1 className="text-2xl font-bold font-heading mb-2 text-slate-900">Sign in to book</h1>
          <p className="text-slate-600 mb-8">You need an account to complete your reservation.</p>
          <Button onClick={() => router.push('/login')} className="w-full h-12 bg-indigo-600 text-white hover:bg-indigo-700 rounded-full font-bold shadow-md shadow-indigo-600/20">Sign in</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-12 pb-24">
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-5 gap-10">

        {/* LEFT SIDE: Payment */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3"
        >
          <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                <Lock className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-heading">Secure Payment</h2>
                <p className="text-slate-500 text-sm">All transactions are AES-256 encrypted</p>
              </div>
            </div>

            <DummyCheckoutForm 
              amount={totalAmount} 
              hotelName={hotelName} 
              checkIn={checkIn}
              checkOut={checkOut}
              guests={guests}
            />
          </div>

          <div className="mt-4 text-center text-xs text-slate-500">
            Signed in as <span className="text-slate-900 font-medium">{user.email}</span>
          </div>
        </motion.div>

        {/* RIGHT SIDE: Booking Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-2"
        >
          <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm sticky top-28">
            <div className="mb-6">
              <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Booking Summary</p>
              <h4 className="text-xl font-bold text-slate-900 font-heading">{hotelName}</h4>
            </div>

            <div className="space-y-4">
              {/* Dates */}
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
                <div>
                  <p className="text-slate-500 text-xs mb-0.5">Dates</p>
                  {checkIn && checkOut ? (
                    <p className="text-slate-900 font-medium">
                      {format(new Date(checkIn), 'MMM d')} → {format(new Date(checkOut), 'MMM d, yyyy')}
                    </p>
                  ) : (
                    <p className="text-slate-400">Flexible dates</p>
                  )}
                </div>
              </div>

              {/* Guests */}
              <div className="flex items-center gap-3 text-sm">
                <Users className="w-4 h-4 text-indigo-600 shrink-0" />
                <div>
                  <p className="text-slate-500 text-xs mb-0.5">Guests</p>
                  <p className="text-slate-900 font-medium">{guests} Guest{guests > 1 ? 's' : ''}</p>
                </div>
              </div>

              {/* Duration */}
              <div className="flex items-center gap-3 text-sm">
                <BedDouble className="w-4 h-4 text-indigo-600 shrink-0" />
                <div>
                  <p className="text-slate-500 text-xs mb-0.5">Duration</p>
                  <p className="text-slate-900 font-medium">{nights} Night{nights > 1 ? 's' : ''}</p>
                </div>
              </div>

              <Separator className="bg-slate-200" />

              {/* Price Breakdown */}
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Room charges × {nights} night{nights > 1 ? 's' : ''}</span>
                  <span className="text-slate-900 font-medium">₹{basePrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Taxes (18% GST)</span>
                  <span className="text-slate-900 font-medium">₹{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Service fee</span>
                  <span className="text-slate-900 font-medium">₹{serviceFee.toLocaleString()}</span>
                </div>
              </div>

              <Separator className="bg-slate-200 my-4" />

              <div className="flex justify-between items-center text-xl font-bold">
                <span className="text-slate-900">Total (INR)</span>
                <span className="text-indigo-600">₹{totalAmount.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl py-2.5 px-3">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-xs text-emerald-700 font-medium">SSL Encrypted · Free Cancellation</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <CheckoutContent />
    </Suspense>
  );
}