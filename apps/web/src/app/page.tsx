import HeroSearch from '@/components/features/home/HeroSearch';
import FeaturedDestinations from '@/components/features/home/FeaturedDestinations';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Key, Sparkles, Star, TrendingUp, Globe, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import * as motionComponents from 'framer-motion/client';

export default function Home() {
   return (
      <main className="min-h-screen font-sans bg-slate-50 text-slate-900 selection:bg-indigo-500/20 selection:text-indigo-900 overflow-hidden">
         <HeroSearch />

         {/* Neo Bento Grid Section */}
         <section className="py-24 relative max-w-7xl mx-auto px-6">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

            <div className="mb-16 flex flex-col md:flex-row justify-between items-end gap-6">
               <div className="max-w-2xl">
                  <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 font-heading leading-tight tracking-tight">
                     Redefining <span className="text-indigo-600">Hospitality</span>
                  </h2>
                  <p className="text-lg text-slate-600 font-light leading-relaxed">
                     A curated ecosystem of the world's most exceptional stays. Verified for quality, designed for the modern traveler.
                  </p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[320px]">
               {/* Large Hero Card */}
               <motionComponents.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="md:col-span-2 md:row-span-2 rounded-[32px] overflow-hidden relative group"
               >
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=2070')] bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-8 md:p-12">
                     <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white backdrop-blur-md text-xs font-bold tracking-widest uppercase mb-4 border border-white/30">
                        Global Reach
                     </span>
                     <h3 className="text-4xl md:text-5xl font-bold font-heading mb-4 leading-tight text-white shadow-sm">
                        Curated Stays Across <br /> 50+ Countries
                     </h3>
                     <Link href="/destinations">
                        <Button className="bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-full px-6 transition-all">
                           Explore Map
                        </Button>
                     </Link>
                  </div>
               </motionComponents.div>

               {/* Small Card 1 */}
               <motionComponents.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="bg-white border border-slate-200 shadow-sm hover:shadow-xl rounded-[32px] p-8 flex flex-col justify-between hover:border-slate-300 transition-all group overflow-hidden relative"
               >
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all"></div>
                  <Sparkles className="w-10 h-10 text-indigo-500 mb-4" />
                  <div>
                     <h3 className="text-2xl font-bold text-slate-900 font-heading mb-2">AI Concierge</h3>
                     <p className="text-slate-600 text-sm">Real-time trip planning tailored to your unique taste profile.</p>
                  </div>
               </motionComponents.div>

               {/* Small Card 2 */}
               <motionComponents.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="bg-white border border-slate-200 shadow-sm hover:shadow-xl rounded-[32px] p-8 flex flex-col justify-between hover:border-slate-300 transition-all group overflow-hidden relative"
               >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-indigo-500/5 to-transparent"></div>
                  <Key className="w-10 h-10 text-slate-700 mb-4" />
                  <div>
                     <h3 className="text-2xl font-bold text-slate-900 font-heading mb-2">Smart Check-in</h3>
                     <p className="text-slate-600 text-sm">Keyless entry and instant room access from your device.</p>
                  </div>
               </motionComponents.div>
            </div>
         </section>

         {/* Trust / Stats Section */}
         <section className="py-24 bg-white border-y border-slate-200 relative">
            <div className="max-w-7xl mx-auto px-6">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <div>
                     <span className="text-indigo-600 font-bold tracking-[0.2em] uppercase text-sm mb-4 block">For Property Owners</span>
                     <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6 leading-tight text-slate-900">
                        Maximize Yield.<br />Minimize Friction.
                     </h2>
                     <p className="text-slate-600 text-lg mb-8 font-light leading-relaxed">
                        Join an elite portfolio of properties. Our algorithmic pricing and premium audience ensure your property performs at its absolute peak.
                     </p>

                     <div className="grid grid-cols-2 gap-6 mb-8">
                        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 shadow-sm">
                           <div className="text-3xl font-bold text-indigo-600 mb-1">85%</div>
                           <div className="text-sm text-slate-500 font-medium">Avg Occupancy Rate</div>
                        </div>
                        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 shadow-sm">
                           <div className="text-3xl font-bold text-indigo-600 mb-1">24h</div>
                           <div className="text-sm text-slate-500 font-medium">Instant Payouts</div>
                        </div>
                        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 shadow-sm">
                           <div className="text-3xl font-bold text-indigo-600 mb-1">8-15%</div>
                           <div className="text-sm text-slate-500 font-medium">Commission Rate</div>
                        </div>
                        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 shadow-sm">
                           <div className="text-3xl font-bold text-indigo-600 mb-1">₹12Cr+</div>
                           <div className="text-sm text-slate-500 font-medium">Revenue Generated</div>
                        </div>
                     </div>

                     <div className="flex gap-4">
                        <Link href="/for-hotels">
                           <Button className="bg-indigo-600 text-white hover:bg-indigo-700 font-bold h-12 px-8 rounded-full shadow-lg shadow-indigo-600/20 btn-magnetic-enhanced">
                              Learn More
                           </Button>
                        </Link>
                     </div>
                  </div>

                  <div className="relative h-[600px] w-full rounded-[40px] overflow-hidden border border-slate-200 shadow-2xl">
                     <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551882547-ff40c0d13c84?q=80')] bg-cover bg-center"></div>
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>

                     {/* Floating Stats UI */}
                     <motionComponents.div
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-md rounded-2xl p-6 border border-white shadow-xl"
                     >
                        <div className="flex items-center gap-4 mb-4">
                           <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden">
                              <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=100" alt="Owner" className="w-full h-full object-cover" />
                           </div>
                           <div>
                              <h4 className="text-slate-900 font-bold">Michael Chen</h4>
                              <p className="text-slate-500 text-xs">Villa Owner, Bali</p>
                           </div>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                           <div className="flex items-center justify-between">
                              <div>
                                 <div className="text-xs text-slate-500 font-medium mb-1">This Month</div>
                                 <div className="text-2xl font-bold text-indigo-600">+127% Revenue</div>
                              </div>
                              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                                 <TrendingUp className="w-6 h-6 text-emerald-600" />
                              </div>
                           </div>
                        </div>
                     </motionComponents.div>
                  </div>
               </div>
            </div>
         </section>

         <FeaturedDestinations />

         {/* Final CTA */}
         <section className="py-32 relative flex items-center justify-center overflow-hidden bg-slate-900">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80')] bg-cover bg-center opacity-40"></div>
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"></div>

            <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
               <motionComponents.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
               >
                  <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 font-heading tracking-tight leading-tight">
                     Unlock The <br /><span className="text-indigo-400">Extraordinary</span>
                  </h2>
                  <p className="text-xl text-slate-300 mb-10 font-light leading-relaxed">
                     Join our exclusive membership for early access to the world's most coveted keys.
                  </p>
                  <Link href="/membership">
                     <Button className="bg-white text-slate-900 hover:bg-slate-100 font-bold h-16 px-12 text-xl rounded-full shadow-[0_8px_30px_rgba(255,255,255,0.2)] transition-all transform hover:scale-105">
                        View Membership Tiers
                     </Button>
                  </Link>
               </motionComponents.div>
            </div>
         </section>
      </main>
   );
}
