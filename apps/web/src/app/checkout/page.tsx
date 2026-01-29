'use client';
import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripeForm from '@/components/features/payment/StripeForm';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Lock, ShieldCheck } from 'lucide-react';

// Initialize Stripe with your Public Key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_YOUR_PUBLIC_KEY_HERE');

function CheckoutContent() {
  const searchParams = useSearchParams();

  const hotelName = searchParams.get('hotel') || 'Hotel';
  const price = parseInt(searchParams.get('price') || '0');
  const serviceFee = 299; // Platform convenience fee
  const tax = price * 0.18;
  const totalAmount = price + tax + serviceFee;

  const [clientSecret, setClientSecret] = useState("");

  // 1. On Load: Ask Backend to create a Payment Intent
  useEffect(() => {
    if (price > 0) {
      fetch("http://localhost:3001/api/payment/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalAmount }),
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret))
        .catch(console.error);
    }
  }, [totalAmount, price]);

  // Options for the Stripe UI - Matches Dark Lux AAA Theme
  const appearance = {
    theme: 'night' as const,
    variables: {
      colorPrimary: '#f59e0b', // Amber-500 for actions
      colorBackground: '#1e293b', // Slate-800 for inputs
      colorText: '#ffffff',
      fontFamily: 'Instrument Sans, ui-sans-serif, system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '12px',
    },
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* LEFT SIDE: Payment Form */}
        <div className="lg:col-span-2 bg-[#0f172a] p-8 rounded-[24px] border border-white/10 shadow-lg shadow-black/20">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-6 h-6 text-accent-gold" />
            <h2 className="text-2xl font-bold font-heading text-white">Secure Payment</h2>
          </div>

          {clientSecret ? (
            <Elements options={options} stripe={stripePromise}>
              <StripeForm amount={totalAmount} />
            </Elements>
          ) : (
            <div className="space-y-4">
              <div className="h-12 w-full bg-slate-800 animate-pulse rounded-md" />
              <div className="h-40 w-full bg-slate-800 animate-pulse rounded-md" />
            </div>
          )}
        </div>

        {/* RIGHT SIDE: Booking Summary */}
        <div className="lg:col-span-1">
          <div className="bg-[#0f172a] p-8 rounded-[24px] sticky top-32 border border-white/10 shadow-lg">
            <h3 className="font-bold text-slate-500 uppercase tracking-widest text-xs mb-6">Booking Summary</h3>

            <h4 className="text-xl font-bold text-white mb-4 font-heading">{hotelName}</h4>
            <Separator className="my-4 bg-white/10" />

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-slate-400 text-sm">
                <span>Base Price</span>
                <span className="font-medium text-white">₹{price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-sm">
                <span>Taxes (18%)</span>
                <span className="font-medium text-white">₹{tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-sm">
                <span>Service Fee</span>
                <span className="font-medium text-white">₹{serviceFee.toLocaleString()}</span>
              </div>
            </div>

            <Separator className="my-4 bg-white/10" />

            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-lg text-white">Total</span>
              <span className="text-2xl font-black text-accent-gold bg-clip-text">₹{totalAmount.toLocaleString()}</span>
            </div>

            <div className="flex justify-center items-center gap-2 text-xs text-slate-400 bg-black/20 border border-white/5 py-3 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="font-medium">SSL Encrypted Transaction</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() { return <Suspense><CheckoutContent /></Suspense>; }