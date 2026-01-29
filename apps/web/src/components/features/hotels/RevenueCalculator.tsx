'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Users, Calendar } from 'lucide-react';
import AnimatedCounter from '@/components/ui/AnimatedCounter';

export default function RevenueCalculator() {
    const [rooms, setRooms] = useState(20);
    const [occupancy, setOccupancy] = useState(70);
    const [avgPrice, setAvgPrice] = useState(8000);

    // Calculations
    const monthlyBookings = Math.round((rooms * 30 * occupancy) / 100);
    const monthlyRevenue = monthlyBookings * avgPrice;
    const platformFee = monthlyRevenue * 0.12; // 12% commission (SILVER tier)
    const netRevenue = monthlyRevenue - platformFee;
    const yearlyRevenue = netRevenue * 12;

    return (
        <div className="bg-[#0f172a] border border-white/10 rounded-[32px] p-8 md:p-12 shadow-2xl relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
                <h3 className="text-3xl font-bold font-heading mb-2 text-white">Revenue Calculator</h3>
                <p className="text-slate-400 mb-8">See your potential earnings with NeonStay</p>

                {/* Input Sliders */}
                <div className="space-y-6 mb-10">
                    {/* Rooms */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-bold text-slate-300">Number of Rooms</label>
                            <span className="text-accent-gold font-bold">{rooms}</span>
                        </div>
                        <input
                            type="range"
                            min="5"
                            max="200"
                            value={rooms}
                            onChange={(e) => setRooms(Number(e.target.value))}
                            className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-gold [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
                        />
                    </div>

                    {/* Occupancy */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-bold text-slate-300">Average Occupancy Rate</label>
                            <span className="text-accent-gold font-bold">{occupancy}%</span>
                        </div>
                        <input
                            type="range"
                            min="30"
                            max="100"
                            value={occupancy}
                            onChange={(e) => setOccupancy(Number(e.target.value))}
                            className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-gold [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
                        />
                    </div>

                    {/* Average Price */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-bold text-slate-300">Average Room Rate (₹/night)</label>
                            <span className="text-accent-gold font-bold">₹{avgPrice.toLocaleString()}</span>
                        </div>
                        <input
                            type="range"
                            min="2000"
                            max="25000"
                            step="500"
                            value={avgPrice}
                            onChange={(e) => setAvgPrice(Number(e.target.value))}
                            className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-gold [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
                        />
                    </div>
                </div>

                {/* Results Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <motion.div
                        className="bg-black/30 rounded-2xl p-4 border border-white/5"
                        whileHover={{ scale: 1.05 }}
                    >
                        <Calendar className="w-6 h-6 text-blue-400 mb-2" />
                        <div className="text-xs text-slate-400 mb-1">Monthly Bookings</div>
                        <div className="text-2xl font-bold text-white">
                            <AnimatedCounter value={monthlyBookings} />
                        </div>
                    </motion.div>

                    <motion.div
                        className="bg-black/30 rounded-2xl p-4 border border-white/5"
                        whileHover={{ scale: 1.05 }}
                    >
                        <DollarSign className="w-6 h-6 text-green-400 mb-2" />
                        <div className="text-xs text-slate-400 mb-1">Gross Revenue</div>
                        <div className="text-2xl font-bold text-white">
                            ₹<AnimatedCounter value={Math.round(monthlyRevenue / 1000)} />k
                        </div>
                    </motion.div>

                    <motion.div
                        className="bg-black/30 rounded-2xl p-4 border border-white/5"
                        whileHover={{ scale: 1.05 }}
                    >
                        <TrendingUp className="w-6 h-6 text-amber-400 mb-2" />
                        <div className="text-xs text-slate-400 mb-1">Net Monthly</div>
                        <div className="text-2xl font-bold text-accent-gold">
                            ₹<AnimatedCounter value={Math.round(netRevenue / 1000)} />k
                        </div>
                    </motion.div>

                    <motion.div
                        className="bg-black/30 rounded-2xl p-4 border border-white/5"
                        whileHover={{ scale: 1.05 }}
                    >
                        <Users className="w-6 h-6 text-purple-400 mb-2" />
                        <div className="text-xs text-slate-400 mb-1">Yearly Potential</div>
                        <div className="text-2xl font-bold text-white">
                            ₹<AnimatedCounter value={Math.round(yearlyRevenue / 100000)} decimals={1} />L
                        </div>
                    </motion.div>
                </div>

                {/* Disclaimer */}
                <p className="text-xs text-slate-500 text-center">
                    * Estimates based on Silver Tier (12% commission). Upgrade to Gold or Platinum for lower rates.
                </p>
            </div>
        </div>
    );
}
