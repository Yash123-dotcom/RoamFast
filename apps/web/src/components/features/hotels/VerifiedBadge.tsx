'use client';

import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VerifiedBadgeProps {
    className?: string;
    showTooltip?: boolean;
}

export default function VerifiedBadge({ className, showTooltip = true }: VerifiedBadgeProps) {
    return (
        <div className={cn("inline-flex items-center gap-1.5 group relative", className)}>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-500/20 to-yellow-600/20 border border-amber-500/30 rounded-full">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-amber-400 tracking-wide">VERIFIED</span>
            </div>

            {showTooltip && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-4 py-2 bg-slate-900 border border-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-64 z-50">
                    <p className="text-xs text-white font-medium mb-1">RoamFast Verified</p>
                    <p className="text-xs text-slate-400">
                        This property has been personally reviewed and approved by our team for quality, cleanliness, and exceptional service.
                    </p>
                </div>
            )}
        </div>
    );
}
