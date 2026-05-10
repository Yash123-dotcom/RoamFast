'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Lock, CheckCircle2, Loader2, Calendar, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Props {
    amount: number;
    hotelName: string;
    checkIn?: string | null;
    checkOut?: string | null;
    guests?: number;
}

function formatCardNumber(val: string) {
    return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(val: string) {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
}

export default function DummyCheckoutForm({ amount, hotelName, checkIn, checkOut, guests }: Props) {
    const router = useRouter();
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardName, setCardName] = useState('');
    const [processing, setProcessing] = useState(false);
    const [step, setStep] = useState<'form' | 'processing' | 'done'>('form');
    const [error, setError] = useState('');

    // Simple card detection
    const rawCard = cardNumber.replace(/\s/g, '');
    const cardBrand = rawCard.startsWith('4') ? 'Visa' :
        rawCard.startsWith('5') ? 'Mastercard' :
            rawCard.startsWith('3') ? 'Amex' : null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Basic validations
        if (rawCard.length < 16) { setError('Please enter a valid 16-digit card number.'); return; }
        if (expiry.length < 5) { setError('Please enter a valid expiry date (MM/YY).'); return; }
        if (cvv.length < 3) { setError('Please enter your 3-digit CVV.'); return; }
        if (!cardName.trim()) { setError('Please enter the name on your card.'); return; }

        // Check for obviously invalid test card (declined simulation)
        if (rawCard === '4000000000000002') {
            setError('Your card was declined. Please try a different card.');
            return;
        }

        setStep('processing');
        setProcessing(true);

        // Simulate payment processing (3 seconds)
        await new Promise(resolve => setTimeout(resolve, 3000));

        setStep('done');
        setProcessing(false);

        // Redirect to success page
        setTimeout(() => {
            router.push(
                `/payment-success?hotel=${encodeURIComponent(hotelName)}&amount=${amount}&payment_intent=dummy_${Date.now()}`
            );
        }, 800);
    };

    if (step === 'processing') {
        return (
            <div className="flex flex-col items-center justify-center py-16 gap-6">
                <div className="relative">
                    <div className="w-16 h-16 rounded-full border-2 border-indigo-500/20 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                    </div>
                    <div className="absolute inset-0 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                </div>
                <div className="text-center">
                    <h3 className="text-lg font-bold text-white mb-1">Processing Payment</h3>
                    <p className="text-slate-400 text-sm">Securing your reservation at {hotelName}...</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Lock className="w-3 h-3" />
                    <span>256-bit SSL encrypted</span>
                </div>
            </div>
        );
    }

    if (step === 'done') {
        return (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center ring-4 ring-emerald-500/20">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <p className="text-white font-bold text-lg">Payment Confirmed!</p>
                <p className="text-slate-400 text-sm">Redirecting to your booking summary...</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            {/* Card Number */}
            <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Card Number</label>
                <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        className="pl-11 h-12 rounded-xl text-slate-900 placeholder:text-slate-400 font-mono bg-white border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                        maxLength={19}
                        inputMode="numeric"
                    />
                    {cardBrand && (
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-indigo-600">
                            {cardBrand}
                        </span>
                    )}
                </div>
            </div>

            {/* Name on Card */}
            <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Name on Card</label>
                <Input
                    placeholder="John Doe"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="h-12 rounded-xl text-slate-900 placeholder:text-slate-400 bg-white border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                />
            </div>

            {/* Expiry + CVV */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Expiry Date</label>
                    <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="MM/YY"
                            value={expiry}
                            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                            className="pl-11 h-12 rounded-xl text-slate-900 placeholder:text-slate-400 font-mono bg-white border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                            maxLength={5}
                            inputMode="numeric"
                        />
                    </div>
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">CVV</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="•••"
                            type="password"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                            className="pl-11 h-12 rounded-xl text-slate-900 placeholder:text-slate-400 font-mono bg-white border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                            maxLength={4}
                            inputMode="numeric"
                        />
                    </div>
                </div>
            </div>

            {error && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl p-3">
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            )}

            <Button
                type="submit"
                disabled={processing}
                className="w-full h-13 font-bold text-base rounded-xl flex items-center justify-center gap-2 transition-all shadow-md bg-indigo-600 hover:bg-indigo-700 text-white"
                style={{ height: '52px' }}
            >
                <Lock className="w-4 h-4" />
                Pay ₹{amount.toLocaleString()}
            </Button>

            <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5"><Lock className="w-3 h-3" /> SSL Secured</span>
                <span>·</span>
                <span>Demo Mode — No real charge</span>
            </div>

            {/* Test card hint */}
            <div className="bg-indigo-500/5 border border-indigo-500/15 rounded-xl p-4">
                <p className="text-xs text-slate-500 font-semibold mb-2 uppercase tracking-wider">Test Mode</p>
                <p className="text-xs text-slate-400">Use any card number (e.g. <span className="font-mono text-indigo-400">4242 4242 4242 4242</span>), any future date, and any CVV.</p>
            </div>
        </form>
    );
}
