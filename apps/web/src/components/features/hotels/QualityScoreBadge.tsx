'use client';

import { cn } from '@/lib/utils';
import { Award, TrendingUp } from 'lucide-react';

interface QualityScoreBadgeProps {
    score: number;
    breakdown?: {
        cleanliness: number;
        service: number;
        amenities: number;
        feedback: number;
        responsiveness: number;
    };
    className?: string;
    showBreakdown?: boolean;
}

export default function QualityScoreBadge({
    score,
    breakdown,
    className,
    showBreakdown = true
}: QualityScoreBadgeProps) {

    const getTier = (score: number): { name: string; color: string; bgColor: string } => {
        if (score >= 90) return { name: 'Gold', color: 'text-amber-400', bgColor: 'bg-amber-500/20' };
        if (score >= 75) return { name: 'Silver', color: 'text-slate-300', bgColor: 'bg-slate-500/20' };
        return { name: 'Bronze', color: 'text-orange-400', bgColor: 'bg-orange-500/20' };
    };

    const tier = getTier(score);

    return (
        <div className={cn("group relative inline-block", className)}>
            <div className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full border transition-all",
                tier.bgColor,
                score >= 90 ? "border-amber-500/40" : score >= 75 ? "border-slate-400/40" : "border-orange-500/40"
            )}>
                <Award className={cn("w-5 h-5", tier.color)} />
                <div>
                    <div className="flex items-baseline gap-2">
                        <span className={cn("text-2xl font-bold", tier.color)}>{score}</span>
                        <span className="text-xs text-slate-400">/100</span>
                    </div>
                    <p className={cn("text-xs font-medium uppercase tracking-wide", tier.color)}>
                        {tier.name} Tier
                    </p>
                </div>
            </div>

            {/* Tooltip with breakdown */}
            {showBreakdown && breakdown && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-5 py-4 bg-slate-900 border border-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-72 z-50 shadow-2xl">
                    <p className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-amber-400" />
                        Quality Score Breakdown
                    </p>
                    <div className="space-y-2">
                        {Object.entries(breakdown).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between text-xs">
                                <span className="text-slate-400 capitalize">{key}</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className={cn(
                                                "h-full rounded-full transition-all",
                                                value >= 90 ? "bg-emerald-500" : value >= 70 ? "bg-amber-500" : "bg-red-500"
                                            )}
                                            style={{ width: `${value}%` }}
                                        />
                                    </div>
                                    <span className="text-white font-bold w-8 text-right">{value}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-slate-500 mt-3 pt-3 border-t border-white/10">
                        Updated regularly based on guest feedback and property standards
                    </p>
                </div>
            )}
        </div>
    );
}
