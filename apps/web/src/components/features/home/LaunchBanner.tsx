'use client';

import { useEffect, useState } from 'react';
import { LAUNCH_CONFIG } from '@/config/launch-city';
import { X, MapPin, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LaunchBanner() {
    const [visible, setVisible] = useState(true);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        const dismissed = localStorage.getItem('launchBannerDismissed');
        if (dismissed) {
            setVisible(false);
            setDismissed(true);
        }
    }, []);

    const handleDismiss = () => {
        localStorage.setItem('launchBannerDismissed', 'true');
        setVisible(false);
    };

    if (!LAUNCH_CONFIG.features.showLaunchBanner || !visible) {
        return null;
    }

    const progress = Math.min(100, (LAUNCH_CONFIG.currentProperties / LAUNCH_CONFIG.targetProperties) * 100);

    return (
        <div className="fixed top-20 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
            <div className="pointer-events-auto bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 backdrop-blur-xl rounded-2xl p-4 max-w-2xl w-full shadow-2xl">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-5 h-5 text-amber-400" />
                            <h3 className="font-bold text-white text-lg">Now Launching in {LAUNCH_CONFIG.primaryCity}</h3>
                        </div>
                        <p className="text-sm text-slate-300 mb-3">
                            {LAUNCH_CONFIG.currentProperties} verified luxury stays curated for discerning travelers.
                            More cities coming soon.
                        </p>

                        {LAUNCH_CONFIG.features.showProgressIndicator && (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs text-slate-400">
                                    <span>Progress to Launch Goal</span>
                                    <span className="font-bold text-amber-400">{LAUNCH_CONFIG.currentProperties}/{LAUNCH_CONFIG.targetProperties} properties</span>
                                </div>
                                <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500 rounded-full"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <Button
                        onClick={handleDismiss}
                        variant="ghost"
                        size="icon"
                        className="shrink-0 text-slate-400 hover:text-white hover:bg-white/10 rounded-full"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
