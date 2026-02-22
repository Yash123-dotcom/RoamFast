'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripeForm from '@/components/features/payment/StripeForm';
import { Separator } from '@/components/ui/separator';
import { Lock, ShieldCheck, LogIn, Calendar, Users, BedDouble } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_YOUR_PUBLIC_KEY_HERE');

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, signInWithGoogle, loading: authLoading } = useAuth();

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

  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [signingIn, setSigningIn] = useState(false);

  // Create payment intent — only when user is authenticated
  useEffect(() => {
    if (!user || basePrice <= 0) return;

    const createIntent = async () => {
      setLoading(true);
      try {
        const token = await user.getIdToken();
        const res = await fetch('http://localhost:3001/api/payment/create-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,   // ← Authenticated!
          },
          body: JSON.stringify({
            amount: totalAmount,
            hotelId,
            hotelName,
            checkIn,
            checkOut,
            guests,
            userId: user.uid,
            userEmail: user.email,
            userName: user.displayName,
          }),
        });
        const data = await res.json();
        if (data.clientSecret) setClientSecret(data.clientSecret);
      } catch (err) {
        console.error('Failed to create payment intent:', err);
      } finally {
        setLoading(false);
      }
    };

    createIntent();
  }, [user, totalAmount, hotelId]);

  const handleSignIn = async () => {
    setSigningIn(true);
    try {
      await signInWithGoogle();
    } finally {
      setSigningIn(false);
    }
  };

  const appearance = {
    theme: 'night' as const,
    variables: {
      colorPrimary: '#f59e0b',
      colorBackground: '#1e293b',
      colorText: '#ffffff',
      fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '12px',
    },
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-5 gap-10">

        {/* LEFT SIDE: Payment */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3"
        >
          <div className="bg-[#0f172a] p-8 rounded-[28px] border border-white/10 shadow-2xl shadow-black/20">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-accent-gold/10 rounded-xl flex items-center justify-center">
                <Lock className="w-5 h-5 text-accent-gold" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white font-heading">Secure Payment</h2>
                <p className="text-slate-400 text-sm">All transactions are AES-256 encrypted</p>
              </div>
            </div>

            {!user ? (
              /* Sign-in wall */
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LogIn className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Authentication Required</h3>
                <p className="text-slate-400 mb-6 max-w-xs mx-auto">
                  Please sign in to complete your reservation at {hotelName}.
                </p>
                <Button
                  onClick={handleSignIn}
                  disabled={signingIn}
                  className="bg-accent-gold text-black font-bold hover:bg-amber-400 px-8 h-12 rounded-xl"
                >
                  {signingIn ? 'Signing in...' : 'Continue with Google'}
                </Button>
              </div>
            ) : loading ? (
              /* Loading skeleton */
              <div className="space-y-4">
                <div className="h-12 w-full bg-slate-800 animate-pulse rounded-xl" />
                <div className="h-40 w-full bg-slate-800 animate-pulse rounded-xl" />
                <div className="h-12 w-full bg-slate-800 animate-pulse rounded-xl" />
              </div>
            ) : clientSecret ? (
              <Elements options={{ clientSecret, appearance }} stripe={stripePromise}>
                <StripeForm amount={totalAmount} />
              </Elements>
            ) : (
              <div className="text-center text-slate-400 py-8">
                <p>Failed to initialize payment. Please try again.</p>
                <Button onClick={() => router.back()} variant="ghost" className="mt-4 text-white">
                  ← Go back
                </Button>
              </div>
            )}
          </div>

          {user && (
            <div className="mt-4 text-center text-xs text-slate-500">
              Signed in as <span className="text-white font-medium">{user.email}</span>
            </div>
          )}
        </motion.div>

        {/* RIGHT SIDE: Booking Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-2"
        >
          <div className="bg-[#0f172a] rounded-[28px] border border-white/10 shadow-2xl overflow-hidden sticky top-28">
            <div className="p-6 border-b border-white/5">
              <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Booking Summary</p>
              <h4 className="text-xl font-bold text-white font-heading">{hotelName}</h4>
            </div>

            <div className="p-6 space-y-4">
              {/* Dates */}
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-accent-gold shrink-0" />
                <div>
                  <p className="text-slate-500 text-xs mb-0.5">Dates</p>
                  {checkIn && checkOut ? (
                    <p className="text-white font-medium">
                      {format(new Date(checkIn), 'MMM d')} → {format(new Date(checkOut), 'MMM d, yyyy')}
                    </p>
                  ) : (
                    <p className="text-slate-400">Flexible dates</p>
                  )}
                </div>
              </div>

              {/* Guests */}
              <div className="flex items-center gap-3 text-sm">
                <Users className="w-4 h-4 text-accent-gold shrink-0" />
                <div>
                  <p className="text-slate-500 text-xs mb-0.5">Guests</p>
                  <p className="text-white font-medium">{guests} Guest{guests > 1 ? 's' : ''}</p>
                </div>
              </div>

              {/* Duration */}
              <div className="flex items-center gap-3 text-sm">
                <BedDouble className="w-4 h-4 text-accent-gold shrink-0" />
                <div>
                  <p className="text-slate-500 text-xs mb-0.5">Duration</p>
                  <p className="text-white font-medium">{nights} Night{nights > 1 ? 's' : ''}</p>
                </div>
              </div>

              <Separator className="bg-white/5" />

              {/* Price Breakdown */}
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Room charges × {nights} night{nights > 1 ? 's' : ''}</span>
                  <span className="text-white font-medium">₹{basePrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Taxes (18% GST)</span>
                  <span className="text-white font-medium">₹{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Service fee</span>
                  <span className="text-white font-medium">₹{serviceFee.toLocaleString()}</span>
                </div>
              </div>

              <Separator className="bg-white/5" />

              <div className="flex justify-between items-center">
                <span className="font-bold text-white text-base">Total</span>
                <span className="text-2xl font-black text-accent-gold">₹{totalAmount.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-center gap-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl py-2.5 px-3">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-xs text-emerald-400 font-medium">SSL Encrypted · Free Cancellation</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
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