'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AIConcierge from '@/components/shared/AIConcierge';

export default function ConciergePage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-amber-500/30 font-sans">
            <Navbar />

            <section className="pt-32 pb-12">
                <div className="max-w-7xl mx-auto px-6 text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-bold font-heading mb-6">
                        Your Personal <span className="text-gradient-neo">Travel Expert</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Whether you need a late checkout, a private chef, or a hidden gem recommendation,
                        our intelligent concierge is here 24/7.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto px-6">
                    <AIConcierge />
                </div>
            </section>

            <Footer />
        </div>
    );
}
