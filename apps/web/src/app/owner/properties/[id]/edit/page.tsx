'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, MapPin, Camera, CheckCircle2, ChevronRight, ChevronLeft, Upload, Loader2, ArrowLeft } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

// Steps configuration (Removed Subscription step for editing)
const steps = [
    { id: 1, title: 'Basic Info', icon: Building2 },
    { id: 2, title: 'Location', icon: MapPin },
    { id: 3, title: 'Details & Media', icon: Camera },
    { id: 4, title: 'Review', icon: CheckCircle2 },
];

export default function EditPropertyPage() {
    const router = useRouter();
    const params = useParams();
    const { user, loading: authLoading, getIdToken } = useAuth();

    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: 'Hotel',
        price: '',
        address: '',
        city: '',
        images: [] as string[],
        amenities: [] as string[],
    });

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push('/login');
                return;
            }
            if (params.id) {
                fetchHotelDetails(params.id as string);
            }
        }
    }, [user, authLoading, params.id]);

    const fetchHotelDetails = async (id: string) => {
        try {
            const res = await fetch(`http://localhost:3001/api/v1/hotels/${id}`); // Assumes public read is allowed, or add auth if needed. 
            // Usually reading specific hotel details might be public? But editing requires auth.
            // If the endpoint is protected/owner-specific, we need token.
            // Let's assume public read for now, but PUT is protected.
            if (res.ok) {
                const data = await res.json();
                setFormData({
                    name: data.name,
                    description: data.description,
                    type: 'Hotel', // Would come from DB realistically
                    price: data.price.toString(),
                    address: data.address,
                    city: data.city,
                    images: data.images || ['https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1974'],
                    amenities: data.amenities || [],
                });
            }
        } catch (error) {
            console.error('Failed to fetch hotel:', error);
        } finally {
            setFetching(false);
        }
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
        try {
            const token = await getIdToken();
            const res = await fetch(`http://localhost:3001/api/v1/hotels/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    address: formData.address,
                    city: formData.city,
                    price: parseInt(formData.price),
                    images: formData.images,
                    amenities: formData.amenities,
                }),
            });

            if (!res.ok) throw new Error('Failed to update hotel');

            router.push('/owner/dashboard?updated=true');
        } catch (error) {
            console.error(error);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const updateField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    if (authLoading || fetching) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white">
                <Loader2 className="w-8 h-8 animate-spin text-accent-gold" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-accent-gold/30">
            <Navbar />

            <div className="max-w-6xl mx-auto px-6 pt-32 pb-20">
                {/* Header */}
                <div className="mb-12 flex items-center gap-4">
                    <Button variant="ghost" className="text-slate-400 hover:text-white rounded-full" onClick={() => router.back()}>
                        <ArrowLeft className="w-5 h-5 mr-2" /> Back
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold font-heading text-white">Edit Property</h1>
                        <p className="text-slate-400">Update details for {formData.name}</p>
                    </div>
                </div>

                {/* Progress Steps */}
                <div className="flex justify-between items-center max-w-3xl mx-auto mb-16 relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -z-10 rounded-full" />
                    <div
                        className="absolute top-1/2 left-0 h-1 bg-accent-gold -z-10 rounded-full transition-all duration-500"
                        style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                    />

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
                <div className="bg-[#0f172a] border border-white/10 rounded-[32px] p-8 md:p-12 shadow-2xl relative overflow-hidden min-h-[500px]">
                    {/* Background Decor */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

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
                                <h2 className="text-2xl font-bold font-heading mb-6">Basic Information</h2>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-400">Property Name</label>
                                    <Input
                                        className="bg-black/20 border-white/10 h-12 text-white placeholder:text-slate-600 focus:border-accent-gold/50"
                                        value={formData.name}
                                        onChange={(e) => updateField('name', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-400">Description</label>
                                    <textarea
                                        className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-accent-gold/50 min-h-[150px]"
                                        value={formData.description}
                                        onChange={(e) => updateField('description', e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-400">Type</label>
                                        <select
                                            className="w-full bg-black/20 border border-white/10 rounded-xl h-12 px-4 text-white focus:outline-none focus:border-accent-gold/50"
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
                                <h2 className="text-2xl font-bold font-heading mb-6">Location Details</h2>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-400">Full Address</label>
                                    <Input
                                        className="bg-black/20 border-white/10 h-12 text-white focus:border-accent-gold/50"
                                        value={formData.address}
                                        onChange={(e) => updateField('address', e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-400">City</label>
                                        <Input
                                            className="bg-black/20 border-white/10 h-12 text-white focus:border-accent-gold/50"
                                            value={formData.city}
                                            onChange={(e) => updateField('city', e.target.value)}
                                        />
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
                                className="space-y-6 max-w-2xl mx-auto"
                            >
                                <h2 className="text-2xl font-bold font-heading mb-6">Amenities & Media</h2>

                                <div className="border-2 border-dashed border-white/10 rounded-2xl p-12 text-center hover:border-accent-gold/30 hover:bg-accent-gold/5 transition-all cursor-pointer group">
                                    <Upload className="w-12 h-12 text-slate-500 mx-auto mb-4 group-hover:text-accent-gold transition-colors" />
                                    <h3 className="text-lg font-bold text-white mb-2">Manage Images</h3>
                                    <p className="text-slate-400 text-sm">Upload new photos (Mock)</p>
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
                                                        : "bg-black/20 border-white/10 text-slate-400 hover:border-white/30"
                                                )}
                                            >
                                                {amenity}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 5: REVIEW (Step 4 in this array) */}
                        {currentStep === 4 && (
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
                                <h2 className="text-2xl font-bold font-heading mb-4">Confirm Changes?</h2>
                                <p className="text-slate-400 mb-8">
                                    Updates will be reflected immediately on your listing page.
                                </p>

                                <div className="bg-black/20 rounded-xl p-6 text-left mb-8 space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Property</span>
                                        <span className="font-bold">{formData.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Price</span>
                                        <span className="font-bold">₹{formData.price}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Location</span>
                                        <span className="font-bold">{formData.city}</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

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
                        {loading ? 'Saving...' : currentStep === steps.length ? 'Save Changes' : 'Continue'}
                        {!loading && currentStep !== steps.length && <ChevronRight className="w-4 h-4 ml-2" />}
                    </Button>
                </div>
            </div>
            <Footer />
        </div>
    );
}
