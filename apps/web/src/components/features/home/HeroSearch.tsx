'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Search, Calendar as CalendarIcon, MapPin, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { LocationSearch } from '@/components/features/hotels/LocationSearch';
import { DateRange } from 'react-day-picker';

export default function HeroSearch() {
  const [city, setCity] = React.useState('');
  const [date, setDate] = React.useState<DateRange | undefined>();
  const router = useRouter();
  const { scrollY } = useScroll();

  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const handleSearch = () => {
    router.push(`/search?city=${encodeURIComponent(city)}`);
  };

  return (
    <div className="relative w-full h-[100vh] min-h-[800px] flex flex-col justify-center items-center overflow-hidden">
      {/* Neo-Lux Aurora Background */}
      <motion.div style={{ y, opacity }} className="absolute inset-0 z-0 select-none pointer-events-none">
        <div className="relative w-full h-full bg-aurora animate-aurora opacity-40"></div>
        <div className="absolute inset-0 bg-void-grid opacity-20 mask-image-gradient-b"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
        <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-black to-transparent" />
      </motion.div>

      <div className="relative z-20 w-full max-w-7xl px-4 text-center text-white mt-[-5vh]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center mb-12"
        >
          <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-6 py-2 mb-8 shadow-[0_0_30px_rgba(251,191,36,0.1)]">
            <Star className="w-3.5 h-3.5 text-accent-gold fill-accent-gold animate-pulse" />
            <span className="text-accent-gold font-bold tracking-[0.25em] text-[11px] uppercase">
              Verified Luxury • Personally Vetted
            </span>
            <Star className="w-3.5 h-3.5 text-accent-gold fill-accent-gold animate-pulse" />
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter font-heading text-white drop-shadow-2xl text-balance-header leading-[0.9]">
            Moments, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-500 italic font-serif pr-2">not rooms</span>
          </h1>

          <p className="mt-8 text-lg text-slate-400 max-w-xl mx-auto font-light leading-relaxed tracking-wide">
            Every stay is personally vetted for quality and trust. Discover curated luxury that saves you time.
          </p>
        </motion.div>

        {/* Unified Glass Command Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="relative max-w-4xl mx-auto z-30"
        >
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 via-white/10 to-amber-500/20 rounded-[40px] blur-xl opacity-50" />

          <div className="relative bg-black/40 backdrop-blur-2xl border border-white/10 p-2 rounded-[32px] flex flex-col md:flex-row gap-2 shadow-2xl">

            {/* Location Input */}
            <div className="flex-1 relative group bg-white/5 hover:bg-white/10 transition-colors rounded-[24px] border border-transparent hover:border-white/5">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-accent-gold transition-colors">
                <MapPin className="w-5 h-5" />
              </div>
              {/* We pass custom classes to LocationSearch to override its default styling if possible, layout constraint usually handled by container */}
              <div className="h-[72px] flex items-center pl-14 pr-4">
                <LocationSearch
                  value={city}
                  onChange={setCity}
                  className="bg-transparent border-none text-xl font-bold text-white placeholder:text-slate-600 w-full focus:ring-0"
                  placeholder="Where to?"
                />
              </div>
            </div>

            {/* Date Picker */}
            <div className="flex-1 relative group bg-white/5 hover:bg-white/10 transition-colors rounded-[24px] border border-transparent hover:border-white/5">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"ghost"}
                    className="w-full h-[72px] justify-start text-left font-normal px-6 bg-transparent hover:bg-transparent text-white border-none"
                  >
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-accent-gold group-hover:bg-accent-gold/10 transition-colors">
                        <CalendarIcon className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500 group-hover:text-accent-gold transition-colors">When</span>
                        <span className="text-lg font-bold truncate">
                          {date?.from ? (
                            date.to ? `${format(date.from, "MMM dd")} - ${format(date.to, "MMM dd")}` : format(date.from, "MMM dd")
                          ) : "Add Dates"}
                        </span>
                      </div>
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border border-white/10 bg-[#0f172a] text-white shadow-2xl rounded-[24px] overflow-hidden" align="center">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                    className="bg-[#0f172a] text-white p-4"
                    classNames={{
                      day_selected: "bg-accent-gold text-black hover:bg-amber-400 focus:bg-amber-400 rounded-md",
                      day_today: "bg-white/10 text-white rounded-md",
                      head_cell: "text-slate-500 font-bold",
                      day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-white/10 rounded-md transition-colors"
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Search Button */}
            <Button
              size="lg"
              className="h-[72px] px-10 rounded-[24px] text-lg font-bold bg-accent-gold text-black hover:bg-white hover:scale-[1.02] transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center gap-2"
              onClick={handleSearch}
            >
              <Search className="w-5 h-5" />
              <span className="hidden md:inline">Search</span>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
