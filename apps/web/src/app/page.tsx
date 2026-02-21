'use client';

import Link from 'next/link';
import HeroSearch from '@/components/features/home/HeroSearch';
import FeaturedDestinations from '@/components/features/home/FeaturedDestinations';
import { motion } from 'framer-motion';
import { ShieldCheck, Percent, Lock, Globe, Sparkles, Key, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { LAUNCH_CONFIG } from '@/config/launch-city';

export default function Home() {
   return (
      <main className="min-h-screen font-sans bg-black text-white selection:bg-amber-500/30 overflow-hidden">
         <HeroSearch />

         {/* Neo Bento Grid Section */}
         <section className="py-24 relative z-10 px-6">
            <div className="max-w-7xl mx-auto mb-16 text-center">
               <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4 text-white">
                  Now Launching in <span className="text-gradient-neo">{LAUNCH_CONFIG.primaryCity}</span>
               </h2>
               <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                  Be among the first to experience our curated collection of verified sanctuaries in {LAUNCH_CONFIG.primaryCity}.
               </p>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[600px]">
               {/* Card 1: Large Left */}
               <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="md:col-span-2 row-span-2 relative group overflow-hidden rounded-[32px] border border-white/10"
               >
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=2070')] bg-cover bg-center transition-transform duration-1000 group-hover:scale-110 brightness-[0.7]"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-8 md:p-12">
                     <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-500 text-xs font-bold tracking-widest uppercase mb-4 border border-amber-500/20">
                        Global Reach
                     </span>
                     <h3 className="text-4xl md:text-5xl font-bold font-heading mb-4 leading-tight text-white">
                        Access Our <br /> Curated Collection
                     </h3>
                     <p className="text-slate-300 text-lg max-w-md mb-8">
                        From Portuguese villas in Assagao to beachfront sanctuaries in Morjim. Only the exceptional makes the cut.
                     </p>
                     <Link href={`/search?city=${LAUNCH_CONFIG.primaryCity}`}>
                        <Button className="glass-panel hover:bg-white hover:text-black transition-all rounded-full px-8 py-6 text-lg">
                           Explore {LAUNCH_CONFIG.primaryCity}
                        </Button>
                     </Link>
                  </div>
               </motion.div>

               {/* Card 2: Top Right */}
               <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-[#0b0f19] border border-white/5 rounded-[32px] p-8 flex flex-col justify-between hover:border-white/20 transition-all group overflow-hidden relative"
               >
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-all"></div>
                  <Sparkles className="w-10 h-10 text-amber-500 mb-4" />
                  <div>
                     <h3 className="text-2xl font-bold text-white font-heading mb-2">AI Concierge</h3>
                     <p className="text-slate-400 text-sm">Real-time trip planning tailored to your unique taste profile.</p>
                  </div>
               </motion.div>

               {/* Card 3: Middle Right */}
               <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-[#0b0f19] border border-white/5 rounded-[32px] p-8 flex flex-col justify-between hover:border-white/20 transition-all group overflow-hidden relative"
               >
                  <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl group-hover:bg-purple-500/30 transition-all"></div>
                  <Lock className="w-10 h-10 text-emerald-400 mb-4" />
                  <div>
                     <h3 className="text-2xl font-bold text-white font-heading mb-2">Secure Booking</h3>
                     <p className="text-slate-400 text-sm">Bank-grade encryption for instant, worry-free reservations.</p>
                  </div>
               </motion.div>

               {/* Card 4: Bottom Right */}
               <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-[#0b0f19] border border-white/5 rounded-[32px] p-8 flex flex-col justify-between hover:border-white/20 transition-all group overflow-hidden relative"
               >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-amber-500/5 to-transparent"></div>
                  <Key className="w-10 h-10 text-white mb-4" />
                  <div>
                     <h3 className="text-2xl font-bold text-white font-heading mb-2">Smart Check-in</h3>
                     <p className="text-slate-400 text-sm">Keyless entry and digital registration at select properties.</p>
                  </div>
               </motion.div>
            </div>
         </section>

         {/* Hotel Partners Section */}
         <section className="py-20 px-6 relative overflow-hidden bg-[#030712]">
            <div className="absolute inset-0 bg-void-grid opacity-20" />

            <div className="max-w-6xl mx-auto relative z-10">
               <div className="grid lg:grid-cols-2 gap-12 items-center">
                  {/* Left: Content */}
                  <motion.div
                     initial={{ opacity: 0, x: -50 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                  >
                     <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-widest uppercase mb-4">
                        For Hotel Managers
                     </div>
                     <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6 text-white">
                        Partner With <span className="text-gradient-neo">NeonStay</span>
                     </h2>
                     <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                        Join 500+ premium properties already scaling their revenue. Get access to verified travelers, instant payouts, and industry-best commission rates.
                     </p>

                     <div className="grid grid-cols-2 gap-6 mb-8">
                        <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                           <div className="text-3xl font-bold text-accent-gold mb-1">85%</div>
                           <div className="text-sm text-slate-400">Avg Occupancy Rate</div>
                        </div>
                        <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                           <div className="text-3xl font-bold text-accent-gold mb-1">24h</div>
                           <div className="text-sm text-slate-400">Instant Payouts</div>
                        </div>
                        <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                           <div className="text-3xl font-bold text-accent-gold mb-1">8-15%</div>
                           <div className="text-sm text-slate-400">Commission Rate</div>
                        </div>
                        <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                           <div className="text-3xl font-bold text-accent-gold mb-1">₹12Cr+</div>
                           <div className="text-sm text-slate-400">Revenue Generated</div>
                        </div>
                     </div>

                     <div className="flex gap-4">
                        <Link href="/for-hotels">
                           <Button className="bg-white text-black hover:bg-amber-400 font-bold h-12 px-8 rounded-full btn-magnetic-enhanced">
                              Learn More
                           </Button>
                        </Link>
                        <Link href="/list-property">
                           <Button variant="outline" className="border-white/20 hover:bg-white/10 h-12 px-8 rounded-full">
                              List Property
                           </Button>
                        </Link>
                     </div>
                  </motion.div>

                  {/* Right: Image */}
                  <motion.div
                     initial={{ opacity: 0, x: 50 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                     className="relative"
                  >
                     <div className="relative rounded-[32px] overflow-hidden border border-white/10 shadow-2xl">
                        <Image
                           src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070"
                           alt="Hotel Partnership"
                           fill
                           sizes="(max-width: 1024px) 100vw, 50vw"
                           className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                        {/* Floating Badge */}
                        <div className="absolute bottom-6 left-6 right-6 bg-black/80 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                           <div className="flex items-center justify-between">
                              <div>
                                 <div className="text-xs text-slate-400 mb-1">This Month</div>
                                 <div className="text-2xl font-bold text-accent-gold">+127% Revenue</div>
                              </div>
                              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                 <TrendingUp className="w-6 h-6 text-emerald-400" />
                              </div>
                           </div>
                        </div>
                     </div>
                  </motion.div>
               </div>
            </div>
         </section>

         {/* Destinations Grid (Legacy Component but wrapped nicely) */}
         <section className="py-12">
            <FeaturedDestinations />
         </section>

         {/* Final CTA */}
         <section className="py-24 px-6 relative">
            <div className="max-w-6xl mx-auto rounded-[48px] overflow-hidden relative border border-white/10 shadow-2xl">
               <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-950"></div>
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80')] bg-cover opacity-20 mix-blend-overlay"></div>

               <div className="relative z-10 p-12 md:p-32 text-center">
                  <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 font-heading tracking-tight">
                     Ready to <span className="text-gradient-neo">Ascend?</span>
                  </h2>
                  <p className="text-slate-400 text-xl md:text-2xl mb-12 max-w-2xl mx-auto font-light">
                     Join our exclusive membership for early access to the world's most coveted keys.
                  </p>
                  <Link href="/membership">
                     <Button className="bg-white text-black hover:bg-amber-400 hover:text-black font-bold h-16 px-12 text-xl rounded-full shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all transform hover:scale-105">
                        View Membership Tiers
                     </Button>
                  </Link>
               </div>
            </div>
         </section>
      </main>
   );
}
