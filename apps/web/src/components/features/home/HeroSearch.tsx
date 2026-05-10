'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Calendar as CalendarIcon, Users, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { motion } from 'framer-motion';

export default function HeroSearch() {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [date, setDate] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(2);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.append('city', location);
    if (date?.from) params.append('checkIn', date.from.toISOString());
    if (date?.to) params.append('checkOut', date.to.toISOString());
    params.append('guests', guests.toString());

    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center pt-32 pb-20 px-6">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-slate-50/80 z-10 backdrop-blur-[2px]"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 scale-105"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80")' }}
        ></div>
      </div>

      <div className="relative z-20 w-full max-w-5xl mx-auto flex flex-col justify-center min-h-[60vh]">
        
        {/* Headline */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center mb-12"
        >
          <div className="inline-flex items-center gap-3 bg-white border border-slate-200 rounded-full px-6 py-2 mb-8 shadow-sm">
            <Star className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600 animate-pulse" />
            <span className="text-indigo-600 font-bold tracking-[0.25em] text-[11px] uppercase">
              Verified Luxury • Personally Vetted
            </span>
            <Star className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600 animate-pulse" />
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter font-heading text-slate-900 drop-shadow-sm text-balance-header leading-[0.9]">
            Reserve experiences, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-indigo-500 to-indigo-800 italic font-serif pr-2">not rooms</span>
          </h1>

          <p className="mt-8 text-lg text-slate-600 max-w-xl mx-auto font-medium leading-relaxed tracking-wide text-center">
            Gain exclusive access to the world's most coveted private villas, penthouses, and heritage estates.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div 
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="relative max-w-4xl mx-auto z-30 w-full"
        >
          <div className="relative bg-white/95 backdrop-blur-md border border-slate-200 p-2 rounded-[32px] flex flex-col md:flex-row gap-2 shadow-2xl shadow-indigo-900/5">
            
            <div className="flex-1 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-100">
              {/* Location */}
              <div className="flex-1 relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex flex-col justify-center h-[72px] pl-20 pr-6">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500 group-hover:text-indigo-600 transition-colors">Where</span>
                  <input
                    type="text"
                    placeholder="Search destinations"
                    className="w-full bg-transparent border-none text-lg font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0 p-0"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="flex-1 relative group">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="w-full h-[72px] justify-start text-left font-normal px-6 bg-transparent hover:bg-transparent text-slate-900 border-none"
                    >
                      <div className="flex items-center gap-4 w-full">
                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                          <CalendarIcon className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500 group-hover:text-indigo-600 transition-colors">When</span>
                          <span className="text-lg font-bold truncate text-slate-900">
                            {date?.from ? (
                              date.to ? `${format(date.from, "MMM dd")} - ${format(date.to, "MMM dd")}` : format(date.from, "MMM dd")
                            ) : (
                              <span className="text-slate-400">Add dates</span>
                            )}
                          </span>
                        </div>
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-slate-200 shadow-2xl rounded-[24px] overflow-hidden" align="center">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={setDate}
                      numberOfMonths={2}
                      className="bg-white text-slate-900 p-4"
                      classNames={{
                        day_selected: "bg-indigo-600 text-white hover:bg-indigo-700 focus:bg-indigo-700 rounded-md",
                        day_today: "bg-slate-100 text-slate-900 rounded-md",
                        head_cell: "text-slate-500 font-bold",
                        day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-slate-100 rounded-md transition-colors",
                        nav_button: "hover:bg-slate-100 rounded-md"
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Guests */}
              <div className="flex-1 relative group hidden lg:block">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                  <Users className="w-5 h-5" />
                </div>
                <div className="flex flex-col justify-center h-[72px] pl-20 pr-6">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500 group-hover:text-indigo-600 transition-colors">Who</span>
                  <div className="flex items-center justify-between w-full">
                    <span className="text-lg font-bold text-slate-900">{guests} Guests</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 flex items-center justify-center font-bold transition-colors">−</button>
                      <button onClick={() => setGuests(guests + 1)} className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 flex items-center justify-center font-bold transition-colors">+</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Search Button */}
            <Button 
              size="lg" 
              className="h-[72px] px-10 rounded-[24px] text-lg font-bold bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-indigo-600/20 flex items-center gap-2"
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
