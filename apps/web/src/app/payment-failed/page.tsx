'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { XCircle, RefreshCcw, ArrowRight, LifeBuoy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Suspense } from 'react';
import Link from 'next/link';

function PaymentFailedContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const reason = searchParams.get('reason') || 'Your payment was declined by the card issuer.';

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
            <div className="max-w-xl w-full bg-white border border-slate-200 rounded-[32px] p-8 md:p-12 shadow-sm text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-red-100">
                        <XCircle className="w-10 h-10 text-red-600" />
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 font-heading mb-4">Payment Failed</h1>
                    <p className="text-slate-600 text-base leading-relaxed max-w-md mx-auto mb-8">
                        We couldn't process your reservation. {reason} Please verify your details or try a different payment method.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col sm:flex-row gap-4 mb-8"
                >
                    <Button
                        onClick={() => router.back()}
                        className="flex-1 rounded-xl h-14 bg-slate-900 hover:bg-slate-800 text-white font-bold text-base shadow-md"
                    >
                        <RefreshCcw className="w-5 h-5 mr-2" />
                        Try Again
                    </Button>
                    <Button
                        onClick={() => router.push('/')}
                        variant="outline"
                        className="flex-1 rounded-xl h-14 border-slate-200 text-slate-900 hover:bg-slate-50 font-bold text-base"
                    >
                        Return Home
                    </Button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="pt-8 border-t border-slate-200"
                >
                    <div className="flex flex-col items-center justify-center gap-2 text-sm text-slate-500">
                        <p>Need help completing your reservation?</p>
                        <Link href="/support" className="flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                            <LifeBuoy className="w-4 h-4" />
                            Contact Support
                            <ArrowRight className="w-3 h-3 ml-1" />
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default function PaymentFailedPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>}>
            <PaymentFailedContent />
        </Suspense>
    );
}
