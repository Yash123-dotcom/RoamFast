'use client';

import { Star, Briefcase, Heart, Home, User, Users, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReviewCardProps {
    review: {
        id: string;
        overallRating: number;
        cleanliness: number;
        sleepQuality: number;
        staffExperience: number;
        luxuryValue: number;
        travelerType: string;
        comment?: string;
        verified: boolean;
        createdAt: string;
        user: {
            name: string;
            image?: string;
        };
    };
}

const TRAVELER_ICONS: Record<string, any> = {
    Business: Briefcase,
    Couples: Heart,
    LongStay: Home,
    Solo: User,
    Family: Users,
};

export default function ReviewCard({ review }: ReviewCardProps) {
    const TravelerIcon = TRAVELER_ICONS[review.travelerType] || User;

    const CategoryRating = ({ label, value }: { label: string; value: number }) => (
        <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-500 uppercase tracking-wide">{label}</span>
            <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={cn(
                            "w-3 h-3",
                            i < value ? "fill-amber-400 text-amber-400" : "text-slate-700"
                        )}
                    />
                ))}
            </div>
        </div>
    );

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg">
                        {review.user.name?.[0] || 'G'}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <p className="font-bold text-white">{review.user.name}</p>
                            {review.verified && (
                                <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
                                    <CheckCircle className="w-3 h-3 text-emerald-500" />
                                    <span className="text-xs font-medium text-emerald-500">Verified Stay</span>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1 px-2 py-0.5 bg-white/5 rounded-full border border-white/10">
                                <TravelerIcon className="w-3 h-3 text-slate-400" />
                                <span className="text-xs text-slate-400">{review.travelerType}</span>
                            </div>
                            <span className="text-xs text-slate-500">
                                {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Overall Rating */}
                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                        <span className="text-xl font-bold text-white">{review.overallRating}.0</span>
                    </div>
                    <p className="text-xs text-slate-500">Overall</p>
                </div>
            </div>

            {/* Category Ratings */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/10">
                <CategoryRating label="Cleanliness" value={review.cleanliness} />
                <CategoryRating label="Sleep" value={review.sleepQuality} />
                <CategoryRating label="Staff" value={review.staffExperience} />
                <CategoryRating label="Value" value={review.luxuryValue} />
            </div>

            {/* Written Review */}
            {review.comment && (
                <div className="pt-4 border-t border-white/10">
                    <p className="text-slate-300 leading-relaxed">{review.comment}</p>
                </div>
            )}
        </div>
    );
}
