'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import Image from 'next/image';

interface TestimonialCardProps {
    name: string;
    role: string;
    hotel: string;
    image: string;
    rating: number;
    testimonial: string;
    stats?: {
        label: string;
        value: string;
    };
}

export default function TestimonialCard({
    name,
    role,
    hotel,
    image,
    rating,
    testimonial,
    stats
}: TestimonialCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            className="bg-[#0f172a] border border-white/10 rounded-[24px] p-8 shadow-xl relative overflow-hidden group card-premium"
        >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Quote Icon */}
            <Quote className="absolute top-6 right-6 w-12 h-12 text-amber-500/10 group-hover:text-amber-500/20 transition-colors" />

            <div className="relative z-10">
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={`w-4 h-4 ${i < rating
                                ? 'fill-amber-500 text-amber-500'
                                : 'text-slate-600'
                                }`}
                        />
                    ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-slate-300 text-base leading-relaxed mb-6">
                    "{testimonial}"
                </p>

                {/* Stats (if provided) */}
                {stats && (
                    <div className="bg-black/30 rounded-xl p-4 mb-6 border border-white/5">
                        <div className="text-xs text-slate-400 mb-1">{stats.label}</div>
                        <div className="text-2xl font-bold text-accent-gold">{stats.value}</div>
                    </div>
                )}

                {/* Author Info */}
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 p-[2px]">
                            <div className="w-full h-full rounded-full bg-[#0f172a] flex items-center justify-center overflow-hidden">
                                <Image
                                    src={image}
                                    alt={name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                        {/* Verified Badge */}
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-[#0f172a] flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    <div>
                        <div className="font-bold text-white">{name}</div>
                        <div className="text-sm text-slate-400">{role}</div>
                        <div className="text-xs text-slate-500">{hotel}</div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
