import { ShieldCheck, Award, Eye, Clock, CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function TrustPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />

            <div className="max-w-4xl mx-auto px-6 py-32">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-2 mb-6">
                        <ShieldCheck className="w-5 h-5 text-amber-400" />
                        <span className="text-sm font-bold text-amber-400 uppercase tracking-wide">Trust & Safety</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold font-heading mb-6 text-gradient-neo">
                        Every Stay, Personally Vetted
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        We don't just list properties—we curate them. Every hotel on RoamFast is manually reviewed to ensure it meets our rigorous standards.
                    </p>
                </div>

                {/* Trust Pillars */}
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                        <Eye className="w-12 h-12 text-amber-400 mb-4" />
                        <h3 className="text-2xl font-bold mb-3">Manual Review Process</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Our team personally inspects property photos, reviews ownership documentation, and verifies amenities before approval.
                        </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                        <Clock className="w-12 h-12 text-amber-400 mb-4" />
                        <h3 className="text-2xl font-bold mb-3">48-Hour Verification</h3>
                        <p className="text-slate-400 leading-relaxed">
                            All applications are reviewed within 48 hours. Only 30% of applicants meet our quality standards.
                        </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                        <Award className="w-12 h-12 text-amber-400 mb-4" />
                        <h3 className="text-2xl font-bold mb-3">Quality Score System</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Every property receives a RoamFast Quality Score (0-100) based on cleanliness, service, amenities, and guest feedback.
                        </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                        <CheckCircle2 className="w-12 h-12 text-amber-400 mb-4" />
                        <h3 className="text-2xl font-bold mb-3">Ongoing Monitoring</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Properties are continuously monitored. Poor ratings or service issues result in listing suspension or removal.
                        </p>
                    </div>
                </div>

                {/* Vetting Criteria */}
                <div className="bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 rounded-3xl p-10 mb-16">
                    <h2 className="text-3xl font-bold font-heading mb-8 text-center">Our Vetting Criteria</h2>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0 mt-1">
                                <span className="text-amber-400 font-bold">1</span>
                            </div>
                            <div>
                                <h4 className="text-lg font-bold mb-2">Visual Inspection</h4>
                                <p className="text-slate-400">Professional photography, accurate representations, and authentic property images.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0 mt-1">
                                <span className="text-amber-400 font-bold">2</span>
                            </div>
                            <div>
                                <h4 className="text-lg font-bold mb-2">Ownership Verification</h4>
                                <p className="text-slate-400">Legal ownership documents, business registration, and authorization to operate.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0 mt-1">
                                <span className="text-amber-400 font-bold">3</span>
                            </div>
                            <div>
                                <h4 className="text-lg font-bold mb-2">Amenity Confirmation</h4>
                                <p className="text-slate-400">Cross-checking listed amenities with property capabilities and guest feedback.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0 mt-1">
                                <span className="text-amber-400 font-bold">4</span>
                            </div>
                            <div>
                                <h4 className="text-lg font-bold mb-2">Service Standards</h4>
                                <p className="text-slate-400">Minimum service requirements: 24/7 support, professional staff, and responsive management.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0 mt-1">
                                <span className="text-amber-400 font-bold">5</span>
                            </div>
                            <div>
                                <h4 className="text-lg font-bold mb-2">Guest Safety</h4>
                                <p className="text-slate-400">Fire safety systems, secure entry, emergency procedures, and insurance coverage.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RoamFast Verified Badge */}
                <div className="text-center bg-white/5 border border-white/10 rounded-3xl p-10">
                    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500/20 to-yellow-600/20 border border-amber-500/30 rounded-full px-6 py-3 mb-6">
                        <ShieldCheck className="w-6 h-6 text-amber-400" />
                        <span className="text-lg font-bold text-amber-400 uppercase tracking-wide">RoamFast Verified</span>
                    </div>
                    <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
                        Look for the <span className="text-amber-400 font-bold">Verified</span> badge when browsing properties.
                        It's your guarantee that the stay has been personally inspected and approved by the RoamFast team.
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    );
}
