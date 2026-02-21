'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, MapPin, Camera, CreditCard, CheckCircle2, ChevronRight, ChevronLeft, Upload, Star, X, Shield, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';

// Steps configuration
const steps = [
    { id: 1, title: 'Basic Info', icon: Building2 },
    { id: 2, title: 'Location', icon: MapPin },
    { id: 3, title: 'Details & Media', icon: Camera },
    { id: 4, title: 'Subscription', icon: CreditCard },
    { id: 5, title: 'Review', icon: CheckCircle2 }
];

export default function ListPropertyPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        // Step 1
        name: '',
        description: '',
        type: 'Hotel',
        price: '',
        // Step 2
        address: '',
        city: '',
        state: '',
        zipCode: '',
        // Step 3
        amenities: [] as string[],
        images: [] as string[],
        // Step 4
        subscriptionTier: 'SILVER',
    });

    const updateField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNext = () => {
        if (currentStep < steps.length) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setLoading(false);
        router.push('/owner/dashboard');
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-amber-500/30 font-sans">
            <Navbar />

            <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                {/* Header Container */}
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="inline-block px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full mb-6">
                        <span className="text-accent-gold text-sm font-bold uppercase tracking-wider">Partner with NeonStay™</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold font-heading mb-4">
                        List Your <span className="text-gradient-neo">Property</span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Join the world's most exclusive network of luxury accommodations. Reach high-net-worth travelers globally.
                    </p>
                </motion.div>

                {/* Stepper */}
                <div className="flex justify-between md:justify-center items-center mb-12 relative max-w-4xl mx-auto">
                    {/* Connecting Line */}
                    <div className="absolute left-[10%] right-[10%] top-5 h-[2px] bg-white/10 -z-10 hidden md:block">
                        <div
                            className="h-full bg-accent-gold transition-all duration-500 ease-out shadow-[0_0_15px_rgba(251,191,36,0.5)]"
                            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                        />
                    </div>

                    {steps.map((step) => (
                        <div key={step.id} className="flex flex-col items-center gap-2 bg-[#020617] px-2">
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                                currentStep >= step.id
                                    ? "bg-accent-gold border-accent-gold text-black shadow-[0_0_20px_rgba(251,191,36,0.5)]"
                                    : "bg-[#0f172a] border-white/10 text-slate-500"
                            )}>
                                <step.icon className="w-5 h-5" />
                            </div>
                            <span className={cn(
                                "text-xs font-bold uppercase tracking-wider transition-colors duration-300",
                                currentStep >= step.id ? "text-accent-gold" : "text-slate-500"
                            )}>{step.title}</span>
                        </div>
                    ))}
                </div>

                {/* Form Container */}
                <motion.div
                    className="bg-[#0f172a] border border-white/10 rounded-[32px] p-8 md:p-12 shadow-2xl relative overflow-hidden min-h-[500px]"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {/* Background Decor */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                    <AnimatePresence mode="wait">
                        {/* STEP 1: BASIC INFO */}
                        {currentStep === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6 max-w-2xl mx-auto"
                            >
                                <h2 className="text-2xl font-bold font-heading mb-6">Tell us about your property</h2>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-400">Property Name</label>
                                    <Input
                                        className="bg-black/20 border-white/10 h-12 text-white placeholder:text-slate-600 focus:border-accent-gold/50"
                                        placeholder="e.g. The Grand seaside Villa"
                                        value={formData.name}
                                        onChange={(e) => updateField('name', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-400">Description</label>
                                    <textarea
                                        className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-accent-gold/50 min-h-[150px]"
                                        placeholder="Describe the unique experience your property offers..."
                                        value={formData.description}
                                        onChange={(e) => updateField('description', e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-400">Type</label>
                                        <select
                                            className="w-full bg-black/20 border border-white/10 rounded-xl h-12 px-4 text-white focus:outline-none focus:border-accent-gold/50 transition-all"
                                            value={formData.type}
                                            onChange={(e) => updateField('type', e.target.value)}
                                        >
                                            <option value="Hotel" className="bg-[#0f172a]">Hotel</option>
                                            <option value="Resort" className="bg-[#0f172a]">Resort</option>
                                            <option value="Villa" className="bg-[#0f172a]">Villa</option>
                                            <option value="Apartment" className="bg-[#0f172a]">Apartment</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-400">Base Price (per night)</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                                            <Input
                                                className="bg-black/20 border-white/10 h-12 text-white pl-8 focus:border-accent-gold/50"
                                                placeholder="0"
                                                type="number"
                                                value={formData.price}
                                                onChange={(e) => updateField('price', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 2: LOCATION */}
                        {currentStep === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6 max-w-2xl mx-auto"
                            >
                                <h2 className="text-2xl font-bold font-heading mb-6">Where is it located?</h2>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-400">Full Address</label>
                                    <Input
                                        className="bg-black/20 border-white/10 h-12 text-white placeholder:text-slate-600 focus:border-accent-gold/50"
                                        placeholder="123 Luxury Avenue"
                                        value={formData.address}
                                        onChange={(e) => updateField('address', e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-400">City</label>
                                        <Input
                                            className="bg-black/20 border-white/10 h-12 text-white placeholder:text-slate-600 focus:border-accent-gold/50"
                                            placeholder="Goa"
                                            value={formData.city}
                                            onChange={(e) => updateField('city', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-400">State / Region</label>
                                        <Input
                                            className="bg-black/20 border-white/10 h-12 text-white placeholder:text-slate-600 focus:border-accent-gold/50"
                                            placeholder="Goa"
                                            value={formData.state}
                                            onChange={(e) => updateField('state', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-400">Zip / Postal Code</label>
                                    <Input
                                        className="bg-black/20 border-white/10 h-12 text-white placeholder:text-slate-600 focus:border-accent-gold/50 max-w-[200px]"
                                        placeholder="403001"
                                        value={formData.zipCode}
                                        onChange={(e) => updateField('zipCode', e.target.value)}
                                    />
                                </div>
                                {/* Mock Map Area */}
                                <div className="w-full h-48 bg-black/40 border border-white/10 rounded-xl flex items-center justify-center relative overflow-hidden group">
                                    <MapPin className="w-8 h-8 text-slate-500 group-hover:text-accent-gold transition-colors" />
                                    <div className="absolute inset-x-0 bottom-4 text-center text-xs text-slate-500">
                                        Map preview will appear after address is entered
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 3: DETAILS & MEDIA */}
                        {currentStep === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8 max-w-3xl mx-auto"
                            >
                                <h2 className="text-2xl font-bold font-heading mb-6">Showcase your property</h2>

                                {/* Image Upload Area */}
                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-slate-400 flex justify-between">
                                        <span>High-Quality Images</span>
                                        <span>{formData.images.length}/10</span>
                                    </label>

                                    <div className="flex gap-4">
                                        <Input
                                            placeholder="Paste Unsplash URL for demo (e.g. https://images.unsplash.com/...)"
                                            className="bg-black/20 border-white/10 text-white h-12"
                                            id="image-url-input"
                                        />
                                        <Button
                                            onClick={() => {
                                                const input = document.getElementById('image-url-input') as HTMLInputElement;
                                                if (input.value) {
                                                    updateField('images', [...formData.images, input.value]);
                                                    input.value = '';
                                                }
                                            }}
                                            className="bg-white/10 hover:bg-white/20 text-white h-12 px-6"
                                        >
                                            Add
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                        {formData.images.map((img, idx) => (
                                            <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-white/10 group">
                                                <Image src={img} alt={`Property ${idx}`} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
                                                <button
                                                    onClick={() => updateField('images', formData.images.filter((_, i) => i !== idx))}
                                                    className="absolute top-2 right-2 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-3 h-3 text-white" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-xs text-slate-500">* Add at least 3 high-quality images</p>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-slate-400">Amenities</label>
                                    <div className="flex flex-wrap gap-3">
                                        {['Pool', 'Spa', 'Wifi', 'Gym', 'Parking', 'Restaurant', 'Bar', 'Beach Access'].map(amenity => (
                                            <div
                                                key={amenity}
                                                onClick={() => {
                                                    const newAmenities = formData.amenities.includes(amenity)
                                                        ? formData.amenities.filter(a => a !== amenity)
                                                        : [...formData.amenities, amenity];
                                                    updateField('amenities', newAmenities);
                                                }}
                                                className={cn(
                                                    "px-4 py-2 rounded-full border text-sm font-medium cursor-pointer transition-all",
                                                    formData.amenities.includes(amenity)
                                                        ? "bg-accent-gold text-black border-accent-gold"
                                                        : "bg-black/20 border-white/10 text-slate-300 hover:border-white/30"
                                                )}
                                            >
                                                {amenity}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 4: SUBSCRIPTION (MONETIZATION) */}
                        {currentStep === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-bold font-heading mb-2">Choose your Partnership Tier</h2>
                                    <p className="text-slate-400">Select a plan that fits your business goals</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    {[
                                        { id: 'FREE', name: 'Standard', price: '₹0', comm: '15%', features: ['Basic Listing', 'Standard Support'] },
                                        { id: 'SILVER', name: 'Silver', price: '₹3,000', comm: '12%', features: ['Verified Badge', 'Priority Support', 'Email Reports'], popular: true },
                                        { id: 'GOLD', name: 'Gold', price: '₹8,000', comm: '10%', features: ['Featured Listing', 'Analytics Dashboard', 'Marketing Boost'] },
                                        { id: 'PLATINUM', name: 'Platinum', price: '₹15,000', comm: '8%', features: ['Top Placement', 'Dedicated Account Mgr', '0% Service Fee for Hotel'] },
                                    ].map((tier) => (
                                        <div
                                            key={tier.id}
                                            onClick={() => updateField('subscriptionTier', tier.id)}
                                            className={cn(
                                                "relative p-6 rounded-2xl border cursor-pointer transition-all duration-300",
                                                formData.subscriptionTier === tier.id
                                                    ? "bg-accent-gold/10 border-accent-gold scale-105 shadow-xl shadow-accent-gold/10"
                                                    : "bg-black/20 border-white/10 hover:border-white/30"
                                            )}
                                        >
                                            {tier.popular && (
                                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent-gold text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                                                    Most Popular
                                                </div>
                                            )}
                                            <h3 className={cn("text-lg font-bold mb-2", formData.subscriptionTier === tier.id ? "text-accent-gold" : "text-white")}>{tier.name}</h3>
                                            <div className="text-3xl font-bold text-white mb-1">{tier.price}<span className="text-sm font-normal text-slate-400">/mo</span></div>
                                            <div className="text-sm text-slate-400 mb-4">{tier.comm} Commission</div>

                                            <ul className="space-y-2">
                                                {tier.features.map(f => (
                                                    <li key={f} className="text-xs text-slate-300 flex items-center gap-2">
                                                        <CheckCircle2 className="w-3 h-3 text-emerald-500" /> {f}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 5: REVIEW */}
                        {currentStep === 5 && (
                            <motion.div
                                key="step5"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="max-w-xl mx-auto text-center"
                            >
                                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-emerald-500/10">
                                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                                </div>
                                <h2 className="text-2xl font-bold font-heading mb-4">Ready to Submit?</h2>
                                <p className="text-slate-400 mb-8">
                                    Review your details carefully. Upon submission, your property will be sent for verification (usually takes 24h).
                                </p>

                                <div className="bg-black/20 rounded-xl p-6 text-left mb-8 space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Property</span>
                                        <span className="font-bold">{formData.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Location</span>
                                        <span className="font-bold">{formData.city}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Plan</span>
                                        <span className="font-bold text-accent-gold">{formData.subscriptionTier}</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Trust Footer */}
                    <div className="mt-8 flex justify-center gap-4">
                        <div className="flex items-center gap-2 bg-black/30 border border-white/5 rounded-full px-4 py-2 trust-badge">
                            <Shield className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs text-slate-400">SSL Encrypted</span>
                        </div>
                        <div className="flex items-center gap-2 bg-black/30 border border-white/5 rounded-full px-4 py-2 trust-badge">
                            <Lock className="w-4 h-4 text-blue-400" />
                            <span className="text-xs text-slate-400">Secure Verification</span>
                        </div>
                    </div>
                </motion.div>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 max-w-6xl mx-auto">
                    <Button
                        variant="ghost"
                        onClick={handleBack}
                        disabled={currentStep === 1}
                        className="text-slate-400 hover:text-white"
                    >
                        <ChevronLeft className="w-4 h-4 mr-2" /> Back
                    </Button>

                    <Button
                        onClick={handleNext}
                        className="bg-accent-gold text-slate-900 hover:bg-amber-400 font-bold px-8 rounded-full h-12"
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : currentStep === steps.length ? 'Submit Property' : 'Continue'}
                        {!loading && currentStep !== steps.length && <ChevronRight className="w-4 h-4 ml-2" />}
                    </Button>
                </div>
            </div>
            <Footer />
        </div>
    );
}
