'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, CreditCard, X, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardPage() {
   const { user, loading: authLoading, getIdToken } = useAuth();
   const router = useRouter();
   const [bookings, setBookings] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      if (!authLoading && !user) {
         router.push('/login');
      }

      // Fetch user bookings
      if (user) {
         (async () => {
            const token = await getIdToken();
            if (!token) return;

            try {
               const res = await fetch('http://localhost:3001/api/bookings/my-bookings', {
                  headers: {
                     'Authorization': `Bearer ${token}`,
                  },
               });
               const data = await res.json();
               setBookings(data);
            } catch (err) {
               console.error(err);
            } finally {
               setLoading(false);
            }
         })();
      }
   }, [user, authLoading, router, getIdToken]);

   const cancelBooking = async (bookingId: string) => {
      if (!confirm('Are you sure you want to cancel this booking?')) return;

      try {
         const token = await getIdToken();
         if (!token) return;

         const res = await fetch(`http://localhost:3001/api/bookings/${bookingId}/cancel`, {
            method: 'POST',
            headers: {
               'Authorization': `Bearer ${token}`,
            },
         });

         if (res.ok) {
            setBookings(bookings.map(b =>
               b.id === bookingId ? { ...b, status: 'CANCELLED' } : b
            ));
         }
      } catch (error) {
         console.error('Failed to cancel booking:', error);
      }
   };

   if (authLoading || loading) {
      return (
         <div className="min-h-screen bg-[#020617] flex items-center justify-center">
            <div className="text-white">Loading...</div>
         </div>
      );
   }

   const upcomingBookings = bookings.filter(b =>
      b.status === 'CONFIRMED' && new Date(b.checkIn) > new Date()
   );
   const pastBookings = bookings.filter(b =>
      b.status === 'COMPLETED' || new Date(b.checkOut) < new Date()
   );

   return (
      <div className="min-h-screen bg-[#020617] text-white">
         <Navbar />

         <div className="max-w-7xl mx-auto px-6 py-32">
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="mb-12"
            >
               <h1 className="text-5xl font-bold mb-4 font-heading">My Bookings</h1>
               <p className="text-slate-400 text-lg">
                  Manage your reservations and view booking history
               </p>
            </motion.div>

            {/* Upcoming Bookings */}
            <section className="mb-16">
               <h2 className="text-2xl font-bold mb-6 font-heading flex items-center gap-3">
                  <div className="w-1 h-8 bg-accent-gold rounded-full"></div>
                  Upcoming Reservations
               </h2>

               {upcomingBookings.length === 0 ? (
                  <div className="bg-[#0f172a] p-12 rounded-[24px] border border-white/10 text-center">
                     <Calendar className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                     <p className="text-slate-400 mb-6">No upcoming reservations</p>
                     <Button
                        onClick={() => router.push('/search')}
                        className="bg-accent-gold text-black hover:bg-amber-400 rounded-full"
                     >
                        Book Your Next Stay
                     </Button>
                  </div>
               ) : (
                  <div className="grid grid-cols-1 gap-6">
                     {upcomingBookings.map((booking, i) => (
                        <motion.div
                           key={booking.id}
                           initial={{ opacity: 0, x: -20 }}
                           animate={{ opacity: 1, x: 0 }}
                           transition={{ delay: i * 0.1 }}
                           className="bg-[#0f172a] p-6 rounded-[24px] border border-white/10 hover:border-accent-gold/30 transition-all"
                        >
                           <div className="flex flex-col md:flex-row gap-6">
                              <div className="flex-1">
                                 <div className="flex items-start justify-between mb-4">
                                    <div>
                                       <h3 className="text-2xl font-bold text-white mb-2">{booking.hotel?.name || 'Hotel'}</h3>
                                       <p className="text-slate-400 flex items-center gap-2">
                                          <MapPin className="w-4 h-4" />
                                          {booking.hotel?.city || 'Location'}
                                       </p>
                                    </div>
                                    <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/30">
                                       {booking.status}
                                    </Badge>
                                 </div>

                                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                                    <div>
                                       <p className="text-xs text-slate-500 mb-1">Check-in</p>
                                       <p className="text-sm font-bold">{new Date(booking.checkIn).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                       <p className="text-xs text-slate-500 mb-1">Check-out</p>
                                       <p className="text-sm font-bold">{new Date(booking.checkOut).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                       <p className="text-xs text-slate-500 mb-1">Total</p>
                                       <p className="text-sm font-bold text-accent-gold">₹{booking.totalPrice?.toLocaleString()}</p>
                                    </div>
                                 </div>
                              </div>

                              <div className="flex md:flex-col gap-3">
                                 <Button
                                    variant="outline"
                                    className="flex-1 border-white/10 text-white hover:bg-white hover:text-black rounded-full"
                                    onClick={() => router.push(`/hotels/${booking.hotelId}`)}
                                 >
                                    <Eye className="w-4 h-4 mr-2" />
                                    View
                                 </Button>
                                 <Button
                                    variant="ghost"
                                    className="flex-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-full"
                                    onClick={() => cancelBooking(booking.id)}
                                 >
                                    <X className="w-4 h-4 mr-2" />
                                    Cancel
                                 </Button>
                              </div>
                           </div>
                        </motion.div>
                     ))}
                  </div>
               )}
            </section>

            {/* Past Bookings */}
            <section>
               <h2 className="text-2xl font-bold mb-6 font-heading flex items-center gap-3">
                  <div className="w-1 h-8 bg-slate-600 rounded-full"></div>
                  Booking History
               </h2>

               {pastBookings.length === 0 ? (
                  <div className="bg-[#0f172a] p-12 rounded-[24px] border border-white/10 text-center">
                     <p className="text-slate-400">No past bookings</p>
                  </div>
               ) : (
                  <div className="grid grid-cols-1 gap-4">
                     {pastBookings.map((booking, i) => (
                        <motion.div
                           key={booking.id}
                           initial={{ opacity: 0 }}
                           animate={{ opacity: 1 }}
                           transition={{ delay: i * 0.05 }}
                           className="bg-[#0f172a]/50 p-4 rounded-[20px] border border-white/5"
                        >
                           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                              <div>
                                 <h4 className="text-lg font-bold text-white mb-1">{booking.hotel?.name || 'Hotel'}</h4>
                                 <p className="text-sm text-slate-500">
                                    {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                                 </p>
                              </div>
                              <div className="flex items-center gap-4">
                                 <span className="text-slate-400">₹{booking.totalPrice?.toLocaleString()}</span>
                                 <Badge variant="outline" className="border-slate-600 text-slate-400">
                                    {booking.status}
                                 </Badge>
                              </div>
                           </div>
                        </motion.div>
                     ))}
                  </div>
               )}
            </section>
         </div>

         <Footer />
      </div>
   );
}