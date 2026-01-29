'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, DollarSign, Users, Building, ArrowUpRight, Plus, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function OwnerDashboard() {
    const { user, loading: authLoading, getIdToken } = useAuth();
    const router = useRouter();
    const [dataLoading, setDataLoading] = useState(true); // Renamed to avoid conflict
    const [analytics, setAnalytics] = useState<any>(null);
    const [hotels, setHotels] = useState<any[]>([]);

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push('/login');
                return;
            }
            fetchOwnerData();
        }
    }, [user, authLoading]);

    const fetchOwnerData = async () => {
        try {
            const token = await getIdToken();
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            // Fetch Analytics
            const analyticsRes = await fetch('http://localhost:3001/api/v1/owner/analytics', { headers });
            if (analyticsRes.ok) {
                const data = await analyticsRes.json();
                setAnalytics(data);
            } else {
                console.error('Analytics API failed:', analyticsRes.status);
            }

            // Fetch Hotels
            const hotelsRes = await fetch('http://localhost:3001/api/v1/owner/hotels', { headers });
            if (hotelsRes.ok) {
                const data = await hotelsRes.json();
                setHotels(data);
            } else {
                console.error('Hotels API failed:', hotelsRes.status);
            }
        } catch (error) {
            console.error('Failed to fetch owner data:', error);
        } finally {
            setDataLoading(false);
        }
    };

    if (authLoading || dataLoading) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white">
                Loading Dashboard...
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-accent-gold/30">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold font-heading mb-2">Control Room</h1>
                        <p className="text-slate-400">Welcome back, {user.displayName || user.email}</p>
                    </div>
                    <Button
                        onClick={() => router.push('/list-property')}
                        className="bg-accent-gold text-black hover:bg-amber-400 font-bold rounded-full px-6"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Property
                    </Button>
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
                                <ArrowUpRight className="w-3 h-3 text-emerald-500 mr-1" /> +12% from last month
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#0f172a] border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-400">Total Bookings</CardTitle>
                            <Users className="w-4 h-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">{analytics?.totalBookings || 0}</div>
                            <p className="text-xs text-slate-500 mt-1 flex items-center">
                                <ArrowUpRight className="w-3 h-3 text-emerald-500 mr-1" /> +5 new this week
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#0f172a] border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-400">Properties</CardTitle>
                            <Building className="w-4 h-4 text-accent-gold" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">{analytics?.activeProperties || 0}</div>
                            <p className="text-xs text-slate-500 mt-1">Active Listings</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#0f172a] border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-400">Avg Rating</CardTitle>
                            <Star className="w-4 h-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">4.9</div>
                            <p className="text-xs text-slate-500 mt-1">Based on 128 reviews</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Content Tabs */}
                <Tabs defaultValue="properties" className="space-y-6">
                    <TabsList className="bg-[#0f172a] border border-white/10 p-1 rounded-full">
                        <TabsTrigger value="properties" className="rounded-full data-[state=active]:bg-accent-gold data-[state=active]:text-black">My Properties</TabsTrigger>
                        <TabsTrigger value="bookings" className="rounded-full data-[state=active]:bg-accent-gold data-[state=active]:text-black">Recent Bookings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="properties" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {hotels.length === 0 ? (
                                <div className="col-span-full text-center py-20 bg-[#0f172a] rounded-3xl border border-white/5 border-dashed">
                                    <Building className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-white mb-2">No Properties Listed Yet</h3>
                                    <p className="text-slate-400 mb-6">Start monetization by listing your first property.</p>
                                    <Button onClick={() => router.push('/list-property')} className="bg-white text-black hover:bg-slate-200 rounded-full">List Property</Button>
                                </div>
                            ) : (
                                hotels.map(hotel => (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        key={hotel.id}
                                        className="group relative bg-[#0f172a] rounded-2xl overflow-hidden border border-white/10 hover:border-accent-gold/50 transition-all"
                                    >
                                        <div className="h-48 bg-slate-800 relative">
                                            {/* Placeholder image if none */}
                                            {hotel.images?.[0] ? (
                                                <img src={hotel.images[0]} alt={hotel.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="absolute inset-0 bg-slate-700 flex items-center justify-center text-slate-500">
                                                    <Building className="w-10 h-10" />
                                                </div>
                                            )}
                                            {hotel.subscriptions?.[0]?.tier && (
                                                <span className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/10 uppercase tracking-wider">
                                                    {hotel.subscriptions[0].tier} Plan
                                                </span>
                                            )}
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold font-heading text-white mb-2">{hotel.name}</h3>
                                            <p className="text-slate-400 text-sm mb-4 truncate">{hotel.address}, {hotel.city}</p>

                                            <div className="flex justify-between items-center pt-4 border-t border-white/10">
                                                <div className="text-sm">
                                                    <span className="text-slate-500">Revenue</span>
                                                    <div className="font-bold text-white">₹{((hotel.bookings?.length || 0) * 5000).toLocaleString()}</div>
                                                </div>
                                                <Link href={`/owner/properties/${hotel.id}/edit`}>
                                                    <Button variant="ghost" size="sm" className="text-accent-gold hover:text-white hover:bg-white/10">Manage</Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="bookings">
                        <Card className="bg-[#0f172a] border-white/10">
                            <CardHeader>
                                <CardTitle className="text-white">Recent Bookings</CardTitle>
                                <CardDescription className="text-slate-400">Latest reservations across all your properties.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {analytics?.recentBookings?.length === 0 ? (
                                        <p className="text-slate-500">No bookings found.</p>
                                    ) : (
                                        analytics?.recentBookings?.map((booking: any) => (
                                            <div key={booking.id} className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                                        {booking.user?.name?.[0] || 'G'}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white">{booking.user?.name || 'Guest'}</p>
                                                        <p className="text-sm text-slate-500">{booking.hotel?.name}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-emerald-400">₹{booking.totalPrice?.toLocaleString()}</p>
                                                    <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-500 bg-emerald-500/10">
                                                        {booking.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            <Footer />
        </div>
    );
}
