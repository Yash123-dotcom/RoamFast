'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Building, DollarSign, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function AdminDashboard() {
    const { user, loading: authLoading, getIdToken } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState<any>(null);
    const [pendingHotels, setPendingHotels] = useState<any[]>([]);
    const [dataLoading, setDataLoading] = useState(true);

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push('/login');
                return;
            }
            // Optional: Check if user is admin via Claims (not implemented here, assuming backend check)
            fetchAdminData();
        }
    }, [user, authLoading]);

    const fetchAdminData = async () => {
        try {
            const token = await getIdToken();
            const headers = {
                'Authorization': `Bearer ${token}`
            };

            // 1. Fetch Stats
            const statsRes = await fetch('http://localhost:3001/api/v1/admin/stats', { headers });
            if (statsRes.ok) setStats(await statsRes.json());

            // 2. Fetch Pending Hotels
            const pendingRes = await fetch('http://localhost:3001/api/v1/admin/hotels/pending', { headers });
            if (pendingRes.ok) setPendingHotels(await pendingRes.json());

        } catch (error) {
            console.error('Failed to fetch admin data', error);
        } finally {
            setDataLoading(false);
        }
    };

    const handleApproval = async (hotelId: string, action: 'approve' | 'reject') => {
        try {
            const token = await getIdToken();
            const res = await fetch(`http://localhost:3001/api/v1/admin/hotels/${hotelId}/${action}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                // Remove from list
                setPendingHotels(prev => prev.filter(h => h.id !== hotelId));
                // Refresh stats
                const statsRes = await fetch('http://localhost:3001/api/v1/admin/stats', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (statsRes.ok) setStats(await statsRes.json());
            }
        } catch (error) {
            console.error(`Failed to ${action} hotel`, error);
        }
    };

    if (authLoading || dataLoading) {
        return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white">Loading Admin Panel...</div>;
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#020617] text-white">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-bold font-heading mb-2">Admin Control Center</h1>
                        <p className="text-slate-400">Manage platform listings and monitor performance.</p>
                    </div>
                    <div className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full text-sm font-bold flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" /> Admin Mode
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <Card className="bg-[#0f172a] border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-400">Total Users</CardTitle>
                            <Users className="w-4 h-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">{stats?.totalUsers || 0}</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#0f172a] border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-400">Verified Hotels</CardTitle>
                            <Building className="w-4 h-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">{stats?.totalHotels || 0}</div>
                        </CardContent>
                    </Card>

                    <Link href="/admin/revenue" className="block">
                        <Card className="bg-[#0f172a] border-white/10 hover:border-accent-gold/50 transition-all cursor-pointer group">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-slate-400">Total Revenue</CardTitle>
                                <DollarSign className="w-4 h-4 text-accent-gold" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-white">₹{stats?.totalRevenue?.toLocaleString() || 0}</div>
                                <p className="text-xs text-accent-gold mt-1 flex items-center group-hover:translate-x-1 transition-transform">
                                    View Details →
                                </p>
                            </CardContent>
                        </Card>
                    </Link>

                    <Card className="bg-[#0f172a] border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-400">Pending Approvals</CardTitle>
                            <AlertCircle className="w-4 h-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">{pendingHotels.length}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Approvals Section */}
                <div className="bg-[#0f172a] rounded-[24px] border border-white/10 p-8 shadow-2xl">
                    <h2 className="text-2xl font-bold font-heading mb-6 flex items-center gap-3">
                        <div className="w-1 h-8 bg-amber-500 rounded-full"></div>
                        Pending Approvals
                    </h2>

                    {pendingHotels.length === 0 ? (
                        <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl">
                            <CheckCircle2 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                            <p className="text-slate-400">All caught up! No pending approvals.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {pendingHotels.map((hotel) => (
                                <div key={hotel.id} className="flex flex-col md:flex-row items-start md:items-center justify-between bg-black/20 p-6 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold text-white">{hotel.name}</h3>
                                            {hotel.subscriptions?.[0]?.tier && (
                                                <Badge variant="outline" className="border-accent-gold text-accent-gold text-[10px] uppercase">
                                                    {hotel.subscriptions[0].tier} Plan
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-slate-400 text-sm mb-1">{hotel.address}, {hotel.city}</p>
                                        <p className="text-slate-500 text-xs">Owner: {hotel.owner?.name || 'Unknown'} ({hotel.owner?.email})</p>
                                    </div>

                                    <div className="flex items-center gap-3 mt-4 md:mt-0">
                                        <Button
                                            onClick={() => handleApproval(hotel.id, 'approve')}
                                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-10 px-6 rounded-lg"
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            onClick={() => handleApproval(hotel.id, 'reject')}
                                            variant="outline"
                                            className="border-red-500/30 text-red-500 hover:bg-red-500/10 h-10 px-6 rounded-lg"
                                        >
                                            Reject
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
            <Footer />
        </div>
    );
}
