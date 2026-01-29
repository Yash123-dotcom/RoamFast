'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, TrendingUp, Building, ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AdminRevenuePage() {
    const [loading, setLoading] = useState(true);
    const [analytics, setAnalytics] = useState<any>(null);

    useEffect(() => {
        fetchRevenueData();
    }, []);

    const fetchRevenueData = async () => {
        try {
            const res = await fetch('http://localhost:3001/api/v1/admin/revenue');
            if (res.ok) {
                const data = await res.json();
                setAnalytics(data);
            }
        } catch (error) {
            console.error('Failed to fetch revenue data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white">Loading Revenue Analytics...</div>;
    }

    const pendingPayouts = analytics?.payoutsByStatus?.find((p: any) => p.status === 'PENDING');
    const paidPayouts = analytics?.payoutsByStatus?.find((p: any) => p.status === 'PAID');
    const failedPayouts = analytics?.payoutsByStatus?.find((p: any) => p.status === 'FAILED');

    return (
        <div className="min-h-screen bg-[#020617] text-white">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold font-heading mb-2">Revenue Analytics</h1>
                        <p className="text-slate-400">Comprehensive platform revenue insights and transaction history.</p>
                    </div>
                    <Link href="/admin/dashboard">
                        <Badge variant="outline" className="border-white/20 text-slate-300 hover:bg-white/5 cursor-pointer">
                            ← Back to Dashboard
                        </Badge>
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <Card className="bg-[#0f172a] border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-400">Total Revenue</CardTitle>
                            <DollarSign className="w-4 h-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">₹{analytics?.totalRevenue?.toLocaleString() || '0'}</div>
                            <p className="text-xs text-slate-500 mt-1 flex items-center">
                                <ArrowUpRight className="w-3 h-3 text-emerald-500 mr-1" /> All-time earnings
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#0f172a] border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-400">Monthly Revenue</CardTitle>
                            <TrendingUp className="w-4 h-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">₹{analytics?.monthlyRevenue?.toLocaleString() || '0'}</div>
                            <p className="text-xs text-slate-500 mt-1">Current month</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#0f172a] border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-400">Commissions</CardTitle>
                            <Building className="w-4 h-4 text-accent-gold" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">₹{analytics?.totalCommissions?.toLocaleString() || '0'}</div>
                            <p className="text-xs text-slate-500 mt-1">{analytics?.transactionCount || 0} transactions</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#0f172a] border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-400">Platform Fees</CardTitle>
                            <DollarSign className="w-4 h-4 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">₹{analytics?.totalPlatformFees?.toLocaleString() || '0'}</div>
                            <p className="text-xs text-slate-500 mt-1">Service charges</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Breakdown Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                    <Card className="bg-[#0f172a] border-white/10">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Clock className="w-5 h-5 text-amber-500" />
                                Pending Payouts
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-amber-500">
                                ₹{((pendingPayouts?._sum?.commissionAmount || 0) + (pendingPayouts?._sum?.platformFee || 0)).toLocaleString()}
                            </div>
                            <p className="text-slate-400 text-sm mt-2">{pendingPayouts?._count || 0} transactions</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#0f172a] border-white/10">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                Paid Payouts
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-emerald-500">
                                ₹{((paidPayouts?._sum?.commissionAmount || 0) + (paidPayouts?._sum?.platformFee || 0)).toLocaleString()}
                            </div>
                            <p className="text-slate-400 text-sm mt-2">{paidPayouts?._count || 0} transactions</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#0f172a] border-white/10">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <XCircle className="w-5 h-5 text-red-500" />
                                Failed Payouts
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-red-500">
                                ₹{((failedPayouts?._sum?.commissionAmount || 0) + (failedPayouts?._sum?.platformFee || 0)).toLocaleString()}
                            </div>
                            <p className="text-slate-400 text-sm mt-2">{failedPayouts?._count || 0} transactions</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Transactions */}
                <Card className="bg-[#0f172a] border-white/10">
                    <CardHeader>
                        <CardTitle className="text-white text-2xl font-heading">Recent Transactions</CardTitle>
                        <CardDescription className="text-slate-400">Latest commission records</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {analytics?.recentTransactions?.length === 0 ? (
                                <p className="text-slate-500 text-center py-8">No transactions found.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="border-b border-white/10">
                                            <tr className="text-left text-slate-400 text-sm">
                                                <th className="pb-4 font-medium">Booking ID</th>
                                                <th className="pb-4 font-medium">Hotel</th>
                                                <th className="pb-4 font-medium">Guest</th>
                                                <th className="pb-4 font-medium">Commission</th>
                                                <th className="pb-4 font-medium">Platform Fee</th>
                                                <th className="pb-4 font-medium">Status</th>
                                                <th className="pb-4 font-medium text-right">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {analytics?.recentTransactions?.map((tx: any, idx: number) => (
                                                <motion.tr
                                                    key={tx.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                                >
                                                    <td className="py-4 text-slate-300 font-mono text-xs">{tx.booking?.id?.slice(0, 8)}...</td>
                                                    <td className="py-4">
                                                        <div className="text-white font-medium">{tx.booking?.hotel?.name}</div>
                                                        <div className="text-slate-500 text-xs">{tx.booking?.hotel?.city}</div>
                                                    </td>
                                                    <td className="py-4">
                                                        <div className="text-white">{tx.booking?.user?.name}</div>
                                                        <div className="text-slate-500 text-xs">{tx.booking?.user?.email}</div>
                                                    </td>
                                                    <td className="py-4 text-emerald-400 font-bold">₹{tx.commissionAmount?.toLocaleString()}</td>
                                                    <td className="py-4 text-blue-400 font-bold">₹{tx.platformFee?.toLocaleString()}</td>
                                                    <td className="py-4">
                                                        <Badge
                                                            variant="outline"
                                                            className={
                                                                tx.status === 'PAID'
                                                                    ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/10'
                                                                    : tx.status === 'PENDING'
                                                                        ? 'border-amber-500/30 text-amber-500 bg-amber-500/10'
                                                                        : 'border-red-500/30 text-red-500 bg-red-500/10'
                                                            }
                                                        >
                                                            {tx.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-4 text-slate-400 text-sm text-right">
                                                        {new Date(tx.createdAt).toLocaleDateString()}
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
            <Footer />
        </div>
    );
}
