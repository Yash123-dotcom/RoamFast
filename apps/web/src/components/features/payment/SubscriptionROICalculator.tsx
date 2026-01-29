'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Star, Users } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

const SUBSCRIPTION_PRICING = {
    FREE: { monthly: 0, commission: 15 },
    SILVER: { monthly: 3000, commission: 12 },
    GOLD: { monthly: 8000, commission: 10 },
    PLATINUM: { monthly: 15000, commission: 8 },
};

interface ROICalculatorProps {
    currentTier?: keyof typeof SUBSCRIPTION_PRICING;
}

export default function SubscriptionROICalculator({ currentTier = 'FREE' }: ROICalculatorProps) {
    const [monthlyBookings, setMonthlyBookings] = useState([10]);
    const [avgBookingValue, setAvgBookingValue] = useState([25000]);
    const [selectedTier, setSelectedTier] = useState<keyof typeof SUBSCRIPTION_PRICING>(currentTier);

    const calculateROI = (tier: keyof typeof SUBSCRIPTION_PRICING) => {
        const bookings = monthlyBookings[0];
        const avgValue = avgBookingValue[0];
        const monthlyRevenue = bookings * avgValue;

        const tierData = SUBSCRIPTION_PRICING[tier];
        const commissionPaid = (monthlyRevenue * tierData.commission) / 100;
        const subscriptionCost = tierData.monthly;
        const totalCost = commissionPaid + subscriptionCost;

        // Compare to FREE tier
        const freeCommission = (monthlyRevenue * SUBSCRIPTION_PRICING.FREE.commission) / 100;
        const savings = freeCommission - totalCost;
        const breakEvenBookings = Math.ceil(subscriptionCost / ((avgValue * (SUBSCRIPTION_PRICING.FREE.commission - tierData.commission)) / 100));

        return {
            monthlyRevenue,
            commissionPaid,
            subscriptionCost,
            totalCost,
            savings: savings > 0 ? savings : 0,
            savingsPercent: savings > 0 ? (savings / freeCommission) * 100 : 0,
            breakEvenBookings,
            roi: savings > 0 ? ((savings * 12) / (subscriptionCost * 12)) * 100 : 0,
        };
    };

    const results = calculateROI(selectedTier);

    return (
        <div className="bg-[#0f172a] border border-white/10 rounded-3xl p-8 space-y-8">
            <div>
                <h3 className="text-2xl font-bold text-white mb-2 font-heading flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-amber-400" />
                    ROI Calculator
                </h3>
                <p className="text-slate-400">Calculate your potential savings with premium tiers</p>
            </div>

            {/* Inputs */}
            <div className="space-y-6">
                <div className="space-y-3">
                    <Label className="text-sm font-medium text-slate-300">
                        Monthly Bookings: <span className="text-white font-bold">{monthlyBookings[0]}</span>
                    </Label>
                    <Slider
                        value={monthlyBookings}
                        onValueChange={setMonthlyBookings}
                        min={1}
                        max={100}
                        step={1}
                        className="cursor-pointer"
                    />
                </div>

                <div className="space-y-3">
                    <Label className="text-sm font-medium text-slate-300">
                        Average Booking Value: <span className="text-white font-bold">₹{avgBookingValue[0].toLocaleString()}</span>
                    </Label>
                    <Slider
                        value={avgBookingValue}
                        onValueChange={setAvgBookingValue}
                        min={5000}
                        max={100000}
                        step={5000}
                        className="cursor-pointer"
                    />
                </div>
            </div>

            {/* Tier Selector */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(Object.keys(SUBSCRIPTION_PRICING) as Array<keyof typeof SUBSCRIPTION_PRICING>).map((tier) => (
                    <button
                        key={tier}
                        onClick={() => setSelectedTier(tier)}
                        className={`p-4 rounded-xl border-2 transition-all ${selectedTier === tier
                                ? 'border-amber-500 bg-amber-500/10'
                                : 'border-white/10 bg-white/5 hover:border-white/20'
                            }`}
                    >
                        <div className={`text-xs font-bold uppercase tracking-wide mb-1 ${selectedTier === tier ? 'text-amber-400' : 'text-slate-400'
                            }`}>
                            {tier}
                        </div>
                        <div className={`text-sm font-bold ${selectedTier === tier ? 'text-white' : 'text-slate-300'
                            }`}>
                            {tier === 'FREE' ? 'Free' : `₹${SUBSCRIPTION_PRICING[tier].monthly.toLocaleString()}/mo`}
                        </div>
                    </button>
                ))}
            </div>

            {/* Results */}
            <div className="pt-6 border-t border-white/10 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/20 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-1">
                            <DollarSign className="w-4 h-4 text-emerald-500" />
                            <span className="text-xs text-slate-400">Monthly Revenue</span>
                        </div>
                        <p className="text-xl font-bold text-white">₹{results.monthlyRevenue.toLocaleString()}</p>
                    </div>

                    <div className="bg-black/20 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-1">
                            <Users className="w-4 h-4 text-blue-500" />
                            <span className="text-xs text-slate-400">Commission Rate</span>
                        </div>
                        <p className="text-xl font-bold text-white">{SUBSCRIPTION_PRICING[selectedTier].commission}%</p>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <p className="text-sm text-slate-400 mb-1">Monthly Savings vs FREE</p>
                            <p className="text-3xl font-bold text-emerald-400">₹{results.savings.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-slate-400 mb-1">Annual ROI</p>
                            <p className="text-2xl font-bold text-white">{results.roi.toFixed(0)}%</p>
                        </div>
                    </div>

                    {selectedTier !== 'FREE' && (
                        <div className="pt-4 border-t border-emerald-500/20">
                            <p className="text-xs text-slate-400">
                                Break-even at <span className="text-white font-bold">{results.breakEvenBookings} bookings/month</span> •
                                Current: <span className="text-emerald-400 font-bold">{monthlyBookings[0]} bookings</span>
                            </p>
                        </div>
                    )}
                </div>

                {selectedTier !== 'FREE' && results.savings > 0 && (
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                        <p className="text-sm text-amber-400 font-medium">
                            💡 You'd save ₹{(results.savings * 12).toLocaleString()} annually with {selectedTier} tier!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
