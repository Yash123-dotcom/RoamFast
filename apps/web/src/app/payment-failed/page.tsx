'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { XCircle, RefreshCcw, ArrowLeft, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

function PaymentFailedContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const errorMessage = searchParams.get('error') || 'Payment could not be processed';
    const hotelName = searchParams.get('hotel') || 'Hotel';
    const amount = searchParams.get('amount') || '0';

    const handleRetry = () => {
        // Go back to checkout with same parameters
        const params = new URLSearchParams(searchParams);
        router.push(`/checkout?${params.toString()}`);
    };

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
                    <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-8 ring-4 ring-red-500/30">
                        <XCircle className="w-12 h-12 text-red-500" />
                    </div>

                    <h1 className="text-5xl font-bold mb-4 font-heading">Payment Failed</h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        We couldn't process your payment. Don't worry, you haven't been charged.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-[#0f172a] rounded-[32px] p-8 md:p-12 border border-white/10 shadow-2xl mb-8"
                >
                    <div className="mb-8">
                        <p className="text-sm text-slate-500 uppercase tracking-wider mb-2">Error Details</p>
                        <p className="text-lg text-red-400">{errorMessage}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pb-8 border-b border-white/10">
                        <div>
                            <p className="text-sm text-slate-500 mb-1">Property</p>
                            <p className="text-xl font-bold text-white">{hotelName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 mb-1">Amount</p>
                            <p className="text-xl font-bold text-white">₹{parseInt(amount).toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
                        <div className="flex items-start gap-4">
                            <HelpCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-lg font-bold text-white mb-2">Common Solutions</h3>
                                <ul className="text-slate-400 space-y-2 text-sm">
                                    <li>• Check if your card has sufficient balance</li>
                                    <li>• Verify your card details are correct</li>
                                    <li>• Try a different payment method</li>
                                    <li>• Contact your bank if the issue persists</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                    <Button
                        onClick={handleRetry}
                        className="bg-accent-gold text-black hover:bg-amber-400 h-14 rounded-full font-bold"
                    >
                        <RefreshCcw className="w-4 h-4 mr-2" />
                        Try Again
                    </Button>
                    <Button
                        onClick={() => router.push('/search')}
                        variant="outline"
                        className="border-white/10 text-white hover:bg-white hover:text-black h-14 rounded-full font-bold"
                    >
                        Browse Other Properties
                    </Button>
                    <Button
                        onClick={() => router.push('/')}
                        variant="ghost"
                        className="text-slate-400 hover:text-white h-14 rounded-full"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Button>
                </motion.div>
            </div>
        </div>
    );
}

export default function PaymentFailedPage() {
    return (
        <Suspense>
            <PaymentFailedContent />
        </Suspense>
    );
}
